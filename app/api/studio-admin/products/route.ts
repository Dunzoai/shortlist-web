import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';

/**
 * Studio Admin product writes. Every method verifies the studio_admin_auth
 * cookie and then uses the service role key (anon writes are blocked by RLS).
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

// Create a product
export async function POST(req: NextRequest) {
  const db = guard(req);
  if (db instanceof NextResponse) return db;

  const { product } = await req.json();
  if (!product?.client_id) {
    return NextResponse.json({ error: 'product with client_id is required' }, { status: 400 });
  }

  const { data, error } = await db.from('sunday_products').insert(product).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: data });
}

// Update a product
export async function PATCH(req: NextRequest) {
  const db = guard(req);
  if (db instanceof NextResponse) return db;

  const { id, fields } = await req.json();
  if (!id || !fields) {
    return NextResponse.json({ error: 'id and fields are required' }, { status: 400 });
  }

  const { error } = await db
    .from('sunday_products')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

// Reorder products — batch update sort_order from an ordered list
export async function PUT(req: NextRequest) {
  const db = guard(req);
  if (db instanceof NextResponse) return db;

  const { order } = await req.json();
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: 'order array is required' }, { status: 400 });
  }

  const results = await Promise.all(
    order.map(({ id, sort_order }) =>
      db.from('sunday_products').update({ sort_order }).eq('id', id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

// Delete a product
export async function DELETE(req: NextRequest) {
  const db = guard(req);
  if (db instanceof NextResponse) return db;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const { error } = await db.from('sunday_products').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
