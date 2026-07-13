import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG, SQUARE_VERSION, SUNDAY_SITE_URL, squareConnectBaseUrl } from '@/lib/square';
import { getSquareConfig, getValidSquareToken } from '@/lib/squareRefresh';
import { computeTotals, DEFAULT_SETTINGS, type StoreSettings } from '@/lib/storeSettings';

/**
 * Creates a Square Payment Link for a Sunday shop order.
 *
 * Security: the client sends only { product_id, quantity }. Prices, tax, and
 * shipping are all computed server-side (products from sunday_products, tax +
 * shipping from sunday_settings) — client-supplied amounts are never trusted.
 * Payment confirmation happens in the webhook, not here.
 */

type CartItem = { product_id: string; quantity: number };

const TAX_UID = 'sunday-sales-tax';

export async function POST(req: NextRequest) {
  const db = serviceClient();
  if (!db) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];
  const customerName: string | null = body?.customer_name?.trim() || null;
  const customerEmail: string | null = body?.customer_email?.trim() || null;

  const cleaned = items
    .filter((i) => i && typeof i.product_id === 'string' && Number(i.quantity) > 0)
    .map((i) => ({ product_id: i.product_id, quantity: Math.floor(Number(i.quantity)) }));

  if (cleaned.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  // Resolve client + real prices from the DB.
  const { data: client } = await db
    .from('web_clients')
    .select('id')
    .eq('slug', SQUARE_CLIENT_SLUG)
    .single();
  if (!client) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 });
  }

  const ids = cleaned.map((i) => i.product_id);
  const { data: products, error: prodError } = await db
    .from('sunday_products')
    .select('id, name, price')
    .eq('client_id', client.id)
    .in('id', ids);
  if (prodError) {
    return NextResponse.json({ error: prodError.message }, { status: 500 });
  }
  const priceById = new Map((products ?? []).map((p) => [p.id, p]));

  // Store settings (tax + shipping).
  const { data: settingsRow } = await db
    .from('sunday_settings')
    .select('tax_rate, shipping_flat_cents, shipping_carrier, free_shipping_threshold_cents')
    .eq('client_slug', SQUARE_CLIENT_SLUG)
    .maybeSingle();
  const settings: StoreSettings = settingsRow ?? DEFAULT_SETTINGS;
  const taxRate = Number(settings.tax_rate) || 0;

  // Build product line items (server-priced).
  const lineItems: Record<string, unknown>[] = [];
  const snapshot: { product_id: string; name: string; quantity: number; price_cents: number }[] = [];
  let subtotal = 0;

  cleaned.forEach((item, i) => {
    const product = priceById.get(item.product_id);
    if (!product) return;
    if (product.price == null) return;
    const priceCents = Math.round(Number(product.price) * 100);
    subtotal += priceCents * item.quantity;
    lineItems.push({
      uid: `item-${i}`,
      name: product.name,
      quantity: String(item.quantity),
      base_price_money: { amount: priceCents, currency: 'USD' },
      ...(taxRate > 0 ? { applied_taxes: [{ tax_uid: TAX_UID }] } : {}),
    });
    snapshot.push({ product_id: product.id, name: product.name, quantity: item.quantity, price_cents: priceCents });
  });

  if (snapshot.length === 0) {
    return NextResponse.json({ error: 'No valid, priced items in cart' }, { status: 400 });
  }

  const totals = computeTotals(subtotal, settings);

  // Shipping as its own (untaxed) line item.
  if (totals.shipping > 0) {
    const label = settings.shipping_carrier ? `Shipping — ${settings.shipping_carrier}` : 'Shipping';
    lineItems.push({
      name: label,
      quantity: '1',
      base_price_money: { amount: totals.shipping, currency: 'USD' },
    });
  }

  const orderNumber = `SUN-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;

  // 1) Create the order row first (pending).
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      client_slug: SQUARE_CLIENT_SLUG,
      order_number: orderNumber,
      items: snapshot,
      subtotal,
      shipping_cents: totals.shipping,
      tax_cents: totals.tax,
      total: totals.total,
      customer_name: customerName,
      customer_email: customerEmail,
      status: 'pending',
    })
    .select('id')
    .single();
  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message || 'Could not create order' }, { status: 500 });
  }

  // 2) Square credentials.
  const config = await getSquareConfig(db, SQUARE_CLIENT_SLUG);
  let token = await getValidSquareToken(db, SQUARE_CLIENT_SLUG);
  if (!config?.location_id || !token) {
    await db.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: 'Square is not connected' }, { status: 400 });
  }

  const payload = {
    idempotency_key: randomUUID(),
    order: {
      location_id: config.location_id,
      line_items: lineItems,
      ...(taxRate > 0
        ? { taxes: [{ uid: TAX_UID, name: 'Sales Tax', percentage: String(taxRate), scope: 'LINE_ITEM' }] }
        : {}),
    },
    checkout_options: {
      ask_for_shipping_address: true,
      redirect_url: `${SUNDAY_SITE_URL}/?order_success=${orderNumber}`,
    },
    ...(customerEmail ? { pre_populated_data: { buyer_email: customerEmail } } : {}),
  };

  const callSquare = (accessToken: string) =>
    fetch(`${squareConnectBaseUrl()}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': SQUARE_VERSION,
      },
      body: JSON.stringify(payload),
    });

  try {
    // 3) Create the payment link — with a 401 → refresh → retry safety net.
    let resp = await callSquare(token);
    if (resp.status === 401) {
      const refreshed = await getValidSquareToken(db, SQUARE_CLIENT_SLUG, true);
      if (refreshed) {
        token = refreshed;
        resp = await callSquare(token);
      }
    }

    const data = await resp.json();
    const link = data?.payment_link;
    if (!resp.ok || !link?.url) {
      const msg = data?.errors?.[0]?.detail || data?.message || 'payment_link_failed';
      throw new Error(msg);
    }

    // 4) Persist Square identifiers on the order.
    await db
      .from('orders')
      .update({ square_order_id: link.order_id ?? null, checkout_url: link.url })
      .eq('id', order.id);

    return NextResponse.json({ checkout_url: link.url, order_id: order.id });
  } catch (err) {
    // Roll back the pending order if Square failed.
    await db.from('orders').delete().eq('id', order.id);
    const msg = err instanceof Error ? err.message : 'unknown_error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
