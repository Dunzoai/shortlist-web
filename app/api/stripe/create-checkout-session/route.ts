import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getStripe, toStripeAmount } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing server configuration' }, { status: 500 })
  }

  const { invoiceId } = await request.json()

  if (!invoiceId) {
    return NextResponse.json({ error: 'invoiceId is required' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Fetch invoice with client info
  const { data: invoice, error: invError } = await supabase
    .from('invoices')
    .select('*, clients(name, email)')
    .eq('id', invoiceId)
    .single()

  if (invError || !invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  if (invoice.status === 'paid') {
    return NextResponse.json({ error: 'Invoice is already paid' }, { status: 400 })
  }

  // Fetch invoice items for line items
  const { data: items } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('sort_order')

  const stripe = getStripe()

  // Get or create Stripe customer
  let stripeCustomerId: string | null = null

  const { data: billing } = await supabase
    .from('client_billing')
    .select('stripe_customer_id')
    .eq('client_id', invoice.client_id)
    .single()

  if (billing?.stripe_customer_id) {
    stripeCustomerId = billing.stripe_customer_id
  } else {
    const customer = await stripe.customers.create({
      email: (invoice.clients as any)?.email || undefined,
      name: (invoice.clients as any)?.name || undefined,
      metadata: { client_id: invoice.client_id },
    })
    stripeCustomerId = customer.id

    await supabase
      .from('client_billing')
      .upsert({
        client_id: invoice.client_id,
        stripe_customer_id: customer.id,
      }, { onConflict: 'client_id' })
  }

  // Build line items for checkout
  const lineItems = items && items.length > 0
    ? items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.description || 'Service' },
          unit_amount: toStripeAmount(Number(item.unit_price) || 0),
        },
        quantity: item.quantity || 1,
      }))
    : [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Invoice ${invoice.invoice_number}` },
          unit_amount: toStripeAmount(Number(invoice.amount_due || invoice.total) || 0),
        },
        quantity: 1,
      }]

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId || undefined,
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `https://my.shortlistpass.com/client-portal/invoices?payment=success`,
    cancel_url: `https://my.shortlistpass.com/client-portal/invoices?payment=cancelled`,
    metadata: {
      invoice_id: invoiceId,
      client_id: invoice.client_id,
    },
  })

  return NextResponse.json({ url: session.url })
}
