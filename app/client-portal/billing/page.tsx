'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import type { RecurringBilling, Payment } from '@/lib/portal-types'

export default function BillingPage() {
  const { clientId: resolvedClientId, loading: authLoading } = usePortalClient()
  const [loading, setLoading] = useState(true)
  const [recurring, setRecurring] = useState<RecurringBilling | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    if (authLoading || !resolvedClientId) return

    async function loadBilling() {
      const supabase = createClient()

      const [{ data: recurringData }, { data: paymentData }] = await Promise.all([
        supabase
          .from('recurring_billing')
          .select('*')
          .eq('client_id', resolvedClientId!)
          .single(),
        supabase
          .from('payments')
          .select('*')
          .eq('client_id', resolvedClientId!)
          .order('created_at', { ascending: false })
          .limit(20)
      ])

      setRecurring(recurringData as RecurringBilling | null)
      setPayments((paymentData as Payment[]) || [])
      setLoading(false)
    }

    loadBilling()
  }, [authLoading, resolvedClientId])

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Billing</h1>

      {/* Subscription Status */}
      <div className="bg-[#333333] border border-[#444444] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Subscription</h2>
        {recurring ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-gray-400">Status:</p>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                recurring.status === 'active' ? 'bg-green-500/20 text-green-400' :
                recurring.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {recurring.status.toUpperCase()}
              </span>
            </div>
            {recurring.next_billing_date && (
              <p className="text-gray-300 text-sm">
                Next billing date: <span className="text-white">{new Date(recurring.next_billing_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No active subscription. Pay an invoice with recurring services to set up auto-billing.</p>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-[#333333] border border-[#444444] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#444444]">
          <h2 className="text-xl font-semibold text-white">Payment History</h2>
        </div>
        {payments.length === 0 ? (
          <div className="px-6 py-8">
            <p className="text-gray-400 text-sm">No payments yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444444]">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">
                    ${Number(p.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {p.card_brand && p.card_last4
                      ? `${p.card_brand} ****${p.card_last4}`
                      : p.payment_method || 'Card'
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      p.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
