import { NextRequest, NextResponse } from 'next/server'
import { stripe, fromStripeAmount } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role for webhooks (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'invoice.paid': {
        // Use 'any' to avoid strict Stripe type issues
        const stripeInvoice = event.data.object as Record<string, unknown>
        const invoiceId = (stripeInvoice.metadata as Record<string, string> | undefined)?.invoice_id

        if (invoiceId) {
          // Get our invoice
          const { data: invoice } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .single()

          if (invoice) {
            await supabase.from('payments').insert({
              client_id: invoice.client_id,
              invoice_id: invoiceId,
              amount: fromStripeAmount((stripeInvoice.amount_paid as number) || 0),
              payment_method: 'card',
              status: 'completed',
            })

            // Update invoice status
            await supabase
              .from('invoices')
              .update({
                status: 'paid',
                amount_paid: fromStripeAmount(stripeInvoice.amount_paid || 0),
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', invoiceId)

            // Log receipt email (Stripe sends it automatically)
            const { data: client } = await supabase
              .from('clients')
              .select('email')
              .eq('id', invoice.client_id)
              .single()

            if (client?.email) {
              await supabase.from('billing_emails').insert({
                client_id: invoice.client_id,
                invoice_id: invoiceId,
                email_type: 'receipt',
                recipient_email: client.email,
                subject: `Payment received for Invoice ${invoice.invoice_number}`,
                status: 'sent',
                sent_at: new Date().toISOString(),
              })
            }
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        // Use 'any' to avoid strict Stripe type issues
        const stripeInvoice = event.data.object as Record<string, unknown>
        const invoiceId = (stripeInvoice.metadata as Record<string, string> | undefined)?.invoice_id

        if (invoiceId) {
          // Record the failed payment
          const { data: invoice } = await supabase
            .from('invoices')
            .select('client_id')
            .eq('id', invoiceId)
            .single()

          if (invoice) {
            const paymentIntent = stripeInvoice.payment_intent as string | { id: string } | null
            const paymentIntentId = typeof paymentIntent === 'string'
              ? paymentIntent
              : paymentIntent?.id || null

            await supabase.from('payments').insert({
              client_id: invoice.client_id,
              invoice_id: invoiceId,
              amount: fromStripeAmount((stripeInvoice.amount_due as number) || 0),
              payment_method: 'card',
              status: 'failed',
              stripe_payment_intent_id: paymentIntentId,
              failure_reason: 'Payment failed',
            })
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        // Handle autopay subscription events (for future)
        console.log('Subscription event:', event.type)
        break
      }

      default:
        console.log('Unhandled webhook event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
