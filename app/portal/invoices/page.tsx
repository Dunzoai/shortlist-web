'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { InvoiceWithClient, InvoiceStatus } from '@/lib/portal-types'

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  sent: 'bg-blue-500/20 text-blue-400',
  paid: 'bg-green-500/20 text-green-400',
  partially_paid: 'bg-yellow-500/20 text-yellow-400',
  overdue: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-gray-500/20 text-gray-500',
  refunded: 'bg-purple-500/20 text-purple-400',
}

const statusLabels: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  partially_paid: 'Partial',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

type FilterStatus = 'all' | InvoiceStatus

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<InvoiceWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')

  useEffect(() => {
    async function fetchInvoices() {
      const supabase = createClient()
      const { data } = await supabase
        .from('invoices')
        .select('*, client:clients(id, name, email)')
        .order('created_at', { ascending: false })

      setInvoices((data as InvoiceWithClient[] | null) ?? [])
      setLoading(false)
    }

    fetchInvoices()
  }, [])

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter(inv => inv.status === filter)

  // Stats
  const totalOutstanding = invoices
    .filter(inv => ['sent', 'partially_paid', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.amount_due, 0)

  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount_due, 0)

  const paidThisMonth = invoices
    .filter(inv => {
      if (inv.status !== 'paid' || !inv.paid_at) return false
      const paidDate = new Date(inv.paid_at)
      const now = new Date()
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, inv) => sum + inv.total, 0)

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
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track client invoices</p>
        </div>
        <Link
          href="/portal/invoices/new"
          className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white text-sm font-medium rounded-lg transition-colors text-center"
        >
          Create Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#333333] rounded-lg p-4">
          <p className="text-sm text-gray-400">Outstanding</p>
          <p className="text-2xl font-bold text-yellow-400">${totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-4">
          <p className="text-sm text-gray-400">Overdue</p>
          <p className="text-2xl font-bold text-red-400">${totalOverdue.toLocaleString()}</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-4">
          <p className="text-sm text-gray-400">Paid This Month</p>
          <p className="text-2xl font-bold text-[#2E8B57]">${paidThisMonth.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'draft', 'sent', 'overdue', 'paid'] as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-[#2E8B57] text-white'
                : 'bg-[#333333] text-gray-300 hover:bg-[#444444]'
            }`}
          >
            {status === 'all' ? 'All' : statusLabels[status]}
            {status !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({invoices.filter(inv => inv.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-[#333333] rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">
            {filter === 'all' ? 'No invoices yet.' : `No ${statusLabels[filter as InvoiceStatus].toLowerCase()} invoices.`}
          </p>
          <Link href="/portal/invoices/new" className="text-[#2E8B57] hover:underline">
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div className="bg-[#333333] rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3a3a3a]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Invoice</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Due Date</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#444444]">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => router.push(`/portal/invoices/${invoice.id}`)}
                    className="hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-white">{invoice.invoice_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{invoice.client?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[invoice.status]}`}>
                        {statusLabels[invoice.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-white">${invoice.total.toLocaleString()}</span>
                      {invoice.amount_due > 0 && invoice.amount_due < invoice.total && (
                        <span className="text-sm text-gray-400 ml-2">(${invoice.amount_due.toLocaleString()} due)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#444444]">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() => router.push(`/portal/invoices/${invoice.id}`)}
                className="p-4 hover:bg-[#3a3a3a] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-white text-sm">{invoice.invoice_number}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[invoice.status]}`}>
                    {statusLabels[invoice.status]}
                  </span>
                </div>
                <p className="text-white font-medium">{invoice.client?.name || 'Unknown'}</p>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-400">Due {new Date(invoice.due_date).toLocaleDateString()}</span>
                  <span className="font-medium text-white">${invoice.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
