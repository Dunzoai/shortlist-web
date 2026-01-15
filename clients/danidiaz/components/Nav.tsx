'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';

const navItems = [
  { href: '/', labelEn: 'Home', labelEs: 'Inicio' },
  { href: '/buyers', labelEn: 'Buyers', labelEs: 'Compradores' },
  { href: '/sellers', labelEn: 'Sellers', labelEs: 'Vendedores' },
  { href: '/international', labelEn: 'International', labelEs: 'Internacional' },
  { href: '/about', labelEn: 'About', labelEs: 'Acerca' },
  { href: '/blog', labelEn: 'Blog', labelEs: 'Blog' },
];

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#1B365D] shadow-lg py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-white">
            Dani Díaz
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white text-sm tracking-wide hover:text-[#C4A25A] transition-colors"
                >
                  {language === 'en' ? item.labelEn : item.labelEs}
                </Link>
              </li>
            ))}
            {/* Language toggle moved to ChatLanguageControls component */}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#1B365D] pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white text-xl font-[family-name:var(--font-playfair)] hover:text-[#C4A25A] transition-colors"
                >
                  {language === 'en' ? item.labelEn : item.labelEs}
                </Link>
              ))}

              {/* Mobile Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center gap-3 text-white text-lg border border-white/30 rounded-full px-4 py-2 mt-4"
              >
                <span className={language === 'en' ? 'font-semibold' : 'opacity-60'}>English</span>
                <span className="text-white/40">|</span>
                <span className={language === 'es' ? 'font-semibold' : 'opacity-60'}>Español</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
