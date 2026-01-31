'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BillingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [recurring, setRecurring] = useState<any>(null)

  useEffect(() => {
    async function loadBilling() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/portal/login')
        return
      }

      const { data: portalUser } = await supabase
        .from('client_portal_users')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (!portalUser) {
        router.push('/portal/login')
        return
      }

      const { data } = await supabase
        .from('recurring_billing')
        .select('*')
        .eq('client_id', portalUser.client_id)
        .single()

      setRecurring(data)
      setLoading(false)
    }

    loadBilling()
  }, [router])

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Billing</h1>

      <div className="bg-[#333333] border border-[#444444] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recurring Billing</h2>
        {recurring ? (
          <div className="space-y-2">
            <p className="text-gray-300">Status: <span className="text-white">{recurring.status}</span></p>
            <p className="text-gray-300">Next Billing: <span className="text-white">{recurring.next_billing_date || 'N/A'}</span></p>
          </div>
        ) : (
          <p className="text-gray-400">No recurring billing set up</p>
        )}
      </div>
    </div>
  )
}
