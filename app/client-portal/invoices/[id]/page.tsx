'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { usePortalClient } from '@/lib/usePortalClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

function linkify(text: string) {
  // Match URLs (http/https) and bare domains (word.tld patterns)
  const urlRegex = /(https?:\/\/[^\s,)]+)|(?<![/@])\b([a-zA-Z0-9][-a-zA-Z0-9]*\.(?:com|net|org|io|co|app|dev|ai|xyz|me|info|biz|us|uk|ca|edu|gov)(?:\.[a-z]{2})?(?:\/[^\s,)]*)?)/gi
  const parts: (string | React.ReactElement)[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const url = match[0]
    const href = url.startsWith('http') ? url : `https://${url}`
    parts.push(
      <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="text-[#2E8B57] hover:underline">
        {url}
      </a>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts.length > 0 ? parts : [text]
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  service_id: string | null
  services?: { name: string } | null
}

interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  status: string
  total: number
  subtotal: number
  amount_paid: number
  amount_due: number
  tax_amount: number
  tax_rate: number
  due_date: string | null
  issue_date: string
  period_start: string | null
  period_end: string | null
  paid_at: string | null
  notes: string | null
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  sent: 'bg-blue-500/20 text-blue-400',
  paid: 'bg-green-500/20 text-green-400',
  partially_paid: 'bg-yellow-500/20 text-yellow-400',
  overdue: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-gray-500/20 text-gray-500',
  refunded: 'bg-purple-500/20 text-purple-400',
}

export default function ClientInvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id as string
  const { clientId, loading: authLoading } = usePortalClient()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (authLoading || !clientId) return

    async function load() {
      const supabase = createClient()

      const [{ data: inv }, { data: lineItems }] = await Promise.all([
        supabase
          .from('invoices')
          .select('*')
          .eq('id', invoiceId)
          .eq('client_id', clientId!)
          .neq('status', 'draft')
          .single(),
        supabase
          .from('invoice_items')
          .select('*, services:service_id(name)')
          .eq('invoice_id', invoiceId)
          .order('sort_order'),
      ])

      setInvoice(inv as Invoice | null)
      setItems((lineItems as InvoiceItem[] | null) ?? [])
      setLoading(false)
    }

    load()
  }, [authLoading, clientId, invoiceId])

  const handlePay = async () => {
    setPaying(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Payment failed')
    } catch {
      alert('Payment failed')
    } finally {
      setPaying(false)
    }
  }

  const isSubdomain = typeof window !== 'undefined' && (window.location.hostname.startsWith('my.') || window.location.hostname.startsWith('clients.'))
  const backHref = isSubdomain ? '/invoices' : '/client-portal/invoices'

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  if (!invoice) {
    return (
      <div>
        <p className="text-gray-400 mb-4">Invoice not found.</p>
        <Link href={backHref} className="text-[#2E8B57] hover:underline">Back to Invoices</Link>
      </div>
    )
  }

  const canPay = invoice.status === 'sent' || invoice.status === 'overdue' || invoice.status === 'partially_paid'

  return (
    <div className="max-w-2xl">
      <Link href={backHref} className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Invoices
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono">{invoice.invoice_number}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Issued {new Date(invoice.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusColors[invoice.status] || statusColors.cancelled}`}>
          {invoice.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {invoice.due_date && (
          <div className="bg-[#333333] border border-[#444444] rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Due Date</p>
            <p className={`text-sm font-medium ${new Date(invoice.due_date) < new Date() && invoice.status !== 'paid' ? 'text-red-400' : 'text-white'}`}>
              {new Date(invoice.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
        {invoice.period_start && invoice.period_end && (
          <div className="bg-[#333333] border border-[#444444] rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Billing Period</p>
            <p className="text-sm text-white">
              {new Date(invoice.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(invoice.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
        {invoice.status === 'paid' && invoice.paid_at && (
          <div className="bg-[#333333] border border-green-500/20 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Paid On</p>
            <p className="text-sm text-green-400 font-medium">
              {new Date(invoice.paid_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="bg-[#333333] border border-[#444444] rounded-xl overflow-hidden mb-6">
        <div className="p-4 border-b border-[#444444]">
          <h2 className="text-sm font-semibold text-gray-400 uppercase">Services Rendered</h2>
        </div>
        <div className="divide-y divide-[#444444]">
          {items.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {item.services?.name && (
                    <p className="text-xs text-[#2E8B57] font-medium mb-1">{item.services.name}</p>
                  )}
                  <p className="text-white text-sm">{linkify(item.description)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-semibold">${Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-500">{item.quantity} × ${Number(item.unit_price).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-[#444444] p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">${Number(invoice.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {invoice.tax_amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tax</span>
              <span className="text-white">${Number(invoice.tax_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#444444]">
            <span className="text-white">Total</span>
            <span className="text-white">${Number(invoice.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {invoice.amount_paid > 0 && invoice.amount_paid < invoice.total && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Paid</span>
                <span className="text-green-400">-${Number(invoice.amount_paid).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Amount Due</span>
                <span className="text-yellow-400">${Number(invoice.amount_due).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-[#333333] border border-[#444444] rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-500 mb-2">Notes</p>
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{linkify(invoice.notes)}</p>
        </div>
      )}

      {/* Pay button */}
      {canPay && (
        <button
          onClick={handlePay}
          disabled={paying}
          className="w-full px-6 py-3 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-xl transition-colors text-lg"
        >
          {paying ? 'Processing...' : `Pay $${Number(invoice.amount_due).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        </button>
      )}
    </div>
  )
}
