import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { isStudioAdminAuthed } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG, SQUARE_SCOPES, signState, squareConnectBaseUrl } from '@/lib/square';

/**
 * Kicks off the Square Connect OAuth flow. Gated by the studio_admin_auth
 * cookie (no Supabase Auth). Issues an HMAC-signed state plus a matching
 * httpOnly nonce cookie so the callback can prove the request originated here.
 */
export async function GET(request: NextRequest) {
  if (!isStudioAdminAuthed(request)) {
    return NextResponse.redirect(new URL('/studio-admin/login', request.url));
  }

  const clientId = process.env.SQUARE_APPLICATION_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL('/studio-admin?square_error=not_configured', request.url));
  }

  const nonce = randomUUID();
  const state = signState(SQUARE_CLIENT_SLUG, nonce);

  const params = new URLSearchParams({
    client_id: clientId,
    scope: SQUARE_SCOPES,
    session: 'false',
    state,
  });

  const res = NextResponse.redirect(`${squareConnectBaseUrl()}/oauth2/authorize?${params}`);
  res.cookies.set('square_oauth_nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
