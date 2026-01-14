'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const empanadaImages = [
  { src: '/empanada.png', alt: 'Empanada' },
  { src: '/street-corn-empanada.png', alt: 'Street Corn Empanada' },
  { src: '/sweet-empanada.png', alt: 'Sweet Empanada' },
];

type Direction = 'left-to-right' | 'right-to-left' | 'diagonal-down' | 'diagonal-up';

interface FlyingEmpanada {
  id: number;
  src: string;
  alt: string;
  size: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  rotation: number;
  direction: Direction;
}

function generateEmpanadas(): FlyingEmpanada[] {
  const directions: Direction[] = ['left-to-right', 'right-to-left', 'diagonal-down', 'diagonal-up'];

  return Array.from({ length: 12 }, (_, i) => {
    const direction = directions[i % directions.length];
    const size = Math.round(60 + Math.random() * 80); // 60-140px

    // Different start/end positions based on direction
    let startX: number, startY: number, endX: number, endY: number;

    switch (direction) {
      case 'left-to-right':
        startX = -15;
        startY = Math.round(5 + Math.random() * 80);
        endX = 110;
        endY = startY + Math.round(-10 + Math.random() * 20);
        break;
      case 'right-to-left':
        startX = 110;
        startY = Math.round(5 + Math.random() * 80);
        endX = -15;
        endY = startY + Math.round(-10 + Math.random() * 20);
        break;
      case 'diagonal-down':
        startX = -15 + Math.round(Math.random() * 30);
        startY = -10;
        endX = 80 + Math.round(Math.random() * 30);
        endY = 110;
        break;
      case 'diagonal-up':
        startX = 80 + Math.round(Math.random() * 30);
        startY = 110;
        endX = -15 + Math.round(Math.random() * 30);
        endY = -10;
        break;
    }

    return {
      id: i,
      ...empanadaImages[i % empanadaImages.length],
      size,
      startX,
      startY,
      endX,
      endY,
      duration: 8 + Math.random() * 12,
      delay: (i * 0.8) % 6,
      rotation: Math.round(Math.random() * 360),
      direction,
    };
  });
}

export function AnimatedHero() {
  const [flyingEmpanadas] = useState<FlyingEmpanada[]>(generateEmpanadas);

  // Animation sequence states
  const [showDamian, setShowDamian] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animation sequence timing
    // Logo is static (no animation needed)
    // Empanadas already flying
    const timers = [
      setTimeout(() => setShowDamian(true), 500),         // 1. Damian slides up at 0.5s
      setTimeout(() => setShowHeadline(true), 1800),      // 2. Headline typewriter starts after Damian settles
      setTimeout(() => setShowSubtitle(true), 4200),      // 3. Subtitle fades in after typing completes (~2.4s for 19 chars at 80ms + pause)
      setTimeout(() => setShowButton(true), 4800),        // 4. Button slams in last
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
    <section className="relative min-h-screen bg-[#D4C5A9] overflow-hidden flex flex-col items-center justify-center px-6 pt-20 pb-12">

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Flying Empanadas Layer - ALWAYS visible, z-[1] */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {flyingEmpanadas.map((empanada) => (
          <motion.div
            key={empanada.id}
            className="absolute"
            style={{
              width: empanada.size,
              height: empanada.size,
            }}
            initial={{
              left: `${empanada.startX}%`,
              top: `${empanada.startY}%`,
              rotate: empanada.rotation,
            }}
            animate={{
              left: [`${empanada.startX}%`, `${empanada.endX}%`],
              top: [`${empanada.startY}%`, `${empanada.endY}%`],
              rotate: [empanada.rotation, empanada.rotation + (empanada.direction === 'right-to-left' ? -360 : 360)],
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
              className="object-contain opacity-70"
            />
          </motion.div>
        ))}
      </div>

      {/* Damian - Background layer, scaled down 10% mobile / 15% desktop, nudged right */}
      {showDamian && (
        <motion.div
          className="absolute bottom-0 -right-4 sm:-right-2 md:-right-4 lg:-right-8 z-[5]"
          style={{
            width: 'clamp(243px, 44vw, 446px)',
            height: 'clamp(365px, 70vw, 638px)',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
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

        {/* Logo - STATIC, no animation, 1.25x bigger on mobile, larger on desktop */}
        <div className="relative w-[350px] h-[350px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] lg:w-[680px] lg:h-[680px] mb-2 sm:mb-6">
          <Image
            src="/nitos-logo.avif"
            alt="Nito's Empanadas Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text Content - Left aligned on mobile, centered on larger screens */}
        {/* Fixed min-height to prevent layout shift during typing animation */}
        <div className="w-full text-left sm:text-center pr-[40%] sm:pr-0 min-h-[180px] sm:min-h-[200px]">
          {/* Headline - BIGGER and BOLDER on mobile, tighter line spacing */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#2D5A3D] italic mb-1 sm:mb-4 leading-[0.95] sm:leading-tight min-h-[2.5em] sm:min-h-[1.5em]">
            {showHeadline && <TypewriterText text="You want empanadas?" speed={80} />}
          </h1>

          {/* Subtitle - fades in after pause */}
          <div className="min-h-[3.5em] sm:min-h-[2em]">
            {showSubtitle && (
              <motion.div
                className="text-lg sm:text-xl md:text-2xl text-[#4A5A3C] mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <span className="block sm:inline">Come to Nito's</span>
                <span className="hidden sm:inline"> — </span>
                <span className="block sm:inline">Best empanadas in town!</span>
              </motion.div>
            )}
          </div>

          {/* Button - z-[30] ABOVE Damian, slams in last */}
          <div className="min-h-[56px]">
            {showButton && (
              <motion.button
                onClick={scrollToSchedule}
                className="relative z-[30] bg-[#C4A052] hover:bg-[#B8944A] text-[#2D5A3D] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold tracking-wide rounded-full shadow-lg hover:shadow-xl transition-colors"
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 600,
                  damping: 12,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find Us This Week
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[15]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.5, duration: 0.5 }}
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

// Typewriter effect component - slower and smoother
function TypewriterText({ text, speed = 80 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Add slight variation to make it feel more natural
      const variation = Math.random() * 30;
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed + variation);
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
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </>
  );
}
