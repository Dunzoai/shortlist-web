'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type ServiceFormData = z.infer<typeof serviceSchema>

export default function NewServicePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  })

  const onSubmit = async (data: ServiceFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase.from('services').insert({
      name: data.name,
      description: data.description || null,
    })

    if (error) {
      alert('Error adding service: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/services')
  }

  return (
    <div className="p-8">
      <div className="max-w-xl">
        <div className="mb-8">
          <Link href="/portal/services" className="text-gray-400 hover:text-white text-sm">&larr; Back to Services</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Add Service</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-[#333333] rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Service Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                placeholder="e.g., Website Hosting, Social Media Management"
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
                placeholder="Brief description of this service..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? 'Adding...' : 'Add Service'}
            </button>
            <Link
              href="/portal/services"
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
