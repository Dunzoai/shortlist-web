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

    console.log('Translate-all endpoint called with secret:', secret ? 'provided' : 'missing');

    if (secret !== 'dani2026') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error: ANTHROPIC_API_KEY not set' },
        { status: 500 }
      );
    }

    console.log('Fetching blog posts from Supabase...');

    // Fetch all blog posts (using correct client_id UUID for danidiaz)
    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, excerpt, content, title_es, excerpt_es, content_es, client_id')
      .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e');

    if (fetchError) {
      console.error('Error fetching posts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch posts', details: fetchError.message },
        { status: 500 }
      );
    }

    console.log(`Found ${posts?.length || 0} posts`);

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
        console.log(`Processing post ${post.id}: "${post.title}"`);
        let needsUpdate = false;
        let updatedData: any = {};

        // Format English content if it exists
        if (post.content) {
          console.log(`  Formatting content for post ${post.id}...`);
          const formattedContent = await formatBlogContent(post.content);
          updatedData.content = formattedContent;
          needsUpdate = true;
          results.formatted++;
          console.log(`  Content formatted for post ${post.id}`);
        }

        // Translate to Spanish if missing
        if (post.content && (!post.title_es || !post.excerpt_es || !post.content_es)) {
          console.log(`  Post ${post.id} needs Spanish translation`);
          const sourceLanguage = await detectLanguage(updatedData.content || post.content);
          console.log(`  Detected language: ${sourceLanguage}`);

          if (sourceLanguage === 'en') {
            console.log(`  Translating post ${post.id} to Spanish...`);
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
            console.log(`  Translation complete for post ${post.id}`);
          }
        } else {
          console.log(`  Post ${post.id} already has Spanish translation`);
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
