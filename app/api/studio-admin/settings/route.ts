import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG } from '@/lib/square';
import { DEFAULT_SETTINGS } from '@/lib/storeSettings';

const COLUMNS = 'tax_rate, shipping_flat_cents, shipping_carrier, free_shipping_threshold_cents';

// Load store settings for the studio admin.
export async function GET(req: NextRequest) {
  if (!isStudioAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  const { data, error } = await db
    .from('sunday_settings')
    .select(COLUMNS)
    .eq('client_slug', SQUARE_CLIENT_SLUG)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data ?? DEFAULT_SETTINGS });
}

// Save store settings (service role, cookie-gated).
export async function PUT(req: NextRequest) {
  if (!isStudioAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const clampInt = (v: unknown) => Math.max(0, Math.round(Number(v) || 0));
  const threshold =
    body.free_shipping_threshold_cents === null || body.free_shipping_threshold_cents === ''
      ? null
      : clampInt(body.free_shipping_threshold_cents);

  const row = {
    client_slug: SQUARE_CLIENT_SLUG,
    tax_rate: Math.max(0, Number(body.tax_rate) || 0),
    shipping_flat_cents: clampInt(body.shipping_flat_cents),
    shipping_carrier: typeof body.shipping_carrier === 'string' ? body.shipping_carrier.trim() || null : null,
    free_shipping_threshold_cents: threshold,
    updated_at: new Date().toISOString(),
  };

  const { error } = await db.from('sunday_settings').upsert(row, { onConflict: 'client_slug' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
