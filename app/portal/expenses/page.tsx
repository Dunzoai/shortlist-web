'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Expense } from '@/lib/portal-types'

const categoryLabels: Record<string, string> = {
  subscription: 'Subscription',
  software: 'Software',
  contractor: 'Contractor',
  marketing: 'Marketing',
  other: 'Other',
}

const categoryColors: Record<string, string> = {
  subscription: 'bg-blue-500/20 text-blue-400',
  software: 'bg-purple-500/20 text-purple-400',
  contractor: 'bg-orange-500/20 text-orange-400',
  marketing: 'bg-pink-500/20 text-pink-400',
  other: 'bg-gray-500/20 text-gray-400',
}

export default function ExpensesPage() {
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    async function fetchExpenses() {
      const supabase = createClient()
      const { data } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })

      setExpenses((data as Expense[] | null) ?? [])
      setLoading(false)
    }

    fetchExpenses()
  }, [])

  // Calculate totals
  const recurringExpenses = expenses.filter((e) => e.is_recurring)
  const oneTimeExpenses = expenses.filter((e) => !e.is_recurring)

  const monthlyTotal = recurringExpenses.reduce((sum, e) => sum + e.amount, 0)
  const yearlyRecurring = monthlyTotal * 12

  // One-time expenses for current year
  const oneTimeThisYear = oneTimeExpenses.filter((e) => {
    if (!e.start_date) return false
    return new Date(e.start_date).getFullYear() === currentYear
  })
  const oneTimeTotal = oneTimeThisYear.reduce((sum, e) => sum + e.amount, 0)

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
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-gray-400 text-sm mt-1">Track business costs and subscriptions</p>
        </div>
        <Link
          href="/portal/expenses/new"
          className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add Expense
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Recurring</p>
          <p className="text-3xl font-bold text-red-400">${monthlyTotal.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{recurringExpenses.length} expense{recurringExpenses.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">Yearly Recurring</p>
          <p className="text-3xl font-bold text-red-400">${yearlyRecurring.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Projected annual</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-6">
          <p className="text-sm text-gray-400 mb-1">One-Time ({currentYear})</p>
          <p className="text-3xl font-bold text-red-400">${oneTimeTotal.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{oneTimeThisYear.length} expense{oneTimeThisYear.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-[#333333] rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No expenses tracked yet.</p>
          <Link href="/portal/expenses/new" className="text-[#2E8B57] hover:underline">
            Add your first expense
          </Link>
        </div>
      ) : (
        <div className="bg-[#333333] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#3a3a3a]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444444]">
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  onClick={() => router.push(`/portal/expenses/${expense.id}`)}
                  className="hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{expense.name}</span>
                    {expense.description && (
                      <p className="text-sm text-gray-400">{expense.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[expense.category]}`}>
                      {categoryLabels[expense.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {expense.is_recurring ? 'Monthly' : 'One-time'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium text-red-400">
                      ${expense.amount.toLocaleString()}
                      {expense.is_recurring && <span className="text-gray-400">/mo</span>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
