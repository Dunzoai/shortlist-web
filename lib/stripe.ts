import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Helper to format amount for Stripe (converts dollars to cents)
export function toStripeAmount(dollars: number): number {
  return Math.round(dollars * 100)
}

// Helper to format amount from Stripe (converts cents to dollars)
export function fromStripeAmount(cents: number): number {
  return cents / 100
}
