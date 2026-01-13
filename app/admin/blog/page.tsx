'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Trash2, ExternalLink, Search, Edit, FileText, CheckCircle, Calendar, ArrowLeft } from 'lucide-react';
import { getRandomEncouragement } from '@/lib/encouragements';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  published_at: string;
  slug: string;
  content_es: string | null;
  excerpt: string;
  featured_image: string | null;
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
  const [encouragement, setEncouragement] = useState('');

  useEffect(() => {
    setEncouragement(getRandomEncouragement('blog'));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, category, published_at, slug, content_es, excerpt, featured_image')
      .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
      .order('published_at', { ascending: false });

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = posts.length;
    const translated = posts.filter(p => p.content_es).length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = posts.filter(p => {
      const postDate = new Date(p.published_at);
      return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
    }).length;

    return { total, translated, thisMonth };
  }, [posts]);

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

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'buyers':
        return 'from-[#C4A25A] to-[#D6BFAE]';
      case 'sellers':
        return 'from-[#1B365D] to-[#3D5A80]';
      default:
        return 'from-[#D6BFAE] to-[#F7F7F7]';
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
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-[#1B365D] text-lg">Loading your posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      {/* Welcome Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-[#3D3D3D] hover:text-[#C4A25A] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-2">
              Welcome back, Dani ✨
            </h1>
            <p className="text-[#3D3D3D] text-lg">Manage your blog content</p>
            {encouragement && (
              <p className="text-[#C4A25A]/80 italic text-sm mt-2 font-[family-name:var(--font-lora)]">
                "{encouragement}"
              </p>
            )}
          </div>
          <Link
            href="/admin/blog/new"
            className="bg-[#1B365D] text-white px-6 py-3 rounded-full hover:bg-[#C4A25A] transition-all hover:shadow-lg flex items-center gap-2"
          >
            <span>✍️</span>
            <span>Write New Post</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1B365D]/10 rounded-lg">
                <FileText className="text-[#1B365D]" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#C4A25A]">{stats.total}</div>
                <div className="text-[#3D3D3D] text-sm">Total Posts</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#C4A25A]">{stats.translated}</div>
                <div className="text-[#3D3D3D] text-sm">Translated</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C4A25A]/10 rounded-lg">
                <Calendar className="text-[#C4A25A]" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#C4A25A]">{stats.thisMonth}</div>
                <div className="text-[#3D3D3D] text-sm">This Month</div>
              </div>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <p className="text-[#3D3D3D] text-lg mb-4">No blog posts yet.</p>
            <Link
              href="/admin/blog/new"
              className="text-[#C4A25A] hover:text-[#1B365D] font-medium transition-colors"
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3D3D3D] opacity-50" size={20} />
                <input
                  type="text"
                  placeholder="Search posts by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[#D6BFAE]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C4A25A] bg-white shadow-sm"
                />
              </div>

              {/* Category Filters and Sort */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  {(['all', 'buyers', 'sellers', 'general'] as CategoryFilter[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        categoryFilter === cat
                          ? 'bg-[#C4A25A] text-white shadow-md'
                          : 'bg-white text-[#3D3D3D] hover:bg-[#D6BFAE]/30 shadow-sm'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="px-4 py-2 border border-[#D6BFAE]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C4A25A] bg-white shadow-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">A-Z</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <div className="mb-6 p-4 bg-white border border-[#C4A25A]/30 rounded-xl flex items-center justify-between shadow-sm">
                <span className="text-[#3D3D3D] font-medium">
                  {selectedIds.size} post{selectedIds.size > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedIds.size})
                </button>
              </div>
            )}

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <p className="text-[#3D3D3D] text-lg">No posts found matching your filters.</p>
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 text-[#C4A25A] hover:text-[#1B365D] font-medium transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Featured Image or Gradient */}
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(post.category)}`} />
                        )}

                        {/* Checkbox overlay */}
                        <div className="absolute top-3 left-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(post.id)}
                            onChange={() => toggleSelect(post.id)}
                            className="w-5 h-5 accent-[#C4A25A] cursor-pointer rounded shadow-lg"
                          />
                        </div>

                        {/* Translation badge */}
                        {post.content_es && (
                          <div className="absolute bottom-3 right-3">
                            <span className="inline-flex items-center justify-center px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold shadow-lg">
                              ES ✓
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] font-semibold leading-tight flex-1">
                              {post.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getCategoryColor(post.category)}`}>
                              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                            </span>
                          </div>

                          <p className="text-[#3D3D3D] text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-[#3D3D3D]/70 mb-4">
                            <Calendar size={14} />
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#D6BFAE]/20">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[#3D3D3D] hover:text-[#C4A25A] transition-colors text-sm"
                            title="View on site"
                          >
                            <ExternalLink size={16} />
                            <span>View</span>
                          </a>
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="flex items-center gap-1.5 text-[#C4A25A] hover:text-[#1B365D] transition-colors font-medium text-sm"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="flex items-center gap-1.5 text-red-600 hover:text-red-700 transition-colors text-sm ml-auto"
                            title="Delete post"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
