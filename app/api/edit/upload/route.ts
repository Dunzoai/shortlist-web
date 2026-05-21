import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const BUCKET = 'client-assets';

/**
 * POST /api/edit/upload
 * Uploads a file to Supabase Storage and returns the public URL.
 * Uses the service role key for storage access.
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey);

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const slug = formData.get('slug') as string | null;

    if (!file || !slug) {
      return NextResponse.json({ error: 'file and slug are required' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'bin';
    const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const arrayBuf = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, arrayBuf, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
