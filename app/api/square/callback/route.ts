import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { squareConnectBaseUrl, squareEnvironment, verifyState } from '@/lib/square';

/**
 * Square OAuth callback. Verifies the signed state + nonce cookie, exchanges the
 * code for tokens, grabs the first location, and upserts into payment_config
 * (service role). Redirects back to /studio-admin on the same host — no
 * hardcoded external domain.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const adminUrl = (qs: string) => `${origin}/studio-admin?${qs}`;

  const sp = request.nextUrl.searchParams;
  const code = sp.get('code');
  const state = sp.get('state');
  const oauthError = sp.get('error');

  if (oauthError) {
    return NextResponse.redirect(adminUrl(`square_error=${encodeURIComponent(oauthError)}`));
  }
  if (!code || !state) {
    return NextResponse.redirect(adminUrl('square_error=missing_params'));
  }

  // Anti-forgery: signed state must verify AND its nonce must match our cookie.
  const verified = verifyState(state);
  const cookieNonce = request.cookies.get('square_oauth_nonce')?.value;
  if (!verified || !cookieNonce || verified.nonce !== cookieNonce) {
    return NextResponse.redirect(adminUrl('square_error=invalid_state'));
  }
  const slug = verified.slug;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.redirect(adminUrl('square_error=server_misconfigured'));
  }
  const supabaseAdmin = createClient(url, serviceKey);

  const squareBaseUrl = squareConnectBaseUrl();
  const environment = squareEnvironment();

  try {
    const tokenResponse = await fetch(`${squareBaseUrl}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SQUARE_APPLICATION_ID,
        client_secret: process.env.SQUARE_APPLICATION_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      const msg = tokenData.message || tokenData.error || 'token_exchange_failed';
      return NextResponse.redirect(adminUrl(`square_error=${encodeURIComponent(msg)}`));
    }

    const { access_token, refresh_token, merchant_id, expires_at } = tokenData;
    if (!merchant_id) throw new Error('No merchant ID returned from Square');

    let locationId: string | null = null;
    const locationsResponse = await fetch(`${squareBaseUrl}/v2/locations`, {
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    });
    if (locationsResponse.ok) {
      const locationsData = await locationsResponse.json();
      if (locationsData.locations?.length > 0) locationId = locationsData.locations[0].id;
    }

    const { error: dbError } = await supabaseAdmin
      .from('payment_config')
      .upsert(
        {
          client_slug: slug,
          provider: 'square',
          config: {
            access_token,
            refresh_token,
            merchant_id,
            location_id: locationId,
            environment,
            expires_at: expires_at || null,
          },
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'client_slug' },
      );

    if (dbError) throw dbError;

    const res = NextResponse.redirect(adminUrl('square_connected=true'));
    res.cookies.set('square_oauth_nonce', '', { path: '/', maxAge: 0 });
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown_error';
    return NextResponse.redirect(adminUrl(`square_error=${encodeURIComponent(msg)}`));
  }
}
