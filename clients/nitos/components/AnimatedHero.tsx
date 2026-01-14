'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const empanadaImages = [
  { src: '/empanada.png', alt: 'Empanada' },
  { src: '/street-corn-empanada.png', alt: 'Street Corn Empanada' },
  { src: '/sweet-empanada.png', alt: 'Sweet Empanada' },
];

interface FlyingEmpanada {
  id: number;
  src: string;
  alt: string;
  size: number;
  startY: number;
  duration: number;
  delay: number;
  rotation: number;
}

function generateEmpanadas(): FlyingEmpanada[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    ...empanadaImages[i % empanadaImages.length],
    size: 80 + Math.random() * 60, // 80-140px
    startY: 10 + Math.random() * 70, // 10-80% from top
    duration: 12 + Math.random() * 8, // 12-20 seconds
    delay: i * 1.5, // Stagger the start more
    rotation: Math.random() * 360,
  }));
}

export function AnimatedHero() {
  const [flyingEmpanadas] = useState<FlyingEmpanada[]>(generateEmpanadas);

  // Animation sequence states
  const [showLogo, setShowLogo] = useState(false);
  const [showDamian, setShowDamian] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showEmpanadas, setShowEmpanadas] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animation sequence timing
    const timers = [
      setTimeout(() => setShowLogo(true), 100),           // 1. Logo fades in
      setTimeout(() => setShowDamian(true), 800),         // 2. Damian slides up
      setTimeout(() => setShowHeadline(true), 1600),      // 3. Headline typewriter
      setTimeout(() => setShowSubtitle(true), 2800),      // 4. Subtitle fades in
      setTimeout(() => setShowEmpanadas(true), 3400),     // 5. Empanadas start flying
      setTimeout(() => setShowButton(true), 3800),        // 6. Button smacks in
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById('schedule');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-[#D4C5A9] overflow-hidden flex flex-col items-center justify-center px-6 py-12">

      {/* Flying Empanadas Layer - z-[1] behind logo but visible */}
      {showEmpanadas && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {flyingEmpanadas.map((empanada) => (
            <motion.div
              key={empanada.id}
              className="absolute"
              style={{
                top: `${empanada.startY}%`,
                left: -150,
                width: empanada.size,
                height: empanada.size,
              }}
              animate={{
                left: ['calc(-150px)', 'calc(100vw + 150px)'],
                rotate: [empanada.rotation, empanada.rotation + 360],
              }}
              transition={{
                duration: empanada.duration,
                delay: empanada.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Image
                src={empanada.src}
                alt={empanada.alt}
                width={empanada.size}
                height={empanada.size}
                className="object-contain opacity-80"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Damian - Background layer, BIGGER (z-[5]) */}
      {showDamian && (
        <motion.div
          className="absolute bottom-0 right-0 sm:right-4 md:right-8 lg:right-16 z-[5]"
          style={{
            width: 'clamp(200px, 40vw, 350px)',
            height: 'clamp(300px, 60vw, 500px)',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94], // easeOut
          }}
        >
          <Image
            src="/damian-sneakers.png"
            alt="Damian from Nito's Empanadas"
            fill
            className="object-contain object-bottom"
          />
        </motion.div>
      )}

      {/* Main Content Container - z-[10] above Damian */}
      <div className="relative z-[10] flex flex-col items-center justify-center w-full max-w-4xl">

        {/* Logo - BIG and centered (main focus) */}
        {showLogo && (
          <motion.div
            className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1], // Bounce ease
            }}
          >
            <Image
              src="/nitos-logo.avif"
              alt="Nito's Empanadas Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        )}

        {/* Text Content - Centered below logo */}
        <div className="text-center">
          {/* Headline */}
          {showHeadline && (
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D5A3D] italic mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TypewriterText text="You want empanadas?" speed={40} />
            </motion.h1>
          )}

          {/* Subtitle */}
          {showSubtitle && (
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-[#4A5A3C] mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Come to Nito's — best empanadas in town!
            </motion.p>
          )}

          {/* Button - z-[30] ABOVE Damian, smacks in with bounce */}
          {showButton && (
            <motion.button
              onClick={scrollToSchedule}
              className="relative z-[30] bg-[#C4A052] hover:bg-[#B8944A] text-[#2D5A3D] px-8 py-4 text-lg font-semibold tracking-wide rounded-full shadow-lg hover:shadow-xl transition-colors"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 15,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Us This Week
            </motion.button>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[15]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6 text-[#2D5A3D]/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Typewriter effect component
function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          className="inline-block w-[3px] h-[1em] bg-[#2D5A3D] ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      )}
    </>
  );
}
