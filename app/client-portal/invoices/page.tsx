'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import type { Invoice } from '@/lib/portal-types'

interface InvoiceWithRecurring extends Invoice {
  has_recurring: boolean
}

export default function InvoicesPage() {
  const { clientId: resolvedClientId, loading: authLoading } = usePortalClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('payment')
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<InvoiceWithRecurring[]>([])
  const [paying, setPaying] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || !resolvedClientId) return

    async function loadInvoices() {
      const supabase = createClient()

      const { data } = await supabase
        .from('invoices')
        .select('*, invoice_items(client_service_id, client_services(monthly_cost))')
        .eq('client_id', resolvedClientId!)
        .order('created_at', { ascending: false })

      const enriched: InvoiceWithRecurring[] = ((data as any[]) || []).map((inv) => {
        const hasRecurring = (inv.invoice_items || []).some(
          (item: any) => item.client_services && Number(item.client_services.monthly_cost) > 0
        )
        const { invoice_items, ...rest } = inv
        return { ...rest, has_recurring: hasRecurring }
      })

      setInvoices(enriched)
      setLoading(false)
    }

    loadInvoices()
  }, [authLoading, resolvedClientId])

  const handlePay = async (invoiceId: string) => {
    setPaying(invoiceId)

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      })

      const data = await res.json()

      if (data.error) {
        alert(data.error)
      } else if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Payment failed')
    } finally {
      setPaying(null)
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Invoices</h1>

      {paymentStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
          Payment successful! Your invoice will be updated shortly.
        </div>
      )}
      {paymentStatus === 'cancelled' && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm">
          Payment was cancelled. You can try again when ready.
        </div>
      )}

      {invoices.length === 0 ? (
        <p className="text-gray-400">No invoices found</p>
      ) : (
        <div className="bg-[#333333] border border-[#444444] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444444]">
              {invoices.map((inv) => {
                const isSubdomain = typeof window !== 'undefined' && (window.location.hostname.startsWith('my.') || window.location.hostname.startsWith('clients.'))
                const detailHref = isSubdomain ? `/invoices/${inv.id}` : `/client-portal/invoices/${inv.id}`
                return (
                <tr key={inv.id} onClick={() => router.push(detailHref)} className="cursor-pointer hover:bg-[#3a3a3a] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">{inv.invoice_number}</td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">${Number(inv.total).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      inv.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      inv.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'partially_paid' ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePay(inv.id) }}
                        disabled={paying === inv.id}
                        className="px-4 py-2 bg-[#2E8B57] text-white text-sm rounded hover:bg-[#267347] disabled:opacity-50"
                      >
                        {paying === inv.id ? 'Processing...' : inv.has_recurring ? 'Pay & Subscribe' : 'Pay Now'}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">View</span>
                    )}
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
