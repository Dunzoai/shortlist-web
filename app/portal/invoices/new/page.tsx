'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Client, ClientService, Service } from '@/lib/portal-types'

interface ClientWithServices extends Client {
  client_services?: (ClientService & { service: Service })[]
}

interface LineItem {
  description: string
  quantity: number
  unit_price: number
  service_id?: string
  isCustom: boolean
}

export default function NewInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedClientId = searchParams.get('client_id') || ''
  const preselectedServiceIds = searchParams.get('service_ids')?.split(',').filter(Boolean) || []
  const [clients, setClients] = useState<ClientWithServices[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [selectedClientId, setSelectedClientId] = useState(preselectedClientId)
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString().split('T')[0]
  })
  const [periodStart, setPeriodStart] = useState(() => {
    const date = new Date()
    date.setDate(1)
    return date.toISOString().split('T')[0]
  })
  const [periodEnd, setPeriodEnd] = useState(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1, 0)
    return date.toISOString().split('T')[0]
  })
  const [notes, setNotes] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [useAutoGenerate, setUseAutoGenerate] = useState(true)
  const [markAsPaid, setMarkAsPaid] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [clientsRes, servicesRes] = await Promise.all([
        supabase
          .from('clients')
          .select('*, client_services(*, service:services(*), performed_by:representatives!client_services_performed_by_id_fkey(name))')
          .order('name'),
        supabase
          .from('services')
          .select('*')
          .order('name')
      ])

      setClients((clientsRes.data as ClientWithServices[] | null) ?? [])
      setServices((servicesRes.data as Service[] | null) ?? [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const selectedClient = clients.find(c => c.id === selectedClientId)

  // If specific service_ids passed, use those; otherwise all services with any cost
  const invoiceableServices = selectedClient?.client_services?.filter(cs => {
    if (preselectedServiceIds.length > 0) return preselectedServiceIds.includes(cs.id)
    return (cs.status === 'active' || cs.status === 'trial' || cs.status === 'completed') && (cs.monthly_cost > 0 || cs.one_time_cost > 0)
  }) || []

  // Auto-populate line items when client selected and auto-generate is on
  useEffect(() => {
    if (useAutoGenerate && selectedClientId && invoiceableServices.length > 0) {
      setLineItems(invoiceableServices.map(cs => {
        const name = cs.service?.name || 'Service'
        const statusLabel = cs.status !== 'active' ? ` (${cs.status})` : ''
        const performedBy = (cs as any).performed_by?.name ? ` | Performed by: ${(cs as any).performed_by.name}` : ''
        const desc = cs.notes
          ? `${name}${statusLabel}${performedBy} — ${cs.notes}`
          : `${name}${statusLabel}${performedBy}`
        return {
          description: desc,
          quantity: 1,
          unit_price: cs.monthly_cost > 0 ? cs.monthly_cost : cs.one_time_cost,
          service_id: cs.service_id,
          isCustom: false,
        }
      }))
      // Auto-populate notes with service details if not already set
      if (!notes) {
        const serviceNotes = invoiceableServices
          .filter(cs => cs.notes)
          .map(cs => `${cs.service?.name}: ${cs.notes}`)
          .join('\n')
        if (serviceNotes) setNotes(serviceNotes)
      }
    }
  }, [selectedClientId, useAutoGenerate, clients])

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0, isCustom: true }])
  }

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const updateLineItem = (index: number, field: string, value: string | number | boolean) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const handleServiceSelect = (index: number, serviceId: string) => {
    const updated = [...lineItems]
    if (serviceId === 'custom') {
      updated[index] = {
        ...updated[index],
        isCustom: true,
        service_id: undefined,
        description: '',
        unit_price: 0,
      }
    } else {
      const service = services.find(s => s.id === serviceId)
      if (service) {
        updated[index] = {
          ...updated[index],
          isCustom: false,
          service_id: serviceId,
          description: service.name,
          // Keep existing price or 0 - user can edit
          unit_price: updated[index].unit_price || 0,
        }
      }
    }
    setLineItems(updated)
  }

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClientId || lineItems.length === 0) return

    setCreating(true)
    const supabase = createClient()

    const invoiceTotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        client_id: selectedClientId,
        due_date: dueDate || null,
        period_start: periodStart,
        period_end: periodEnd,
        notes: notes || null,
        status: markAsPaid ? 'paid' : 'draft',
        ...(markAsPaid ? { amount_paid: invoiceTotal, paid_at: new Date().toISOString() } : {}),
      })
      .select()
      .single()

    if (invoiceError || !invoice) {
      alert('Error creating invoice: ' + invoiceError?.message)
      setCreating(false)
      return
    }

    // Create line items
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(lineItems.map((item, index) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        service_id: item.service_id || null,
        period_start: periodStart,
        period_end: periodEnd,
        sort_order: index,
      })))

    if (itemsError) {
      alert('Error creating line items: ' + itemsError.message)
      setCreating(false)
      return
    }

    // If marking as paid, also create a payment record
    if (markAsPaid) {
      await supabase.from('payments').insert({
        client_id: selectedClientId,
        invoice_id: invoice.id,
        amount: invoiceTotal,
        payment_method: 'other',
        status: 'completed',
        notes: 'Marked as paid on creation',
      })
    }

    router.push(`/portal/invoices/${invoice.id}`)
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="h-64 bg-[#444444] rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-3xl">
        <div className="mb-8">
          <Link href="/portal/invoices" className="text-gray-400 hover:text-white text-sm">&larr; Back to Invoices</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Create Invoice</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="bg-[#333333] rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Client</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Client <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                required
              >
                <option value="">Choose a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedClient && invoiceableServices.length > 0 && (
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={useAutoGenerate}
                  onChange={(e) => {
                    setUseAutoGenerate(e.target.checked)
                    if (!e.target.checked) setLineItems([])
                  }}
                  className="w-4 h-4 rounded bg-[#444444] border-[#555555] text-[#2E8B57] focus:ring-[#2E8B57]"
                />
                Auto-populate from {invoiceableServices.length} service{invoiceableServices.length !== 1 ? 's' : ''}
              </label>
            )}
          </div>

          {/* Dates */}
          <div className="bg-[#333333] rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Dates</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Period Start</label>
                <input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Period End</label>
                <input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-[#333333] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Line Items</h2>
              <button
                type="button"
                onClick={addLineItem}
                className="text-sm text-[#2E8B57] hover:underline"
              >
                + Add Item
              </button>
            </div>

            {lineItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No line items. Select a client or add manually.</p>
            ) : (
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={index} className="p-3 bg-[#3a3a3a] rounded-lg space-y-3">
                    {/* Service Dropdown */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <select
                          value={item.isCustom ? 'custom' : (item.service_id || 'custom')}
                          onChange={(e) => handleServiceSelect(index, e.target.value)}
                          className="w-full px-3 py-2 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                        >
                          <option value="custom">Custom Item</option>
                          <optgroup label="Services">
                            {services.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                      <div className="w-full sm:w-24 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Description, Qty, Price */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                        />
                      </div>
                      <div className="w-full sm:w-20">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                        />
                      </div>
                      <div className="w-full sm:w-28">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={item.unit_price}
                            onChange={(e) => updateLineItem(index, 'unit_price', Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-24 flex items-center justify-end">
                        <span className="text-white font-medium">
                          ${(item.quantity * item.unit_price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-4 border-t border-[#444444]">
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Subtotal</p>
                    <p className="text-2xl font-bold text-white">${subtotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-[#333333] rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (visible to client)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Thank you for your business..."
              className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              onClick={() => setMarkAsPaid(false)}
              disabled={creating || !selectedClientId || lineItems.length === 0}
              className="w-full sm:w-auto px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {creating && !markAsPaid ? 'Creating...' : 'Create Draft Invoice'}
            </button>
            <button
              type="submit"
              onClick={() => setMarkAsPaid(true)}
              disabled={creating || !selectedClientId || lineItems.length === 0}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {creating && markAsPaid ? 'Creating...' : 'Create as Paid (Receipt)'}
            </button>
            <Link
              href="/portal/invoices"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
