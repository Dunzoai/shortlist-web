import Stripe from 'stripe'

// Singleton pattern with lazy initialization
// Standard approach for serverless - avoids build-time env var access
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

// Helper to format amount for Stripe (converts dollars to cents)
export function toStripeAmount(dollars: number): number {
  return Math.round(dollars * 100)
}

// Helper to format amount from Stripe (converts cents to dollars)
export function fromStripeAmount(cents: number): number {
  return cents / 100
}
