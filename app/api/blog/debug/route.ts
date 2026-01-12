import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Debug endpoint to check blog post data
 * GET /api/blog/debug?slug=first-time-homebuyer-guide
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug') || 'first-time-homebuyer-guide';

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, title_es, content, content_es')
      .eq('slug', slug)
      .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      slug: data.slug,
      title: data.title,
      title_es: data.title_es,
      has_title_es: !!data.title_es,
      has_content: !!data.content,
      has_content_es: !!data.content_es,
      content_preview: data.content?.substring(0, 300),
      content_es_preview: data.content_es?.substring(0, 300),
      content_has_html_tags: data.content?.includes('<'),
      content_es_has_html_tags: data.content_es?.includes('<'),
      content_length: data.content?.length,
      content_es_length: data.content_es?.length,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
