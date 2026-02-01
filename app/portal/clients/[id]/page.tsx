'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Client, Affiliate, Service, ClientService, Representative, Payment } from '@/lib/portal-types'

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  affiliate_id: z.string().optional(),
  representative_id: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientServiceWithService extends ClientService {
  services: Service
}

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [clientServices, setClientServices] = useState<ClientServiceWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [inviteStatus, setInviteStatus] = useState('')
  const [payments, setPayments] = useState<Payment[]>([])

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  })

  const currentRepId = watch('representative_id')

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: clientData } = await supabase.from('clients').select('*').eq('id', clientId).single()

      if (clientData) {
        setClient(clientData as Client)
        reset({
          name: clientData.name,
          email: clientData.email || '',
          phone: clientData.phone || '',
          notes: clientData.notes || '',
          affiliate_id: clientData.affiliate_id || '',
          representative_id: clientData.representative_id || '',
        })
      }

      const { data: affiliatesData } = await supabase.from('affiliates').select('*').order('name')
      setAffiliates((affiliatesData as Affiliate[]) ?? [])

      const { data: repsData } = await supabase.from('representatives').select('*').order('name')
      setRepresentatives((repsData as Representative[]) ?? [])

      const { data: servicesData } = await supabase.from('services').select('*').order('name')
      setServices((servicesData as Service[]) ?? [])

      const { data: clientServicesData } = await supabase
        .from('client_services')
        .select('*, services(*)')
        .eq('client_id', clientId)
        .order('created_at')

      setClientServices((clientServicesData as ClientServiceWithService[]) ?? [])

      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(20)

      setPayments((paymentsData as Payment[]) ?? [])
      setLoading(false)
    }

    fetchData()
  }, [clientId, reset])

  const onSubmit = async (data: ClientFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('clients')
      .update({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
        affiliate_id: data.affiliate_id || null,
        representative_id: data.representative_id || null,
      })
      .eq('id', clientId)

    if (error) {
      alert('Error updating client: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/clients')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client? This will also delete all their services.')) return

    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('clients').delete().eq('id', clientId)

    if (error) {
      alert('Error deleting client: ' + error.message)
      setDeleting(false)
      return
    }

    router.push('/portal/clients')
  }

  const handleInviteToPortal = async () => {
    const email = watch('email')
    const name = watch('name')
    if (!email) {
      alert('Client must have an email address to send an invite.')
      return
    }
    if (!confirm(`Send portal invite to ${email}?`)) return

    setInviting(true)
    setInviteStatus('')
    try {
      const res = await fetch('/api/portal/invite-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, email, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setInviteStatus(`Error: ${data.error}`)
      } else if (data.alreadyExisted) {
        setInviteStatus('User already has an account. Linked to this client.')
      } else {
        setInviteStatus('Invite sent! Client will receive an email to set their password.')
      }
    } catch {
      setInviteStatus('Failed to send invite.')
    }
    setInviting(false)
  }

  const handleAddService = async (serviceId: string) => {
    const supabase = createClient()

    // Default performed_by_id to the client's account manager, start_date to today
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('client_services')
      .insert({
        client_id: clientId,
        service_id: serviceId,
        monthly_cost: 0,
        one_time_cost: 0,
        status: 'active',
        performed_by_id: currentRepId || null,
        start_date: today,
      })
      .select('*, services(*)')
      .single()

    if (error) {
      alert('Error adding service: ' + error.message)
      return
    }

    setClientServices([...clientServices, data as ClientServiceWithService])
  }

  const handleUpdateService = async (csId: string, field: 'monthly_cost' | 'one_time_cost' | 'status' | 'performed_by_id' | 'commission_rate' | 'start_date' | 'notes' | 'deposit_amount' | 'amount_paid' | 'trial_end_date' | 'paused_at' | 'ended_at', value: string | number | null) => {
    const supabase = createClient()

    const updateData: Record<string, string | number | null> = {}
    if (field === 'monthly_cost' || field === 'one_time_cost' || field === 'commission_rate' || field === 'deposit_amount' || field === 'amount_paid') {
      updateData[field] = Number(value) || 0
    } else if (field === 'performed_by_id' || field === 'start_date' || field === 'trial_end_date' || field === 'paused_at' || field === 'ended_at') {
      updateData[field] = value || null
    } else if (field === 'notes') {
      updateData[field] = value as string || null
    } else if (field === 'status') {
      updateData[field] = value
      // Auto-set dates when status changes
      if (value === 'trial') {
        const cs = clientServices.find(s => s.id === csId)
        if (cs && !cs.trial_end_date) {
          const trialEnd = new Date()
          trialEnd.setDate(trialEnd.getDate() + 7)
          updateData.trial_end_date = trialEnd.toISOString().split('T')[0]
        }
      } else if (value === 'paused') {
        updateData.paused_at = new Date().toISOString()
      } else if (value === 'completed') {
        updateData.ended_at = new Date().toISOString()
      } else if (value === 'cancelled') {
        updateData.ended_at = new Date().toISOString()
      }
    } else {
      updateData[field] = value
    }

    const { error } = await supabase.from('client_services').update(updateData).eq('id', csId)

    if (error) {
      alert('Error updating service: ' + error.message)
      return
    }

    setClientServices(clientServices.map((cs) => cs.id === csId ? { ...cs, ...updateData } : cs))
  }

  const handleRemoveService = async (csId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('client_services').delete().eq('id', csId)

    if (error) {
      alert('Error removing service: ' + error.message)
      return
    }

    setClientServices(clientServices.filter((cs) => cs.id !== csId))
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="h-64 bg-[#444444] rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Client not found.</p>
        <Link href="/portal/clients" className="text-[#2E8B57] hover:underline">Back to Clients</Link>
      </div>
    )
  }

  // Allow adding same service multiple times (e.g., 3 websites)
  const availableServices = services

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link href="/portal/clients" className="text-gray-400 hover:text-white text-sm">&larr; Back to Clients</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Edit Client</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-[#333333] rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Client Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
                  <input type="text" {...register('name')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" {...register('email')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input type="tel" {...register('phone')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Referred by Affiliate</label>
                  <select {...register('affiliate_id')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                    <option value="">No affiliate</option>
                    {affiliates.map((affiliate) => (
                      <option key={affiliate.id} value={affiliate.id}>{affiliate.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Manager</label>
                  <select {...register('representative_id')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                    <option value="">No rep assigned</option>
                    {representatives.map((rep) => (
                      <option key={rep.id} value={rep.id}>{rep.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea {...register('notes')} rows={4} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none" />
                </div>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white">Client Portal Access</h2>
                <p className="text-sm text-gray-400">Send an invite email so this client can log into their dashboard at my.shortlistpass.com</p>
                <button
                  type="button"
                  onClick={handleInviteToPortal}
                  disabled={inviting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {inviting ? 'Sending...' : 'Invite to Portal'}
                </button>
                {inviteStatus && (
                  <p className={`text-sm ${inviteStatus.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {inviteStatus}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors">
                  {deleting ? 'Deleting...' : 'Delete Client'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-[#333333] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Services</h2>
                {availableServices.length > 0 && (
                  <select
                    onChange={(e) => { if (e.target.value) { handleAddService(e.target.value); e.target.value = '' } }}
                    className="px-3 py-1.5 bg-[#444444] border border-[#555555] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  >
                    <option value="">+ Add Service</option>
                    {availableServices.map((service) => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {clientServices.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No services assigned yet. Use the dropdown above to add services.</p>
              ) : (
                <div className="space-y-4">
                  {clientServices.map((cs) => (
                    <div key={cs.id} className="bg-[#3a3a3a] rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{cs.services.name}</span>
                        <button onClick={() => handleRemoveService(cs.id)} className="text-gray-400 hover:text-red-400 text-sm">Remove</button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Monthly Cost</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="number"
                              value={cs.monthly_cost}
                              onChange={(e) => handleUpdateService(cs.id, 'monthly_cost', e.target.value)}
                              className="w-full pl-7 pr-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">One-time Cost</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="number"
                              value={cs.one_time_cost}
                              onChange={(e) => handleUpdateService(cs.id, 'one_time_cost', e.target.value)}
                              className="w-full pl-7 pr-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Deposit Amount</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="number"
                              value={cs.deposit_amount || 0}
                              onChange={(e) => handleUpdateService(cs.id, 'deposit_amount', e.target.value)}
                              className="w-full pl-7 pr-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Amount Paid</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="number"
                              value={cs.amount_paid || 0}
                              onChange={(e) => handleUpdateService(cs.id, 'amount_paid', e.target.value)}
                              className="w-full pl-7 pr-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Service Notes (visible to client)</label>
                        <textarea
                          key={cs.id + '-notes'}
                          defaultValue={cs.notes || ''}
                          onBlur={(e) => handleUpdateService(cs.id, 'notes', e.target.value)}
                          rows={2}
                          placeholder="e.g., 3 posts/month, no UGC. 5-page website with contact form..."
                          className="w-full px-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Status</label>
                          <select
                            value={cs.status}
                            onChange={(e) => handleUpdateService(cs.id, 'status', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                          >
                            <option value="active">Active</option>
                            <option value="trial">Trial</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="paused">Paused</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Performed By</label>
                          <select
                            value={cs.performed_by_id || ''}
                            onChange={(e) => handleUpdateService(cs.id, 'performed_by_id', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                          >
                            <option value="">Not assigned</option>
                            {representatives.map((rep) => (
                              <option key={rep.id} value={rep.id}>{rep.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={cs.start_date || ''}
                            onChange={(e) => handleUpdateService(cs.id, 'start_date', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                          />
                        </div>
                      </div>

                      {/* Conditional date fields based on status */}
                      {cs.status === 'trial' && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Trial Ends</label>
                          <input
                            type="date"
                            value={cs.trial_end_date ? cs.trial_end_date.split('T')[0] : ''}
                            onChange={(e) => handleUpdateService(cs.id, 'trial_end_date', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#444444] border border-yellow-500/50 rounded text-yellow-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      )}

                      {cs.status === 'paused' && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Paused On</label>
                          <input
                            type="date"
                            value={cs.paused_at ? cs.paused_at.split('T')[0] : ''}
                            onChange={(e) => handleUpdateService(cs.id, 'paused_at', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#444444] border border-yellow-500/50 rounded text-yellow-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      )}

                      {cs.status === 'completed' && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Completed On</label>
                          <input
                            type="date"
                            value={cs.ended_at ? cs.ended_at.split('T')[0] : ''}
                            onChange={(e) => handleUpdateService(cs.id, 'ended_at', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#444444] border border-purple-500/50 rounded text-purple-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      )}

                      {cs.status === 'cancelled' && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Ended On</label>
                          <input
                            type="date"
                            value={cs.ended_at ? cs.ended_at.split('T')[0] : ''}
                            onChange={(e) => handleUpdateService(cs.id, 'ended_at', e.target.value)}
                            className="w-full px-3 py-1.5 bg-[#444444] border border-red-500/50 rounded text-red-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t border-[#444444] space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Monthly</span>
                      <span className="font-medium text-white">
                        ${clientServices.filter((cs) => cs.status === 'active' || cs.status === 'trial').reduce((sum, cs) => sum + Number(cs.monthly_cost), 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total One-time</span>
                      <span className="font-medium text-white">
                        ${clientServices.reduce((sum, cs) => sum + Number(cs.one_time_cost), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="bg-[#333333] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment History</h2>
              {payments.length === 0 ? (
                <p className="text-gray-400 text-center py-4 text-sm">No payments recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between bg-[#3a3a3a] rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm text-white font-medium">${Number(p.amount).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {p.card_brand && p.card_last4 ? `${p.card_brand} ****${p.card_last4}` : p.payment_method || 'Card'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          p.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          p.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
