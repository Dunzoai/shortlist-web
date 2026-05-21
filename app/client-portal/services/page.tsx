'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import { X } from 'lucide-react'
import type { ClientService, Service, RecurringBilling } from '@/lib/portal-types'

interface ClientServiceWithService extends ClientService {
  services: Service
}

function getNextRenewalDate(startDate: string): string {
  const start = new Date(startDate)
  const now = new Date()
  const renewal = new Date(start)

  while (renewal <= now) {
    renewal.setMonth(renewal.getMonth() + 1)
  }

  return renewal.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getOneTimeStatus(svc: ClientServiceWithService) {
  if (svc.one_time_cost <= 0) return null
  const paid = svc.amount_paid || 0
  const total = svc.one_time_cost
  const owed = total - paid

  if (paid >= total) return { label: 'PAID', color: 'bg-green-500/20 text-green-400', owed: 0 }
  if (paid > 0 || (svc.deposit_amount || 0) > 0) return { label: 'DEPOSIT PAID', color: 'bg-yellow-500/20 text-yellow-400', owed }
  return { label: 'UNPAID', color: 'bg-red-500/20 text-red-400', owed }
}

function statusBadge(status: string, trialEndDate?: string | null) {
  const colors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    trial: 'bg-blue-500/20 text-blue-400',
    pending: 'bg-orange-500/20 text-orange-400',
    completed: 'bg-purple-500/20 text-purple-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
    cancelled: 'bg-red-500/20 text-red-400',
  }

  let label = status.toUpperCase()
  if (status === 'trial' && trialEndDate) {
    const endDate = new Date(trialEndDate + 'T23:59:59')
    const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    label = daysLeft > 0 ? `TRIAL - ${daysLeft} DAY${daysLeft === 1 ? '' : 'S'} LEFT` : 'TRIAL ENDED'
  }

  return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${colors[status] || colors.cancelled}`}>{label}</span>
}

function statusBorderColor(status: string) {
  const map: Record<string, string> = {
    active: 'border-green-500/30',
    trial: 'border-blue-500/30',
    pending: 'border-orange-500/30',
    paused: 'border-yellow-500/30',
    completed: 'border-purple-500/30',
    cancelled: 'border-red-500/20',
  }
  return map[status] || 'border-[#444444]'
}

export default function ServicesPage() {
  const { clientId: resolvedClientId, loading: authLoading } = usePortalClient()
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<ClientServiceWithService[]>([])
  const [clientId, setClientId] = useState('')
  const [recurring, setRecurring] = useState<RecurringBilling | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

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
    if (!confirm(`Are you sure you want to cancel ${serviceName}? This action cannot be undone.`)) return

    const supabase = createClient()
    await supabase.from('client_services').update({ status: 'cancelled', is_active: false }).eq('id', serviceId)
    await fetch('/api/portal/notify-cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, serviceName, clientId })
    })
    setServices(services.map(s => s.id === serviceId ? { ...s, status: 'cancelled', is_active: false } : s))
    setExpanded(null)
  }

  const handlePause = async (serviceId: string, serviceName: string) => {
    if (!confirm(`Pause ${serviceName}?`)) return

    const supabase = createClient()
    await supabase.from('client_services').update({ status: 'paused', is_active: false }).eq('id', serviceId)
    await fetch('/api/portal/notify-cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, serviceName, clientId, action: 'paused' })
    })
    setServices(services.map(s => s.id === serviceId ? { ...s, status: 'paused', is_active: false } : s))
    setExpanded(null)
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  const isSubscribed = recurring?.status === 'active'
  const subscriptionPaused = recurring?.status === 'paused'
  const expandedService = services.find(s => s.id === expanded)

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Your Services</h1>

      {services.length === 0 ? (
        <p className="text-gray-400">No services found</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {services.map((svc) => {
            const oneTimeStatus = getOneTimeStatus(svc)
            const isMonthly = svc.monthly_cost > 0
            const isOneTime = svc.one_time_cost > 0

            return (
              <button
                key={svc.id}
                onClick={() => setExpanded(svc.id)}
                className={`bg-[#333333] border ${statusBorderColor(svc.status)} rounded-xl p-4 md:p-5 text-left hover:border-white/20 hover:bg-[#3a3a3a] transition-all group`}
              >
                {/* Status badge */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {statusBadge(svc.status, svc.trial_end_date)}
                  {isMonthly && (svc.status === 'active' || svc.status === 'trial') && isSubscribed && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400">SUBSCRIBED</span>
                  )}
                  {isMonthly && svc.status === 'active' && subscriptionPaused && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-400">PAYMENT FAILED</span>
                  )}
                  {isOneTime && oneTimeStatus && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${oneTimeStatus.color}`}>{oneTimeStatus.label}</span>
                  )}
                </div>

                {/* Service name */}
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#2E8B57] transition-colors">
                  {svc.services.name}
                </h3>

                {/* Price highlight */}
                {isMonthly && (
                  <p className="text-white font-bold text-xl mb-1">${Number(svc.monthly_cost).toFixed(0)}<span className="text-sm font-normal text-gray-400">/mo</span></p>
                )}
                {isOneTime && !isMonthly && (
                  <p className="text-white font-bold text-xl mb-1">${Number(svc.one_time_cost).toFixed(0)}<span className="text-sm font-normal text-gray-400"> one-time</span></p>
                )}

                {/* Short description */}
                {svc.services.description && (
                  <p className="text-gray-500 text-xs line-clamp-2 mt-1">{svc.services.description}</p>
                )}

                {/* Tap hint */}
                <p className="text-gray-600 text-[10px] mt-3 group-hover:text-gray-400 transition-colors">Tap for details</p>
              </button>
            )
          })}
        </div>
      )}

      {/* Expanded detail modal */}
      {expandedService && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpanded(null)}
        >
          <div
            className={`bg-[#333333] border ${statusBorderColor(expandedService.status)} rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {statusBadge(expandedService.status, expandedService.trial_end_date)}
                    {expandedService.monthly_cost > 0 && (expandedService.status === 'active' || expandedService.status === 'trial') && isSubscribed && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400">SUBSCRIBED</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{expandedService.services.name}</h2>
                </div>
                <button onClick={() => setExpanded(null)} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              {expandedService.services.description && (
                <p className="text-gray-400 text-sm mb-4">{expandedService.services.description}</p>
              )}

              {/* Service Details / Notes */}
              {expandedService.notes && (
                <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4 border border-[#444444]">
                  <p className="text-xs text-gray-500 mb-2">Service Details</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{expandedService.notes}</p>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4 border border-[#444444] space-y-2">
                {expandedService.monthly_cost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Monthly</span>
                    <span className="text-white font-semibold">${Number(expandedService.monthly_cost).toFixed(2)}/mo</span>
                  </div>
                )}
                {expandedService.monthly_cost > 0 && expandedService.status === 'active' && expandedService.start_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{isSubscribed ? 'Auto-renews' : 'Renews'}</span>
                    <span className="text-gray-300 text-sm">
                      {isSubscribed && recurring?.next_billing_date
                        ? new Date(recurring.next_billing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : getNextRenewalDate(expandedService.start_date)}
                    </span>
                  </div>
                )}
                {expandedService.one_time_cost > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">One-time</span>
                      <span className="text-white font-semibold">${Number(expandedService.one_time_cost).toFixed(2)}</span>
                    </div>
                    {(expandedService.deposit_amount || 0) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Deposit</span>
                        <span className="text-gray-300 text-sm">${Number(expandedService.deposit_amount).toFixed(2)}</span>
                      </div>
                    )}
                    {(() => {
                      const ots = getOneTimeStatus(expandedService)
                      if (!ots) return null
                      return ots.owed > 0 ? (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Remaining</span>
                          <span className="text-red-400 font-semibold">${ots.owed.toFixed(2)}</span>
                        </div>
                      ) : null
                    })()}
                  </>
                )}
              </div>

              {/* Dates */}
              <div className="text-xs text-gray-500 space-y-1 mb-6">
                <p>Started: {new Date(expandedService.start_date).toLocaleDateString()}</p>
                {expandedService.status === 'paused' && expandedService.paused_at && (
                  <p className="text-yellow-500">Paused: {new Date(expandedService.paused_at).toLocaleDateString()}</p>
                )}
                {expandedService.status === 'completed' && expandedService.ended_at && (
                  <p className="text-purple-400">Completed: {new Date(expandedService.ended_at).toLocaleDateString()}</p>
                )}
                {expandedService.status === 'cancelled' && expandedService.ended_at && (
                  <p className="text-red-500">Ended: {new Date(expandedService.ended_at).toLocaleDateString()}</p>
                )}
              </div>

              {/* Actions */}
              {(expandedService.status === 'active' || expandedService.status === 'trial') && (
                <div className="flex gap-3 pt-4 border-t border-[#444444]">
                  <button
                    onClick={() => handlePause(expandedService.id, expandedService.services.name)}
                    className="flex-1 px-4 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Pause Service
                  </button>
                  <button
                    onClick={() => handleCancel(expandedService.id, expandedService.services.name)}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Service
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
