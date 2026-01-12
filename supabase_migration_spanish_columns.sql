-- Add Spanish language columns to blog_posts table for auto-translation system
-- Run this in your Supabase SQL Editor

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS excerpt_es TEXT,
ADD COLUMN IF NOT EXISTS content_es TEXT;

-- Add comment for documentation
COMMENT ON COLUMN blog_posts.title_es IS 'Spanish translation of blog post title';
COMMENT ON COLUMN blog_posts.excerpt_es IS 'Spanish translation of blog post excerpt';
COMMENT ON COLUMN blog_posts.content_es IS 'Spanish translation of blog post content (HTML)';
