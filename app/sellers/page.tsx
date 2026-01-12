'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
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
  title_es?: string;
  excerpt_es?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// Placeholder posts for when Supabase data is not available
const placeholderPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Price Your Home for a Quick Sale',
    slug: 'price-home-quick-sale',
    excerpt: 'Learn the strategies for pricing your home competitively in the Myrtle Beach market.',
    featured_image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    published_at: '2024-01-15',
    category: 'sellers'
  },
  {
    id: '2',
    title: 'Staging Tips to Sell Your Home Faster',
    slug: 'staging-tips-sell-faster',
    excerpt: 'Professional staging techniques that can help your home stand out to buyers.',
    featured_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    published_at: '2024-01-10',
    category: 'sellers'
  },
  {
    id: '3',
    title: 'Understanding the Closing Process',
    slug: 'understanding-closing-process',
    excerpt: 'A comprehensive guide to what happens between accepting an offer and handing over the keys.',
    featured_image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
    published_at: '2024-01-05',
    category: 'sellers'
  },
  {
    id: '4',
    title: 'Repairs to Make Before Listing Your Home',
    slug: 'repairs-before-listing',
    excerpt: 'Which repairs are worth the investment and which ones you can skip.',
    featured_image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    published_at: '2024-01-01',
    category: 'sellers'
  },
];

const sellerResources = [
  {
    titleEn: 'Home Valuation',
    titleEs: 'Valuación de Casa',
    descEn: 'Get a free market analysis',
    descEs: 'Obtén un análisis gratuito',
    icon: '💰'
  },
  {
    titleEn: 'Seller Checklist',
    titleEs: 'Lista del Vendedor',
    descEn: 'Prepare your home for sale',
    descEs: 'Prepara tu casa para vender',
    icon: '📋'
  },
  {
    titleEn: 'Market Report',
    titleEs: 'Reporte del Mercado',
    descEn: 'Current market conditions',
    descEs: 'Condiciones actuales del mercado',
    icon: '📊'
  },
  {
    titleEn: 'Net Proceeds',
    titleEs: 'Ganancias Netas',
    descEn: 'Estimate your sale proceeds',
    descEs: 'Estima tus ganancias de venta',
    icon: '🧮'
  },
];

const sellingProcess = [
  {
    stepEn: 'Consultation',
    stepEs: 'Consulta',
    descEn: 'We discuss your goals, timeline, and evaluate your property',
    descEs: 'Discutimos tus metas, cronograma y evaluamos tu propiedad'
  },
  {
    stepEn: 'Preparation',
    stepEs: 'Preparación',
    descEn: 'Professional photography, staging advice, and listing preparation',
    descEs: 'Fotografía profesional, consejos de preparación y listado'
  },
  {
    stepEn: 'Marketing',
    stepEs: 'Marketing',
    descEn: 'Multi-channel marketing to reach qualified buyers',
    descEs: 'Marketing multicanal para llegar a compradores calificados'
  },
  {
    stepEn: 'Closing',
    stepEs: 'Cierre',
    descEn: 'Negotiation, paperwork, and successful closing',
    descEs: 'Negociación, documentación y cierre exitoso'
  },
];

export default function SellersPage() {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(placeholderPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, published_at, category, title_es, excerpt_es')
        .eq('category', 'sellers')
        .eq('client_id', 'danidiaz')
        .order('published_at', { ascending: false });

      if (data && data.length > 0) {
        setPosts(data);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

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
              {t('Seller Resources', 'Recursos para Vendedores')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Maximize your home sale with expert guidance',
                'Maximiza la venta de tu casa con orientación experta'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#F7F7F7] p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <span className="text-4xl mb-4 block">{resource.icon}</span>
                <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-2">
                  {language === 'en' ? resource.titleEn : resource.titleEs}
                </h3>
                <p className="text-sm text-[#3D3D3D]">
                  {language === 'en' ? resource.descEn : resource.descEs}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Selling Process */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-4">
              {t('The Selling Process', 'El Proceso de Venta')}
            </h2>
            <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
              {t(
                'A simple, streamlined approach to selling your home',
                'Un enfoque simple y optimizado para vender tu casa'
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {sellingProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#C4A25A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold font-[family-name:var(--font-playfair)]">
                  {index + 1}
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-2">
                  {language === 'en' ? step.stepEn : step.stepEs}
                </h3>
                <p className="text-[#3D3D3D]">
                  {language === 'en' ? step.descEn : step.descEs}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts for Sellers */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-4">
              {t('Guides for Sellers', 'Guías para Vendedores')}
            </h2>
            <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
              {t(
                'Tips and strategies to get the best price for your home',
                'Consejos y estrategias para obtener el mejor precio por tu casa'
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-[#F7F7F7] shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="relative h-56 overflow-hidden">
                      {/* TODO: Replace with actual blog images */}
                      <Image
                        src={post.featured_image || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-[#1B365D] text-white px-3 py-1 text-sm">
                        {t('Sellers', 'Vendedores')}
                      </div>
                    </div>
                    <div className="p-6">
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
                      <p className="text-[#3D3D3D] line-clamp-2">
                        {language === 'es' && post.excerpt_es ? post.excerpt_es : post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog?category=sellers"
              className="inline-flex items-center text-[#C4A25A] text-lg hover:text-[#1B365D] transition-colors"
            >
              {t('View All Seller Articles', 'Ver Todos los Artículos para Vendedores')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1B365D]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-white mb-6">
              {t('Ready to Sell Your Home?', '¿Listo para Vender Tu Casa?')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                "Get a free home valuation and discover what your property is worth in today's market.",
                "Obtén una valuación gratuita y descubre cuánto vale tu propiedad en el mercado actual."
              )}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors"
            >
              {t('Get Free Valuation', 'Obtener Valuación Gratuita')}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
