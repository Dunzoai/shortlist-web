'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const affiliateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  payment_type: z.enum(['percentage', 'flat']).optional(),
  payment_amount: z.string().optional(),
  payment_frequency: z.enum(['one_time', 'monthly']).optional(),
  notes: z.string().optional(),
})

type AffiliateFormData = z.infer<typeof affiliateSchema>

export default function NewAffiliatePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateSchema),
  })

  const paymentType = watch('payment_type')

  const onSubmit = async (data: AffiliateFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase.from('affiliates').insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      payment_type: data.payment_type || null,
      payment_amount: data.payment_amount ? Number(data.payment_amount) : null,
      payment_frequency: data.payment_frequency || null,
      notes: data.notes || null,
    })

    if (error) {
      alert('Error creating affiliate: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/affiliates')
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <Link href="/portal/affiliates" className="text-gray-400 hover:text-white text-sm">&larr; Back to Affiliates</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Add New Affiliate</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-[#333333] rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
              <input type="text" {...register('name')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" placeholder="John Smith" />
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
          </div>

          <div className="bg-[#333333] rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Payment Terms</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Payment Type</label>
              <select {...register('payment_type')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                <option value="">Select payment type</option>
                <option value="percentage">Percentage of client revenue</option>
                <option value="flat">Flat fee per client</option>
              </select>
            </div>

            {paymentType && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {paymentType === 'percentage' ? 'Percentage (%)' : 'Flat Amount ($)'}
                  </label>
                  <input type="number" step={paymentType === 'percentage' ? '0.1' : '1'} {...register('payment_amount')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" placeholder={paymentType === 'percentage' ? '10' : '100'} />
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
            <textarea {...register('notes')} rows={4} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none" placeholder="Any additional notes about this affiliate..." />
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
              {saving ? 'Saving...' : 'Create Affiliate'}
            </button>
            <Link href="/portal/affiliates" className="px-6 py-2 text-gray-300 hover:text-white transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
