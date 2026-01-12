'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  category: string;
  tags: string[];
  author?: string;
  title_es?: string;
  excerpt_es?: string;
  content_es?: string;
}

// Placeholder post for when Supabase data is not available
const placeholderPost: BlogPost = {
  id: '1',
  title: 'First-Time Homebuyer Guide for Myrtle Beach',
  slug: 'first-time-homebuyer-guide',
  content: `
    <p>Buying your first home is an exciting milestone, and Myrtle Beach offers incredible opportunities for first-time buyers. This comprehensive guide will walk you through everything you need to know.</p>

    <h2>Getting Started</h2>
    <p>Before you start browsing listings, it's important to get your finances in order. This means checking your credit score, saving for a down payment, and getting pre-approved for a mortgage.</p>

    <h2>Understanding Your Budget</h2>
    <p>Your budget should account for more than just the purchase price. Consider closing costs, property taxes, homeowners insurance, and potential HOA fees. In Myrtle Beach, property taxes are relatively low compared to other coastal areas.</p>

    <h2>Choosing the Right Neighborhood</h2>
    <p>Myrtle Beach and the surrounding Grand Strand area offer diverse neighborhoods to suit different lifestyles. Whether you prefer beachfront living, golf course communities, or quiet suburban streets, there's something for everyone.</p>

    <h2>The Home Search Process</h2>
    <p>Once you're pre-approved and know what you can afford, the fun begins! Work with a knowledgeable local Realtor® who understands the market and can help you find properties that match your criteria.</p>

    <h2>Making an Offer</h2>
    <p>When you find "the one," your agent will help you craft a competitive offer. In today's market, being prepared to move quickly can make all the difference.</p>

    <h2>Closing Day</h2>
    <p>After your offer is accepted, you'll go through inspections, appraisal, and final loan approval before closing. This process typically takes 30-45 days. Then you'll receive the keys to your new home!</p>
  `,
  excerpt: 'Everything you need to know about buying your first home in the Grand Strand area.',
  featured_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
  published_at: '2024-01-15',
  category: 'buyers',
  tags: ['first-time', 'guide', 'tips'],
  author: 'Dani Díaz'
};

const relatedPosts = [
  {
    id: '2',
    title: 'Understanding Mortgage Options in South Carolina',
    slug: 'mortgage-options-south-carolina',
    featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    category: 'buyers'
  },
  {
    id: '3',
    title: 'Best Neighborhoods in Myrtle Beach for Families',
    slug: 'best-neighborhoods-families',
    featured_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    category: 'buyers'
  },
  {
    id: '4',
    title: 'What to Look for During a Home Inspection',
    slug: 'home-inspection-checklist',
    featured_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    category: 'buyers'
  },
];

