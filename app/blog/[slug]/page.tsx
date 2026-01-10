'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
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
  author: string;
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
        .select('*')
        .eq('slug', params.slug)
        .eq('client_id', 'danidiaz')
        .single();

      if (data) {
        setPost(data);
        // Fetch related posts
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select('id, title, slug, featured_image, category')
          .eq('client_id', 'danidiaz')
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

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-24 pb-0">
        <div className="relative h-[50vh] min-h-[400px]">
          {/* TODO: Replace with actual blog image */}
          <Image
            src={post.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80'}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#1B365D]/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className={`inline-block px-4 py-1 text-sm text-white mb-6 ${
                  post.category === 'buyers' ? 'bg-[#C4A25A]' :
                  post.category === 'sellers' ? 'bg-[#1B365D] border border-white' :
                  'bg-[#3D3D3D]'
                }`}>
                  {post.category === 'buyers' ? t('Buyers', 'Compradores') :
                   post.category === 'sellers' ? t('Sellers', 'Vendedores') :
                   t('General', 'General')}
                </div>
                <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  {post.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-white/80">
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
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none
              prose-headings:font-[family-name:var(--font-playfair)]
              prose-headings:text-[#1B365D]
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-[#3D3D3D] prose-p:leading-relaxed
              prose-a:text-[#C4A25A] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#1B365D]
              prose-ul:text-[#3D3D3D] prose-ol:text-[#3D3D3D]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#D6BFAE]/30">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#F7F7F7] text-[#3D3D3D] px-4 py-2 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          <div className="mt-12 p-8 bg-[#F7F7F7]">
            <div className="flex items-center gap-6">
              {/* TODO: Replace with actual author photo */}
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"
                alt="Dani Díaz"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-1">
                  Dani Díaz
                </h3>
                <p className="text-[#3D3D3D] text-sm mb-2">
                  {t('Bilingual Realtor® at Faircloth Real Estate Group', 'Agente Inmobiliaria Bilingüe en Faircloth Real Estate Group')}
                </p>
                <Link href="/about" className="text-[#C4A25A] text-sm hover:underline">
                  {t('Read full bio', 'Leer biografía completa')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-12 text-center">
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
                      <Image
                        src={relatedPost.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] group-hover:text-[#C4A25A] transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B365D] py-12">
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
