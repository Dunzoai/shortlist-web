import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';

/**
 * Studio Admin gallery writes (caption update + delete). Gallery image uploads
 * go through /api/studio-admin/upload. Auth + service role required.
 */

function guard(req: NextRequest) {
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
  return db;
}

// Update a gallery caption
export async function PATCH(req: NextRequest) {
  const db = guard(req);
  if (db instanceof NextResponse) return db;

  const { id, caption } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const { error } = await db.from('sunday_gallery').update({ caption }).eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

// Reorder gallery items — batch update sort_order from an ordered list
export async function PUT(req: NextRequest) {
  const db = guard(req);
  if (db instanceof NextResponse) return db;

  const { order } = await req.json();
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: 'order array is required' }, { status: 400 });
  }

  const results = await Promise.all(
    order.map(({ id, sort_order }) =>
      db.from('sunday_gallery').update({ sort_order }).eq('id', id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

// Delete a gallery item
export async function DELETE(req: NextRequest) {
  const db = guard(req);
  if (db instanceof NextResponse) return db;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const { error } = await db.from('sunday_gallery').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
