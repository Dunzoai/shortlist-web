'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  published_at: string;
  slug: string;
}

export default function AdminBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, category, published_at, slug')
      .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
      .order('published_at', { ascending: false });

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'buyers':
        return 'bg-[#C4A25A] text-white';
      case 'sellers':
        return 'bg-[#1B365D] text-white';
      default:
        return 'bg-[#D6BFAE] text-[#3D3D3D]';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-[#3D3D3D]">Loading posts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D]">
          Blog Posts
        </h1>
        <Link
          href="/admin/blog/new"
          className="bg-[#1B365D] text-white px-6 py-3 rounded hover:bg-[#C4A25A] transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-[#3D3D3D] mb-4">No blog posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="text-[#C4A25A] hover:underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F7F7F7] border-b border-[#D6BFAE]">
              <tr>
                <th className="text-left py-4 px-6 font-[family-name:var(--font-playfair)] text-[#1B365D]">
                  Title
                </th>
                <th className="text-left py-4 px-6 font-[family-name:var(--font-playfair)] text-[#1B365D]">
                  Category
                </th>
                <th className="text-left py-4 px-6 font-[family-name:var(--font-playfair)] text-[#1B365D]">
                  Published
                </th>
                <th className="text-right py-4 px-6 font-[family-name:var(--font-playfair)] text-[#1B365D]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-[#F7F7F7] hover:bg-[#FFFBF5] transition-colors">
                  <td className="py-4 px-6">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-[#1B365D] hover:text-[#C4A25A] font-medium"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(post.category)}`}>
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#3D3D3D]">
                    {formatDate(post.published_at)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-[#C4A25A] hover:text-[#1B365D] font-medium"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