// Decode HTML entities if content is escaped
function decodeHtmlEntities(html: string): string {
  if (!html) return html;

  // Check if HTML contains entities
  if (!html.includes('&lt;') && !html.includes('&gt;') && !html.includes('&amp;')) {
    return html; // Already decoded
  }

  // Decode HTML entities
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export default function BlogPostPage() {
  const { language, t } = useLanguage();
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState(relatedPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, content, excerpt, featured_image, published_at, category, tags, title_es, excerpt_es, content_es')
        .eq('slug', params.slug)
        .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
        .single();

      console.log('RAW SUPABASE DATA:', data);
      console.log('SUPABASE ERROR:', error);

      if (data) {
        console.log('Post data from Supabase:', {
          title: data.title,
          title_es: data.title_es,
          has_content_es: !!data.content_es,
          content_preview: data.content?.substring(0, 150),
          content_es_preview: data.content_es?.substring(0, 150),
          content_has_html: data.content?.includes('<'),
          content_es_has_html: data.content_es?.includes('<')
        });
        setPost(data);
        // Fetch related posts
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select('id, title, slug, featured_image, category, title_es')
          .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
          .eq('category', data.category)
          .neq('slug', params.slug)
          .limit(3);

        if (relatedData && relatedData.length > 0) {
          setRelated(relatedData);
        }
      } else {
        // Use placeholder if not found
        setPost(placeholderPost);
      }
      setLoading(false);
    }

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="font-[family-name:var(--font-lora)]">
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-[#1B365D]">Loading...</div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="font-[family-name:var(--font-lora)]">
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-4">
              {t('Post Not Found', 'Publicación No Encontrada')}
            </h1>
            <Link href="/blog" className="text-[#C4A25A] hover:underline">
              {t('Back to Blog', 'Volver al Blog')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Debug: Log language and content selection
  console.log('Rendering with:', {
    language,
    hasPost: !!post,
    hasTitleEs: !!post?.title_es,
    hasContentEs: !!post?.content_es,
    willShowSpanish: language === 'es' && !!post?.title_es
  });

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-[#1B365D]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className={`inline-block px-4 py-1.5 text-sm text-white ${
                post.category === 'buyers' ? 'bg-[#C4A25A]' :
                post.category === 'sellers' ? 'bg-white/20 border border-white/30' :
                'bg-white/20'
              }`}>
                {post.category === 'buyers' ? t('Buyers', 'Compradores') :
                 post.category === 'sellers' ? t('Sellers', 'Vendedores') :
                 t('General', 'General')}
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {language === 'es' && post.title_es ? post.title_es : post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/70 text-lg">
              <span>{post.author || 'Dani Díaz'}</span>
              <span>•</span>
              <span>
                {new Date(post.published_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#C4A25A] hover:text-[#1B365D] transition-colors mb-12"
          >
            <ArrowLeft size={20} />
            <span>{t('Back to Blog', 'Volver al Blog')}</span>
          </Link>

          {/* Content */}
          <div
            className="blog-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: (() => {
                const content = language === 'es' && post.content_es ? post.content_es : post.content;
                const decoded = decodeHtmlEntities(content);
                console.log('Content to render (first 200 chars):', decoded.substring(0, 200));
                console.log('Has HTML tags:', decoded.includes('<'));
                return decoded;
              })()
            }}
          />

          <style jsx global>{`
            .blog-content h2 {
              font-family: var(--font-playfair);
              font-size: 1.5rem;
              font-weight: 600;
              color: #1B365D;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }

            .blog-content h3 {
              font-family: var(--font-playfair);
              font-size: 1.25rem;
              font-weight: 600;
              color: #1B365D;
              margin-top: 2rem;
              margin-bottom: 0.75rem;
            }

            .blog-content p {
              color: #374151;
              font-size: 1.125rem;
              line-height: 1.75;
              margin-bottom: 1.5rem;
            }

            .blog-content ul,
            .blog-content ol {
              color: #374151;
              font-size: 1.125rem;
              line-height: 1.75;
              margin-bottom: 1.5rem;
              padding-left: 1.5rem;
            }

            .blog-content li {
              margin-bottom: 0.5rem;
            }

            .blog-content a {
              color: #C4A25A;
              text-decoration: none;
            }

            .blog-content a:hover {
              text-decoration: underline;
            }

            .blog-content strong {
              color: #1B365D;
              font-weight: 600;
            }

            .blog-content em {
              font-style: italic;
            }
          `}</style>

          {/* Signature */}
          <div className="mt-12 mb-12 flex justify-center">
            <Image
              src="/dani-signature.png"
              alt="Dani Díaz Signature"
              width={150}
              height={50}
              className="opacity-60 max-w-[150px] w-auto h-auto"
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[#D6BFAE]/30">
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="border border-[#C4A25A] text-[#C4A25A] px-4 py-2 text-sm rounded-full hover:bg-[#C4A25A] hover:text-white transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          <div className="mt-16 p-8 bg-[#F7F7F7] rounded-lg">
            <div className="flex items-center gap-6">
              <div className="rounded-full overflow-hidden w-20 h-20 flex-shrink-0">
                <Image
                  src="/dani-diaz-about.JPG"
                  alt="Dani Díaz"
                  width={80}
                  height={80}
                  className="object-cover object-top w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-2">
                  Dani Díaz
                </h3>
                <p className="text-[#3D3D3D] mb-3">
                  {t('Bilingual Realtor® at Faircloth Real Estate Group', 'Agente Inmobiliaria Bilingüe en Faircloth Real Estate Group')}
                </p>
                <Link href="/about" className="text-[#C4A25A] hover:text-[#1B365D] transition-colors font-medium">
                  {t('Read full bio →', 'Leer biografía completa →')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-12 text-center">
            {t('Related Articles', 'Artículos Relacionados')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map((relatedPost, index) => (
              <motion.div
                key={relatedPost.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${relatedPost.slug}`} className="group block">
                  <div className="bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      {/* TODO: Replace with actual blog images */}
                      <Image
                        src={relatedPost.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] group-hover:text-[#C4A25A] transition-colors">
                        {language === 'es' && (relatedPost as any).title_es ? (relatedPost as any).title_es : relatedPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
