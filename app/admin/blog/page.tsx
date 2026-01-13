'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Trash2, ExternalLink, Search } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  published_at: string;
  slug: string;
  content_es: string | null;
}

type CategoryFilter = 'all' | 'buyers' | 'sellers' | 'general';
type SortOrder = 'newest' | 'oldest' | 'a-z';

export default function AdminBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, category, published_at, slug, content_es')
      .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
      .order('published_at', { ascending: false });

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    if (sortOrder === 'newest') {
      sorted.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    } else if (sortOrder === 'oldest') {
      sorted.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
    } else if (sortOrder === 'a-z') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [posts, categoryFilter, searchQuery, sortOrder]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (!error) {
      setPosts(posts.filter(post => post.id !== id));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      alert('Failed to delete post');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} post${selectedIds.size > 1 ? 's' : ''}? This cannot be undone.`)) {
      return;
    }

    const idsToDelete = Array.from(selectedIds);

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .in('id', idsToDelete);

    if (!error) {
      setPosts(posts.filter(post => !selectedIds.has(post.id)));
      setSelectedIds(new Set());
    } else {
      alert('Failed to delete posts');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPosts.map(post => post.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
        <>
          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D3D3D] opacity-50" size={20} />
              <input
                type="text"
                placeholder="Search posts by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
              />
            </div>

            {/* Category Filters and Sort */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                {(['all', 'buyers', 'sellers', 'general'] as CategoryFilter[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-[#C4A25A] text-white'
                        : 'bg-[#F7F7F7] text-[#3D3D3D] hover:bg-[#D6BFAE]'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="px-4 py-2 border border-[#D6BFAE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A25A] bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="mb-4 p-4 bg-[#FFFBF5] border border-[#D6BFAE] rounded-lg flex items-center justify-between">
              <span className="text-[#3D3D3D]">
                {selectedIds.size} post{selectedIds.size > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Selected ({selectedIds.size})
              </button>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F7F7F7] border-b border-[#D6BFAE]">
                <tr>
                  <th className="w-12 py-4 px-6">
                    <input
                      type="checkbox"
                      checked={filteredPosts.length > 0 && selectedIds.size === filteredPosts.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-[#C4A25A] cursor-pointer"
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-[family-name:var(--font-playfair)] text-[#1B365D]">
                    Title
                  </th>
                  <th className="text-left py-4 px-6 font-[family-name:var(--font-playfair)] text-[#1B365D]">
                    Category
                  </th>
                  <th className="text-center py-4 px-6 font-[family-name:var(--font-playfair)] text-[#1B365D]">
                    Translation
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
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#3D3D3D]">
                      No posts found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-[#F7F7F7] hover:bg-[#FFFBF5] transition-colors">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(post.id)}
                          onChange={() => toggleSelect(post.id)}
                          className="w-4 h-4 accent-[#C4A25A] cursor-pointer"
                        />
                      </td>
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
                      <td className="py-4 px-6 text-center">
                        {post.content_es ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            ES
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-400 rounded-full text-xs">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-[#3D3D3D]">
                        {formatDate(post.published_at)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3D3D3D] hover:text-[#C4A25A] transition-colors"
                            title="View on site"
                          >
                            <ExternalLink size={18} />
                          </a>
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="text-[#C4A25A] hover:text-[#1B365D] font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete post"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
