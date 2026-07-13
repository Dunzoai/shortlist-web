/**
 * Store settings (tax + shipping) shared between the shopper cart, the checkout
 * route, and the studio-admin settings drawer. computeTotals is the single
 * source of truth for how shipping and tax are applied.
 */

export type StoreSettings = {
  tax_rate: number; // percentage, e.g. 7.5
  shipping_flat_cents: number;
  shipping_carrier: string | null;
  free_shipping_threshold_cents: number | null;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  tax_rate: 0,
  shipping_flat_cents: 0,
  shipping_carrier: null,
  free_shipping_threshold_cents: null,
};

export type CartTotals = { subtotal: number; shipping: number; tax: number; total: number };

/** All amounts in integer cents. Tax applies to the product subtotal only (not shipping). */
export function computeTotals(subtotalCents: number, s: StoreSettings): CartTotals {
  const threshold = s.free_shipping_threshold_cents;
  const qualifiesFree = threshold != null && threshold > 0 && subtotalCents >= threshold;
  const shipping = qualifiesFree ? 0 : Math.max(0, Math.round(s.shipping_flat_cents || 0));
  const tax = Math.max(0, Math.round((subtotalCents * (Number(s.tax_rate) || 0)) / 100));
  return { subtotal: subtotalCents, shipping, tax, total: subtotalCents + shipping + tax };
}
