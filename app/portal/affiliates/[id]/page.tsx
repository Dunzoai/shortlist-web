'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Affiliate, Client, ClientService } from '@/lib/portal-types'

const affiliateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  payment_type: z.enum(['percentage', 'flat', '']).optional(),
  payment_amount: z.string().optional(),
  payment_frequency: z.enum(['one_time', 'monthly', '']).optional(),
  notes: z.string().optional(),
})

type AffiliateFormData = z.infer<typeof affiliateSchema>

interface ClientWithRevenue extends Client {
  monthlyRevenue: number
}

export default function EditAffiliatePage() {
  const router = useRouter()
  const params = useParams()
  const affiliateId = params.id as string

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [clients, setClients] = useState<ClientWithRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateSchema),
  })

  const paymentType = watch('payment_type')

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: affiliateData } = await supabase.from('affiliates').select('*').eq('id', affiliateId).single()

      if (affiliateData) {
        const aff = affiliateData as Affiliate
        setAffiliate(aff)
        reset({
          name: aff.name,
          email: aff.email || '',
          phone: aff.phone || '',
          payment_type: aff.payment_type || '',
          payment_amount: aff.payment_amount?.toString() || '',
          payment_frequency: aff.payment_frequency || '',
          notes: aff.notes || '',
        })
      }

      const { data: clientsData } = await supabase.from('clients').select('*').eq('affiliate_id', affiliateId).order('created_at', { ascending: false })

      const clientIds = (clientsData as Client[])?.map((c) => c.id) ?? []

      if (clientIds.length > 0) {
        const { data: servicesData } = await supabase.from('client_services').select('*').in('client_id', clientIds).eq('status', 'active')

        const services = (servicesData as ClientService[]) ?? []

        const clientsWithRevenue = ((clientsData as Client[]) ?? []).map((client) => {
          const clientServices = services.filter((s) => s.client_id === client.id)
          const monthlyRevenue = clientServices.reduce((sum, s) => sum + Number(s.monthly_cost), 0)
          return { ...client, monthlyRevenue }
        })

        setClients(clientsWithRevenue)
      } else {
        setClients([])
      }

      setLoading(false)
    }

    fetchData()
  }, [affiliateId, reset])

  const onSubmit = async (data: AffiliateFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('affiliates')
      .update({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        payment_type: data.payment_type || null,
        payment_amount: data.payment_amount ? Number(data.payment_amount) : null,
        payment_frequency: data.payment_frequency || null,
        notes: data.notes || null,
      })
      .eq('id', affiliateId)

    if (error) {
      alert('Error updating affiliate: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/affiliates')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this affiliate? Their referred clients will no longer be associated with them.')) return

    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('affiliates').delete().eq('id', affiliateId)

    if (error) {
      alert('Error deleting affiliate: ' + error.message)
      setDeleting(false)
      return
    }

    router.push('/portal/affiliates')
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

  if (!affiliate) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Affiliate not found.</p>
        <Link href="/portal/affiliates" className="text-[#2E8B57] hover:underline">Back to Affiliates</Link>
      </div>
    )
  }

  const totalMonthlyRevenue = clients.reduce((sum, c) => sum + c.monthlyRevenue, 0)
  let totalEarnings = 0
  if (affiliate.payment_type === 'percentage' && affiliate.payment_amount) {
    totalEarnings = totalMonthlyRevenue * (affiliate.payment_amount / 100)
  } else if (affiliate.payment_type === 'flat' && affiliate.payment_amount) {
    totalEarnings = affiliate.payment_amount * clients.length
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link href="/portal/affiliates" className="text-gray-400 hover:text-white text-sm">&larr; Back to Affiliates</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Edit Affiliate</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-[#333333] rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
                  <input type="text" {...register('name')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" {...register('email')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input type="tel" {...register('phone')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                </div>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Payment Terms</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Type</label>
                  <select {...register('payment_type')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                    <option value="">No payment terms</option>
                    <option value="percentage">Percentage of client revenue</option>
                    <option value="flat">Flat fee per client</option>
                  </select>
                </div>

                {(paymentType === 'percentage' || paymentType === 'flat') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {paymentType === 'percentage' ? 'Percentage (%)' : 'Flat Amount ($)'}
                      </label>
                      <input type="number" step={paymentType === 'percentage' ? '0.1' : '1'} {...register('payment_amount')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Payment Frequency</label>
                      <select {...register('payment_frequency')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                        <option value="">Select frequency</option>
                        <option value="monthly">Monthly (recurring)</option>
                        <option value="one_time">One-time per client</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-[#333333] rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea {...register('notes')} rows={4} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none" />
              </div>

              <div className="flex items-center justify-between">
                <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors">
                  {deleting ? 'Deleting...' : 'Delete Affiliate'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-[#333333] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Earnings Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Clients</span>
                  <span className="text-white">{clients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Client Revenue</span>
                  <span className="text-white">${totalMonthlyRevenue.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#444444]">
                  <span className="text-gray-400">Their Earnings</span>
                  <span className="text-xl font-semibold text-[#2E8B57]">
                    ${totalEarnings.toLocaleString()}{affiliate.payment_frequency === 'monthly' && '/mo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#333333] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Referred Clients</h2>
              {clients.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No clients referred yet.</p>
              ) : (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <Link key={client.id} href={`/portal/clients/${client.id}`} className="flex items-center justify-between p-3 bg-[#3a3a3a] hover:bg-[#444444] rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-sm text-gray-400">{client.email || 'No email'}</p>
                      </div>
                      <span className="text-sm text-gray-300">${client.monthlyRevenue.toLocaleString()}/mo</span>
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
