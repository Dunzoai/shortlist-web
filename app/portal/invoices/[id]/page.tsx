'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Invoice, InvoiceItem, Client, Payment, InvoiceStatus } from '@/lib/portal-types'

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  sent: 'bg-blue-500/20 text-blue-400',
  paid: 'bg-green-500/20 text-green-400',
  partially_paid: 'bg-yellow-500/20 text-yellow-400',
  overdue: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-gray-500/20 text-gray-500',
  refunded: 'bg-purple-500/20 text-purple-400',
}

const statusLabels: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  partially_paid: 'Partially Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchInvoice() {
      const supabase = createClient()

      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()

      if (!invoiceData) {
        setLoading(false)
        return
      }

      setInvoice(invoiceData as Invoice)

      // Fetch related data in parallel
      const [clientRes, itemsRes, paymentsRes] = await Promise.all([
        supabase.from('clients').select('*').eq('id', invoiceData.client_id).single(),
        supabase.from('invoice_items').select('*').eq('invoice_id', invoiceId).order('sort_order'),
        supabase.from('payments').select('*').eq('invoice_id', invoiceId).order('created_at', { ascending: false }),
      ])

      setClient(clientRes.data as Client | null)
      setItems((itemsRes.data as InvoiceItem[] | null) ?? [])
      setPayments((paymentsRes.data as Payment[] | null) ?? [])
      setLoading(false)
    }

    fetchInvoice()
  }, [invoiceId])

  const handleMarkAsSent = async () => {
    if (!invoice) return
    setUpdating(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'sent', updated_at: new Date().toISOString() })
      .eq('id', invoiceId)

    if (error) {
      alert('Error updating invoice: ' + error.message)
    } else {
      setInvoice({ ...invoice, status: 'sent' })
    }
    setUpdating(false)
  }

  const handleMarkAsPaid = async () => {
    if (!invoice) return
    setUpdating(true)

    const supabase = createClient()

    // Create a manual payment record
    await supabase.from('payments').insert({
      client_id: invoice.client_id,
      invoice_id: invoiceId,
      amount: invoice.amount_due,
      payment_method: 'other',
      status: 'completed',
      notes: 'Manually marked as paid',
    })

    // Update invoice
    const { error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        amount_paid: invoice.total,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)

    if (error) {
      alert('Error updating invoice: ' + error.message)
    } else {
      setInvoice({ ...invoice, status: 'paid', amount_paid: invoice.total, paid_at: new Date().toISOString() })
    }
    setUpdating(false)
  }

  const handleCancel = async () => {
    if (!invoice || !confirm('Are you sure you want to cancel this invoice?')) return
    setUpdating(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', invoiceId)

    if (error) {
      alert('Error cancelling invoice: ' + error.message)
    } else {
      setInvoice({ ...invoice, status: 'cancelled' })
    }
    setUpdating(false)
  }

  const handleDelete = async () => {
    if (!invoice || !confirm('Are you sure you want to delete this invoice? This cannot be undone.')) return
    setUpdating(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId)

    if (error) {
      alert('Error deleting invoice: ' + error.message)
      setUpdating(false)
      return
    }

    router.push('/portal/invoices')
  }

  const handleSendInvoice = async () => {
    if (!invoice || !client?.email) {
      alert('Client must have an email address to send invoice')
      return
    }

    if (!confirm(`Send invoice to ${client.email}?`)) return

    setUpdating(true)

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invoice')
      }

      // Refresh invoice data
      const supabase = createClient()
      const { data: updatedInvoice } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()

      if (updatedInvoice) {
        setInvoice(updatedInvoice as Invoice)
      }

      alert('Invoice sent successfully!')
    } catch (error) {
      alert('Error sending invoice: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }

    setUpdating(false)
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

  if (!invoice) {
    return (
      <div className="p-4 lg:p-8">
        <p className="text-gray-400">Invoice not found.</p>
        <Link href="/portal/invoices" className="text-[#2E8B57] hover:underline">Back to Invoices</Link>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/portal/invoices" className="text-gray-400 hover:text-white text-sm">&larr; Back to Invoices</Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl font-bold text-white font-mono">{invoice.invoice_number}</h1>
              <p className="text-gray-400">{client?.name || 'Unknown Client'}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusColors[invoice.status]} w-fit`}>
              {statusLabels[invoice.status]}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#333333] rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {invoice.status === 'draft' && (
              <>
                <button
                  onClick={handleSendInvoice}
                  disabled={updating || !client?.email}
                  className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {updating ? 'Sending...' : 'Send Invoice'}
                </button>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={handleMarkAsSent}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Mark as Sent
                </button>
                <button
                  onClick={handleDelete}
                  disabled={updating}
                  className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors"
                >
                  Delete
                </button>
              </>
            )}
            {invoice.stripe_hosted_invoice_url && (
              <a
                href={invoice.stripe_hosted_invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#635BFF] hover:bg-[#5851db] text-white text-sm font-medium rounded-lg transition-colors"
              >
                View Stripe Invoice
              </a>
            )}
            {(invoice.status === 'sent' || invoice.status === 'overdue' || invoice.status === 'partially_paid') && (
              <>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={updating}
                  className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors"
                >
                  Cancel Invoice
                </button>
              </>
            )}
            {invoice.status === 'paid' && (
              <span className="text-green-400 text-sm">
                Paid on {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : 'N/A'}
              </span>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#333333] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Issue Date</p>
            <p className="text-white">{new Date(invoice.issue_date).toLocaleDateString()}</p>
          </div>
          <div className="bg-[#333333] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Due Date</p>
            <p className={`${new Date(invoice.due_date) < new Date() && invoice.status !== 'paid' ? 'text-red-400' : 'text-white'}`}>
              {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-[#333333] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Billing Period</p>
            <p className="text-white">
              {invoice.period_start && invoice.period_end
                ? `${new Date(invoice.period_start).toLocaleDateString()} - ${new Date(invoice.period_end).toLocaleDateString()}`
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-[#333333] rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-[#444444]">
            <h2 className="text-lg font-semibold text-white">Line Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3a3a3a]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Qty</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Price</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#444444]">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-white">{item.description}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-300">${item.unit_price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#444444] space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">${invoice.subtotal.toLocaleString()}</span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tax ({(invoice.tax_rate * 100).toFixed(2)}%)</span>
                <span className="text-white">${invoice.tax_amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#444444]">
              <span className="text-white">Total</span>
              <span className="text-white">${invoice.total.toLocaleString()}</span>
            </div>
            {invoice.amount_paid > 0 && invoice.amount_paid < invoice.total && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Paid</span>
                  <span className="text-green-400">-${invoice.amount_paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Amount Due</span>
                  <span className="text-yellow-400">${invoice.amount_due.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="bg-[#333333] rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Notes</h3>
            <p className="text-white whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="bg-[#333333] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#444444]">
              <h2 className="text-lg font-semibold text-white">Payment History</h2>
            </div>
            <div className="divide-y divide-[#444444]">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white">${payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">
                      {payment.payment_method ? payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1) : 'Unknown'}
                      {payment.card_last4 && ` •••• ${payment.card_last4}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      payment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      payment.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
