'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Service } from '@/lib/portal-types'

interface ServiceWithStats extends Service {
  activeCount: number
  totalMonthly: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('name')

      // Get active client_services stats
      const { data: clientServices } = await supabase
        .from('client_services')
        .select('service_id, monthly_cost, status')
        .eq('status', 'active')

      const statsMap: Record<string, { count: number; total: number }> = {}
      clientServices?.forEach((cs) => {
        if (!statsMap[cs.service_id]) {
          statsMap[cs.service_id] = { count: 0, total: 0 }
        }
        statsMap[cs.service_id].count++
        statsMap[cs.service_id].total += Number(cs.monthly_cost) || 0
      })

      const servicesWithStats: ServiceWithStats[] = (servicesData as Service[] | null)?.map((service) => ({
        ...service,
        activeCount: statsMap[service.id]?.count || 0,
        totalMonthly: statsMap[service.id]?.total || 0,
      })) ?? []

      setServices(servicesWithStats)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="h-64 bg-[#444444] rounded-lg"></div>
        </div>
      </div>
    )
  }

  const totalActiveServices = services.reduce((sum, s) => sum + s.activeCount, 0)
  const totalMonthlyRevenue = services.reduce((sum, s) => sum + s.totalMonthly, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-400 text-sm mt-1">
            {totalActiveServices} active across all clients = ${totalMonthlyRevenue.toLocaleString()}/mo
          </p>
        </div>
        <Link
          href="/portal/services/new"
          className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-[#333333] rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No services yet.</p>
          <Link
            href="/portal/services/new"
            className="text-[#2E8B57] hover:underline"
          >
            Add your first service
          </Link>
        </div>
      ) : (
        <div className="bg-[#333333] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#3a3a3a]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Service</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Description</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Active Clients</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Monthly Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444444]">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-[#3a3a3a] transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/portal/services/${service.id}`}
                      className="text-white font-medium hover:text-[#2E8B57] transition-colors"
                    >
                      {service.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {service.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-white">{service.activeCount}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[#2E8B57] font-medium">
                      ${service.totalMonthly.toLocaleString()}
                    </span>
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
