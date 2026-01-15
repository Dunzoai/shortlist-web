'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';

export default function ChatLanguageControls() {
  const { language, setLanguage } = useLanguage();
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  useEffect(() => {
    // Observe DOM for SmartPage widget expansion
    // The widget typically adds/removes classes or changes dimensions when expanded
    const checkChatState = () => {
      // Look for common SmartPage widget expanded states
      const widgetElements = document.querySelectorAll(
        '[id*="smartpage"], [id*="slp-"], [class*="smartpage"], [class*="slp-"], iframe[src*="shortlistpass"]'
      );

      let expanded = false;
      widgetElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If widget is larger than typical pill size (e.g., > 100px height), it's expanded
        if (rect.height > 100 || rect.width > 200) {
          expanded = true;
        }
        // Also check for expanded class names
        if (
          el.classList.contains('expanded') ||
          el.classList.contains('open') ||
          el.classList.contains('active') ||
          el.getAttribute('data-state') === 'open' ||
          el.getAttribute('data-expanded') === 'true'
        ) {
          expanded = true;
        }
      });

      setIsChatExpanded(expanded);
    };

    // Initial check
    checkChatState();

    // Set up MutationObserver to watch for widget changes
    const observer = new MutationObserver(() => {
      checkChatState();
    });

    // Observe the entire body for changes (widget is injected dynamically)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-state', 'data-expanded'],
    });

    // Also poll periodically as a fallback (some widgets don't trigger mutations)
    const interval = setInterval(checkChatState, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed top-20 right-6 z-[60] flex flex-col items-end gap-3">
      {/* Language Toggle - Hidden when chat is expanded */}
      <AnimatePresence>
        {!isChatExpanded && (
          <motion.button
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-2 bg-[#1B365D] text-white text-sm border border-white/30 rounded-full px-4 py-2 hover:bg-[#2a4a7a] transition-colors shadow-lg"
          >
            <span className={language === 'en' ? 'font-semibold' : 'opacity-60'}>EN</span>
            <span className="text-white/40">|</span>
            <span className={language === 'es' ? 'font-semibold' : 'opacity-60'}>ES</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Spacer for where SmartPage widget will appear */}
      {/* The widget.js will inject its element here via CSS positioning */}
    </div>
  );
}
