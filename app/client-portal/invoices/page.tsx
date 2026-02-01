'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import type { Invoice } from '@/lib/portal-types'

export default function InvoicesPage() {
  const { clientId: resolvedClientId, loading: authLoading } = usePortalClient()
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [paying, setPaying] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || !resolvedClientId) return

    async function loadInvoices() {
      const supabase = createClient()

      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', resolvedClientId!)
        .order('created_at', { ascending: false })

      setInvoices((data as Invoice[]) || [])
      setLoading(false)
    }

    loadInvoices()
  }, [authLoading, resolvedClientId])

  const handlePay = async (invoiceId: string) => {
    setPaying(invoiceId)
    
    try {
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      })

      const data = await res.json()
      
      if (data.error) {
        alert(data.error)
      } else {
        alert('Payment processing - Stripe integration pending')
      }
    } catch (err) {
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
              {invoices.map((inv) => (
                <tr key={inv.id}>
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
                        onClick={() => handlePay(inv.id)}
                        disabled={paying === inv.id}
                        className="px-4 py-2 bg-[#2E8B57] text-white text-sm rounded hover:bg-[#267347] disabled:opacity-50"
                      >
                        {paying === inv.id ? 'Processing...' : 'Pay Now'}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
