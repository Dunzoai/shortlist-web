import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { translateBlogPost, detectLanguage } from '@/lib/translate';
import { formatBlogContent } from '@/lib/formatBlogContent';

/**
 * One-time migration endpoint to translate existing blog posts
 * GET /api/blog/translate-all?secret=dani2026
 */
export async function GET(request: NextRequest) {
  try {
    // Check for secret parameter
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');

    if (secret !== 'dani2026') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all blog posts where Spanish translation is missing
    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, excerpt, content, title_es, excerpt_es, content_es')
      .eq('client_id', 'danidiaz');

    if (fetchError) {
      console.error('Error fetching posts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({
        message: 'No posts found',
        translated: 0,
        formatted: 0,
      });
    }

    const results = {
      total: posts.length,
      translated: 0,
      formatted: 0,
      errors: [] as string[],
      details: [] as any[],
    };

    // Process each post
    for (const post of posts) {
      try {
        let needsUpdate = false;
        let updatedData: any = {};

        // Format English content if it exists
        if (post.content) {
          const formattedContent = await formatBlogContent(post.content);
          updatedData.content = formattedContent;
          needsUpdate = true;
          results.formatted++;
        }

        // Translate to Spanish if missing
        if (post.content && (!post.title_es || !post.excerpt_es || !post.content_es)) {
          const sourceLanguage = await detectLanguage(updatedData.content || post.content);

          if (sourceLanguage === 'en') {
            const translated = await translateBlogPost(
              {
                title: post.title,
                excerpt: post.excerpt,
                content: updatedData.content || post.content,
              },
              'en'
            );

            updatedData.title_es = post.title_es || translated.title;
            updatedData.excerpt_es = post.excerpt_es || translated.excerpt;
            updatedData.content_es = post.content_es || translated.content;

            needsUpdate = true;
            results.translated++;
          }
        }

        // Update the post if needed
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update(updatedData)
            .eq('id', post.id);

          if (updateError) {
            console.error(`Error updating post ${post.id}:`, updateError);
            results.errors.push(`Failed to update post ${post.id}: ${updateError.message}`);
          } else {
            results.details.push({
              id: post.id,
              title: post.title,
              translated: !post.content_es && updatedData.content_es,
              formatted: !!updatedData.content,
            });
          }
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`Error processing post ${post.id}:`, error);
        results.errors.push(`Error processing post ${post.id}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.total} posts`,
      translated: results.translated,
      formatted: results.formatted,
      errors: results.errors.length > 0 ? results.errors : undefined,
      details: results.details,
    });
  } catch (error: any) {
    console.error('Error in translate-all endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
