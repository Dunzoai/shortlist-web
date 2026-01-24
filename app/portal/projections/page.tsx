'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Service, Representative } from '@/lib/portal-types'

interface ActiveService {
  id: string
  clientName: string
  serviceName: string
  serviceId: string
  monthlyAmount: number
  performedById: string | null
}

interface OneTimeService {
  id: string
  clientName: string
  serviceName: string
  serviceId: string
  oneTimeAmount: number
  performedById: string | null
}

interface ServiceBreakdown {
  name: string
  count: number
  monthlyTotal: number
  yearlyTotal: number
  oneTimeTotal: number
}

interface RepBreakdown {
  id: string | null
  name: string
  count: number
  monthlyTotal: number
  yearlyTotal: number
  oneTimeTotal: number
}

export default function ProjectionsPage() {
  const [activeServices, setActiveServices] = useState<ActiveService[]>([])
  const [oneTimeServices, setOneTimeServices] = useState<OneTimeService[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [loading, setLoading] = useState(true)

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() // 0-indexed

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch active client services
      const { data: clientServicesData } = await supabase
        .from('client_services')
        .select('*, clients(name), services(id, name)')
        .eq('status', 'active')
        .gt('monthly_cost', 0)

      const items: ActiveService[] = clientServicesData?.map((cs: Record<string, unknown>) => ({
        id: cs.id as string,
        clientName: (cs.clients as { name: string } | null)?.name || 'Unknown',
        serviceName: (cs.services as { name: string } | null)?.name || 'Unknown',
        serviceId: (cs.services as { id: string } | null)?.id || '',
        monthlyAmount: Number(cs.monthly_cost) || 0,
        performedById: cs.performed_by_id as string | null,
      })) ?? []

      setActiveServices(items)

      // Fetch one-time services for current year
      const { data: oneTimeData } = await supabase
        .from('client_services')
        .select('*, clients(name), services(id, name)')
        .gte('start_date', `${currentYear}-01-01`)
        .lte('start_date', `${currentYear}-12-31`)
        .gt('one_time_cost', 0)

      const oneTimeItems: OneTimeService[] = oneTimeData?.map((cs: Record<string, unknown>) => ({
        id: cs.id as string,
        clientName: (cs.clients as { name: string } | null)?.name || 'Unknown',
        serviceName: (cs.services as { name: string } | null)?.name || 'Unknown',
        serviceId: (cs.services as { id: string } | null)?.id || '',
        oneTimeAmount: Number(cs.one_time_cost) || 0,
        performedById: cs.performed_by_id as string | null,
      })) ?? []

      setOneTimeServices(oneTimeItems)

      // Fetch services for reference
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('name')

      setServices((servicesData as Service[] | null) ?? [])

      // Fetch representatives
      const { data: repsData } = await supabase
        .from('representatives')
        .select('*')
        .order('name')

      setRepresentatives((repsData as Representative[] | null) ?? [])
      setLoading(false)
    }

    fetchData()
  }, [])

  // Calculate totals
  const monthlyRecurring = activeServices.reduce((sum, s) => sum + s.monthlyAmount, 0)
  const yearlyProjection = monthlyRecurring * 12
  const remainingMonths = 12 - currentMonth
  const remainingYearProjection = monthlyRecurring * remainingMonths
  const totalOneTime = oneTimeServices.reduce((sum, s) => sum + s.oneTimeAmount, 0)

  // Breakdown by service
  const serviceBreakdown: ServiceBreakdown[] = services
    .map((service) => {
      const matchingRecurring = activeServices.filter((s) => s.serviceId === service.id)
      const matchingOneTime = oneTimeServices.filter((s) => s.serviceId === service.id)
      const monthlyTotal = matchingRecurring.reduce((sum, s) => sum + s.monthlyAmount, 0)
      const oneTimeTotal = matchingOneTime.reduce((sum, s) => sum + s.oneTimeAmount, 0)
      return {
        name: service.name,
        count: matchingRecurring.length,
        monthlyTotal,
        yearlyTotal: monthlyTotal * 12,
        oneTimeTotal,
      }
    })
    .filter((s) => s.count > 0 || s.oneTimeTotal > 0)
    .sort((a, b) => (b.monthlyTotal + b.oneTimeTotal) - (a.monthlyTotal + a.oneTimeTotal))

  // Breakdown by rep
  const repBreakdown: RepBreakdown[] = [
    // Company (null performed_by_id)
    (() => {
      const matchingRecurring = activeServices.filter((s) => s.performedById === null)
      const matchingOneTime = oneTimeServices.filter((s) => s.performedById === null)
      const monthlyTotal = matchingRecurring.reduce((sum, s) => sum + s.monthlyAmount, 0)
      const oneTimeTotal = matchingOneTime.reduce((sum, s) => sum + s.oneTimeAmount, 0)
      return {
        id: null,
        name: 'Company',
        count: matchingRecurring.length,
        monthlyTotal,
        yearlyTotal: monthlyTotal * 12,
        oneTimeTotal,
      }
    })(),
    // Individual reps
    ...representatives.map((rep) => {
      const matchingRecurring = activeServices.filter((s) => s.performedById === rep.id)
      const matchingOneTime = oneTimeServices.filter((s) => s.performedById === rep.id)
      const monthlyTotal = matchingRecurring.reduce((sum, s) => sum + s.monthlyAmount, 0)
      const oneTimeTotal = matchingOneTime.reduce((sum, s) => sum + s.oneTimeAmount, 0)
      return {
        id: rep.id,
        name: rep.name,
        count: matchingRecurring.length,
        monthlyTotal,
        yearlyTotal: monthlyTotal * 12,
        oneTimeTotal,
      }
    }),
  ]
    .filter((r) => r.count > 0 || r.oneTimeTotal > 0)
    .sort((a, b) => (b.monthlyTotal + b.oneTimeTotal) - (a.monthlyTotal + a.oneTimeTotal))

  // Monthly projection for next 12 months
  const months = []
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentMonth + i, 1)
    months.push({
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount: monthlyRecurring,
      cumulative: monthlyRecurring * (i + 1),
    })
  }

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
          <div className="h-64 bg-[#444444] rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Projections</h1>
        <p className="text-gray-400 text-sm mt-1">
          Revenue forecast based on {activeServices.length} active recurring service{activeServices.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Recurring</p>
          <p className="text-3xl font-bold text-white">${monthlyRecurring.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Current MRR</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Projected Annual</p>
          <p className="text-3xl font-bold text-white">${yearlyProjection.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Recurring only</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">One-Time ({currentYear})</p>
          <p className="text-3xl font-bold text-white">${totalOneTime.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{oneTimeServices.length} project{oneTimeServices.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Total {currentYear}</p>
          <p className="text-3xl font-bold text-[#2E8B57]">${(remainingYearProjection + totalOneTime).toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Recurring + One-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* By Service */}
        <div className="bg-[#333333] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">By Service</h2>
          {serviceBreakdown.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No services</p>
          ) : (
            <div className="space-y-3">
              {serviceBreakdown.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-[#3a3a3a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{service.name}</p>
                    <p className="text-sm text-gray-400">
                      {service.count > 0 && `${service.count} recurring`}
                      {service.count > 0 && service.oneTimeTotal > 0 && ' + '}
                      {service.oneTimeTotal > 0 && `$${service.oneTimeTotal.toLocaleString()} one-time`}
                    </p>
                  </div>
                  <div className="text-right">
                    {service.monthlyTotal > 0 && (
                      <p className="text-[#2E8B57] font-bold">${service.monthlyTotal.toLocaleString()}/mo</p>
                    )}
                    <p className="text-sm text-gray-400">
                      ${(service.yearlyTotal + service.oneTimeTotal).toLocaleString()}/yr
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Rep */}
        <div className="bg-[#333333] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">By Performer</h2>
          {repBreakdown.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No services</p>
          ) : (
            <div className="space-y-3">
              {repBreakdown.map((rep) => (
                <div key={rep.id ?? 'company'} className="flex items-center justify-between p-3 bg-[#3a3a3a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{rep.name}</p>
                    <p className="text-sm text-gray-400">
                      {rep.count > 0 && `${rep.count} recurring`}
                      {rep.count > 0 && rep.oneTimeTotal > 0 && ' + '}
                      {rep.oneTimeTotal > 0 && `$${rep.oneTimeTotal.toLocaleString()} one-time`}
                    </p>
                  </div>
                  <div className="text-right">
                    {rep.monthlyTotal > 0 && (
                      <p className="text-[#2E8B57] font-bold">${rep.monthlyTotal.toLocaleString()}/mo</p>
                    )}
                    <p className="text-sm text-gray-400">
                      ${(rep.yearlyTotal + rep.oneTimeTotal).toLocaleString()}/yr
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 12-Month Projection Table */}
      <div className="bg-[#333333] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">12-Month Forecast</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#444444]">
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Month</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Monthly</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month, idx) => (
                <tr key={month.label} className={idx % 2 === 0 ? 'bg-[#3a3a3a]' : ''}>
                  <td className="py-3 px-2 text-white">{month.label}</td>
                  <td className="py-3 px-2 text-right text-gray-300">${month.amount.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-[#2E8B57] font-medium">${month.cumulative.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
