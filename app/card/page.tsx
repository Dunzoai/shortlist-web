'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { downloadVCard } from '@/lib/vcard';
import { useLanguage } from '@/clients/danidiaz/components/LanguageContext';

export default function DigitalCardPage() {
  const { t } = useLanguage();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleShare = async () => {
    const shareData = {
      title: t('Dani Díaz - Bilingual Realtor', 'Dani Díaz - Agente Inmobiliaria Bilingüe'),
      text: t(
        'Connect with Dani Díaz, your bilingual real estate expert on the Grand Strand.',
        'Conecta con Dani Díaz, tu experta bilingüe en bienes raíces en el Grand Strand.'
      ),
      url: 'https://demo-danidiaz.shortlistpass.com/card',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error - fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('https://demo-danidiaz.shortlistpass.com/card');
    showNotification(t('Link copied!', '¡Enlace copiado!'));
  };

  const handleSaveContact = () => {
    downloadVCard();
    showNotification(t('Contact saved!', '¡Contacto guardado!'));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  } as const;

  const photoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  } as const;

  const floatAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1B365D] via-[#162c4d] to-[#0f1f35] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M0 50 Q25 30 50 50 T100 50"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <path
                d="M0 70 Q25 50 50 70 T100 70"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* Toast notification */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showToast ? 1 : 0, y: showToast ? 0 : -20 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#C4A25A] text-white px-6 py-3 rounded-full shadow-lg z-50 font-[family-name:var(--font-lora)]"
      >
        {toastMessage}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center px-6 py-12 min-h-screen"
      >
        {/* Photo with gold ring */}
        <motion.div
          variants={photoVariants}
          animate={floatAnimation}
          className="relative mb-6"
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-br from-[#C4A25A] via-[#d4b46a] to-[#C4A25A] shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#1B365D]">
              <Image
                src="/dani-diaz-home-about.JPG"
                alt="Dani Díaz"
                width={192}
                height={192}
                className="w-full h-full object-cover object-[center_15%] scale-150"
                priority
              />
            </div>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-[#C4A25A] opacity-20 blur-xl -z-10" />
        </motion.div>

        {/* Name and title */}
        <motion.h1
          variants={itemVariants}
          className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-white text-center mb-2"
        >
          Dani Díaz
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-[family-name:var(--font-lora)] text-[#C4A25A] text-lg md:text-xl mb-1"
        >
          {t('Bilingual Realtor®', 'Agente Inmobiliaria Bilingüe®')}
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="font-[family-name:var(--font-lora)] text-white/60 text-sm mb-6"
        >
          Faircloth Real Estate Group
        </motion.p>

        {/* Gold divider */}
        <motion.div
          variants={itemVariants}
          className="w-24 h-px bg-gradient-to-r from-transparent via-[#C4A25A] to-transparent mb-8"
        />

        {/* Contact buttons */}
        <motion.div variants={itemVariants} className="w-full max-w-sm space-y-3 mb-8">
          <a
            href="tel:+18435035038"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full border-2 border-[#C4A25A] text-white hover:bg-[#C4A25A]/10 transition-all duration-300 font-[family-name:var(--font-lora)]"
          >
            <span className="text-xl">📞</span>
            <span>{t('Call', 'Llamar')}</span>
          </a>

          <a
            href="mailto:danidiazrealestate@gmail.com"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full border-2 border-[#C4A25A] text-white hover:bg-[#C4A25A]/10 transition-all duration-300 font-[family-name:var(--font-lora)]"
          >
            <span className="text-xl">✉️</span>
            <span>{t('Email', 'Correo')}</span>
          </a>

          <a
            href="https://demo-danidiaz.shortlistpass.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full border-2 border-[#C4A25A] text-white hover:bg-[#C4A25A]/10 transition-all duration-300 font-[family-name:var(--font-lora)]"
          >
            <span className="text-xl">🌐</span>
            <span>{t('Website', 'Sitio Web')}</span>
          </a>

          <div className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full border-2 border-white/20 text-white/70 font-[family-name:var(--font-lora)]">
            <span className="text-xl">📍</span>
            <span>Myrtle Beach, SC</span>
          </div>
        </motion.div>

        {/* Social icons */}
        <motion.div variants={itemVariants} className="flex gap-4 mb-8">
          <a
            href="https://www.instagram.com/dani.globalhomes/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-[#C4A25A]/50 flex items-center justify-center text-white hover:bg-[#C4A25A]/20 hover:border-[#C4A25A] transition-all duration-300"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <a
            href="https://www.facebook.com/daniampudiazv/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-[#C4A25A]/50 flex items-center justify-center text-white hover:bg-[#C4A25A]/20 hover:border-[#C4A25A] transition-all duration-300"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/danidiazrealtor"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border-2 border-[#C4A25A]/50 flex items-center justify-center text-white hover:bg-[#C4A25A]/20 hover:border-[#C4A25A] transition-all duration-300"
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={itemVariants} className="w-full max-w-sm space-y-3 mb-10">
          <button
            onClick={handleSaveContact}
            className="w-full py-4 px-6 rounded-full bg-[#C4A25A] text-white font-semibold hover:bg-[#b3923f] transition-all duration-300 shadow-lg shadow-[#C4A25A]/30 font-[family-name:var(--font-lora)] text-lg"
          >
            {t('Save Contact', 'Guardar Contacto')}
          </button>

          <button
            onClick={handleShare}
            className="w-full py-4 px-6 rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 font-[family-name:var(--font-lora)]"
          >
            {t('Share', 'Compartir')}
          </button>
        </motion.div>

        {/* QR Code section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="bg-white p-3 rounded-xl shadow-lg mb-3">
            <QRCodeSVG
              value="https://demo-danidiaz.shortlistpass.com/card"
              size={100}
              bgColor="#ffffff"
              fgColor="#1B365D"
              level="M"
            />
          </div>
          <p className="text-white/50 text-sm font-[family-name:var(--font-lora)]">
            {t('Scan to save my contact', 'Escanea para guardar mi contacto')}
          </p>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </motion.div>
    </main>
  );
}
