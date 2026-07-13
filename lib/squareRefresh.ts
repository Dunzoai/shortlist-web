import { SupabaseClient } from '@supabase/supabase-js';
import { squareConnectBaseUrl, squareEnvironment } from './square';

/**
 * Square access tokens expire ~30 days after issue. This helper returns a valid
 * access token for a client, refreshing it via the stored refresh_token when it
 * is missing or close to expiry, and persisting the new tokens back into
 * payment_config. Requires a service-role Supabase client.
 *
 * (Wired for future cart/checkout use — not called by the connect flow itself.)
 */

export type SquareConfig = {
  access_token: string;
  refresh_token: string;
  merchant_id: string;
  location_id: string | null;
  environment: string;
  expires_at?: string | null;
};

// Refresh when the token expires within this window.
const REFRESH_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Loads the stored Square config (access token, location, merchant, env) or null. */
export async function getSquareConfig(
  db: SupabaseClient,
  clientSlug: string,
): Promise<SquareConfig | null> {
  const { data, error } = await db
    .from('payment_config')
    .select('config, is_active')
    .eq('client_slug', clientSlug)
    .eq('provider', 'square')
    .maybeSingle();

  if (error || !data || data.is_active !== true) return null;
  return (data.config as SquareConfig) ?? null;
}

/**
 * Returns a valid access token, refreshing when near expiry — or unconditionally
 * when `force` is true (used for the 401 → refresh → retry safety net).
 */
export async function getValidSquareToken(
  db: SupabaseClient,
  clientSlug: string,
  force = false,
): Promise<string | null> {
  const config = await getSquareConfig(db, clientSlug);
  if (!config?.access_token) return null;

  const expiresAt = config.expires_at ? new Date(config.expires_at).getTime() : 0;
  const needsRefresh = force || !expiresAt || expiresAt - Date.now() < REFRESH_THRESHOLD_MS;
  if (!needsRefresh || !config.refresh_token) return config.access_token;

  const resp = await fetch(`${squareConnectBaseUrl()}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SQUARE_APPLICATION_ID,
      client_secret: process.env.SQUARE_APPLICATION_SECRET,
      grant_type: 'refresh_token',
      refresh_token: config.refresh_token,
    }),
  });
  const tokenData = await resp.json();

  // If refresh fails, fall back to the existing token and let the caller surface errors.
  if (!resp.ok || !tokenData.access_token) return config.access_token;

  const newConfig: SquareConfig = {
    ...config,
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token || config.refresh_token,
    expires_at: tokenData.expires_at || config.expires_at || null,
    environment: squareEnvironment(),
  };

  await db
    .from('payment_config')
    .update({ config: newConfig, updated_at: new Date().toISOString() })
    .eq('client_slug', clientSlug)
    .eq('provider', 'square');

  return newConfig.access_token;
}
