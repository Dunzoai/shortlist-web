import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG } from '@/lib/square';

/**
 * GET  → how many paid orders have arrived since the admin last opened Orders.
 * POST → mark Orders as seen (resets the badge to 0). Both cookie-gated.
 */

export async function GET(req: NextRequest) {
  if (!isStudioAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  const { data: settings } = await db
    .from('sunday_settings')
    .select('orders_seen_at')
    .eq('client_slug', SQUARE_CLIENT_SLUG)
    .maybeSingle();
  const seenAt = settings?.orders_seen_at ?? '1970-01-01T00:00:00Z';

  const { count } = await db
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('client_slug', SQUARE_CLIENT_SLUG)
    .eq('status', 'paid')
    .gt('paid_at', seenAt);

  return NextResponse.json({ count: count ?? 0 });
}

export async function POST(req: NextRequest) {
  if (!isStudioAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  const { error } = await db
    .from('sunday_settings')
    .update({ orders_seen_at: new Date().toISOString() })
    .eq('client_slug', SQUARE_CLIENT_SLUG);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
