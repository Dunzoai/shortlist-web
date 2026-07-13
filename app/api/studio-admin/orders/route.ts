import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG } from '@/lib/square';

/**
 * Lists shop orders for the studio admin (newest first). Gated by the
 * studio_admin_auth cookie; reads the service-role-only orders table.
 */
export async function GET(req: NextRequest) {
  if (!isStudioAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = serviceClient();
  if (!db) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const { data, error } = await db
    .from('orders')
    .select('id, order_number, items, subtotal, total, customer_name, customer_email, shipping_address, status, created_at, paid_at')
    .eq('client_slug', SQUARE_CLIENT_SLUG)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
