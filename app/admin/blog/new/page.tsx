'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NewBlogPost() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'general',
    tags: '',
    featuredImage: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, featuredImage: e.target.files[0] });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let featuredImageUrl = '';

      // Upload image if provided
      if (formData.featuredImage) {
        const fileExt = formData.featuredImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, formData.featuredImage);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        featuredImageUrl = publicUrl;
      }

      // Create blog post
      const slug = generateSlug(formData.title);
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { data: post, error: insertError } = await supabase
        .from('blog_posts')
        .insert([{
          title: formData.title,
          slug,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          tags: tagsArray,
          featured_image: featuredImageUrl,
          client_id: '3c125122-f3d9-4f75-91d9-69cf84d6d20e',
          published_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create post: ${insertError.message}`);
      }

      // Call translate-all endpoint to generate Spanish translation
      try {
        const translateResponse = await fetch(
          `/api/blog/translate-all?secret=dani2026&post_id=${post.id}`,
          { method: 'GET' }
        );

        if (!translateResponse.ok) {
          console.warn('Translation failed, but post was created');
        }
      } catch (translateError) {
        console.warn('Translation request failed:', translateError);
      }

      // Success! Redirect to blog list
      router.push('/admin/blog');
    } catch (err: any) {
      setError(err.message || 'Failed to create blog post');
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-2">
          New Blog Post
        </h1>
        <p className="text-[#3D3D3D]">
          Create a new blog post. Spanish translation will be generated automatically.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-[#1B365D] font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-[#D6BFAE] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
            placeholder="Enter post title"
          />
        </div>

        {/* Excerpt */}
        <div className="mb-6">
          <label className="block text-[#1B365D] font-medium mb-2">
            Excerpt *
          </label>
          <textarea
            required
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-[#D6BFAE] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
            placeholder="Brief description (1-2 sentences)"
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-[#1B365D] font-medium mb-2">
            Content *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(html) => setFormData({ ...formData, content: html })}
            placeholder="Write your blog post content..."
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-[#1B365D] font-medium mb-2">
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-[#D6BFAE] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
          >
            <option value="general">General</option>
            <option value="buyers">Buyers</option>
            <option value="sellers">Sellers</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-[#1B365D] font-medium mb-2">
            Tags
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border border-[#D6BFAE] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
            placeholder="first-time, guide, tips (comma-separated)"
          />
          <p className="text-sm text-[#3D3D3D] mt-1">Separate tags with commas</p>
        </div>

        {/* Featured Image */}
        <div className="mb-6">
          <label className="block text-[#1B365D] font-medium mb-2">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-[#D6BFAE] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
          />
          {formData.featuredImage && (
            <p className="text-sm text-[#3D3D3D] mt-1">
              Selected: {formData.featuredImage.name}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-[#D6BFAE]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1B365D] text-white px-6 py-3 rounded hover:bg-[#C4A25A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save & Translate'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
