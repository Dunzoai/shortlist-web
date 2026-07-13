import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG, SQUARE_VERSION, squareConnectBaseUrl } from '@/lib/square';
import { getValidSquareToken } from '@/lib/squareRefresh';

/**
 * Issues a full refund for an order through Square's Refunds API, so Brandy can
 * refund from the studio admin without opening Square. Cookie-gated + service
 * role. Refunds initiated directly in Square are handled by the webhook instead.
 */
export async function POST(req: NextRequest) {
  if (!isStudioAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const { data: order, error } = await db
    .from('orders')
    .select('id, status, total, square_order_id, square_payment_id')
    .eq('id', id)
    .eq('client_slug', SQUARE_CLIENT_SLUG)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.status === 'refunded') return NextResponse.json({ success: true, alreadyRefunded: true });
  if (!order.total || order.total <= 0) {
    return NextResponse.json({ error: 'Nothing to refund' }, { status: 400 });
  }

  let token = await getValidSquareToken(db, SQUARE_CLIENT_SLUG);
  if (!token) return NextResponse.json({ error: 'Square is not connected' }, { status: 400 });

  const base = squareConnectBaseUrl();
  const authedGet = (path: string, t: string) =>
    fetch(`${base}${path}`, { headers: { Authorization: `Bearer ${t}`, 'Square-Version': SQUARE_VERSION } });

  // Resolve the payment id (stored, or from the Square order's tender).
  let paymentId = order.square_payment_id as string | null;
  if (!paymentId && order.square_order_id) {
    let resp = await authedGet(`/v2/orders/${order.square_order_id}`, token);
    if (resp.status === 401) {
      const refreshed = await getValidSquareToken(db, SQUARE_CLIENT_SLUG, true);
      if (refreshed) { token = refreshed; resp = await authedGet(`/v2/orders/${order.square_order_id}`, token); }
    }
    if (resp.ok) {
      const data = await resp.json();
      paymentId = data?.order?.tenders?.[0]?.id ?? null;
    }
  }
  if (!paymentId) {
    return NextResponse.json({ error: 'Could not find the Square payment for this order' }, { status: 400 });
  }

  const payload = {
    idempotency_key: randomUUID(),
    amount_money: { amount: order.total, currency: 'USD' },
    payment_id: paymentId,
    reason: 'Refund issued from Sunday studio admin',
  };
  const callRefund = (t: string) =>
    fetch(`${base}/v2/refunds`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json', 'Square-Version': SQUARE_VERSION },
      body: JSON.stringify(payload),
    });

  let resp = await callRefund(token);
  if (resp.status === 401) {
    const refreshed = await getValidSquareToken(db, SQUARE_CLIENT_SLUG, true);
    if (refreshed) { token = refreshed; resp = await callRefund(token); }
  }

  const data = await resp.json();
  if (!resp.ok || !data?.refund) {
    const msg = data?.errors?.[0]?.detail || data?.message || 'refund_failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // Mark refunded now; the webhook's refund.updated event is idempotent.
  await db.from('orders').update({ status: 'refunded' }).eq('id', order.id);
  return NextResponse.json({ success: true });
}
