'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Client, ClientService } from '@/lib/portal-types'

interface DashboardStats {
  totalClients: number
  activeClients: number
  monthlyRevenue: number
  oneTimeRevenue: number
  recentClients: Client[]
}

export default function PortalDashboard() {
  const currentYear = new Date().getFullYear()
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    oneTimeRevenue: 0,
    recentClients: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      // Active services for monthly revenue
      const { data: activeServices } = await supabase
        .from('client_services')
        .select('*')
        .eq('status', 'active')

      // One-time costs for current year
      const { data: oneTimeServices } = await supabase
        .from('client_services')
        .select('*')
        .gte('start_date', `${currentYear}-01-01`)
        .lte('start_date', `${currentYear}-12-31`)
        .gt('one_time_cost', 0)

      const totalClients = clients?.length ?? 0
      const recentClients = clients?.slice(0, 5) ?? []

      const monthlyRevenue = (activeServices as ClientService[] | null)?.reduce(
        (sum, cs) => sum + (Number(cs.monthly_cost) || 0),
        0
      ) ?? 0

      const oneTimeRevenue = (oneTimeServices as ClientService[] | null)?.reduce(
        (sum, cs) => sum + (Number(cs.one_time_cost) || 0),
        0
      ) ?? 0

      const activeClientIds = new Set(
        (activeServices as ClientService[] | null)?.map((cs) => cs.client_id) ?? []
      )
      const activeClients = activeClientIds.size

      setStats({
        totalClients,
        activeClients,
        monthlyRevenue,
        oneTimeRevenue,
        recentClients,
      })
      setLoading(false)
    }

    fetchStats()
  }, [currentYear])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[#444444] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Clients" value={stats.totalClients} href="/portal/clients" />
        <StatCard title="Active Clients" value={stats.activeClients} subtitle="With active services" />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          subtitle="From active services"
          href="/portal/revenue"
        />
        <StatCard
          title={`One-Time (${currentYear})`}
          value={`$${stats.oneTimeRevenue.toLocaleString()}`}
          subtitle="Project fees"
          href="/portal/revenue"
        />
      </div>

      <div className="bg-[#333333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Clients</h2>
          <Link href="/portal/clients/new" className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white text-sm font-medium rounded-lg transition-colors">
            Add Client
          </Link>
        </div>

        {stats.recentClients.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No clients yet. <Link href="/portal/clients/new" className="text-[#2E8B57] hover:underline">Add your first client</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {stats.recentClients.map((client) => (
              <Link key={client.id} href={`/portal/clients/${client.id}`} className="flex items-center justify-between p-4 bg-[#3a3a3a] hover:bg-[#444444] rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-white">{client.name}</p>
                  <p className="text-sm text-gray-400">{client.email || 'No email'}</p>
                </div>
                <span className="text-gray-400 text-sm">{new Date(client.created_at).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, href }: { title: string; value: string | number; subtitle?: string; href?: string }) {
  const content = (
    <div className="bg-[#333333] rounded-lg p-6">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )

  if (href) {
    return <Link href={href} className="block hover:ring-2 hover:ring-[#2E8B57] rounded-lg transition-all">{content}</Link>
  }
  return content
}
