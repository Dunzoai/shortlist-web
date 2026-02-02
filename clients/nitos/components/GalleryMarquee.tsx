'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const ALL_IMAGES = Array.from({ length: 12 }, (_, i) => `/nitos-gallery/nitos-gallery-${i + 1}.png`);

function shuffle(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function GalleryMarquee() {
  const [topImages, setTopImages] = useState<string[]>([]);
  const [bottomImages, setBottomImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const shuffled = shuffle(ALL_IMAGES);
    setTopImages(shuffled.slice(0, 6));
    setBottomImages(shuffled.slice(6, 12));
  }, []);

  const handleSelect = (src: string) => {
    setSelected(src);
    setPaused(true);
  };

  const handleClose = () => {
    setSelected(null);
    setPaused(false);
  };

  // Duplicate images for seamless loop
  const topRow = [...topImages, ...topImages];
  const bottomRow = [...bottomImages, ...bottomImages];

  if (topImages.length === 0) return null;

  return (
    <section className="py-12 bg-[#1a1a1a] overflow-hidden">
      <h2
        className="text-3xl md:text-4xl font-bold text-center text-white mb-8"
        style={{ fontFamily: 'serif' }}
      >
        Fresh Off the Grill
      </h2>

      {/* Top row - scrolls left */}
      <div className="mb-3">
        <div
          className="flex gap-3 marquee-left"
          style={{ animationPlayState: paused ? 'paused' : 'running' }}
        >
          {topRow.map((src, i) => (
            <button
              key={`top-${i}`}
              onClick={() => handleSelect(src)}
              className="flex-shrink-0 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              <Image
                src={src}
                alt="Nito's Empanadas"
                width={280}
                height={280}
                className="w-48 h-48 md:w-64 md:h-64 object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row - scrolls right */}
      <div>
        <div
          className="flex gap-3 marquee-right"
          style={{ animationPlayState: paused ? 'paused' : 'running' }}
        >
          {bottomRow.map((src, i) => (
            <button
              key={`bottom-${i}`}
              onClick={() => handleSelect(src)}
              className="flex-shrink-0 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200"
            >
              <Image
                src={src}
                alt="Nito's Empanadas"
                width={280}
                height={280}
                className="w-48 h-48 md:w-64 md:h-64 object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10"
          >
            &times;
          </button>
          <Image
            src={selected}
            alt="Nito's Empanadas"
            width={800}
            height={800}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
