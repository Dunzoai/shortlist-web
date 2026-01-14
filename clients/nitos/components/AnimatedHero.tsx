'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const empanadas = [
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
    ...empanadas[i % empanadas.length],
    size: 60 + Math.random() * 80, // 60-140px
    startY: 10 + Math.random() * 70, // 10-80% from top
    duration: 8 + Math.random() * 6, // 8-14 seconds
    delay: Math.random() * 5, // 0-5 second delay
    rotation: Math.random() * 360,
  }));
}

export function AnimatedHero() {
  const [flyingEmpanadas] = useState<FlyingEmpanada[]>(generateEmpanadas);
  const [showText, setShowText] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    // Show text after Damian slides up
    const textTimer = setTimeout(() => setShowText(true), 1200);
    const subtextTimer = setTimeout(() => setShowSubtext(true), 2000);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(subtextTimer);
    };
  }, []);

  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById('schedule');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-[#D4C5A9] overflow-hidden">
      {/* Flying Empanadas Layer - Behind everything */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {flyingEmpanadas.map((empanada) => (
          <motion.div
            key={empanada.id}
            className="absolute"
            style={{
              top: `${empanada.startY}%`,
              width: empanada.size,
              height: empanada.size,
            }}
            initial={{ x: '-150px', rotate: empanada.rotation }}
            animate={{
              x: ['calc(-150px)', 'calc(100vw + 150px)'],
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
              fill
              className="object-contain opacity-70"
            />
          </motion.div>
        ))}
      </div>

      {/* Logo Layer - Center */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Image
            src="/nitos-logo.avif"
            alt="Nito's Empanadas Logo"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-20">
        {/* Left Side - Text */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left order-2 md:order-1 mt-8 md:mt-0">
          <AnimatePresence>
            {showText && (
              <motion.h1
                className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#2D5A3D] italic mb-4 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <TypewriterText text="You want empanadas?" />
              </motion.h1>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSubtext && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xl md:text-2xl lg:text-3xl text-[#4A5A3C] mb-8 md:mb-12">
                  Come to Nito's — best empanadas in town!
                </p>
                <motion.button
                  onClick={scrollToSchedule}
                  className="bg-[#C4A052] hover:bg-[#B8944A] text-[#2D5A3D] px-8 py-4 text-lg font-semibold tracking-wide transition-colors rounded-full shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Find Us This Week
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side - Damian */}
        <div className="flex-1 flex justify-center md:justify-end items-end order-1 md:order-2 relative h-[300px] md:h-[500px] lg:h-[600px] w-full md:w-auto">
          <motion.div
            className="relative w-[250px] h-[350px] md:w-[350px] md:h-[500px] lg:w-[400px] lg:h-[600px]"
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 50,
              damping: 15,
              duration: 1,
            }}
          >
            <Image
              src="/damian-sneakers.png"
              alt="Damian from Nito's Empanadas"
              fill
              className="object-contain object-bottom"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-[#2D5A3D]/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

// Typewriter effect component
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return (
    <>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </>
  );
}
