'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ClientService, Service } from '@/lib/portal-types'

interface ClientServiceWithService extends ClientService {
  services: Service
}

export default function ServicesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<ClientServiceWithService[]>([])
  const [clientId, setClientId] = useState('')

  useEffect(() => {
    async function loadServices() {
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

      setClientId(portalUser.client_id)

      const { data } = await supabase
        .from('client_services')
        .select('*, services(*)')
        .eq('client_id', portalUser.client_id)
        .order('created_at', { ascending: false })

      setServices((data as ClientServiceWithService[]) || [])
      setLoading(false)
    }

    loadServices()
  }, [router])

  const handleCancel = async (serviceId: string, serviceName: string) => {
    if (!confirm(`Are you sure you want to cancel ${serviceName}? This action cannot be undone.`)) {
      return
    }

    const supabase = createClient()
    
    await supabase
      .from('client_services')
      .update({ status: 'cancelled', is_active: false })
      .eq('id', serviceId)

    await fetch('/api/portal/notify-cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, serviceName, clientId })
    })

    setServices(services.map(s => 
      s.id === serviceId ? { ...s, status: 'cancelled', is_active: false } : s
    ))
  }

  const handlePause = async (serviceId: string, serviceName: string) => {
    if (!confirm(`Pause ${serviceName}?`)) return

    const supabase = createClient()
    
    await supabase
      .from('client_services')
      .update({ status: 'paused', is_active: false })
      .eq('id', serviceId)

    await fetch('/api/portal/notify-cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, serviceName, clientId, action: 'paused' })
    })

    setServices(services.map(s => 
      s.id === serviceId ? { ...s, status: 'paused', is_active: false } : s
    ))
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Your Services</h1>

      {services.length === 0 ? (
        <p className="text-gray-400">No services found</p>
      ) : (
        <div className="space-y-4">
          {services.map((svc) => (
            <div key={svc.id} className="bg-[#333333] border border-[#444444] rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{svc.services.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{svc.services.description}</p>
                  
                  <div className="space-y-1 text-sm">
                    {svc.monthly_cost > 0 && (
                      <p className="text-gray-300">Monthly: ${(svc.monthly_cost / 100).toFixed(2)}</p>
                    )}
                    {svc.one_time_cost > 0 && (
                      <p className="text-gray-300">One-time: ${(svc.one_time_cost / 100).toFixed(2)}</p>
                    )}
                    <p className="text-gray-400">Started: {new Date(svc.start_date).toLocaleDateString()}</p>
                    <p className={`inline-block px-2 py-1 rounded text-xs ${
                      svc.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      svc.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {svc.status.toUpperCase()}
                    </p>
                  </div>
                </div>

                {svc.status === 'active' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handlePause(svc.id, svc.services.name)}
                      className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => handleCancel(svc.id, svc.services.name)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
