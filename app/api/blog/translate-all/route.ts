import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { translateBlogPost, detectLanguage } from '@/lib/translate';
import { formatBlogContent } from '@/lib/formatBlogContent';

// Increase timeout for Vercel Pro (default is 10s on Hobby)
export const maxDuration = 60;

/**
 * Batch translation endpoint for blog posts
 *
 * GET /api/blog/translate-all?secret=dani2026
 * - Returns list of posts that need translation
 *
 * GET /api/blog/translate-all?secret=dani2026&post_id=123
 * - Translates a single post by ID
 */
export async function GET(request: NextRequest) {
  try {
    // Check for secret parameter
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    const postId = searchParams.get('post_id');

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

    // If post_id is provided, translate only that post
    if (postId) {
      return await translateSinglePost(postId);
    }

    // Otherwise, return list of posts that need translation
    return await getPostsNeedingTranslation();
  } catch (error: any) {
    console.error('Error in translate-all endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Returns a list of posts that need translation or formatting
 */
async function getPostsNeedingTranslation() {
  console.log('Fetching posts that need translation...');

  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug, content, content_es, title_es, excerpt_es')
    .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e');

  if (fetchError) {
    console.error('Error fetching posts:', fetchError);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: fetchError.message },
      { status: 500 }
    );
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({
      message: 'No posts found',
      total: 0,
      needsTranslation: [],
    });
  }

  // Filter posts that need translation or formatting
  const needsWork = posts.filter(post => {
    const needsTranslation = post.content && (!post.title_es || !post.excerpt_es || !post.content_es);
    const needsFormatting = post.content && !(post.content.includes('<h2>') && post.content.includes('<p>'));
    return needsTranslation || needsFormatting;
  });

  console.log(`Found ${posts.length} total posts, ${needsWork.length} need work`);

  return NextResponse.json({
    message: `Found ${needsWork.length} posts needing translation/formatting`,
    total: posts.length,
    needsWork: needsWork.length,
    posts: needsWork.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      needsTranslation: !p.content_es,
      needsFormatting: !(p.content?.includes('<h2>') && p.content?.includes('<p>')),
    })),
    instructions: 'To translate a specific post, call this endpoint with ?post_id=POST_ID',
  });
}

/**
 * Translates and formats a single blog post
 */
