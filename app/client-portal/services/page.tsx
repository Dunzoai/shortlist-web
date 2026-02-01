'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import type { ClientService, Service, RecurringBilling } from '@/lib/portal-types'

interface ClientServiceWithService extends ClientService {
  services: Service
}

function getNextRenewalDate(startDate: string): string {
  const start = new Date(startDate)
  const now = new Date()
  const renewal = new Date(start)

  // Move renewal forward month by month until it's in the future
  while (renewal <= now) {
    renewal.setMonth(renewal.getMonth() + 1)
  }

  return renewal.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getOneTimeStatus(svc: ClientServiceWithService) {
  if (svc.one_time_cost <= 0) return null
  const paid = svc.amount_paid || 0
  const deposit = svc.deposit_amount || 0
  const total = svc.one_time_cost
  const owed = total - paid

  if (paid >= total) return { label: 'PAID', color: 'bg-green-500/20 text-green-400', owed: 0 }
  if (paid > 0 || deposit > 0) return { label: 'DEPOSIT PAID', color: 'bg-yellow-500/20 text-yellow-400', owed }
  return { label: 'UNPAID', color: 'bg-red-500/20 text-red-400', owed }
}

export default function ServicesPage() {
  const { clientId: resolvedClientId, loading: authLoading } = usePortalClient()
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<ClientServiceWithService[]>([])
  const [clientId, setClientId] = useState('')
  const [recurring, setRecurring] = useState<RecurringBilling | null>(null)

  useEffect(() => {
    if (authLoading || !resolvedClientId) return

    async function loadServices() {
      const supabase = createClient()
      setClientId(resolvedClientId!)

      const [{ data: svcData }, { data: recurringData }] = await Promise.all([
        supabase
          .from('client_services')
          .select('*, services(*)')
          .eq('client_id', resolvedClientId!)
          .order('created_at', { ascending: false }),
        supabase
          .from('recurring_billing')
          .select('*')
          .eq('client_id', resolvedClientId!)
          .single()
      ])

      setServices((svcData as ClientServiceWithService[]) || [])
      setRecurring(recurringData as RecurringBilling | null)
      setLoading(false)
    }

    loadServices()
  }, [authLoading, resolvedClientId])

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

  const isSubscribed = recurring?.status === 'active'
  const subscriptionPaused = recurring?.status === 'paused'

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Your Services</h1>

      {services.length === 0 ? (
        <p className="text-gray-400">No services found</p>
      ) : (
        <div className="space-y-4">
          {services.map((svc) => {
            const oneTimeStatus = getOneTimeStatus(svc)
            const isMonthly = svc.monthly_cost > 0
            const isOneTime = svc.one_time_cost > 0

            return (
              <div key={svc.id} className="bg-[#333333] border border-[#444444] rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Header: Name + Status */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-white">{svc.services.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        svc.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        svc.status === 'trial' ? 'bg-blue-500/20 text-blue-400' :
                        svc.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                        svc.status === 'completed' ? 'bg-purple-500/20 text-purple-400' :
                        svc.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {svc.status === 'trial' ? (() => {
                          if (!svc.trial_end_date) return 'TRIAL'
                          const endDate = new Date(svc.trial_end_date + 'T23:59:59')
                          const now = new Date()
                          const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                          return daysLeft > 0 ? `TRIAL - ${daysLeft} DAY${daysLeft === 1 ? '' : 'S'} LEFT` : 'TRIAL ENDED'
                        })() : svc.status.toUpperCase()}
                      </span>
                      {/* Subscription chip for monthly services */}
                      {isMonthly && (svc.status === 'active' || svc.status === 'trial') && isSubscribed && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                          SUBSCRIBED
                        </span>
                      )}
                      {isMonthly && svc.status === 'active' && subscriptionPaused && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                          PAYMENT FAILED
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {svc.services.description && (
                      <p className="text-gray-400 text-sm mb-3">{svc.services.description}</p>
                    )}

                    {/* Scope / Notes from admin */}
                    {svc.notes && (
                      <div className="bg-[#2a2a2a] rounded-lg p-3 mb-3 border border-[#444444]">
                        <p className="text-xs text-gray-500 mb-1">Service Details</p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{svc.notes}</p>
                      </div>
                    )}

                    {/* Pricing & Dates */}
                    <div className="space-y-1 text-sm">
                      {/* Monthly recurring */}
                      {isMonthly && (
                        <div className="flex items-center gap-4">
                          <p className="text-gray-300">${Number(svc.monthly_cost).toFixed(2)}/mo</p>
                          {svc.status === 'active' && svc.start_date && (
                            <p className="text-gray-500">
                              {isSubscribed
                                ? `Auto-renews: ${recurring?.next_billing_date ? new Date(recurring.next_billing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : getNextRenewalDate(svc.start_date)}`
                                : `Renews: ${getNextRenewalDate(svc.start_date)}`
                              }
                            </p>
                          )}
                        </div>
                      )}

                      {/* One-time with deposit tracking */}
                      {isOneTime && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-gray-300">Total: ${Number(svc.one_time_cost).toFixed(2)}</p>
                          {(svc.deposit_amount || 0) > 0 && (
                            <p className="text-gray-400">Deposit: ${Number(svc.deposit_amount).toFixed(2)}</p>
                          )}
                          {oneTimeStatus && (
                            <>
                              {oneTimeStatus.owed > 0 && (
                                <p className="text-gray-300 font-medium">Owed: ${oneTimeStatus.owed.toFixed(2)}</p>
                              )}
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${oneTimeStatus.color}`}>
                                {oneTimeStatus.label}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Dates */}
                      <p className="text-gray-500 text-xs">Started: {new Date(svc.start_date).toLocaleDateString()}</p>
                      {svc.status === 'paused' && svc.paused_at && (
                        <p className="text-yellow-500 text-xs">Paused: {new Date(svc.paused_at).toLocaleDateString()}</p>
                      )}
                      {svc.status === 'completed' && svc.ended_at && (
                        <p className="text-purple-400 text-xs">Completed: {new Date(svc.ended_at).toLocaleDateString()}</p>
                      )}
                      {svc.status === 'cancelled' && svc.ended_at && (
                        <p className="text-red-500 text-xs">Ended: {new Date(svc.ended_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {(svc.status === 'active' || svc.status === 'trial') && (
                    <div className="flex flex-col gap-2 ml-4">
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
            )
          })}
        </div>
      )}
    </div>
  )
}
