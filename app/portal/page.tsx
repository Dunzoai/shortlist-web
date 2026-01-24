'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Client, ClientService, Service } from '@/lib/portal-types'

interface ClientServiceWithDetails extends ClientService {
  clients: { name: string }
  services: { name: string }
}

interface MonthlyBreakdownItem {
  serviceName: string
  count: number
  totalMonthly: number
  clients: string[]
}

interface OneTimeItem {
  clientName: string
  serviceName: string
  amount: number
  date: string
}

interface DashboardStats {
  totalClients: number
  activeClients: number
  monthlyRevenue: number
  oneTimeRevenue: number
  recentClients: Client[]
  monthlyBreakdown: MonthlyBreakdownItem[]
  oneTimeItems: OneTimeItem[]
}

export default function PortalDashboard() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    oneTimeRevenue: 0,
    recentClients: [],
    monthlyBreakdown: [],
    oneTimeItems: [],
  })
  const [loading, setLoading] = useState(true)
  const [showMonthlyModal, setShowMonthlyModal] = useState(false)
  const [showOneTimeModal, setShowOneTimeModal] = useState(false)

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
        .select('*, clients(name), services(name)')
        .eq('status', 'active')

      // One-time costs for selected year
      const { data: oneTimeServices } = await supabase
        .from('client_services')
        .select('*, clients(name), services(name)')
        .gte('start_date', `${selectedYear}-01-01`)
        .lte('start_date', `${selectedYear}-12-31`)
        .gt('one_time_cost', 0)

      const totalClients = clients?.length ?? 0
      const recentClients = clients?.slice(0, 5) ?? []

      // Calculate monthly revenue and breakdown
      const monthlyRevenue = (activeServices as ClientServiceWithDetails[] | null)?.reduce(
        (sum, cs) => sum + (Number(cs.monthly_cost) || 0),
        0
      ) ?? 0

      // Group by service for monthly breakdown
      const monthlyMap = new Map<string, MonthlyBreakdownItem>()
      ;(activeServices as ClientServiceWithDetails[] | null)?.forEach((cs) => {
        if (Number(cs.monthly_cost) > 0) {
          const serviceName = cs.services?.name || 'Unknown'
          const existing = monthlyMap.get(serviceName)
          if (existing) {
            existing.count++
            existing.totalMonthly += Number(cs.monthly_cost)
            existing.clients.push(cs.clients?.name || 'Unknown')
          } else {
            monthlyMap.set(serviceName, {
              serviceName,
              count: 1,
              totalMonthly: Number(cs.monthly_cost),
              clients: [cs.clients?.name || 'Unknown'],
            })
          }
        }
      })
      const monthlyBreakdown = Array.from(monthlyMap.values()).sort((a, b) => b.totalMonthly - a.totalMonthly)

      // Calculate one-time revenue
      const oneTimeRevenue = (oneTimeServices as ClientServiceWithDetails[] | null)?.reduce(
        (sum, cs) => sum + (Number(cs.one_time_cost) || 0),
        0
      ) ?? 0

      // Build one-time items list
      const oneTimeItems: OneTimeItem[] = (oneTimeServices as ClientServiceWithDetails[] | null)?.map((cs) => ({
        clientName: cs.clients?.name || 'Unknown',
        serviceName: cs.services?.name || 'Unknown',
        amount: Number(cs.one_time_cost),
        date: cs.start_date,
      })) ?? []

      const activeClientIds = new Set(
        (activeServices as ClientServiceWithDetails[] | null)?.map((cs) => cs.client_id) ?? []
      )
      const activeClients = activeClientIds.size

      setStats({
        totalClients,
        activeClients,
        monthlyRevenue,
        oneTimeRevenue,
        recentClients,
        monthlyBreakdown,
        oneTimeItems,
      })
      setLoading(false)
    }

    fetchStats()
  }, [selectedYear])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-[#444444] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Group one-time items by month for the modal
  const oneTimeByMonth = stats.oneTimeItems.reduce((acc, item) => {
    const monthKey = new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!acc[monthKey]) acc[monthKey] = { items: [], total: 0 }
    acc[monthKey].items.push(item)
    acc[monthKey].total += item.amount
    return acc
  }, {} as Record<string, { items: OneTimeItem[]; total: number }>)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 bg-[#444444] border border-[#555555] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Clients" value={stats.totalClients} href="/portal/clients" />
        <StatCard title="Active Clients" value={stats.activeClients} subtitle="With active services" />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          subtitle="From active services"
          onClick={() => setShowMonthlyModal(true)}
        />
        <StatCard
          title={`One-Time Revenue (${selectedYear})`}
          value={`$${stats.oneTimeRevenue.toLocaleString()}`}
          subtitle="Project fees"
          onClick={() => setShowOneTimeModal(true)}
        />
      </div>

      {/* Monthly Revenue Breakdown Modal */}
      {showMonthlyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMonthlyModal(false)}>
          <div className="bg-[#333333] rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Monthly Revenue Breakdown</h2>
              <button onClick={() => setShowMonthlyModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {stats.monthlyBreakdown.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No active monthly services</p>
            ) : (
              <div className="space-y-4">
                {stats.monthlyBreakdown.map((item) => (
                  <div key={item.serviceName} className="bg-[#3a3a3a] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{item.serviceName}</span>
                      <span className="text-[#2E8B57] font-bold">${item.totalMonthly.toLocaleString()}/mo</span>
                    </div>
                    <p className="text-sm text-gray-400">{item.count} client{item.count !== 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.clients.join(', ')}</p>
                  </div>
                ))}
                <div className="pt-4 border-t border-[#444444] flex justify-between">
                  <span className="font-medium text-gray-300">Total Monthly</span>
                  <span className="font-bold text-white">${stats.monthlyRevenue.toLocaleString()}/mo</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* One-Time Revenue Breakdown Modal */}
      {showOneTimeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowOneTimeModal(false)}>
          <div className="bg-[#333333] rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">One-Time Revenue ({selectedYear})</h2>
              <button onClick={() => setShowOneTimeModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {stats.oneTimeItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No one-time charges in {selectedYear}</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(oneTimeByMonth).map(([month, data]) => (
                  <div key={month}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-300">{month}</h3>
                      <span className="text-sm text-[#2E8B57]">${data.total.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2">
                      {data.items.map((item, idx) => (
                        <div key={idx} className="bg-[#3a3a3a] rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <p className="text-white text-sm">{item.clientName}</p>
                            <p className="text-xs text-gray-400">{item.serviceName}</p>
                          </div>
                          <span className="font-medium text-white">${item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-[#444444] flex justify-between">
                  <span className="font-medium text-gray-300">Total ({selectedYear})</span>
                  <span className="font-bold text-white">${stats.oneTimeRevenue.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

function StatCard({ title, value, subtitle, href, onClick }: { title: string; value: string | number; subtitle?: string; href?: string; onClick?: () => void }) {
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
  if (onClick) {
    return <button onClick={onClick} className="block w-full text-left hover:ring-2 hover:ring-[#2E8B57] rounded-lg transition-all cursor-pointer">{content}</button>
  }
  return content
}
