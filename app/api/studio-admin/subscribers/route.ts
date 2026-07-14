import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';
import { SQUARE_CLIENT_SLUG } from '@/lib/square';

/**
 * Lists newsletter subscribers for the studio admin (newest first). Cookie-gated
 * + service role. Used to show the count and build the CSV export.
 */
export async function GET(req: NextRequest) {
  if (!isStudioAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

  const { data, error } = await db
    .from('sunday_subscribers')
    .select('email, created_at')
    .eq('client_slug', SQUARE_CLIENT_SLUG)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscribers: data ?? [] });
}
