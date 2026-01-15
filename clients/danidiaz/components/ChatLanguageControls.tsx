'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';

export default function ChatLanguageControls() {
  const { language, setLanguage } = useLanguage();
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll detection - hide while scrolling, show after 500ms pause
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to show after 500ms of no scrolling
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

  // Chat expansion detection
  useEffect(() => {
    const checkChatState = () => {
      const chatIframes = document.querySelectorAll('iframe[src*="shortlistpass"], iframe[src*="smartpage"]');
      let expanded = false;

      chatIframes.forEach((iframe) => {
        const rect = iframe.getBoundingClientRect();
        if (rect.height > 300) {
          expanded = true;
        }
      });

      setIsChatExpanded(expanded);
    };

    const initialTimeout = setTimeout(checkChatState, 1000);
    const observer = new MutationObserver(checkChatState);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    const interval = setInterval(checkChatState, 1000);

    return () => {
      clearTimeout(initialTimeout);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Don't show if chat is expanded or user is scrolling
  const shouldShow = !isChatExpanded && !isScrolling;

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className={`fixed bottom-[70px] right-[20px] z-[9999] flex items-center gap-2 bg-white text-[#1B365D] text-sm border border-[#1B365D]/30 rounded-full px-4 py-2 hover:bg-[#F7F7F7] shadow-lg cursor-pointer transition-all duration-300 ${
        shouldShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className={language === 'en' ? 'font-semibold' : 'opacity-60'}>EN</span>
      <span className="text-[#1B365D]/40">|</span>
      <span className={language === 'es' ? 'font-semibold' : 'opacity-60'}>ES</span>
    </button>
  );
}
