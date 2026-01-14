'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/clients/danidiaz/components/Nav';
import { useLanguage } from '@/clients/danidiaz/components/LanguageContext';
import { supabase } from '@/lib/supabase';

interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  status: string;
  description: string;
  property_type: string;
  features: string[];
  year_built: number;
  lot_size: string;
  mls_number: string;
}

// Placeholder listing for when Supabase data is not available
const placeholderListing: Listing = {
  id: '1',
  address: '123 Ocean Boulevard',
  city: 'Myrtle Beach',
  state: 'SC',
  zip: '29577',
  price: 425000,
  beds: 4,
  baths: 3,
  sqft: 2450,
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
  ],
  status: 'active',
  description: `This stunning oceanfront home offers breathtaking views of the Atlantic Ocean from nearly every room. The open floor plan features a gourmet kitchen with granite countertops, stainless steel appliances, and a large island perfect for entertaining.

The primary suite boasts a private balcony overlooking the ocean, a spa-like bathroom with dual vanities, a soaking tub, and a walk-in shower. Three additional bedrooms provide ample space for family and guests.

Step outside to enjoy the private pool and hot tub, surrounded by lush landscaping that provides privacy while maintaining those gorgeous ocean views. The outdoor kitchen and covered patio make this the perfect home for beach lovers who love to entertain.`,
  property_type: 'Single Family',
  features: [
    'Ocean Views',
    'Private Pool',
    'Hot Tub',
    'Outdoor Kitchen',
    'Granite Countertops',
    'Stainless Steel Appliances',
    'Primary Suite Balcony',
    'Walk-in Closets',
    'Two-Car Garage',
    'Covered Patio'
  ],
  year_built: 2018,
  lot_size: '0.35 acres',
  mls_number: 'MLS123456'
};

