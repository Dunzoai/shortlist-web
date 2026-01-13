'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

export default function ParallaxSection() {
  const { language, t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    // Mobile: Use a simple static image with overlay
    return (
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/dani-phone-laptop.jpg)',
            backgroundPosition: 'center 35%'
          }}
        />
        <div className="absolute inset-0 bg-[#1B365D]/30" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h2 className="text-white text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-bold text-center px-6 drop-shadow-lg">
            {t('From Global Roots to Local Roofs', 'De Raíces Globales a Techos Locales')}
          </h2>
        </div>
      </section>
    );
  }

  // Desktop: Use CSS parallax
  return (
    <div className="parallax-section">
      <div className="absolute inset-0 bg-[#1B365D]/30"></div>
      <div className="relative text-center px-6 z-10">
        <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] font-bold drop-shadow-lg">
          {t('From Global Roots to Local Roofs', 'De Raíces Globales a Techos Locales')}
        </h2>
      </div>
    </div>
  );
}
