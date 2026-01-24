'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ClientService, Service } from '@/lib/portal-types'

interface ClientServiceWithDetails extends ClientService {
  clients: { name: string }
  services: { name: string }
}

interface RevenueItem {
  id: string
  clientName: string
  serviceName: string
  monthlyAmount: number
  oneTimeAmount: number
  status: string
  startDate: string
}

export default function RevenuePage() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [revenueItems, setRevenueItems] = useState<RevenueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch all services for filter chips
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('name')

      setServices((servicesData as Service[]) ?? [])

      // Fetch all client services with details
      const { data: clientServicesData } = await supabase
        .from('client_services')
        .select('*, clients(name), services(name)')
        .order('start_date', { ascending: false })

      const items: RevenueItem[] = (clientServicesData as ClientServiceWithDetails[] | null)?.map((cs) => ({
        id: cs.id,
        clientName: cs.clients?.name || 'Unknown',
        serviceName: cs.services?.name || 'Unknown',
        monthlyAmount: Number(cs.monthly_cost) || 0,
        oneTimeAmount: Number(cs.one_time_cost) || 0,
        status: cs.status,
        startDate: cs.start_date,
      })) ?? []

      setRevenueItems(items)
      setLoading(false)
    }

    fetchData()
  }, [])

  const toggleService = (serviceName: string) => {
    const newSelected = new Set(selectedServices)
    if (newSelected.has(serviceName)) {
      newSelected.delete(serviceName)
    } else {
      newSelected.add(serviceName)
    }
    setSelectedServices(newSelected)
  }

  const clearFilters = () => setSelectedServices(new Set())

  // Filter items based on selected services
  const filteredItems = selectedServices.size === 0
    ? revenueItems
    : revenueItems.filter((item) => selectedServices.has(item.serviceName))

  // Monthly recurring (active only)
  const monthlyItems = filteredItems.filter((item) => item.status === 'active' && item.monthlyAmount > 0)
  const totalMonthly = monthlyItems.reduce((sum, item) => sum + item.monthlyAmount, 0)

  // One-time for selected year
  const oneTimeItems = filteredItems.filter((item) => {
    if (item.oneTimeAmount <= 0) return false
    const year = new Date(item.startDate).getFullYear()
    return year === selectedYear
  })
  const totalOneTime = oneTimeItems.reduce((sum, item) => sum + item.oneTimeAmount, 0)

  // Group one-time by month
  const oneTimeByMonth = oneTimeItems.reduce((acc, item) => {
    const monthKey = new Date(item.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!acc[monthKey]) acc[monthKey] = { items: [] as RevenueItem[], total: 0 }
    acc[monthKey].items.push(item)
    acc[monthKey].total += item.oneTimeAmount
    return acc
  }, {} as Record<string, { items: RevenueItem[]; total: number }>)

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="h-12 bg-[#444444] rounded"></div>
          <div className="h-64 bg-[#444444] rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Revenue</h1>
        <div className="flex items-center gap-4">
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
      </div>

      {/* Service Filter Chips */}
      <div className="mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-400 mr-2">Filter by service:</span>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => toggleService(service.name)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedServices.has(service.name)
                  ? 'bg-[#2E8B57] text-white'
                  : 'bg-[#444444] text-gray-300 hover:bg-[#555555]'
              }`}
            >
              {service.name}
            </button>
          ))}
          {selectedServices.size > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Recurring Revenue</p>
          <p className="text-3xl font-bold text-white">${totalMonthly.toLocaleString()}<span className="text-lg text-gray-400">/mo</span></p>
          <p className="text-sm text-gray-500 mt-1">{monthlyItems.length} active service{monthlyItems.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">One-Time Revenue ({selectedYear})</p>
          <p className="text-3xl font-bold text-white">${totalOneTime.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{oneTimeItems.length} charge{oneTimeItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Recurring Section */}
        <div className="bg-[#333333] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Monthly Recurring</h2>
          {monthlyItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active monthly services{selectedServices.size > 0 ? ' for selected filters' : ''}</p>
          ) : (
            <div className="space-y-3">
              {monthlyItems.map((item) => (
                <div key={item.id} className="bg-[#3a3a3a] rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{item.clientName}</p>
                    <p className="text-sm text-gray-400">{item.serviceName}</p>
                  </div>
                  <span className="text-[#2E8B57] font-bold">${item.monthlyAmount.toLocaleString()}/mo</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* One-Time Section */}
        <div className="bg-[#333333] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">One-Time Charges ({selectedYear})</h2>
          {oneTimeItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No one-time charges{selectedServices.size > 0 ? ' for selected filters' : ''} in {selectedYear}</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(oneTimeByMonth).map(([month, data]) => (
                <div key={month}>
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#444444]">
                    <h3 className="font-medium text-gray-300">{month}</h3>
                    <span className="text-sm font-medium text-[#2E8B57]">${data.total.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    {data.items.map((item) => (
                      <div key={item.id} className="bg-[#3a3a3a] rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white text-sm">{item.clientName}</p>
                          <p className="text-xs text-gray-400">{item.serviceName}</p>
                        </div>
                        <span className="font-medium text-white">${item.oneTimeAmount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
