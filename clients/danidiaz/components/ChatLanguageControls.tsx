'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

export default function ChatLanguageControls() {
  const { language, setLanguage } = useLanguage();
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  useEffect(() => {
    // Observe DOM for SmartPage widget expansion
    const checkChatState = () => {
      // Look for iframes which indicate the chat is open
      const chatIframes = document.querySelectorAll('iframe[src*="shortlistpass"], iframe[src*="smartpage"]');

      let expanded = false;
      chatIframes.forEach((iframe) => {
        const rect = iframe.getBoundingClientRect();
        // Chat window is typically > 300px tall when open
        if (rect.height > 300) {
          expanded = true;
        }
      });

      // Also check for any element with expanded/open data attributes
      const expandedElements = document.querySelectorAll('[data-state="open"], [data-expanded="true"], [aria-expanded="true"]');
      if (expandedElements.length > 0) {
        expandedElements.forEach((el) => {
          // Only count if it looks like a chat widget
          if (el.closest('[class*="smartpage"]') || el.closest('[class*="slp"]') || el.closest('[id*="smartpage"]')) {
            expanded = true;
          }
        });
      }

      setIsChatExpanded(expanded);
    };

    // Initial check after a short delay to let widget load
    const initialTimeout = setTimeout(checkChatState, 1000);

    // Set up MutationObserver to watch for widget changes
    const observer = new MutationObserver(() => {
      checkChatState();
    });

    // Observe the entire body for changes (widget is injected dynamically)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-state', 'data-expanded', 'aria-expanded'],
    });

    // Also poll periodically as a fallback
    const interval = setInterval(checkChatState, 1000);

    return () => {
      clearTimeout(initialTimeout);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Language Toggle - Centered above the chat widget pill */}
      {!isChatExpanded && (
        <div className="fixed bottom-[60px] right-[16px] z-[9999] flex justify-center" style={{ width: '260px' }}>
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-2 bg-white text-[#1B365D] text-sm border border-[#1B365D]/30 rounded-full px-4 py-2 hover:bg-[#F7F7F7] transition-all shadow-lg"
          >
            <span className={language === 'en' ? 'font-semibold' : 'opacity-60'}>EN</span>
            <span className="text-[#1B365D]/40">|</span>
            <span className={language === 'es' ? 'font-semibold' : 'opacity-60'}>ES</span>
          </button>
        </div>
      )}
    </>
  );
}
