'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import type { ClientService, Service, Invoice } from '@/lib/portal-types'

interface ClientServiceWithService extends ClientService {
  services: Service
}

export default function PortalDashboard() {
  const { clientId: resolvedClientId, loading: authLoading } = usePortalClient()
  const [loading, setLoading] = useState(true)
  const [clientName, setClientName] = useState('')
  const [services, setServices] = useState<ClientServiceWithService[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    if (authLoading || !resolvedClientId) return

    async function loadData() {
      const supabase = createClient()

      const { data: clientData } = await supabase
        .from('clients')
        .select('name')
        .eq('id', resolvedClientId!)
        .single()

      setClientName(clientData?.name || '')

      const { data: servicesData } = await supabase
        .from('client_services')
        .select('*, services(*)')
        .eq('client_id', resolvedClientId!)
        .eq('is_active', true)

      setServices((servicesData as ClientServiceWithService[]) || [])

      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', resolvedClientId!)
        .in('status', ['sent', 'overdue', 'partially_paid'])
        .order('due_date', { ascending: true })
        .limit(5)

      setInvoices((invoicesData as Invoice[]) || [])
      setLoading(false)
    }

    loadData()
  }, [authLoading, resolvedClientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Welcome back{clientName && `, ${clientName}`}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#333333] border border-[#444444] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Active Services</h2>
          {services.length === 0 ? (
            <p className="text-gray-400">No active services</p>
          ) : (
            <ul className="space-y-2">
              {services.map((svc) => (
                <li key={svc.id} className="text-gray-300">
                  • {svc.services.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[#333333] border border-[#444444] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Pending Invoices</h2>
          {invoices.length === 0 ? (
            <p className="text-gray-400">No pending invoices</p>
          ) : (
            <ul className="space-y-2">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex justify-between text-gray-300">
                  <span>{inv.invoice_number}</span>
                  <span className="text-[#2E8B57]">${Number(inv.total).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
