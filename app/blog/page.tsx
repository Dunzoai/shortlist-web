'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Nav from '@/components/Nav';
import { useLanguage } from '@/components/LanguageContext';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  category: string;
  tags: string[];
  title_es?: string;
  excerpt_es?: string;
}

// Placeholder posts for when Supabase data is not available
const placeholderPosts: BlogPost[] = [
  {
    id: '1',
    title: 'First-Time Homebuyer Guide for Myrtle Beach',
    slug: 'first-time-homebuyer-guide',
    excerpt: 'Everything you need to know about buying your first home in the Grand Strand area.',
    featured_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    published_at: '2024-01-15',
    category: 'buyers',
    tags: ['first-time', 'guide', 'tips']
  },
  {
    id: '2',
    title: 'How to Price Your Home for a Quick Sale',
    slug: 'price-home-quick-sale',
    excerpt: 'Learn the strategies for pricing your home competitively in the market.',
    featured_image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    published_at: '2024-01-12',
    category: 'sellers',
    tags: ['pricing', 'strategy', 'selling']
  },
  {
    id: '3',
    title: 'Best Neighborhoods in Myrtle Beach for Families',
    slug: 'best-neighborhoods-families',
    excerpt: 'Discover the top family-friendly neighborhoods with great schools and amenities.',
    featured_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    published_at: '2024-01-10',
    category: 'buyers',
    tags: ['neighborhoods', 'families', 'schools']
  },
  {
    id: '4',
    title: 'Staging Tips to Sell Your Home Faster',
    slug: 'staging-tips-sell-faster',
    excerpt: 'Professional staging techniques that can help your home stand out.',
    featured_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    published_at: '2024-01-08',
    category: 'sellers',
    tags: ['staging', 'tips', 'selling']
  },
  {
    id: '5',
    title: 'Understanding Mortgage Options in South Carolina',
    slug: 'mortgage-options-south-carolina',
    excerpt: 'Compare different mortgage types including FHA, VA, and conventional loans.',
    featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    published_at: '2024-01-05',
    category: 'buyers',
    tags: ['mortgage', 'financing', 'loans']
  },
  {
    id: '6',
    title: 'The Myrtle Beach Real Estate Market in 2024',
    slug: 'myrtle-beach-market-2024',
    excerpt: 'An overview of current market trends and what to expect this year.',
    featured_image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
    published_at: '2024-01-01',
    category: 'general',
    tags: ['market', 'trends', '2024']
  },
];

const categories = [
  { value: 'all', labelEn: 'All Posts', labelEs: 'Todos' },
  { value: 'buyers', labelEn: 'Buyers', labelEs: 'Compradores' },
  { value: 'sellers', labelEn: 'Sellers', labelEs: 'Vendedores' },
  { value: 'general', labelEn: 'General', labelEs: 'General' },
];

function BlogContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>(placeholderPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(placeholderPosts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');

    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (tagParam) {
      setActiveTag(tagParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, title_es, slug, excerpt, excerpt_es, featured_image, published_at, category, tags')
        .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
        .order('published_at', { ascending: false });

      if (data && data.length > 0) {
        setPosts(data);
        setFilteredPosts(data);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => post.category === activeCategory);
    }

    // Filter by tag
    if (activeTag) {
      filtered = filtered.filter(post => post.tags?.includes(activeTag));
    }

    setFilteredPosts(filtered);
  }, [activeCategory, activeTag, posts]);

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTag(tag);
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('tag', tag);
    window.history.pushState({}, '', url);
  };

  const clearTagFilter = () => {
    setActiveTag(null);
    // Remove tag from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('tag');
    window.history.pushState({}, '', url);
  };

  return (
    <>
      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-[#D6BFAE]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-6 py-2 text-sm tracking-wide transition-colors ${
                  activeCategory === category.value
                    ? 'bg-[#1B365D] text-white'
                    : 'bg-[#F7F7F7] text-[#3D3D3D] hover:bg-[#D6BFAE]'
                }`}
              >
                {language === 'en' ? category.labelEn : category.labelEs}
              </button>
            ))}
          </div>

          {/* Active Tag Filter */}
          {activeTag && (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C4A25A] text-white rounded-full">
                <span className="text-sm">
                  {t('Tag:', 'Etiqueta:')} <span className="font-semibold">#{activeTag}</span>
                </span>
                <button
                  onClick={clearTagFilter}
                  className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                  title={t('Clear filter', 'Limpiar filtro')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#3D3D3D] text-lg">
                {t('No posts found in this category.', 'No se encontraron publicaciones en esta categoría.')}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <div className="bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        {/* TODO: Replace with actual blog images */}
                        <Image
                          src={post.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className={`absolute top-4 left-4 px-3 py-1 text-sm text-white ${
                          post.category === 'buyers' ? 'bg-[#C4A25A]' :
                          post.category === 'sellers' ? 'bg-[#1B365D]' :
                          'bg-[#3D3D3D]'
                        }`}>
                          {post.category === 'buyers' ? t('Buyers', 'Compradores') :
                           post.category === 'sellers' ? t('Sellers', 'Vendedores') :
                           t('General', 'General')}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <p className="text-sm text-[#3D3D3D]/60 mb-2">
                          {new Date(post.published_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-3 group-hover:text-[#C4A25A] transition-colors">
                          {language === 'es' && post.title_es ? post.title_es : post.title}
                        </h3>
                        <p className="text-[#3D3D3D] line-clamp-3 flex-grow">
                          {language === 'es' && post.excerpt_es ? post.excerpt_es : post.excerpt}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags?.slice(0, 3).map((tag, tagIndex) => (
                            <button
                              key={tagIndex}
                              onClick={(e) => handleTagClick(tag, e)}
                              className={`text-xs px-2 py-1 transition-colors hover:bg-[#C4A25A] hover:text-white ${
                                activeTag === tag
                                  ? 'bg-[#C4A25A] text-white'
                                  : 'bg-[#F7F7F7] text-[#3D3D3D]'
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-[#1B365D]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-white mb-6">
              {t('Stay Updated', 'Mantente Informado')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                'Subscribe to receive the latest real estate tips and market updates',
                'Suscríbete para recibir los últimos consejos y actualizaciones del mercado'
              )}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('Enter your email', 'Ingresa tu correo')}
                className="flex-grow px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
              />
              <button
                type="submit"
                className="bg-[#C4A25A] text-white px-8 py-3 hover:bg-[#b3923f] transition-colors"
              >
                {t('Subscribe', 'Suscribirse')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default function BlogPage() {
  const { t } = useLanguage();

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-[#1B365D]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Blog
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Insights, tips, and guides for buying and selling homes in Myrtle Beach',
                'Consejos y guías para comprar y vender casas en Myrtle Beach'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
        <BlogContent />
      </Suspense>

      {/* Footer */}
      <footer className="bg-[#1B365D] py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="font-[family-name:var(--font-playfair)] text-white text-xl mb-2">
                Dani Díaz
              </p>
              <p className="text-white/60 text-sm">
                {t('Bilingual Realtor® at Faircloth Real Estate Group', 'Agente Inmobiliaria Bilingüe en Faircloth Real Estate Group')}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-white/60 text-sm">
                © {new Date().getFullYear()} Dani Díaz. {t('All rights reserved.', 'Todos los derechos reservados.')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
