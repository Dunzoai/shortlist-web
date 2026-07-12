import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';

/**
 * Reset a client's products to the starter seeds: delete all rows for the
 * client, then insert the provided seed rows. Auth + service role required.
 */
export async function POST(req: NextRequest) {
  if (!isStudioAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) {
    return NextResponse.json(
      { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    );
  }

  const { clientId, seeds } = await req.json();
  if (!clientId || !Array.isArray(seeds)) {
    return NextResponse.json({ error: 'clientId and seeds are required' }, { status: 400 });
  }

  const { error: delError } = await db.from('sunday_products').delete().eq('client_id', clientId);
  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  const { data, error } = await db.from('sunday_products').insert(seeds).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: data });
}
