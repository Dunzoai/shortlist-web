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

    // Log Supabase client configuration
    console.log('⚙️  Supabase configuration:');
    console.log('  - Using ANON key (subject to RLS):', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('  - Has SERVICE_ROLE key (bypasses RLS):', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('  ⚠️  If UPDATEs return 0 rows, check RLS policies in Supabase');

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
 * Returns a list of posts that need translation (bidirectional)
 */
async function getPostsNeedingTranslation() {
  console.log('Fetching posts that need translation...');

  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, title_es, excerpt_es, content_es')
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

  // Filter posts that need translation (either direction)
  const needsWork = posts.filter(post => {
    const hasEnglish = post.title && post.excerpt && post.content;
    const hasSpanish = post.title_es && post.excerpt_es && post.content_es;
    // Need translation if one language exists but the other doesn't
    return (hasEnglish && !hasSpanish) || (hasSpanish && !hasEnglish);
  });

  console.log(`Found ${posts.length} total posts, ${needsWork.length} need translation`);

  return NextResponse.json({
    message: `Found ${needsWork.length} posts needing translation`,
    total: posts.length,
    needsWork: needsWork.length,
    posts: needsWork.map(p => {
      const hasEnglish = p.title && p.excerpt && p.content;
      const hasSpanish = p.title_es && p.excerpt_es && p.content_es;
      return {
        id: p.id,
        title: p.title || p.title_es,
        slug: p.slug,
        hasEnglish,
        hasSpanish,
        translationDirection: hasEnglish && !hasSpanish ? 'EN → ES' : hasSpanish && !hasEnglish ? 'ES → EN' : 'None',
      };
    }),
    instructions: 'To translate a specific post, call this endpoint with ?post_id=POST_ID',
  });
}

/**
 * Translates a single blog post (bidirectional: EN ↔ ES)
 * Only fills in empty fields, never overwrites existing content
 */
async function translateSinglePost(postId: string) {
  console.log(`Translating post ${postId}...`);

  // Fetch the post
  const { data: post, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, title_es, excerpt_es, content_es')
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

    console.log(`  Current English fields - title:`, post.title || 'NULL');
    console.log(`  Current English fields - excerpt:`, post.excerpt || 'NULL');
    console.log(`  Current English fields - content:`, post.content ? `${post.content.length} chars` : 'NULL');
    console.log(`  Current Spanish fields - title_es:`, post.title_es || 'NULL');
    console.log(`  Current Spanish fields - excerpt_es:`, post.excerpt_es || 'NULL');
    console.log(`  Current Spanish fields - content_es:`, post.content_es ? `${post.content_es.length} chars` : 'NULL');

    // Determine what's missing
    const hasEnglish = post.title && post.excerpt && post.content;
    const hasSpanish = post.title_es && post.excerpt_es && post.content_es;
    const needsEnglishTranslation = !post.title || !post.excerpt || !post.content;
    const needsSpanishTranslation = !post.title_es || !post.excerpt_es || !post.content_es;

    console.log(`  Translation status:`);
    console.log(`    - Has complete English: ${hasEnglish}`);
    console.log(`    - Has complete Spanish: ${hasSpanish}`);
    console.log(`    - Needs English translation: ${needsEnglishTranslation}`);
    console.log(`    - Needs Spanish translation: ${needsSpanishTranslation}`);

    // Case 1: Both languages complete - skip
    if (hasEnglish && hasSpanish) {
      console.log(`  ✓ Post has both English and Spanish - skipping translation`);
    }
    // Case 2: English exists, Spanish missing - translate EN → ES
    else if (hasEnglish && needsSpanishTranslation) {
      console.log(`  📝 English exists, Spanish missing - translating EN → ES`);
      const translated = await translateBlogPost(
        {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
        },
        'en'
      );

      console.log(`  Translation EN → ES received from API`);
      // Only fill EMPTY Spanish fields, never overwrite
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
    }
    // Case 3: Spanish exists, English missing - translate ES → EN
    else if (hasSpanish && needsEnglishTranslation) {
      console.log(`  📝 Spanish exists, English missing - translating ES → EN`);
      const translated = await translateBlogPost(
        {
          title: post.title_es,
          excerpt: post.excerpt_es,
          content: post.content_es,
        },
        'es'
      );

      console.log(`  Translation ES → EN received from API`);
      // Only fill EMPTY English fields, never overwrite
      if (!post.title) {
        updatedData.title = translated.title;
        console.log(`  ✓ Will update title`);
      }
      if (!post.excerpt) {
        updatedData.excerpt = translated.excerpt;
        console.log(`  ✓ Will update excerpt`);
      }
      if (!post.content) {
        updatedData.content = translated.content;
        console.log(`  ✓ Will update content`);
      }
      wasTranslated = true;
    }
    // Case 4: Neither language complete - can't translate
    else {
      console.log(`  ⚠️  Neither language has complete content - cannot translate`);
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

    // CRITICAL DEBUG: Log the exact ID being used
    console.log(`  🔍 DEBUGGING UPDATE QUERY:`);
    console.log(`    - Post ID value: "${post.id}"`);
    console.log(`    - Post ID type: ${typeof post.id}`);
    console.log(`    - Post ID length: ${String(post.id).length}`);

    // Test if the row exists with a SELECT query
    console.log(`  🔍 Testing if row exists with SELECT...`);
    const { data: testSelect, error: testError } = await supabase
      .from('blog_posts')
      .select('id, title, client_id')
      .eq('id', post.id)
      .single();

    if (testError) {
      console.error(`  ❌ TEST SELECT FAILED:`, testError);
    } else if (testSelect) {
      console.log(`  ✅ Row found in test SELECT:`);
      console.log(`    - ID: ${testSelect.id}`);
      console.log(`    - Title: ${testSelect.title}`);
      console.log(`    - Client ID: ${testSelect.client_id}`);
    } else {
      console.error(`  ❌ No row found in test SELECT!`);
    }

    console.log(`  Calling Supabase UPDATE...`);
    console.log(`  UPDATE query: .from('blog_posts').update(...).eq('id', '${post.id}').select()`);

    const { data: updateResult, error: updateError } = await supabase
      .from('blog_posts')
      .update(updatedData)
      .eq('id', post.id)
      .select('id, title, slug, title_es, excerpt_es, content_es');

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

    console.log(`  ✅ DATABASE UPDATE SUCCESSFUL (no error)`);
    console.log(`  Update result type: ${typeof updateResult}`);
    console.log(`  Update result is array: ${Array.isArray(updateResult)}`);
    console.log(`  Update result:`, JSON.stringify(updateResult, null, 2));
    console.log(`  Rows updated: ${updateResult?.length || 0}`);

    if (!updateResult || updateResult.length === 0) {
      console.error(`  ❌❌❌ CRITICAL: UPDATE RETURNED 0 ROWS! ❌❌❌`);
      console.error(`  This means the WHERE clause did not match any rows!`);
      console.error(`  Possible causes:`);
      console.error(`    1. Row with ID "${post.id}" does not exist`);
      console.error(`    2. RLS (Row Level Security) policy is blocking the update`);
      console.error(`    3. ID format/type mismatch`);
      console.error(`  `);

      // Try a manual verification query
      const { data: verifyData, error: verifyError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', post.id);

      console.error(`  Verification SELECT result: ${verifyData ? `Found ${verifyData.length} row(s)` : 'No rows'}`);
      if (verifyData && verifyData.length > 0) {
        console.error(`  Row EXISTS but UPDATE did not work - likely RLS policy issue!`);
      }
    }

    if (updateResult && updateResult.length > 0) {
      console.log(`  Verification - Spanish fields in database:`);
      console.log(`    - title_es: ${updateResult[0]?.title_es ? `"${updateResult[0].title_es.substring(0, 50)}..."` : 'NULL'}`);
      console.log(`    - excerpt_es: ${updateResult[0]?.excerpt_es ? `${updateResult[0].excerpt_es.length} chars` : 'NULL'}`);
      console.log(`    - content_es: ${updateResult[0]?.content_es ? `${updateResult[0].content_es.length} chars` : 'NULL'}`);
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
