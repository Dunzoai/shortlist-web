'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
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

// Placeholder listings for when Supabase data is not available
const placeholderListings: Listing[] = [
  {
    id: '1',
    address: '123 Ocean Boulevard',
    city: 'Myrtle Beach',
    state: 'SC',
    zip: '29577',
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2450,
    photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    status: 'active',
    description: 'Beautiful oceanfront home with stunning views',
    property_type: 'Single Family'
  },
  {
    id: '2',
    address: '456 Marsh View Drive',
    city: 'Pawleys Island',
    state: 'SC',
    zip: '29585',
    price: 575000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    status: 'active',
    description: 'Luxurious marsh-front estate with private dock',
    property_type: 'Single Family'
  },
  {
    id: '3',
    address: '789 Coastal Lane',
    city: 'Surfside Beach',
    state: 'SC',
    zip: '29575',
    price: 325000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    photos: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'],
    status: 'active',
    description: 'Charming beach cottage steps from the sand',
    property_type: 'Single Family'
  },
  {
    id: '4',
    address: '321 Golf Course Way',
    city: 'Myrtle Beach',
    state: 'SC',
    zip: '29579',
    price: 289000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    photos: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'],
    status: 'active',
    description: 'Golf course community with resort amenities',
    property_type: 'Condo'
  },
  {
    id: '5',
    address: '555 Beachside Terrace',
    city: 'North Myrtle Beach',
    state: 'SC',
    zip: '29582',
    price: 459000,
    beds: 4,
    baths: 3,
    sqft: 2100,
    photos: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'],
    status: 'pending',
    description: 'Modern home with ocean views and pool',
    property_type: 'Single Family'
  },
  {
    id: '6',
    address: '888 Harbor View Court',
    city: 'Little River',
    state: 'SC',
    zip: '29566',
    price: 375000,
    beds: 3,
    baths: 2.5,
    sqft: 2000,
    photos: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'],
    status: 'active',
    description: 'Waterfront townhome with boat slip',
    property_type: 'Townhouse'
  },
];

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
  const [listings, setListings] = useState<Listing[]>(placeholderListings);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(placeholderListings);
  const [priceRange, setPriceRange] = useState('all');
  const [beds, setBeds] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setListings(data);
        setFilteredListings(data);
      }
      setLoading(false);
    }

    fetchListings();
  }, []);

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
  }, [priceRange, beds, searchQuery, listings]);

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
              {t('Property Listings', 'Propiedades')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
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
                  <Link href={`/listings/${listing.id}`} className="group block">
                    <div className="bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative h-64 overflow-hidden">
                        {/* TODO: Replace with actual listing photos */}
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
