'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/components/LanguageContext';

interface Neighborhood {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  name_es?: string;
  description_es?: string;
  highlights_es?: string[];
  price_range: string;
  image_url: string;
  display_order: number;
}

export default function NeighborhoodGuides() {
  const { t, language } = useLanguage();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNeighborhoods() {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('id, name, description, highlights, image_url, display_order, price_range, name_es, description_es, highlights_es')
        .order('display_order', { ascending: true });

      if (data) {
        setNeighborhoods(data);
      }
    }

    fetchNeighborhoods();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (neighborhoods.length === 0) {
    return null;
  }

  // Create an infinite loop by tripling the neighborhoods array
  const infiniteNeighborhoods = [...neighborhoods, ...neighborhoods, ...neighborhoods];

  return (
    <>
      <section id="neighborhoods" className="relative z-10 py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header with Navigation Arrows */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6 md:mb-12">
              <div className="flex-1">
                <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#1B365D] mb-4">
                  {t('Explore the Grand Strand', 'Explora el Grand Strand')}
                </h2>
                <p className="text-[#3D3D3D] text-lg max-w-2xl">
                  {t(
                    'Discover the unique neighborhoods that make our coast special',
                    'Descubre los vecindarios únicos que hacen especial nuestra costa'
                  )}
                </p>
              </div>

              {/* Navigation Arrows - Desktop: top right */}
              <div className="hidden md:flex gap-3 ml-6">
                <button
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full bg-[#1B365D] text-white flex items-center justify-center hover:bg-[#C4A25A] transition-colors shadow-lg"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full bg-[#1B365D] text-white flex items-center justify-center hover:bg-[#C4A25A] transition-colors shadow-lg"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Navigation Arrows - Mobile: above images */}
            <div className="flex md:hidden gap-3 justify-end mb-4">
              <button
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full bg-[#1B365D] text-white flex items-center justify-center hover:bg-[#C4A25A] transition-colors shadow-lg"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full bg-[#1B365D] text-white flex items-center justify-center hover:bg-[#C4A25A] transition-colors shadow-lg"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {infiniteNeighborhoods.map((neighborhood, index) => (
              <button
                key={`${neighborhood.id}-${index}`}
                onClick={() => setSelectedNeighborhood(neighborhood)}
                className="flex-shrink-0 w-80 group cursor-pointer"
              >
                <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={neighborhood.image_url}
                    alt={neighborhood.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-white font-bold">
                      {neighborhood.name}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedNeighborhood && (() => {
          // Get language-specific content
          const displayName = language === 'es' && selectedNeighborhood.name_es
            ? selectedNeighborhood.name_es
            : selectedNeighborhood.name;
          const displayDescription = language === 'es' && selectedNeighborhood.description_es
            ? selectedNeighborhood.description_es
            : selectedNeighborhood.description;
          const displayHighlights = language === 'es' && selectedNeighborhood.highlights_es
            ? selectedNeighborhood.highlights_es
            : selectedNeighborhood.highlights;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedNeighborhood(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedNeighborhood(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-[#1B365D] flex items-center justify-center hover:bg-[#C4A25A] hover:text-white transition-colors shadow-lg z-10"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>

                {/* Hero Image */}
                <div className="relative h-96 w-full">
                  <Image
                    src={selectedNeighborhood.image_url}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-white font-bold">
                      {displayName}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Description */}
                  <div className="prose prose-lg max-w-none mb-8">
                    {displayDescription.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-[#3D3D3D] leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Highlights */}
                  {displayHighlights && displayHighlights.length > 0 && (
                    <div>
                      <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
                        {t('Highlights', 'Destacados')}
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {displayHighlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#C4A25A] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check size={16} className="text-white" />
                            </div>
                            <span className="text-[#3D3D3D]">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