async function translateSinglePost(postId: string) {
  console.log(`Translating post ${postId}...`);

  // Fetch the post
  const { data: post, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, excerpt, content, title_es, excerpt_es, content_es')
    .eq('id', postId)
    .single();

  if (fetchError) {
    console.error('Error fetching post:', fetchError);
    return NextResponse.json(
      { error: 'Failed to fetch post', details: fetchError.message },
      { status: 500 }
    );
  }

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  try {
    const updatedData: any = {};
    let wasFormatted = false;
    let wasTranslated = false;

    console.log(`  Current post Spanish fields - title_es:`, post.title_es || 'NULL');
    console.log(`  Current post Spanish fields - excerpt_es:`, post.excerpt_es || 'NULL');
    console.log(`  Current post Spanish fields - content_es:`, post.content_es ? `${post.content_es.length} chars` : 'NULL');

    // Format English content if needed
    let contentToTranslate = post.content;
    if (post.content) {
      console.log(`  Checking if formatting needed for post ${postId}...`);
      const needsFormatting = !(post.content.includes('<h2>') && post.content.includes('<p>'));

      if (needsFormatting) {
        console.log(`  Formatting content for post ${postId}...`);
        const formattedContent = await formatBlogContent(post.content);
        updatedData.content = formattedContent;
        contentToTranslate = formattedContent;
        wasFormatted = true;
        console.log(`  Content formatted for post ${postId}`);
      } else {
        console.log(`  Content already formatted for post ${postId}`);
        // Don't update content field if no changes needed
      }
    }

    // Translate to Spanish if missing
    const needsSpanishTranslation = !post.title_es || !post.excerpt_es || !post.content_es;
    console.log(`  Needs Spanish translation: ${needsSpanishTranslation}`);
    console.log(`  - Missing title_es: ${!post.title_es}`);
    console.log(`  - Missing excerpt_es: ${!post.excerpt_es}`);
    console.log(`  - Missing content_es: ${!post.content_es}`);

    if (post.content && needsSpanishTranslation) {
      console.log(`  Post ${postId} needs Spanish translation`);
      const sourceLanguage = await detectLanguage(contentToTranslate);
      console.log(`  Detected language: ${sourceLanguage}`);

      if (sourceLanguage === 'en') {
        console.log(`  Translating post ${postId} to Spanish...`);
        const translated = await translateBlogPost(
          {
            title: post.title,
            excerpt: post.excerpt,
            content: contentToTranslate,
          },
          'en'
        );

        console.log(`  Translation received from API`);
        console.log(`  - Translated title: ${translated.title.substring(0, 50)}...`);
        console.log(`  - Translated excerpt length: ${translated.excerpt.length}`);
        console.log(`  - Translated content length: ${translated.content.length}`);

        // ALWAYS set Spanish fields if missing (force update)
        if (!post.title_es) {
          updatedData.title_es = translated.title;
          console.log(`  ✓ Will update title_es`);
        }
        if (!post.excerpt_es) {
          updatedData.excerpt_es = translated.excerpt;
          console.log(`  ✓ Will update excerpt_es`);
        }
        if (!post.content_es) {
          updatedData.content_es = translated.content;
          console.log(`  ✓ Will update content_es`);
        }

        wasTranslated = true;
        console.log(`  Translation data prepared for database update`);
      } else {
        console.log(`  Skipping translation - detected language is not English: ${sourceLanguage}`);
      }
    } else {
      console.log(`  Post ${postId} already has Spanish translation - skipping`);
    }

    // Update the post if needed
    console.log(`  ═══════════════════════════════════════`);
    console.log(`  ATTEMPTING DATABASE UPDATE`);
    console.log(`  Post ID: ${post.id}`);
    console.log(`  Update data keys: [${Object.keys(updatedData).join(', ')}]`);
    console.log(`  Number of fields to update: ${Object.keys(updatedData).length}`);

    if (Object.keys(updatedData).length === 0) {
      console.log(`  ⚠️  NO FIELDS TO UPDATE - SKIPPING DATABASE CALL`);
      return NextResponse.json({
        success: true,
        message: `Post already up to date: ${post.title}`,
        postId: post.id,
        title: post.title,
        slug: post.slug,
        formatted: false,
        translated: false,
        skipped: true,
      });
    }

    console.log(`  Fields to update:`);
    if (updatedData.title_es) console.log(`    - title_es: "${updatedData.title_es.substring(0, 50)}..."`);
    if (updatedData.excerpt_es) console.log(`    - excerpt_es: ${updatedData.excerpt_es.length} chars`);
    if (updatedData.content_es) console.log(`    - content_es: ${updatedData.content_es.length} chars`);
    if (updatedData.content) console.log(`    - content: ${updatedData.content.length} chars`);

    console.log(`  Calling Supabase UPDATE...`);

    const { data: updateResult, error: updateError } = await supabase
      .from('blog_posts')
      .update(updatedData)
      .eq('id', post.id)
      .select('id, title, title_es, excerpt_es, content_es');

    if (updateError) {
      console.error(`  ❌ SUPABASE UPDATE ERROR:`, JSON.stringify(updateError, null, 2));
      console.error(`  Error message:`, updateError.message);
      console.error(`  Error details:`, updateError.details);
      console.error(`  Error hint:`, updateError.hint);
      console.error(`  Error code:`, updateError.code);

      return NextResponse.json(
        {
          error: 'SUPABASE UPDATE FAILED',
          supabaseError: {
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint,
            code: updateError.code
          },
          attemptedUpdate: {
            postId: post.id,
            fields: Object.keys(updatedData)
          }
        },
        { status: 500 }
      );
    }

    console.log(`  ✅ DATABASE UPDATE SUCCESSFUL`);
    console.log(`  Update result:`, JSON.stringify(updateResult, null, 2));
    console.log(`  Rows updated: ${updateResult?.length || 0}`);

    if (updateResult && updateResult.length > 0) {
      console.log(`  Verification - Spanish fields in database:`);
      console.log(`    - title_es: ${updateResult[0]?.title_es ? `"${updateResult[0].title_es.substring(0, 50)}..."` : 'NULL'}`);
      console.log(`    - excerpt_es: ${updateResult[0]?.excerpt_es ? `${updateResult[0].excerpt_es.length} chars` : 'NULL'}`);
      console.log(`    - content_es: ${updateResult[0]?.content_es ? `${updateResult[0].content_es.length} chars` : 'NULL'}`);
    } else {
      console.log(`  ⚠️  WARNING: No rows returned from update`);
    }

    console.log(`  ═══════════════════════════════════════`);

    return NextResponse.json({
      success: true,
      message: `Successfully processed post: ${post.title}`,
      postId: post.id,
      title: post.title,
      slug: post.slug,
      formatted: wasFormatted,
      translated: wasTranslated,
      updatedFields: Object.keys(updatedData),
      databaseUpdateSucceeded: true,
      rowsAffected: updateResult?.length || 0,
      verification: {
        title_es: updateResult?.[0]?.title_es?.substring(0, 50) || 'NOT SAVED',
        has_excerpt_es: !!updateResult?.[0]?.excerpt_es,
        content_es_length: updateResult?.[0]?.content_es?.length || 0,
      }
    });
  } catch (error: any) {
    console.error(`Error processing post ${postId}:`, error);
    return NextResponse.json(
      { error: 'Error processing post', details: error.message },
      { status: 500 }
    );
  }
}
