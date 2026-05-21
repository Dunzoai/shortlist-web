'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Affiliate, Client, ClientService } from '@/lib/portal-types'

interface AffiliateWithStats extends Affiliate {
  clients: Client[]
  totalMonthlyRevenue: number
  totalEarnings: number
}

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<AffiliateWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAffiliates() {
      const supabase = createClient()

      const { data: affiliatesData } = await supabase.from('affiliates').select('*, clients(*)').order('name')

      const { data: clientServicesData } = await supabase.from('client_services').select('*').eq('status', 'active')

      const clientServices = (clientServicesData as ClientService[]) ?? []

      const affiliatesWithStats = ((affiliatesData as (Affiliate & { clients: Client[] })[]) ?? []).map((affiliate) => {
        const clientIds = affiliate.clients.map((c) => c.id)

        const totalMonthlyRevenue = clientServices
          .filter((cs) => clientIds.includes(cs.client_id))
          .reduce((sum, cs) => sum + Number(cs.monthly_cost), 0)

        let totalEarnings = 0
        if (affiliate.payment_type === 'percentage' && affiliate.payment_amount) {
          totalEarnings = totalMonthlyRevenue * (affiliate.payment_amount / 100)
        } else if (affiliate.payment_type === 'flat' && affiliate.payment_amount) {
          totalEarnings = affiliate.payment_amount * affiliate.clients.length
        }

        return { ...affiliate, totalMonthlyRevenue, totalEarnings }
      })

      setAffiliates(affiliatesWithStats)
      setLoading(false)
    }

    fetchAffiliates()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Affiliates</h1>
        <Link href="/portal/affiliates/new" className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white font-medium rounded-lg transition-colors">
          Add Affiliate
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>{[1, 2, 3].map((i) => <div key={i} className="h-48 bg-[#333333] rounded-lg animate-pulse"></div>)}</>
        ) : affiliates.length === 0 ? (
          <div className="col-span-full bg-[#333333] rounded-lg p-8 text-center text-gray-400">
            No affiliates yet. <Link href="/portal/affiliates/new" className="text-[#2E8B57] hover:underline">Add your first affiliate</Link>
          </div>
        ) : (
          affiliates.map((affiliate) => (
            <Link key={affiliate.id} href={`/portal/affiliates/${affiliate.id}`} className="bg-[#333333] rounded-lg p-6 hover:ring-2 hover:ring-[#2E8B57] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{affiliate.name}</h3>
                  <p className="text-gray-400 text-sm">{affiliate.email || 'No email'}</p>
                </div>
                <span className="px-2 py-1 bg-[#444444] rounded text-xs text-gray-300">
                  {affiliate.clients.length} client{affiliate.clients.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Terms</span>
                  <span className="text-gray-200">
                    {affiliate.payment_type === 'percentage' ? `${affiliate.payment_amount}%` : affiliate.payment_type === 'flat' ? `$${affiliate.payment_amount}` : '-'}
                    {affiliate.payment_frequency === 'monthly' && '/mo'}
                    {affiliate.payment_frequency === 'one_time' && ' (one-time)'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Client Revenue</span>
                  <span className="text-gray-200">${affiliate.totalMonthlyRevenue.toLocaleString()}/mo</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#444444]">
                  <span className="text-gray-400">Their Earnings</span>
                  <span className="font-medium text-[#2E8B57]">
                    ${affiliate.totalEarnings.toLocaleString()}{affiliate.payment_frequency === 'monthly' && '/mo'}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
