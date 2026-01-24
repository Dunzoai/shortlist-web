'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Expense } from '@/lib/portal-types'

const expenseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  amount: z.string().min(1, 'Amount is required'),
  category: z.enum(['subscription', 'software', 'contractor', 'marketing', 'other']),
  is_recurring: z.boolean(),
  start_date: z.string().optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

export default function EditExpensePage() {
  const router = useRouter()
  const params = useParams()
  const expenseId = params.id as string

  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  })

  const isRecurring = watch('is_recurring')

  useEffect(() => {
    async function fetchExpense() {
      const supabase = createClient()
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', expenseId)
        .single()

      if (data) {
        setExpense(data as Expense)
        reset({
          name: data.name,
          description: data.description || '',
          amount: String(data.amount),
          category: data.category,
          is_recurring: data.is_recurring,
          start_date: data.start_date || '',
        })
      }
      setLoading(false)
    }

    fetchExpense()
  }, [expenseId, reset])

  const onSubmit = async (data: ExpenseFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('expenses')
      .update({
        name: data.name,
        description: data.description || null,
        amount: Number(data.amount) || 0,
        category: data.category,
        is_recurring: data.is_recurring,
        start_date: data.start_date || null,
      })
      .eq('id', expenseId)

    if (error) {
      alert('Error updating expense: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/portal/expenses')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId)

    if (error) {
      alert('Error deleting expense: ' + error.message)
      setDeleting(false)
      return
    }

    router.push('/portal/expenses')
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

  if (!expense) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Expense not found.</p>
        <Link href="/portal/expenses" className="text-[#2E8B57] hover:underline">Back to Expenses</Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-xl">
        <div className="mb-8">
          <Link href="/portal/expenses" className="text-gray-400 hover:text-white text-sm">&larr; Back to Expenses</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Edit Expense</h1>
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
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      {...register('is_recurring')}
                      value="true"
                      checked={isRecurring === true}
                      onChange={() => {}}
                      className="text-[#2E8B57]"
                    />
                    <span className="text-gray-300">Monthly</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      {...register('is_recurring')}
                      value="false"
                      checked={isRecurring === false}
                      onChange={() => {}}
                      className="text-[#2E8B57]"
                    />
                    <span className="text-gray-300">One-time</span>
                  </label>
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
    </div>
  )
}
