'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const expenseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  amount: z.string().min(1, 'Amount is required'),
  category: z.enum(['subscription', 'software', 'contractor', 'marketing', 'other']),
  is_recurring: z.boolean(),
  start_date: z.string().optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

export default function NewExpensePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: 'subscription',
      is_recurring: true,
      start_date: new Date().toISOString().split('T')[0],
    },
  })

  const isRecurring = watch('is_recurring')

  const onSubmit = async (data: ExpenseFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase.from('expenses').insert({
      name: data.name,
      description: data.description || null,
      amount: Number(data.amount) || 0,
      category: data.category,
      is_recurring: data.is_recurring,
      start_date: data.start_date || null,
    })

    if (error) {
      alert('Error adding expense: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/expenses')
  }

  return (
    <div className="p-8">
      <div className="max-w-xl">
        <div className="mb-8">
          <Link href="/portal/expenses" className="text-gray-400 hover:text-white text-sm">&larr; Back to Expenses</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Add Expense</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-[#333333] rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                placeholder="e.g., Anthropic API, Adobe Creative Cloud"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <input
                type="text"
                {...register('description')}
                className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                placeholder="Brief description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('amount')}
                    className="w-full pl-7 pr-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                >
                  <option value="subscription">Subscription</option>
                  <option value="software">Software</option>
                  <option value="contractor">Contractor</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setValue('is_recurring', true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isRecurring === true
                        ? 'bg-[#2E8B57] text-white'
                        : 'bg-[#444444] text-gray-300 hover:bg-[#555555]'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('is_recurring', false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isRecurring === false
                        ? 'bg-[#2E8B57] text-white'
                        : 'bg-[#444444] text-gray-300 hover:bg-[#555555]'
                    }`}
                  >
                    One-time
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isRecurring ? 'Start Date' : 'Date'}
                </label>
                <input
                  type="date"
                  {...register('start_date')}
                  className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? 'Adding...' : 'Add Expense'}
            </button>
            <Link
              href="/portal/expenses"
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
