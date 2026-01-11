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
  price_range: string;
  image_url: string;
  display_order: number;
}

export default function NeighborhoodGuides() {
  const { t } = useLanguage();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNeighborhoods() {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
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

  return (
    <>
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#1B365D] mb-4">
              {t('Explore the Grand Strand', 'Explora el Grand Strand')}
            </h2>
            <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
              {t(
                'Discover the unique neighborhoods that make our coast special',
                'Descubre los vecindarios únicos que hacen especial nuestra costa'
              )}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#1B365D] text-white flex items-center justify-center hover:bg-[#C4A25A] transition-colors shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#1B365D] text-white flex items-center justify-center hover:bg-[#C4A25A] transition-colors shadow-lg"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {neighborhoods.map((neighborhood) => (
                <button
                  key={neighborhood.id}
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
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedNeighborhood && (
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
                  alt={selectedNeighborhood.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-white font-bold">
                    {selectedNeighborhood.name}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Description */}
                <div className="prose prose-lg max-w-none mb-8">
                  {selectedNeighborhood.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-[#3D3D3D] leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Highlights */}
                {selectedNeighborhood.highlights && selectedNeighborhood.highlights.length > 0 && (
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
                      {t('Highlights', 'Destacados')}
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {selectedNeighborhood.highlights.map((highlight, index) => (
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
        )}
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
