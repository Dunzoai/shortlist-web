'use client';

import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-16 bg-[#1B365D]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 items-start">
          {/* Brand Section */}
          <div className="md:col-span-3">
            <h2 className="font-[family-name:var(--font-playfair)] text-white text-5xl md:text-6xl font-bold mb-8">
              Dani Díaz
            </h2>
            <h3 className="text-white text-sm font-semibold tracking-wider mb-4">
              {t('CONTACT', 'CONTACTO')}
            </h3>
            <div className="space-y-3">
              <a
                href="tel:+18435035038"
                className="block text-white hover:text-[#C4A25A] transition-colors"
              >
                (843) 503-5038
              </a>
              <a
                href="mailto:danidiazrealestate@gmail.com"
                className="block text-white hover:text-[#C4A25A] transition-colors text-sm"
              >
                danidiazrealestate@gmail.com
              </a>
            </div>
          </div>

          {/* Address Section */}
          <div className="md:col-span-3">
            <h3 className="text-white text-sm font-semibold tracking-wider mb-4 mt-[88px] md:mt-[104px]">
              {t('ADDRESS', 'DIRECCIÓN')}
            </h3>
            <div className="text-white">
              <p>730 Main Street #355</p>
              <p>North Myrtle Beach, SC 29572</p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block md:col-span-1">
            <div className="h-full w-px bg-white/30 mx-auto"></div>
          </div>

          {/* Faircloth and Social Icons Section */}
          <div className="md:col-span-5 flex justify-end items-start -mt-8">
            <div className="flex flex-col items-center gap-1 mr-[-100px]">
              {/* Faircloth Real Estate Logo */}
              <div className="relative w-[750px] h-[188px] md:w-[1125px] md:h-[281px]">
                <Image
                  src="/faircloth-real-estate-logo.png"
                  alt="Faircloth Real Estate Group"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>

              {/* Social Icons - centered under logo */}
              <div className="flex gap-3">
              <a
                href="https://www.facebook.com/daniampudiazv/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B365D] hover:bg-[#C4A25A] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/dani.globalhomes/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B365D] hover:bg-[#C4A25A] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/danidiazrealtor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B365D] hover:bg-[#C4A25A] hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.realtor.com/realestateagents/66abbb21e7320c7ad682b6a8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B365D] hover:bg-[#C4A25A] hover:text-white transition-colors font-bold text-xl"
                aria-label="Realtor.com"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                R
              </a>
            </div>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-white/20 pt-8">
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-6 md:gap-8 justify-center md:justify-start mb-6">
            <a
              href="/about"
              className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
            >
              {t('ABOUT', 'ACERCA DE')}
            </a>
            <a
              href="/buyers"
              className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
            >
              {t('BUYERS', 'COMPRADORES')}
            </a>
            <a
              href="/sellers"
              className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
            >
              {t('SELLERS', 'VENDEDORES')}
            </a>
            <a
              href="/international"
              className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
            >
              {t('INTERNATIONAL', 'INTERNACIONAL')}
            </a>
            <a
              href="/#contact"
              className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
            >
              {t("LET'S CONNECT", 'CONECTEMOS')}
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-white/60 text-xs">
              © {new Date().getFullYear()} Dani Díaz. {t('All rights reserved.', 'Todos los derechos reservados.')}
            </p>
            <p className="mt-2">
              <a
                href="/admin"
                className="text-white/30 hover:text-white/50 transition-colors text-xs"
              >
                Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
