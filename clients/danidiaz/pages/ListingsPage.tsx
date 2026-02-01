'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  photos: string[];
  status: string;
  description: string;
  property_type: string;
}


const priceRanges = [
  { value: 'all', label: 'Any Price' },
  { value: '0-300000', label: 'Under $300K' },
  { value: '300000-500000', label: '$300K - $500K' },
  { value: '500000-750000', label: '$500K - $750K' },
  { value: '750000+', label: '$750K+' },
];

const bedOptions = [
  { value: 'all', label: 'Any Beds' },
  { value: '2', label: '2+ Beds' },
  { value: '3', label: '3+ Beds' },
  { value: '4', label: '4+ Beds' },
  { value: '5', label: '5+ Beds' },
];

export function ListingsPage() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const isInternational = searchParams.get('type') === 'international';
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [priceRange, setPriceRange] = useState('all');
  const [beds, setBeds] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      // Fetch from both listings and featured_properties tables
      const featuredQuery = supabase
        .from('featured_properties')
        .select('*')
        .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e');

      if (isInternational) {
        featuredQuery.eq('listing_type', 'international');
      } else {
        featuredQuery.neq('listing_type', 'international');
      }
      featuredQuery.order('display_order', { ascending: true });

      const [listingsResult, featuredResult] = await Promise.all([
        isInternational
          ? Promise.resolve({ data: null })
          : supabase
              .from('listings')
              .select('*')
              .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
              .order('created_at', { ascending: false }),
        featuredQuery
      ]);

      const allListings: Listing[] = [];
      const seenIds = new Set<string>();

      // Add featured properties first (they appear at top)
      if (featuredResult.data && featuredResult.data.length > 0) {
        for (const prop of featuredResult.data) {
          if (!seenIds.has(prop.id)) {
            seenIds.add(prop.id);
            allListings.push({
              id: prop.id,
              address: prop.address || prop.title || 'Property',
              city: prop.city || 'Myrtle Beach',
              state: prop.state || 'SC',
              zip: prop.zip || '',
              price: prop.price || 0,
              beds: prop.beds || 0,
              baths: prop.baths || 0,
              sqft: prop.sqft || 0,
              photos: prop.images || prop.photos || [],
              status: prop.status || 'active',
              description: prop.description || '',
              property_type: prop.property_type || 'Single Family'
            });
          }
        }
      }

      // Add regular listings (skip duplicates)
      if (listingsResult.data && listingsResult.data.length > 0) {
        for (const listing of listingsResult.data) {
          if (!seenIds.has(listing.id)) {
            seenIds.add(listing.id);
            allListings.push(listing);
          }
        }
      }

      setListings(allListings);
      setFilteredListings(allListings);
      setLoading(false);
    }

    fetchListings();
  }, [isInternational]);

  useEffect(() => {
    let filtered = [...listings];

    // Filter by price
    if (priceRange !== 'all') {
      if (priceRange.includes('+')) {
        const min = parseInt(priceRange.replace('+', ''));
        filtered = filtered.filter(l => l.price >= min);
      } else {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter(l => l.price >= min && l.price <= max);
      }
    }

    // Filter by beds
    if (beds !== 'all') {
      const minBeds = parseInt(beds);
      filtered = filtered.filter(l => l.beds >= minBeds);
    }

    // Filter by city
    if (cityFilter !== 'all') {
      filtered = filtered.filter(l => l.city === cityFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.address.toLowerCase().includes(query) ||
        l.city.toLowerCase().includes(query) ||
        l.description?.toLowerCase().includes(query)
      );
    }

    setFilteredListings(filtered);
  }, [priceRange, beds, cityFilter, searchQuery, listings]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

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
              {isInternational
                ? t('International Listings', 'Propiedades Internacionales')
                : t('Property Listings', 'Propiedades')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {isInternational
                ? t(
                    'Featured properties available in international markets',
                    'Propiedades destacadas disponibles en mercados internacionales'
                  )
                : t(
                    'Discover your perfect home in Myrtle Beach and the Grand Strand',
                    'Descubre tu hogar perfecto en Myrtle Beach y el Grand Strand'
                  )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-[#D6BFAE]/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-auto flex-grow max-w-md">
              <input
                type="text"
                placeholder={t('Search by location...', 'Buscar por ubicación...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none bg-white"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none bg-white"
              >
                {bedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* City Filter Chips */}
      {(() => {
        const cities = Array.from(new Set(listings.map(l => l.city).filter(Boolean))).sort();
        if (cities.length <= 1) return null;
        return (
          <section className="py-4 bg-[#F7F7F7] border-b border-[#D6BFAE]/20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCityFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    cityFilter === 'all'
                      ? 'bg-[#1B365D] text-white'
                      : 'bg-white text-[#3D3D3D] hover:bg-[#1B365D]/10 border border-[#D6BFAE]'
                  }`}
                >
                  {t('All Cities', 'Todas las Ciudades')}
                </button>
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => setCityFilter(city)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      cityFilter === city
                        ? 'bg-[#1B365D] text-white'
                        : 'bg-white text-[#3D3D3D] hover:bg-[#1B365D]/10 border border-[#D6BFAE]'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Results Count */}
      <section className="py-6 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#3D3D3D]">
            {t(
              `Showing ${filteredListings.length} ${filteredListings.length === 1 ? 'property' : 'properties'}`,
              `Mostrando ${filteredListings.length} ${filteredListings.length === 1 ? 'propiedad' : 'propiedades'}`
            )}
          </p>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#3D3D3D] text-lg mb-4">
                {t('No properties found matching your criteria.', 'No se encontraron propiedades que coincidan con tus criterios.')}
              </p>
              <button
                onClick={() => {
                  setPriceRange('all');
                  setBeds('all');
                  setSearchQuery('');
                }}
                className="text-[#C4A25A] hover:underline"
              >
                {t('Clear filters', 'Limpiar filtros')}
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {isInternational ? (
                    <Link
                      href={`/listings/${listing.id}`}
                      className="relative h-96 overflow-hidden shadow-lg md:hover:shadow-2xl transition-shadow duration-300 group cursor-pointer block"
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={listing.photos?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                          alt={listing.address}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute top-4 left-4 bg-[#3D3D3D] text-white px-4 py-2 font-semibold z-10">
                        {formatPrice(listing.price)}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-6 translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#3D3D3D] mb-1">
                          {listing.address}
                        </h3>
                        <p className="text-[#3D3D3D] mb-4">{listing.city}, {listing.state}</p>
                        <div className="flex gap-4 text-sm text-[#3D3D3D]">
                          {listing.beds > 0 && <span>{listing.beds} {t('beds', 'hab')}</span>}
                          {listing.beds > 0 && listing.baths > 0 && <span>•</span>}
                          {listing.baths > 0 && <span>{listing.baths} {t('baths', 'baños')}</span>}
                          {listing.baths > 0 && listing.sqft > 0 && <span>•</span>}
                          {listing.sqft > 0 && <span>{listing.sqft.toLocaleString()} {t('sq ft', 'pies²')}</span>}
                        </div>
                      </div>
                      <div className="md:hidden absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-6">
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#3D3D3D] mb-1">
                          {listing.address}
                        </h3>
                        <p className="text-[#3D3D3D] mb-4">{listing.city}, {listing.state}</p>
                        <div className="flex gap-4 text-sm text-[#3D3D3D]">
                          {listing.beds > 0 && <span>{listing.beds} {t('beds', 'hab')}</span>}
                          {listing.beds > 0 && listing.baths > 0 && <span>•</span>}
                          {listing.baths > 0 && <span>{listing.baths} {t('baths', 'baños')}</span>}
                          {listing.baths > 0 && listing.sqft > 0 && <span>•</span>}
                          {listing.sqft > 0 && <span>{listing.sqft.toLocaleString()} {t('sq ft', 'pies²')}</span>}
                        </div>
                      </div>
                    </Link>
                  ) : (
                  <Link href={`/listings/${listing.id}`} className="group block">
                    <div className="bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={listing.photos?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                          alt={listing.address}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-[#1B365D] text-white px-4 py-2 font-semibold">
                          {formatPrice(listing.price)}
                        </div>
                        {listing.status === 'pending' && (
                          <div className="absolute top-4 right-4 bg-[#C4A25A] text-white px-3 py-1 text-sm">
                            {t('Pending', 'Pendiente')}
                          </div>
                        )}
                        {listing.status === 'sold' && (
                          <div className="absolute top-4 right-4 bg-[#3D3D3D] text-white px-3 py-1 text-sm">
                            {t('Sold', 'Vendido')}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-1 group-hover:text-[#C4A25A] transition-colors">
                          {listing.address}
                        </h3>
                        <p className="text-[#3D3D3D] mb-4">
                          {listing.city}, {listing.state} {listing.zip}
                        </p>
                        <div className="flex gap-4 text-sm text-[#3D3D3D] border-t border-[#D6BFAE]/30 pt-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {listing.beds} {t('beds', 'hab')}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            {listing.baths} {t('baths', 'baños')}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            {listing.sqft?.toLocaleString()} {t('sq ft', 'pies²')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}
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
              {t("Can't Find What You're Looking For?", '¿No Encuentras Lo Que Buscas?')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                "Let me know your criteria and I'll help you find the perfect property.",
                "Cuéntame tus criterios y te ayudaré a encontrar la propiedad perfecta."
              )}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors"
            >
              {t('Contact Me', 'Contáctame')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B365D] py-12 border-t border-white/10">
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
