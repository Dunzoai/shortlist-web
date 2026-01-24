import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return _stripe
}

// Keep for backwards compatibility but use lazy getter
export const stripe = {
  get customers() { return getStripe().customers },
  get invoices() { return getStripe().invoices },
  get invoiceItems() { return getStripe().invoiceItems },
  get webhooks() { return getStripe().webhooks },
}

// Helper to format amount for Stripe (converts dollars to cents)
export function toStripeAmount(dollars: number): number {
  return Math.round(dollars * 100)
}

// Helper to format amount from Stripe (converts cents to dollars)
export function fromStripeAmount(cents: number): number {
  return cents / 100
}
