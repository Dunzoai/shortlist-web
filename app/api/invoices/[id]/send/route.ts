import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, toStripeAmount } from '@/lib/stripe'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invoiceId } = await params

  try {
    const supabase = await createClient()

    // Get invoice with client and items
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, client:clients(*)')
      .eq('id', invoiceId)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.status !== 'draft' && invoice.status !== 'sent') {
      return NextResponse.json({ error: 'Invoice cannot be sent' }, { status: 400 })
    }

    const client = invoice.client as { id: string; name: string; email: string | null }

    if (!client?.email) {
      return NextResponse.json({ error: 'Client has no email address' }, { status: 400 })
    }

    // Get or create Stripe customer
    let stripeCustomerId: string

    // Check if client already has a Stripe customer ID
    const { data: billing } = await supabase
      .from('client_billing')
      .select('stripe_customer_id')
      .eq('client_id', client.id)
      .single()

    if (billing?.stripe_customer_id) {
      stripeCustomerId = billing.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        name: client.name,
        email: client.email,
        metadata: {
          client_id: client.id,
        },
      })
      stripeCustomerId = customer.id

      // Save to client_billing
      await supabase.from('client_billing').upsert({
        client_id: client.id,
        stripe_customer_id: stripeCustomerId,
      })
    }

    // Get invoice items
    const { data: items } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('sort_order')

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Invoice has no line items' }, { status: 400 })
    }

    // Create Stripe invoice
    const stripeInvoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      collection_method: 'send_invoice',
      days_until_due: Math.max(1, Math.ceil((new Date(invoice.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      metadata: {
        invoice_id: invoiceId,
        client_id: client.id,
      },
    })

    // Add line items to Stripe invoice
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        invoice: stripeInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_amount: toStripeAmount(item.unit_price),
      })
    }

    // Finalize and send the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id)
    await stripe.invoices.sendInvoice(stripeInvoice.id)

    // Update our invoice with Stripe details
    await supabase
      .from('invoices')
      .update({
        status: 'sent',
        stripe_invoice_id: stripeInvoice.id,
        stripe_hosted_invoice_url: finalizedInvoice.hosted_invoice_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)

    // Log the email
    await supabase.from('billing_emails').insert({
      client_id: client.id,
      invoice_id: invoiceId,
      email_type: 'invoice',
      recipient_email: client.email,
      subject: `Invoice ${invoice.invoice_number} from Shortlist`,
      status: 'sent',
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      stripe_invoice_id: stripeInvoice.id,
      hosted_invoice_url: finalizedInvoice.hosted_invoice_url,
    })
  } catch (error) {
    console.error('Error sending invoice:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send invoice' },
      { status: 500 }
    )
  }
}
