import { NextRequest, NextResponse } from 'next/server';
import { serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG } from '@/lib/square';

/**
 * Public newsletter signup. Stores one row per email (duplicates are ignored by
 * the unique constraint). Writes via the service role — there are no public
 * write policies on sunday_subscribers.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  const { error } = await db
    .from('sunday_subscribers')
    .upsert(
      { client_slug: SQUARE_CLIENT_SLUG, email },
      { onConflict: 'client_slug,email', ignoreDuplicates: true },
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
