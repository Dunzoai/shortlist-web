'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Calculator, ClipboardCheck, GraduationCap, MapPin } from 'lucide-react';
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
    title: 'First-Time Homebuyer Guide for Myrtle Beach',
    slug: 'first-time-homebuyer-guide',
    excerpt: 'Everything you need to know about buying your first home in the Grand Strand area. From pre-approval to closing day.',
    featured_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    published_at: '2024-01-15',
    category: 'buyers'
  },
  {
    id: '2',
    title: 'Understanding Mortgage Options in South Carolina',
    slug: 'mortgage-options-south-carolina',
    excerpt: 'Compare different mortgage types available to buyers in SC, including FHA, VA, and conventional loans.',
    featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    published_at: '2024-01-10',
    category: 'buyers'
  },
  {
    id: '3',
    title: 'Best Neighborhoods in Myrtle Beach for Families',
    slug: 'best-neighborhoods-families',
    excerpt: 'Discover the top family-friendly neighborhoods with great schools, parks, and community amenities.',
    featured_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    published_at: '2024-01-05',
    category: 'buyers'
  },
  {
    id: '4',
    title: 'What to Look for During a Home Inspection',
    slug: 'home-inspection-checklist',
    excerpt: 'A comprehensive checklist of things to watch for during your home inspection process.',
    featured_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    published_at: '2024-01-01',
    category: 'buyers'
  },
];

const buyerResources = [
  {
    titleEn: 'Mortgage Calculator',
    titleEs: 'Calculadora de Hipoteca',
    descEn: 'Estimate your monthly payments',
    descEs: 'Estima tus pagos mensuales',
    icon: Calculator,
    link: '/calculator'
  },
  {
    titleEn: 'Buyer Checklist',
    titleEs: 'Lista de Verificación',
    descEn: 'Step-by-step buying guide',
    descEs: 'Guía paso a paso para comprar',
    icon: ClipboardCheck,
    link: '/buyers/checklist'
  },
  {
    titleEn: 'School Reports',
    titleEs: 'Informes Escolares',
    descEn: 'Local school ratings and info',
    descEs: 'Calificaciones e información escolar',
    icon: GraduationCap,
    link: '#'
  },
  {
    titleEn: 'Area Guide',
    titleEs: 'Guía del Área',
    descEn: 'Explore Myrtle Beach neighborhoods',
    descEs: 'Explora los vecindarios',
    icon: MapPin,
    link: '#'
  },
];

export default function BuyersPage() {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(placeholderPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, published_at, category, title_es, excerpt_es')
        .eq('category', 'buyers')
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
              {t('Buyer Resources', 'Recursos para Compradores')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Your guide to finding the perfect home in Myrtle Beach',
                'Tu guía para encontrar el hogar perfecto en Myrtle Beach'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerResources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={resource.link}
                    className="block bg-[#F7F7F7] p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-center mb-4">
                      <IconComponent size={32} className="text-[#1B365D]" />
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-2">
                      {language === 'en' ? resource.titleEn : resource.titleEs}
                    </h3>
                    <p className="text-sm text-[#3D3D3D]">
                      {language === 'en' ? resource.descEn : resource.descEs}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts for Buyers */}
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
              {t('Guides for Buyers', 'Guías para Compradores')}
            </h2>
            <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
              {t(
                'Expert advice and tips to help you navigate the home buying process',
                'Consejos y sugerencias de expertos para ayudarte en el proceso de compra'
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
                  <div className="bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="relative h-56 overflow-hidden">
                      {/* TODO: Replace with actual blog images */}
                      <Image
                        src={post.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-[#C4A25A] text-white px-3 py-1 text-sm">
                        {t('Buyers', 'Compradores')}
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
              href="/blog?category=buyers"
              className="inline-flex items-center text-[#C4A25A] text-lg hover:text-[#1B365D] transition-colors"
            >
              {t('View All Buyer Articles', 'Ver Todos los Artículos para Compradores')}
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
              {t('Ready to Find Your Dream Home?', '¿Listo para Encontrar Tu Casa Soñada?')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                "Let me help you navigate the Myrtle Beach real estate market. I'll be with you every step of the way.",
                "Déjame ayudarte a navegar el mercado inmobiliario de Myrtle Beach. Estaré contigo en cada paso del camino."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors"
              >
                {t('Browse Listings', 'Ver Propiedades')}
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 text-lg hover:bg-white hover:text-[#1B365D] transition-colors"
              >
                {t('Contact Me', 'Contáctame')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
