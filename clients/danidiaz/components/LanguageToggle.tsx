'use client';

import { useLanguage } from './LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg hover:bg-white/30"
      aria-label="Toggle language"
    >
      <span className={`transition-opacity ${language === 'en' ? 'opacity-100 font-semibold' : 'opacity-50'}`}>
        EN
      </span>
      <span className="text-white/60">|</span>
      <span className={`transition-opacity ${language === 'es' ? 'opacity-100 font-semibold' : 'opacity-50'}`}>
        ES
      </span>
    </button>
  );
}
