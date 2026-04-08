'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import type { RecurringBilling, Payment } from '@/lib/portal-types'
import { CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />
      default: return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-l-green-500'
      case 'failed': return 'border-l-red-500'
      default: return 'border-l-yellow-500'
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-6">Billing</h1>

      {/* Subscription Status */}
      <div className="bg-[#333333] border border-[#444444] rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#2E8B57]" />
          Subscription
        </h2>
        {recurring ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                recurring.status === 'active' ? 'bg-green-500/20 text-green-400' :
                recurring.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {recurring.status.toUpperCase()}
              </span>
            </div>
            {recurring.next_billing_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Next billing:</span>
                <span className="text-white">
                  {new Date(recurring.next_billing_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No active subscription. Pay an invoice with recurring services to set up auto-billing.</p>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-[#333333] border border-[#444444] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#444444]">
          <h2 className="text-lg font-semibold text-white">Payment History</h2>
        </div>

        {payments.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No payments yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#444444]">
            {payments.map((p) => (
              <div key={p.id} className={`p-4 border-l-4 ${getStatusColor(p.status)}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(p.status)}
                      <span className="text-white font-semibold">${Number(p.amount).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {p.card_brand && p.card_last4
                        ? `${p.card_brand} ****${p.card_last4}`
                        : p.payment_method || 'Card'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                    <span className={`text-xs ${
                      p.status === 'completed' ? 'text-green-400' :
                      p.status === 'failed' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
