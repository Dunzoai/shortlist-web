'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Service } from '@/lib/portal-types'

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ClientUsingService {
  id: string
  clientId: string
  clientName: string
  monthlyCost: number
  status: string
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string

  const [service, setService] = useState<Service | null>(null)
  const [clientsUsing, setClientsUsing] = useState<ClientUsingService[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: serviceData } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single()

      if (serviceData) {
        setService(serviceData as Service)
        reset({
          name: serviceData.name,
          description: serviceData.description || '',
        })
      }

      // Get clients using this service
      const { data: clientServicesData } = await supabase
        .from('client_services')
        .select('*, clients(id, name)')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false })

      const clientsList: ClientUsingService[] = clientServicesData?.map((cs: Record<string, unknown>) => ({
        id: cs.id as string,
        clientId: (cs.clients as { id: string } | null)?.id || '',
        clientName: (cs.clients as { name: string } | null)?.name || 'Unknown',
        monthlyCost: Number(cs.monthly_cost) || 0,
        status: cs.status as string,
      })) ?? []

      setClientsUsing(clientsList)
      setLoading(false)
    }

    fetchData()
  }, [serviceId, reset])

  const onSubmit = async (data: ServiceFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('services')
      .update({
        name: data.name,
        description: data.description || null,
      })
      .eq('id', serviceId)

    if (error) {
      alert('Error updating service: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/services')
  }

  const handleDelete = async () => {
    if (clientsUsing.length > 0) {
      alert('Cannot delete service while clients are using it. Remove the service from all clients first.')
      return
    }

    if (!confirm('Are you sure you want to delete this service?')) return

    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('services').delete().eq('id', serviceId)

    if (error) {
      alert('Error deleting service: ' + error.message)
      setDeleting(false)
      return
    }

    router.push('/portal/services')
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

  if (!service) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Service not found.</p>
        <Link href="/portal/services" className="text-[#2E8B57] hover:underline">Back to Services</Link>
      </div>
    )
  }

  const activeClients = clientsUsing.filter((c) => c.status === 'active')
  const totalMonthly = activeClients.reduce((sum, c) => sum + c.monthlyCost, 0)

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link href="/portal/services" className="text-gray-400 hover:text-white text-sm">&larr; Back to Services</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Edit Service</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-[#333333] rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Service Details</h2>

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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none"
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
                  disabled={deleting || clientsUsing.length > 0}
                  className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors"
                  title={clientsUsing.length > 0 ? 'Remove from all clients first' : ''}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </form>
          </div>

          <div>
            <div className="bg-[#333333] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Clients Using ({activeClients.length} active)
                </h2>
                <span className="text-[#2E8B57] font-medium">
                  ${totalMonthly.toLocaleString()}/mo
                </span>
              </div>

              {clientsUsing.length === 0 ? (
                <p className="text-gray-400 text-sm">No clients using this service yet.</p>
              ) : (
                <div className="space-y-2">
                  {clientsUsing.map((client) => (
                    <Link
                      key={client.id}
                      href={`/portal/clients/${client.clientId}`}
                      className="flex items-center justify-between p-3 bg-[#3a3a3a] hover:bg-[#444444] rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">{client.clientName}</p>
                        <p className="text-xs text-gray-400">
                          {client.status === 'active' ? (
                            <span className="text-green-400">Active</span>
                          ) : client.status === 'paused' ? (
                            <span className="text-yellow-400">Paused</span>
                          ) : (
                            <span className="text-red-400">Cancelled</span>
                          )}
                        </p>
                      </div>
                      <span className="text-sm text-gray-300">
                        ${client.monthlyCost}/mo
                      </span>
                    </Link>
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
