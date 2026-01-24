'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Service, Representative, Expense } from '@/lib/portal-types'

interface ActiveService {
  id: string
  clientName: string
  serviceName: string
  serviceId: string
  monthlyAmount: number
  performedById: string | null
  startDate: string | null
}

interface OneTimeService {
  id: string
  clientName: string
  serviceName: string
  serviceId: string
  oneTimeAmount: number
  performedById: string | null
  startDate: string | null
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

type ModalType = 'service' | 'performer' | null

interface ModalData {
  type: ModalType
  id: string | null
  name: string
}

export default function ProjectionsPage() {
  const [activeServices, setActiveServices] = useState<ActiveService[]>([])
  const [oneTimeServices, setOneTimeServices] = useState<OneTimeService[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalData | null>(null)

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
        startDate: cs.start_date as string | null,
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
        startDate: cs.start_date as string | null,
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

      // Fetch expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')

      setExpenses((expensesData as Expense[] | null) ?? [])
      setLoading(false)
    }

    fetchData()
  }, [])

  // Calculate revenue totals
  const monthlyRecurring = activeServices.reduce((sum, s) => sum + s.monthlyAmount, 0)
  const yearlyProjection = monthlyRecurring * 12
  const remainingMonths = 12 - currentMonth
  const remainingYearProjection = monthlyRecurring * remainingMonths
  const totalOneTime = oneTimeServices.reduce((sum, s) => sum + s.oneTimeAmount, 0)

  // Calculate expense totals
  const recurringExpenses = expenses.filter((e) => e.is_recurring)
  const oneTimeExpenses = expenses.filter((e) => !e.is_recurring)
  const monthlyExpenses = recurringExpenses.reduce((sum, e) => sum + e.amount, 0)
  const yearlyExpenses = monthlyExpenses * 12
  const oneTimeExpensesThisYear = oneTimeExpenses.filter((e) => {
    if (!e.start_date) return false
    return new Date(e.start_date).getFullYear() === currentYear
  }).reduce((sum, e) => sum + e.amount, 0)

  // Calculate profit
  const monthlyProfit = monthlyRecurring - monthlyExpenses
  const yearlyProfit = yearlyProjection + totalOneTime - yearlyExpenses - oneTimeExpensesThisYear

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
  // Calculate based on start dates of services and expenses
  const months: { label: string; revenue: number; expenses: number; profit: number; cumulative: number }[] = []
  let cumulativeProfit = 0

  for (let i = 0; i < 12; i++) {
    const forecastDate = new Date(currentYear, currentMonth + i, 1)
    const forecastYear = forecastDate.getFullYear()
    const forecastMonth = forecastDate.getMonth()

    // Calculate recurring revenue for this month based on services that started on or before this month
    const monthlyRecurringForMonth = activeServices.reduce((sum, service) => {
      if (!service.startDate) {
        return sum + service.monthlyAmount
      }
      const startDate = new Date(service.startDate)
      if (startDate.getFullYear() < forecastYear ||
          (startDate.getFullYear() === forecastYear && startDate.getMonth() <= forecastMonth)) {
        return sum + service.monthlyAmount
      }
      return sum
    }, 0)

    // Calculate one-time revenue for this specific month
    const oneTimeRevenueForMonth = oneTimeServices.reduce((sum, service) => {
      if (!service.startDate) return sum
      const startDate = new Date(service.startDate)
      if (startDate.getFullYear() === forecastYear && startDate.getMonth() === forecastMonth) {
        return sum + service.oneTimeAmount
      }
      return sum
    }, 0)

    // Calculate recurring expenses for this month based on start dates
    const monthlyExpensesForMonth = recurringExpenses.reduce((sum, expense) => {
      if (!expense.start_date) {
        return sum + expense.amount
      }
      const startDate = new Date(expense.start_date)
      if (startDate.getFullYear() < forecastYear ||
          (startDate.getFullYear() === forecastYear && startDate.getMonth() <= forecastMonth)) {
        return sum + expense.amount
      }
      return sum
    }, 0)

    // Calculate one-time expenses for this specific month
    const oneTimeExpenseForMonth = oneTimeExpenses.reduce((sum, expense) => {
      if (!expense.start_date) return sum
      const startDate = new Date(expense.start_date)
      if (startDate.getFullYear() === forecastYear && startDate.getMonth() === forecastMonth) {
        return sum + expense.amount
      }
      return sum
    }, 0)

    const totalRevenue = monthlyRecurringForMonth + oneTimeRevenueForMonth
    const totalExpenses = monthlyExpensesForMonth + oneTimeExpenseForMonth
    const monthProfit = totalRevenue - totalExpenses
    cumulativeProfit += monthProfit

    months.push({
      label: forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: monthProfit,
      cumulative: cumulativeProfit,
    })
  }

  // Get clients for a specific service
  const getClientsForService = (serviceName: string) => {
    const service = services.find(s => s.name === serviceName)
    if (!service) return []

    const recurring = activeServices.filter(s => s.serviceId === service.id)
    const oneTime = oneTimeServices.filter(s => s.serviceId === service.id)

    const clientMap = new Map<string, { name: string; monthly: number; oneTime: number }>()

    recurring.forEach(s => {
      const existing = clientMap.get(s.clientName) || { name: s.clientName, monthly: 0, oneTime: 0 }
      existing.monthly += s.monthlyAmount
      clientMap.set(s.clientName, existing)
    })

    oneTime.forEach(s => {
      const existing = clientMap.get(s.clientName) || { name: s.clientName, monthly: 0, oneTime: 0 }
      existing.oneTime += s.oneTimeAmount
      clientMap.set(s.clientName, existing)
    })

    return Array.from(clientMap.values()).sort((a, b) => (b.monthly + b.oneTime) - (a.monthly + a.oneTime))
  }

  // Get clients for a specific performer
  const getClientsForPerformer = (performerId: string | null) => {
    const recurring = activeServices.filter(s => s.performedById === performerId)
    const oneTime = oneTimeServices.filter(s => s.performedById === performerId)

    const clientMap = new Map<string, { name: string; services: string[]; monthly: number; oneTime: number }>()

    recurring.forEach(s => {
      const existing = clientMap.get(s.clientName) || { name: s.clientName, services: [], monthly: 0, oneTime: 0 }
      existing.monthly += s.monthlyAmount
      if (!existing.services.includes(s.serviceName)) existing.services.push(s.serviceName)
      clientMap.set(s.clientName, existing)
    })

    oneTime.forEach(s => {
      const existing = clientMap.get(s.clientName) || { name: s.clientName, services: [], monthly: 0, oneTime: 0 }
      existing.oneTime += s.oneTimeAmount
      if (!existing.services.includes(s.serviceName)) existing.services.push(s.serviceName)
      clientMap.set(s.clientName, existing)
    })

    return Array.from(clientMap.values()).sort((a, b) => (b.monthly + b.oneTime) - (a.monthly + a.oneTime))
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

      {/* Summary Cards - Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Revenue</p>
          <p className="text-3xl font-bold text-[#2E8B57]">${monthlyRecurring.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">MRR from {activeServices.length} service{activeServices.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Expenses</p>
          <p className="text-3xl font-bold text-red-400">${monthlyExpenses.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{recurringExpenses.length} recurring cost{recurringExpenses.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Profit</p>
          <p className={`text-3xl font-bold ${monthlyProfit >= 0 ? 'text-[#2E8B57]' : 'text-red-400'}`}>
            ${monthlyProfit.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Revenue - Expenses</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Projected Annual Profit</p>
          <p className={`text-3xl font-bold ${yearlyProfit >= 0 ? 'text-[#2E8B57]' : 'text-red-400'}`}>
            ${yearlyProfit.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Including one-time</p>
        </div>
      </div>

      {/* One-time breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#333333] rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">One-Time Revenue ({currentYear})</p>
            <p className="text-xl font-bold text-[#2E8B57]">${totalOneTime.toLocaleString()}</p>
          </div>
          <span className="text-sm text-gray-500">{oneTimeServices.length} project{oneTimeServices.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="bg-[#333333] rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">One-Time Expenses ({currentYear})</p>
            <p className="text-xl font-bold text-red-400">${oneTimeExpensesThisYear.toLocaleString()}</p>
          </div>
          <span className="text-sm text-gray-500">{oneTimeExpenses.filter(e => e.start_date && new Date(e.start_date).getFullYear() === currentYear).length} expense{oneTimeExpenses.filter(e => e.start_date && new Date(e.start_date).getFullYear() === currentYear).length !== 1 ? 's' : ''}</span>
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
                <button
                  key={service.name}
                  onClick={() => setModal({ type: 'service', id: service.name, name: service.name })}
                  className="w-full flex items-center justify-between p-3 bg-[#3a3a3a] rounded-lg hover:bg-[#444444] transition-colors cursor-pointer text-left"
                >
                  <div>
                    <p className="text-white font-medium">{service.name}</p>
                    <p className="text-sm text-gray-400">
                      {service.count > 0 && `${service.count} recurring`}
                      {service.count > 0 && service.oneTimeTotal > 0 && ' + '}
                      {service.oneTimeTotal > 0 && `$${service.oneTimeTotal.toLocaleString()} one-time`}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      {service.monthlyTotal > 0 && (
                        <p className="text-[#2E8B57] font-bold">${service.monthlyTotal.toLocaleString()}/mo</p>
                      )}
                      <p className="text-sm text-gray-400">
                        ${(service.yearlyTotal + service.oneTimeTotal).toLocaleString()}/yr
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
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
                <button
                  key={rep.id ?? 'company'}
                  onClick={() => setModal({ type: 'performer', id: rep.id, name: rep.name })}
                  className="w-full flex items-center justify-between p-3 bg-[#3a3a3a] rounded-lg hover:bg-[#444444] transition-colors cursor-pointer text-left"
                >
                  <div>
                    <p className="text-white font-medium">{rep.name}</p>
                    <p className="text-sm text-gray-400">
                      {rep.count > 0 && `${rep.count} recurring`}
                      {rep.count > 0 && rep.oneTimeTotal > 0 && ' + '}
                      {rep.oneTimeTotal > 0 && `$${rep.oneTimeTotal.toLocaleString()} one-time`}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      {rep.monthlyTotal > 0 && (
                        <p className="text-[#2E8B57] font-bold">${rep.monthlyTotal.toLocaleString()}/mo</p>
                      )}
                      <p className="text-sm text-gray-400">
                        ${(rep.yearlyTotal + rep.oneTimeTotal).toLocaleString()}/yr
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 12-Month Projection Table */}
      <div className="bg-[#333333] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">12-Month Profit Forecast</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#444444]">
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Month</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Revenue</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Expenses</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Profit</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month, idx) => (
                <tr key={month.label} className={idx % 2 === 0 ? 'bg-[#3a3a3a]' : ''}>
                  <td className="py-3 px-2 text-white">{month.label}</td>
                  <td className="py-3 px-2 text-right text-[#2E8B57]">${month.revenue.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-red-400">
                    {month.expenses > 0 ? `$${month.expenses.toLocaleString()}` : '-'}
                  </td>
                  <td className={`py-3 px-2 text-right font-medium ${month.profit >= 0 ? 'text-[#2E8B57]' : 'text-red-400'}`}>
                    ${month.profit.toLocaleString()}
                  </td>
                  <td className={`py-3 px-2 text-right font-medium ${month.cumulative >= 0 ? 'text-[#2E8B57]' : 'text-red-400'}`}>
                    ${month.cumulative.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-[#333333] rounded-lg max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#444444]">
              <h3 className="text-lg font-semibold text-white">
                {modal.type === 'service' ? `${modal.name} Clients` : `${modal.name}'s Clients`}
              </h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {modal.type === 'service' ? (
                <div className="space-y-3">
                  {getClientsForService(modal.name).map(client => (
                    <div key={client.name} className="flex items-center justify-between p-3 bg-[#3a3a3a] rounded-lg">
                      <p className="text-white font-medium">{client.name}</p>
                      <div className="text-right">
                        {client.monthly > 0 && (
                          <p className="text-[#2E8B57] font-medium">${client.monthly.toLocaleString()}/mo</p>
                        )}
                        {client.oneTime > 0 && (
                          <p className="text-sm text-gray-400">${client.oneTime.toLocaleString()} one-time</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {getClientsForService(modal.name).length === 0 && (
                    <p className="text-gray-400 text-center py-4">No clients found</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {getClientsForPerformer(modal.id).map(client => (
                    <div key={client.name} className="flex items-center justify-between p-3 bg-[#3a3a3a] rounded-lg">
                      <div>
                        <p className="text-white font-medium">{client.name}</p>
                        <p className="text-sm text-gray-400">{client.services.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        {client.monthly > 0 && (
                          <p className="text-[#2E8B57] font-medium">${client.monthly.toLocaleString()}/mo</p>
                        )}
                        {client.oneTime > 0 && (
                          <p className="text-sm text-gray-400">${client.oneTime.toLocaleString()} one-time</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {getClientsForPerformer(modal.id).length === 0 && (
                    <p className="text-gray-400 text-center py-4">No clients found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
