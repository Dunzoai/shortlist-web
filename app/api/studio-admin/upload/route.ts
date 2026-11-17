import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';

const BUCKET = 'client-assets';

/**
 * Uploads an image to the client-assets bucket via the service role key, then:
 *  - kind=product  → updates the product's image_url, returns { url }
 *  - kind=gallery  → inserts a sunday_gallery row (or, with galleryId, swaps
 *                    that row's image), returns { item }
 *
 * Optional photo-editor fields (non-destructive editing):
 *  - original     the untouched photo (new uploads); stored as <name>-original.jpg
 *  - originalUrl  an already-stored original being re-edited
 *  - edit         JSON crop/adjust settings
 * When either original field is present, a `<name>.edit.json` sidecar is written
 * next to the rendered image so the editor can reopen from the original.
 * Auth required.
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

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const kind = formData.get('kind') as string | null;

  if (!file || !kind) {
    return NextResponse.json({ error: 'file and kind are required' }, { status: 400 });
  }

  const ext = extFor(file);
  let base: string; // storage path without extension

  if (kind === 'product') {
    const productId = formData.get('productId') as string | null;
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    base = `brandydemo/products/${productId}-${Date.now()}`;
    const url = await put(db, `${base}.${ext}`, file);
    if (url instanceof NextResponse) return url;
    const sidecarError = await writeEditSidecar(db, base, formData);
    if (sidecarError) return sidecarError;

    const { error: updateError } = await db
      .from('sunday_products')
      .update({ image_url: url, updated_at: new Date().toISOString() })
      .eq('id', productId);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ url });
  }

  if (kind === 'gallery') {
    const galleryId = formData.get('galleryId') as string | null;

    // Replace the photo on an existing gallery item (edit flow).
    if (galleryId) {
      base = `brandydemo/gallery/${galleryId}-${Date.now()}`;
      const url = await put(db, `${base}.${ext}`, file);
      if (url instanceof NextResponse) return url;
      const sidecarError = await writeEditSidecar(db, base, formData);
      if (sidecarError) return sidecarError;
      const { data, error } = await db
        .from('sunday_gallery')
        .update({ image_url: url })
        .eq('id', galleryId)
        .select('id, image_url, caption')
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ item: data });
    }

    const clientId = formData.get('clientId') as string | null;
    const sortOrder = Number(formData.get('sortOrder') ?? 0);
    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }
    const id = `g${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    base = `brandydemo/gallery/${id}`;
    const url = await put(db, `${base}.${ext}`, file);
    if (url instanceof NextResponse) return url;
    const sidecarError = await writeEditSidecar(db, base, formData);
    if (sidecarError) return sidecarError;
    const item = { id, client_id: clientId, image_url: url, caption: '', sort_order: sortOrder };
    const { error: insertError } = await db.from('sunday_gallery').insert(item);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ item: { id, image_url: url, caption: '' } });
  }

  return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
}

function extFor(file: File): string {
  if (file.type === 'image/jpeg') return 'jpg';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  const fromName = file.name.split('.').pop();
  return fromName && fromName !== file.name ? fromName.toLowerCase() : 'jpg';
}

/** Upload a blob and return its public URL, or an error response. */
async function put(
  db: SupabaseClient,
  path: string,
  blob: Blob,
  contentType = blob.type || 'image/jpeg'
): Promise<string | NextResponse> {
  const { error } = await db.storage
    .from(BUCKET)
    .upload(path, await blob.arrayBuffer(), { contentType, upsert: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Store the original (if new) + edit settings next to the rendered image. */
async function writeEditSidecar(
  db: SupabaseClient,
  base: string,
  formData: FormData
): Promise<NextResponse | null> {
  const original = formData.get('original') as File | null;
  let originalUrl = formData.get('originalUrl') as string | null;
  const editRaw = formData.get('edit') as string | null;
  if (!original && !originalUrl) return null;

  if (original) {
    const url = await put(db, `${base}-original.${extFor(original)}`, original);
    if (url instanceof NextResponse) return url;
    originalUrl = url;
  }

  let edit: unknown = null;
  try {
    edit = editRaw ? JSON.parse(editRaw) : null;
  } catch {
    edit = null;
  }

  const sidecar = new Blob([JSON.stringify({ v: 1, originalUrl, edit })], { type: 'application/json' });
  const res = await put(db, `${base}.edit.json`, sidecar, 'application/json');
  return res instanceof NextResponse ? res : null;
}
