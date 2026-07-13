import { createHmac } from 'crypto';

/**
 * Square Connect OAuth helpers.
 *
 * Pilot: keyed to a single web client (brandydemo). Everything ties to the web
 * client via client_slug — there is no business_id in this project.
 */

export const SQUARE_CLIENT_SLUG = 'brandydemo';

export const SQUARE_SCOPES =
  'PAYMENTS_WRITE PAYMENTS_READ ORDERS_WRITE ORDERS_READ MERCHANT_PROFILE_READ ITEMS_READ';

// Square API version sent as the `Square-Version` header on REST calls.
export const SQUARE_VERSION = '2024-10-17';

/** Canonical public site URL used for OAuth/checkout redirects. */
export const SUNDAY_SITE_URL = 'https://www.sundaynailpress.com';

export function squareEnvironment(): 'production' | 'sandbox' {
  return process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';
}

/** Base URL for Square Connect API + OAuth, per environment. */
export function squareConnectBaseUrl(): string {
  return squareEnvironment() === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
}

// ─── Signed OAuth state ──────────────────────────────────────────────
// The reference passed `state = businessId` in the clear, which is forgeable:
// anyone could hit the callback with an arbitrary id. Here the state is an
// HMAC-signed payload (slug + nonce + expiry). The callback verifies the
// signature and expiry, and cross-checks the nonce against an httpOnly cookie.

function stateSecret(): string {
  // Dedicated secret preferred; fall back to the Square app secret if unset.
  return process.env.SQUARE_OAUTH_STATE_SECRET || process.env.SQUARE_APPLICATION_SECRET || '';
}

export function signState(slug: string, nonce: string, ttlMs = 10 * 60 * 1000): string {
  const payload = { slug, nonce, exp: Date.now() + ttlMs };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', stateSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyState(state: string): { slug: string; nonce: string } | null {
  const [body, sig] = state.split('.');
  if (!body || !sig) return null;

  const expected = createHmac('sha256', stateSecret()).update(body).digest('base64url');
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return null;
    if (!payload.slug || !payload.nonce) return null;
    return { slug: payload.slug, nonce: payload.nonce };
  } catch {
    return null;
  }
}
