import { NextRequest, NextResponse } from 'next/server';
import { isStudioAdminAuthed, serviceClient } from '@/lib/studioAdmin';

const BUCKET = 'client-assets';

/**
 * Uploads an image to the client-assets bucket via the service role key, then:
 *  - kind=product  → updates the product's image_url, returns { url }
 *  - kind=gallery  → inserts a sunday_gallery row, returns { item }
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

  const ext = file.name.split('.').pop() || 'jpg';
  const arrayBuf = await file.arrayBuffer();

  if (kind === 'product') {
    const productId = formData.get('productId') as string | null;
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    const path = `brandydemo/products/${productId}-${Date.now()}.${ext}`;
    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(path, arrayBuf, { contentType: file.type, upsert: true });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(path);
    const { error: updateError } = await db
      .from('sunday_products')
      .update({ image_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', productId);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ url: urlData.publicUrl });
  }

  if (kind === 'gallery') {
    const clientId = formData.get('clientId') as string | null;
    const sortOrder = Number(formData.get('sortOrder') ?? 0);
    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }
    const id = `g${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const path = `brandydemo/gallery/${id}.${ext}`;
    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(path, arrayBuf, { contentType: file.type, upsert: true });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(path);
    const item = { id, client_id: clientId, image_url: urlData.publicUrl, caption: '', sort_order: sortOrder };
    const { error: insertError } = await db.from('sunday_gallery').insert(item);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ item: { id, image_url: urlData.publicUrl, caption: '' } });
  }

  return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
}
