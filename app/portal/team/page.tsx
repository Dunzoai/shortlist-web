'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Representative } from '@/lib/portal-types'

interface RepWithStats extends Representative {
  clientCount: number
  serviceCount: number
}

export default function TeamPage() {
  const [reps, setReps] = useState<RepWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: repsData } = await supabase
        .from('representatives')
        .select('*')
        .order('name')

      // Get client counts per rep (as account manager)
      const { data: clientCounts } = await supabase
        .from('clients')
        .select('representative_id')

      // Get service counts per rep (as performer)
      const { data: serviceCounts } = await supabase
        .from('client_services')
        .select('performed_by_id')
        .eq('status', 'active')

      const clientCountMap: Record<string, number> = {}
      clientCounts?.forEach((c) => {
        if (c.representative_id) {
          clientCountMap[c.representative_id] = (clientCountMap[c.representative_id] || 0) + 1
        }
      })

      const serviceCountMap: Record<string, number> = {}
      serviceCounts?.forEach((s) => {
        if (s.performed_by_id) {
          serviceCountMap[s.performed_by_id] = (serviceCountMap[s.performed_by_id] || 0) + 1
        }
      })

      const repsWithStats: RepWithStats[] = (repsData as Representative[] | null)?.map((rep) => ({
        ...rep,
        clientCount: clientCountMap[rep.id] || 0,
        serviceCount: serviceCountMap[rep.id] || 0,
      })) ?? []

      setReps(repsWithStats)
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <Link
          href="/portal/team/new"
          className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add Team Member
        </Link>
      </div>

      {reps.length === 0 ? (
        <div className="bg-[#333333] rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No team members yet.</p>
          <Link
            href="/portal/team/new"
            className="text-[#2E8B57] hover:underline"
          >
            Add your first team member
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reps.map((rep) => (
            <Link
              key={rep.id}
              href={`/portal/team/${rep.id}`}
              className="bg-[#333333] hover:bg-[#3a3a3a] rounded-lg p-6 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{rep.name}</h3>
                  {rep.role && (
                    <p className="text-sm text-gray-400">{rep.role}</p>
                  )}
                </div>
                <div className="w-10 h-10 bg-[#2E8B57] rounded-full flex items-center justify-center text-white font-medium">
                  {rep.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {rep.email && (
                <p className="text-sm text-gray-400 mb-4">{rep.email}</p>
              )}

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-white font-medium">{rep.clientCount}</span>
                  <span className="text-gray-400 ml-1">client{rep.clientCount !== 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-white font-medium">{rep.serviceCount}</span>
                  <span className="text-gray-400 ml-1">active service{rep.serviceCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
