import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG, SQUARE_VERSION, squareConnectBaseUrl } from '@/lib/square';
import { getSquareConfig, getValidSquareToken } from '@/lib/squareRefresh';

/**
 * Square webhook — this is where payment confirmation happens (never the
 * checkout route). Verifies the HMAC signature, confirms the event belongs to
 * Brandy's merchant, then on a completed payment marks the matching order paid
 * and captures the shipping address Square collected.
 */

function verifySignature(notificationUrl: string, rawBody: string, signature: string | null): boolean {
  const key = process.env.SUNDAY_WEBHOOK_SIGNATURE_KEY;
  if (!key || !signature) return false;
  const expected = createHmac('sha256', key).update(notificationUrl + rawBody).digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const host = req.headers.get('host');
  const notificationUrl = `https://${host}/api/square/webhook`;
  const signature = req.headers.get('x-square-hmacsha256-signature');

  if (!verifySignature(notificationUrl, raw, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Bad payload' }, { status: 400 });
  }

  // Only act on Brandy's merchant.
  const config = await getSquareConfig(db, SQUARE_CLIENT_SLUG);
  if (!config?.merchant_id || event.merchant_id !== config.merchant_id) {
    return NextResponse.json({ received: true }); // ignore, but ack
  }

  // We care about completed payments.
  if (event.type === 'payment.updated' || event.type === 'payment.created') {
    const payment = event.data?.object?.payment;
    const squareOrderId = payment?.order_id;
    if (payment?.status === 'COMPLETED' && squareOrderId) {
      const { data: order } = await db
        .from('orders')
        .select('id, status')
        .eq('square_order_id', squareOrderId)
        .maybeSingle();

      if (order && order.status !== 'paid' && order.status !== 'shipped') {
        // Pull the shipping address Square collected off the order's fulfillment.
        let shipping: any = null;
        let name: string | null = null;
        let email: string | null = null;
        const token = await getValidSquareToken(db, SQUARE_CLIENT_SLUG);
        if (token) {
          const resp = await fetch(`${squareConnectBaseUrl()}/v2/orders/${squareOrderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Square-Version': SQUARE_VERSION,
            },
          });
          if (resp.ok) {
            const data = await resp.json();
            const recipient = data?.order?.fulfillments?.[0]?.shipment_details?.recipient;
            if (recipient) {
              shipping = recipient.address ?? null;
              name = recipient.display_name ?? null;
              email = recipient.email_address ?? null;
            }
          }
        }

        const update: Record<string, unknown> = {
          status: 'paid',
          paid_at: new Date().toISOString(),
        };
        // Authoritative total actually charged by Square.
        const paidAmount = payment?.amount_money?.amount;
        if (typeof paidAmount === 'number') update.total = paidAmount;
        if (shipping) update.shipping_address = shipping;
        if (name) update.customer_name = name;
        if (email) update.customer_email = email;

        await db.from('orders').update(update).eq('id', order.id);
      }
    }
  }

  // Refunds → mark the order refunded.
  if (event.type === 'refund.updated' || event.type === 'refund.created') {
    const refund = event.data?.object?.refund;
    const squareOrderId = refund?.order_id;
    if ((refund?.status === 'COMPLETED' || refund?.status === 'PENDING') && squareOrderId) {
      await db
        .from('orders')
        .update({ status: 'refunded' })
        .eq('square_order_id', squareOrderId);
    }
  }

  return NextResponse.json({ received: true });
}
