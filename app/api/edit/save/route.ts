import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/edit/save
 * Saves the content JSON to a web_clients row.
 * Uses the service role key (server-side only) to bypass RLS.
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
    const { slug, content } = await req.json();

    if (!slug || !content) {
      return NextResponse.json({ error: 'slug and content are required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('web_clients')
      .update({ content })
      .eq('slug', slug);

    if (error) {
      console.error('Save error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