export default function ListingDetailPage() {
  const { language, t } = useLanguage();
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    description: string;
    property_type: string;
    features: string[];
  } | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const { data, error } = await supabase
        .from('featured_properties')
        .select('*')
        .eq('id', params.id)
        .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
        .single();

      if (data) {
        setListing(data);
      } else {
        // Use placeholder if not found
        setListing(placeholderListing);
      }
      setLoading(false);
    }

    fetchListing();
  }, [params.id]);

  // Translate listing content when language changes to Spanish
  useEffect(() => {
    async function translateListing() {
      if (language === 'es' && listing && !translating) {
        // Check cache first
        const cacheKey = `listing_translation_${listing.id}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          try {
            const parsedCache = JSON.parse(cached);
            // Check if cached translation matches current content
            if (parsedCache.original_description === listing.description) {
              setTranslatedContent(parsedCache.translated);
              return;
            }
          } catch (e) {
            // Invalid cache, continue to fetch
          }
        }

        setTranslating(true);
        try {
          const response = await fetch('/api/listings/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              description: listing.description,
              features: listing.features || [],
              property_type: listing.property_type,
            }),
          });

          if (response.ok) {
            const translated = await response.json();
            setTranslatedContent(translated);

            // Cache the translation
            try {
              localStorage.setItem(cacheKey, JSON.stringify({
                original_description: listing.description,
                translated: translated,
                timestamp: Date.now()
              }));
            } catch (e) {
              // Ignore storage errors
            }
          }
        } catch (error) {
          console.error('Failed to translate listing:', error);
        } finally {
          setTranslating(false);
        }
      } else if (language === 'en') {
        setTranslatedContent(null);
      }
    }

    translateListing();
  }, [language, listing]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

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

  if (!listing) {
    return (
      <main className="font-[family-name:var(--font-lora)]">
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-4">
              {t('Listing Not Found', 'Propiedad No Encontrada')}
            </h1>
            <Link href="/listings" className="text-[#C4A25A] hover:underline">
              {t('Back to Listings', 'Volver a Propiedades')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />

      {/* Image Gallery */}
      <section className="pt-24">
        <div className="relative h-[60vh] min-h-[500px]">
          <Image
            src={listing.images?.[selectedImage] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'}
            alt={listing.address}
            fill
            className="object-cover"
            priority
          />
          {listing.status === 'pending' && (
            <div className="absolute top-8 left-8 bg-[#C4A25A] text-white px-4 py-2 text-lg">
              {t('Sale Pending', 'Venta Pendiente')}
            </div>
          )}
          {listing.status === 'sold' && (
            <div className="absolute top-8 left-8 bg-[#3D3D3D] text-white px-4 py-2 text-lg">
              {t('Sold', 'Vendido')}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {listing.images && listing.images.length > 1 && (
          <div className="bg-white py-4">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {listing.images.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-24 flex-shrink-0 overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-[#C4A25A]' : ''
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`${listing.address} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Listing Details */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Header */}
                <div className="mb-8">
                  <p className="text-[#C4A25A] text-lg mb-2">{listing.property_type}</p>
                  <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#1B365D] mb-2">
                    {listing.address}
                  </h1>
                  <p className="text-[#3D3D3D] text-xl">
                    {listing.city}, {listing.state} {listing.zip}
                  </p>
                </div>

                {/* Price & Stats */}
                <div className="bg-[#F7F7F7] p-6 mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                      <p className="text-sm text-[#3D3D3D]/60 mb-1">{t('Price', 'Precio')}</p>
                      <p className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] font-bold">
                        {formatPrice(listing.price)}
                      </p>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-center">
                        <p className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D]">{listing.beds}</p>
                        <p className="text-sm text-[#3D3D3D]/60">{t('Beds', 'Habitaciones')}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D]">{listing.baths}</p>
                        <p className="text-sm text-[#3D3D3D]/60">{t('Baths', 'Baños')}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D]">{listing.sqft?.toLocaleString()}</p>
                        <p className="text-sm text-[#3D3D3D]/60">{t('Sq Ft', 'Pies²')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
                    {t('Description', 'Descripción')}
                  </h2>
                  <div className="text-[#3D3D3D] leading-relaxed whitespace-pre-line relative">
                    {translating && language === 'es' && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex items-center gap-2 text-[#C4A25A]">
                          <div className="animate-spin h-4 w-4 border-2 border-[#C4A25A] border-t-transparent rounded-full"></div>
                          <span className="text-sm">Traduciendo...</span>
                        </div>
                      </div>
                    )}
                    {translatedContent?.description || listing.description}
                  </div>
                </div>

                {/* Features */}
                {listing.features && listing.features.length > 0 && (
                  <div className="mb-8">
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
                      {t('Features', 'Características')}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(translatedContent?.features || listing.features).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-[#C4A25A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[#3D3D3D]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Details */}
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
                    {t('Property Details', 'Detalles de la Propiedad')}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex justify-between py-3 border-b border-[#D6BFAE]/30">
                      <span className="text-[#3D3D3D]/60">{t('Property Type', 'Tipo de Propiedad')}</span>
                      <span className="text-[#3D3D3D]">{translatedContent?.property_type || listing.property_type}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[#D6BFAE]/30">
                      <span className="text-[#3D3D3D]/60">{t('Year Built', 'Año de Construcción')}</span>
                      <span className="text-[#3D3D3D]">{listing.year_built || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[#D6BFAE]/30">
                      <span className="text-[#3D3D3D]/60">{t('Lot Size', 'Tamaño del Lote')}</span>
                      <span className="text-[#3D3D3D]">{listing.lot_size || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[#D6BFAE]/30">
                      <span className="text-[#3D3D3D]/60">MLS #</span>
                      <span className="text-[#3D3D3D]">{listing.mls_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Contact Agent */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#F7F7F7] p-8 sticky top-24"
              >
                <div className="text-center mb-6">
                  <Image
                    src="/dani-diaz-about.JPG"
                    alt="Dani Díaz"
                    width={100}
                    height={100}
                    className="rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D]">
                    Dani Díaz
                  </h3>
                  <p className="text-[#3D3D3D] text-sm">
                    {t('Bilingual Realtor', 'Agente Inmobiliaria Bilingüe')}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <a
                    href="tel:+18435550123"
                    className="flex items-center justify-center gap-2 w-full bg-[#1B365D] text-white px-6 py-3 hover:bg-[#152a4a] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    (843) 555-0123
                  </a>
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full bg-[#C4A25A] text-white px-6 py-3 hover:bg-[#b3923f] transition-colors"
                  >
                    {t('Request Info', 'Solicitar Información')}
                  </button>
                </div>

                {showContactForm && (
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder={t('Your Name', 'Tu Nombre')}
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder={t('Phone', 'Teléfono')}
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      placeholder={t(`I'm interested in ${listing.address}...`, `Me interesa ${listing.address}...`)}
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#1B365D] text-white px-6 py-3 hover:bg-[#152a4a] transition-colors"
                    >
                      {t('Send Message', 'Enviar Mensaje')}
                    </button>
                  </form>
                )}

                <p className="text-xs text-[#3D3D3D]/60 mt-6 text-center">
                  {t(
                    'By requesting info, you agree to be contacted about real estate services.',
                    'Al solicitar información, aceptas ser contactado sobre servicios inmobiliarios.'
                  )}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Listings */}
      <section className="py-8 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/listings"
            className="inline-flex items-center text-[#C4A25A] hover:text-[#1B365D] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {t('Back to All Listings', 'Volver a Todas las Propiedades')}
          </Link>
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
                {t('Bilingual Realtor at Faircloth Real Estate Group', 'Agente Inmobiliaria Bilingüe en Faircloth Real Estate Group')}
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
