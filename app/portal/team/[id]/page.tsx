'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Representative, Client } from '@/lib/portal-types'

const repSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  role: z.string().optional(),
})

type RepFormData = z.infer<typeof repSchema>

interface ClientServiceInfo {
  id: string
  clientName: string
  serviceName: string
  monthlyAmount: number
}

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const repId = params.id as string

  const [rep, setRep] = useState<Representative | null>(null)
  const [assignedClients, setAssignedClients] = useState<Client[]>([])
  const [performedServices, setPerformedServices] = useState<ClientServiceInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RepFormData>({
    resolver: zodResolver(repSchema),
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: repData } = await supabase
        .from('representatives')
        .select('*')
        .eq('id', repId)
        .single()

      if (repData) {
        setRep(repData as Representative)
        reset({
          name: repData.name,
          email: repData.email || '',
          role: repData.role || '',
        })
      }

      // Get clients managed by this rep
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .eq('representative_id', repId)
        .order('name')

      setAssignedClients((clientsData as Client[] | null) ?? [])

      // Get services performed by this rep
      const { data: servicesData } = await supabase
        .from('client_services')
        .select('*, clients(name), services(name)')
        .eq('performed_by_id', repId)
        .eq('status', 'active')

      const servicesList: ClientServiceInfo[] = servicesData?.map((s: Record<string, unknown>) => ({
        id: s.id as string,
        clientName: (s.clients as { name: string } | null)?.name || 'Unknown',
        serviceName: (s.services as { name: string } | null)?.name || 'Unknown',
        monthlyAmount: Number(s.monthly_cost) || 0,
      })) ?? []

      setPerformedServices(servicesList)
      setLoading(false)
    }

    fetchData()
  }, [repId, reset])

  const onSubmit = async (data: RepFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('representatives')
      .update({
        name: data.name,
        email: data.email || null,
        role: data.role || null,
      })
      .eq('id', repId)

    if (error) {
      alert('Error updating team member: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/team')
  }

  const handleDelete = async () => {
    if (assignedClients.length > 0 || performedServices.length > 0) {
      alert('Cannot delete team member with assigned clients or services. Please reassign them first.')
      return
    }

    if (!confirm('Are you sure you want to delete this team member?')) return

    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('representatives').delete().eq('id', repId)

    if (error) {
      alert('Error deleting team member: ' + error.message)
      setDeleting(false)
      return
    }

    router.push('/portal/team')
  }

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

  if (!rep) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Team member not found.</p>
        <Link href="/portal/team" className="text-[#2E8B57] hover:underline">Back to Team</Link>
      </div>
    )
  }

  const totalMonthlyRevenue = performedServices.reduce((sum, s) => sum + s.monthlyAmount, 0)

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link href="/portal/team" className="text-gray-400 hover:text-white text-sm">&larr; Back to Team</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Edit Team Member</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-[#333333] rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    {...register('role')}
                    className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            {/* Assigned Clients */}
            <div className="bg-[#333333] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Assigned Clients ({assignedClients.length})
              </h2>
              {assignedClients.length === 0 ? (
                <p className="text-gray-400 text-sm">No clients assigned as account manager.</p>
              ) : (
                <div className="space-y-2">
                  {assignedClients.map((client) => (
                    <Link
                      key={client.id}
                      href={`/portal/clients/${client.id}`}
                      className="block p-3 bg-[#3a3a3a] hover:bg-[#444444] rounded-lg transition-colors"
                    >
                      <p className="text-white text-sm font-medium">{client.name}</p>
                      {client.email && (
                        <p className="text-gray-400 text-xs">{client.email}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Performed Services */}
            <div className="bg-[#333333] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Active Services ({performedServices.length})
                </h2>
                <span className="text-[#2E8B57] font-medium">
                  ${totalMonthlyRevenue.toLocaleString()}/mo
                </span>
              </div>
              {performedServices.length === 0 ? (
                <p className="text-gray-400 text-sm">No active services performed by this team member.</p>
              ) : (
                <div className="space-y-2">
                  {performedServices.map((service) => (
                    <div
                      key={service.id}
                      className="p-3 bg-[#3a3a3a] rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white text-sm font-medium">{service.clientName}</p>
                          <p className="text-gray-400 text-xs">{service.serviceName}</p>
                        </div>
                        <span className="text-sm text-gray-300">${service.monthlyAmount}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
