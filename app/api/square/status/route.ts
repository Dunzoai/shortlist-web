import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG } from '@/lib/square';

/**
 * Returns the Square connection status for the pilot client. Gated by the
 * studio_admin_auth cookie; reads payment_config via the service role.
 */
export async function GET(request: NextRequest) {
  if (!isStudioAdminAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = serviceClient();
  if (!db) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const { data, error } = await db
    .from('payment_config')
    .select('config, is_active, updated_at')
    .eq('client_slug', SQUARE_CLIENT_SLUG)
    .eq('provider', 'square')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const config = data?.config as
    | { merchant_id?: string; location_id?: string | null; environment?: string }
    | undefined;
  const connected = Boolean(data && config?.merchant_id && data.is_active === true);

  return NextResponse.json({
    connected,
    merchant_id: connected ? config?.merchant_id ?? null : null,
    location_id: connected ? config?.location_id ?? null : null,
    environment: connected ? config?.environment ?? null : null,
    updated_at: data?.updated_at ?? null,
  });
}
