'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import type { Invoice } from '@/lib/portal-types'
import { FileText, Calendar, ChevronRight } from 'lucide-react'

interface InvoiceWithRecurring extends Invoice {
  has_recurring: boolean
  service_names: string
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
        .select('*, invoice_items(client_service_id, service_id, client_services(monthly_cost), services:service_id(name))')
        .eq('client_id', resolvedClientId!)
        .neq('status', 'draft')
        .order('created_at', { ascending: false })

      const enriched: InvoiceWithRecurring[] = ((data as any[]) || []).map((inv) => {
        const hasRecurring = (inv.invoice_items || []).some(
          (item: any) => item.client_services && Number(item.client_services.monthly_cost) > 0
        )
        const names = (inv.invoice_items || [])
          .map((item: any) => item.services?.name)
          .filter(Boolean)
        const uniqueNames = [...new Set(names)]
        const { invoice_items, ...rest } = inv
        return { ...rest, has_recurring: hasRecurring, service_names: uniqueNames.join(', ') || '-' }
      })

      setInvoices(enriched)
      setLoading(false)
    }

    loadInvoices()
  }, [authLoading, resolvedClientId])

  const handlePay = async (invoiceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'border-l-green-500 bg-green-500/5'
      case 'overdue': return 'border-l-red-500 bg-red-500/5'
      case 'sent': return 'border-l-yellow-500 bg-yellow-500/5'
      case 'partially_paid': return 'border-l-orange-500 bg-orange-500/5'
      default: return 'border-l-gray-500 bg-gray-500/5'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400'
      case 'overdue': return 'bg-red-500/20 text-red-400'
      case 'sent': return 'bg-yellow-500/20 text-yellow-400'
      case 'partially_paid': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const isSubdomain = typeof window !== 'undefined' && (window.location.hostname.startsWith('my.') || window.location.hostname.startsWith('clients.'))

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6">Invoices</h1>

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
        <div className="bg-[#333333] border border-[#444444] rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No invoices yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => {
            const detailHref = isSubdomain ? `/invoices/${inv.id}` : `/client-portal/invoices/${inv.id}`
            const needsPayment = inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'partially_paid'

            return (
              <div
                key={inv.id}
                onClick={() => router.push(detailHref)}
                className={`bg-[#333333] border border-[#444444] rounded-lg p-4 cursor-pointer hover:bg-[#3a3a3a] transition-colors border-l-4 ${getStatusColor(inv.status)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">#{inv.invoice_number}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(inv.status)}`}>
                        {inv.status.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[#2E8B57] text-sm font-medium truncate">{inv.service_names}</p>
                    {inv.due_date && (
                      <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due {new Date(inv.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-white font-bold text-lg">${Number(inv.total).toFixed(2)}</span>
                    {needsPayment ? (
                      <button
                        onClick={(e) => handlePay(inv.id, e)}
                        disabled={paying === inv.id}
                        className="px-3 py-1.5 bg-[#2E8B57] text-white text-xs font-medium rounded hover:bg-[#267347] disabled:opacity-50"
                      >
                        {paying === inv.id ? 'Processing...' : 'Pay Now'}
                      </button>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
