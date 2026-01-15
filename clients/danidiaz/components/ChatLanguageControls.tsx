'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';

export default function ChatLanguageControls() {
  const { language, setLanguage } = useLanguage();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll detection - hide while scrolling, show after 500ms pause
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2 bg-white text-[#1B365D] text-sm border border-[#1B365D]/30 rounded-full px-4 py-2 hover:bg-[#F7F7F7] shadow-lg cursor-pointer transition-all duration-300 ${
        isScrolling ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <span className={language === 'en' ? 'font-semibold' : 'opacity-60'}>EN</span>
      <span className="text-[#1B365D]/40">|</span>
      <span className={language === 'es' ? 'font-semibold' : 'opacity-60'}>ES</span>
    </button>
  );
}
