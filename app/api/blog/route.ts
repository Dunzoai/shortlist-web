import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { translateBlogPost, detectLanguage } from '@/lib/translate';
import { formatBlogContent } from '@/lib/formatBlogContent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      featured_image,
      category,
      tags,
      author,
      client_id,
      title_es,
      excerpt_es,
      content_es,
    } = body;

    // Validate required fields
    if (!title || !slug || !content || !excerpt || !client_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format content to ensure proper HTML structure
    const formattedContent = await formatBlogContent(content);

    // Detect source language
    const sourceLanguage = await detectLanguage(formattedContent);

    // Auto-translate if one language is missing
    let finalTitleEs = title_es;
    let finalExcerptEs = excerpt_es;
    let finalContentEs = content_es;
    let finalTitle = title;
    let finalExcerpt = excerpt;
    let finalContent = formattedContent;

    if (sourceLanguage === 'en') {
      // English content provided, translate to Spanish if not provided
      if (!title_es || !excerpt_es || !content_es) {
        const translated = await translateBlogPost(
          { title, excerpt, content: formattedContent },
          'en'
        );
        finalTitleEs = title_es || translated.title;
        finalExcerptEs = excerpt_es || translated.excerpt;
        finalContentEs = content_es || translated.content;
      }
    } else {
      // Spanish content provided, translate to English if not provided
      if (!title || !excerpt || !content) {
        const translated = await translateBlogPost(
          {
            title: title_es || title,
            excerpt: excerpt_es || excerpt,
            content: content_es || formattedContent,
          },
          'es'
        );
        finalTitle = title || translated.title;
        finalExcerpt = excerpt || translated.excerpt;
        finalContent = translated.content;

        // If Spanish was the source, use that
        finalTitleEs = title_es || title;
        finalExcerptEs = excerpt_es || excerpt;
        finalContentEs = content_es || formattedContent;
      }
    }

    // Insert into database
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: finalTitle,
          slug,
          content: finalContent,
          excerpt: finalExcerpt,
          title_es: finalTitleEs,
          excerpt_es: finalExcerptEs,
          content_es: finalContentEs,
          featured_image,
          category,
          tags,
          author: author || 'Dani Díaz',
          client_id,
          published_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      content,
      excerpt,
      featured_image,
      category,
      tags,
      author,
      title_es,
      excerpt_es,
      content_es,
    } = body;

    // Validate required fields
    if (!id || !title || !slug || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format content to ensure proper HTML structure
    const formattedContent = await formatBlogContent(content);

    // Detect source language
    const sourceLanguage = await detectLanguage(formattedContent);

    // Auto-translate if one language is missing
    let finalTitleEs = title_es;
    let finalExcerptEs = excerpt_es;
    let finalContentEs = content_es;
    let finalTitle = title;
    let finalExcerpt = excerpt;
    let finalContent = formattedContent;

    if (sourceLanguage === 'en') {
      // English content provided, translate to Spanish if not provided
      if (!title_es || !excerpt_es || !content_es) {
        const translated = await translateBlogPost(
          { title, excerpt, content: formattedContent },
          'en'
        );
        finalTitleEs = title_es || translated.title;
        finalExcerptEs = excerpt_es || translated.excerpt;
        finalContentEs = content_es || translated.content;
      }
    } else {
      // Spanish content provided, translate to English if not provided
      if (!title || !excerpt || !content) {
        const translated = await translateBlogPost(
          {
            title: title_es || title,
            excerpt: excerpt_es || excerpt,
            content: content_es || formattedContent,
          },
          'es'
        );
        finalTitle = title || translated.title;
        finalExcerpt = excerpt || translated.excerpt;
        finalContent = translated.content;

        // If Spanish was the source, use that
        finalTitleEs = title_es || title;
        finalExcerptEs = excerpt_es || excerpt;
        finalContentEs = content_es || formattedContent;
      }
    }

    // Update in database
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: finalTitle,
        slug,
        content: finalContent,
        excerpt: finalExcerpt,
        title_es: finalTitleEs,
        excerpt_es: finalExcerptEs,
        content_es: finalContentEs,
        featured_image,
        category,
        tags,
        author: author || 'Dani Díaz',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
