'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageContext';

export default function ParallaxSection() {
  const { language, t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (!imageRef.current || !sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = -rect.top;

      // Only apply effect when section is in view
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        imageRef.current.style.transform = `translateY(${scrollProgress * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative h-[80vh] w-screen left-0 right-0 overflow-hidden">
        <div
          ref={imageRef}
          className="absolute -top-[40%] left-0 w-full h-[150%] bg-cover bg-no-repeat will-change-transform"
          style={{
            backgroundImage: 'url(/dani-phone-laptop.jpg)',
            backgroundPosition: 'center center'
          }}
        />
        <div className="absolute inset-0 bg-[#1B365D]/30 z-10" />
      </section>
    );
  }

  // Desktop: Use CSS parallax (background-attachment: fixed works here)
  return (
    <div className="parallax-section">
      <div className="absolute inset-0 bg-[#1B365D]/30" />
      <div className="relative z-10 text-center px-6">
        <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] font-bold drop-shadow-lg">
          {t('From Global Roots to Local Roofs', 'De Raíces Globales a Techos Locales')}
        </h2>
      </div>
    </div>
  );
}
