'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import content from '../content';

const BG = '#0a0807';
const GOLD = '#c9a96e';

function shuffle(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Gallery() {
  const [topImages, setTopImages] = useState<string[]>([]);
  const [bottomImages, setBottomImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const shuffled = shuffle([...content.gallery.images]);
    setTopImages(shuffled.slice(0, 6));
    setBottomImages(shuffled.slice(6, 12));
  }, []);

  const handleSelect = (src: string) => {
    setSelected(src);
    setPaused(true);
  };

  const handleClose = useCallback(() => {
    setSelected(null);
    setPaused(false);
  }, []);

  // ESC key closes lightbox
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, handleClose]);

  const topRow = [...topImages, ...topImages];
  const bottomRow = [...bottomImages, ...bottomImages];

  if (topImages.length === 0) return null;

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: BG }}>
      {/* Section header */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        <p
          className="text-sm font-semibold uppercase tracking-[0.3em]"
          style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
        >
          {content.gallery.sectionLabel}
        </p>
        <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
      </div>

      {/* Marquee container */}
      <div className="overflow-hidden">
        {/* Top row — scrolls left */}
        <div className="mb-3">
          <div
            className="flex gap-3 marquee-left"
            style={{ animationPlayState: paused ? 'paused' : 'running' }}
          >
            {topRow.map((src, i) => (
              <button
                key={`top-${i}`}
                onClick={() => handleSelect(src)}
                className="flex-shrink-0 rounded-md overflow-hidden shadow-lg hover:scale-105 hover:ring-2 hover:ring-[#c9a96e]/40 transition-transform duration-200"
              >
                <Image
                  src={src}
                  alt={content.gallery.imageAlt}
                  width={320}
                  height={320}
                  loading="lazy"
                  className="w-48 h-48 md:w-64 md:h-64 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom row — scrolls right */}
        <div>
          <div
            className="flex gap-3 marquee-right"
            style={{ animationPlayState: paused ? 'paused' : 'running' }}
          >
            {bottomRow.map((src, i) => (
              <button
                key={`bottom-${i}`}
                onClick={() => handleSelect(src)}
                className="flex-shrink-0 rounded-md overflow-hidden shadow-lg hover:scale-105 hover:ring-2 hover:ring-[#c9a96e]/40 transition-transform duration-200"
              >
                <Image
                  src={src}
                  alt={content.gallery.imageAlt}
                  width={320}
                  height={320}
                  loading="lazy"
                  className="w-48 h-48 md:w-64 md:h-64 object-cover"
                />
              </button>
            ))}
          </div>
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
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:scale-110 transition-all z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <Image
            src={selected}
            alt={content.gallery.imageAlt}
            width={900}
            height={900}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
