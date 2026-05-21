'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Affiliate, Representative } from '@/lib/portal-types'

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  affiliate_id: z.string().optional(),
  representative_id: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

export default function NewClientPage() {
  const router = useRouter()
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: affiliatesData } = await supabase.from('affiliates').select('*').order('name')
      setAffiliates((affiliatesData as Affiliate[]) ?? [])
      const { data: repsData } = await supabase.from('representatives').select('*').order('name')
      setRepresentatives((repsData as Representative[]) ?? [])
    }
    fetchData()
  }, [])

  const onSubmit = async (data: ClientFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase.from('clients').insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      notes: data.notes || null,
      affiliate_id: data.affiliate_id || null,
      representative_id: data.representative_id || null,
    })

    if (error) {
      alert('Error creating client: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/clients')
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <Link href="/portal/clients" className="text-gray-400 hover:text-white text-sm">&larr; Back to Clients</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Add New Client</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-[#333333] rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
              <input type="text" {...register('name')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" {...register('email')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input type="tel" {...register('phone')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Referred by Affiliate</label>
              <select {...register('affiliate_id')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                <option value="">No affiliate</option>
                {affiliates.map((affiliate) => (
                  <option key={affiliate.id} value={affiliate.id}>{affiliate.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Account Manager</label>
              <select {...register('representative_id')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                <option value="">No rep assigned</option>
                {representatives.map((rep) => (
                  <option key={rep.id} value={rep.id}>{rep.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <textarea {...register('notes')} rows={4} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
              {saving ? 'Saving...' : 'Create Client'}
            </button>
            <Link href="/portal/clients" className="px-6 py-2 text-gray-300 hover:text-white transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
