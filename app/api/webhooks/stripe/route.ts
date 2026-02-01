import { NextRequest, NextResponse } from 'next/server'
import { getStripe, fromStripeAmount } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Create supabase client lazily (not at build time)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase()
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
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
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as Record<string, unknown>
        const mode = session.mode as string
        const metadata = session.metadata as Record<string, string> | undefined

        if (mode === 'subscription' && metadata?.client_id) {
          const subscriptionId = session.subscription as string

          // Store subscription in recurring_billing
          await supabase.from('recurring_billing').upsert({
            client_id: metadata.client_id,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: session.customer as string,
            status: 'active',
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }, { onConflict: 'client_id' })
        }

        // Mark the invoice as paid for one-time payments
        if (mode === 'payment' && metadata?.invoice_id) {
          const amountTotal = session.amount_total as number
          await supabase
            .from('invoices')
            .update({
              status: 'paid',
              amount_paid: fromStripeAmount(amountTotal || 0),
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', metadata.invoice_id)

          // Record payment
          const { data: invoice } = await supabase
            .from('invoices')
            .select('client_id')
            .eq('id', metadata.invoice_id)
            .single()

          if (invoice) {
            await supabase.from('payments').insert({
              client_id: invoice.client_id,
              invoice_id: metadata.invoice_id,
              amount: fromStripeAmount(amountTotal || 0),
              payment_method: 'card',
              status: 'completed',
            })
          }
        }
        break
      }

      case 'invoice.paid': {
        const stripeInvoice = event.data.object as unknown as Record<string, unknown>
        const billingReason = stripeInvoice.billing_reason as string | undefined
        const subscriptionId = stripeInvoice.subscription as string | null

        // Check metadata on the invoice itself or on the subscription
        let invoiceId = (stripeInvoice.metadata as Record<string, string> | undefined)?.invoice_id
        const subscriptionMeta = (stripeInvoice.subscription_details as any)?.metadata as Record<string, string> | undefined
        const clientId = subscriptionMeta?.client_id ||
          (stripeInvoice.metadata as Record<string, string> | undefined)?.client_id

        // For subscription renewals, auto-create an invoice in our system
        if (billingReason === 'subscription_cycle' && subscriptionId && clientId) {
          // Get the recurring_billing record to find client info
          const { data: recurring } = await supabase
            .from('recurring_billing')
            .select('*')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (recurring) {
            // Auto-create invoice for this month's subscription payment
            const { data: newInvoice } = await supabase
              .from('invoices')
              .insert({
                client_id: clientId,
                status: 'paid',
                subtotal: fromStripeAmount((stripeInvoice.amount_paid as number) || 0),
                total: fromStripeAmount((stripeInvoice.amount_paid as number) || 0),
                amount_paid: fromStripeAmount((stripeInvoice.amount_paid as number) || 0),
                amount_due: 0,
                tax_rate: 0,
                tax_amount: 0,
                issue_date: new Date().toISOString(),
                due_date: new Date().toISOString(),
                paid_at: new Date().toISOString(),
                stripe_invoice_id: stripeInvoice.id as string,
                notes: 'Auto-generated from subscription payment',
              })
              .select()
              .single()

            if (newInvoice) {
              invoiceId = newInvoice.id
            }

            // Update next billing date
            const nextDate = new Date()
            nextDate.setMonth(nextDate.getMonth() + 1)
            await supabase
              .from('recurring_billing')
              .update({ next_billing_date: nextDate.toISOString() })
              .eq('id', recurring.id)
          }
        }

        if (invoiceId) {
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

            // Update invoice status if not already paid
            if (invoice.status !== 'paid') {
              await supabase
                .from('invoices')
                .update({
                  status: 'paid',
                  amount_paid: fromStripeAmount((stripeInvoice.amount_paid as number) || 0),
                  paid_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
                .eq('id', invoiceId)
            }

            // Log receipt email
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
        const stripeInvoice = event.data.object as unknown as Record<string, unknown>
        const invoiceId = (stripeInvoice.metadata as Record<string, string> | undefined)?.invoice_id

        if (invoiceId) {
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

        // Also update recurring_billing if this is a subscription payment failure
        const subscriptionId = stripeInvoice.subscription as string | null
        if (subscriptionId) {
          await supabase
            .from('recurring_billing')
            .update({ status: 'paused' })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as Record<string, unknown>
        const subId = subscription.id as string
        const status = subscription.status as string

        let mappedStatus: 'active' | 'paused' | 'cancelled' = 'active'
        if (status === 'canceled' || status === 'unpaid') mappedStatus = 'cancelled'
        else if (status === 'past_due' || status === 'incomplete') mappedStatus = 'paused'

        const currentPeriodEnd = subscription.current_period_end as number | undefined
        const nextBilling = currentPeriodEnd
          ? new Date(currentPeriodEnd * 1000).toISOString()
          : null

        await supabase
          .from('recurring_billing')
          .update({
            status: mappedStatus,
            ...(nextBilling ? { next_billing_date: nextBilling } : {}),
          })
          .eq('stripe_subscription_id', subId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as Record<string, unknown>
        const subId = subscription.id as string

        await supabase
          .from('recurring_billing')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subId)
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
