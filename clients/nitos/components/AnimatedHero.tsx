'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FoodTruckTimeline } from './FoodTruckTimeline';

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
    const size = Math.round(60 + Math.random() * 80);

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Animation sequence states
  const [showDamian, setShowDamian] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Truck animation state
  const [showTruck, setShowTruck] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowDamian(true), 500),
      setTimeout(() => setShowHeadline(true), 1800),
      setTimeout(() => setShowSubtitle(true), 4200),
      setTimeout(() => setShowButton(true), 4800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // State for showing the revealed schedule section
  const [showScheduleOverlay, setShowScheduleOverlay] = useState(false);

  const handleFindUsClick = () => {
    if (showTruck || isPanning) return;

    // Trigger truck animation and wipe reveal
    setShowTruck(true);
    setIsPanning(true);
    setShowScheduleOverlay(true);

    // After truck animation completes, hide the truck but keep schedule visible
    setTimeout(() => {
      setShowTruck(false);
      setIsPanning(false);
    }, 2400);
  };

  // Close schedule overlay when clicking the back button or scrolling
  const handleCloseSchedule = () => {
    setShowScheduleOverlay(false);
  };

  return (
    <section className="relative h-[100dvh] bg-[#D4C5A9] overflow-hidden">

      {/* Optional: Audio element for truck horn */}
      {/* <audio ref={audioRef} src="/truck-horn.mp3" preload="auto" /> */}

      {/* SCHEDULE OVERLAY - Revealed by truck wipe, stays visible */}
      <AnimatePresence>
        {showScheduleOverlay && (
          <motion.div
            className="fixed inset-0 z-[9998] overflow-hidden bg-[#D4C5A9]"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            exit={{ clipPath: 'inset(0 0 0 100%)' }}
            transition={{ duration: showTruck ? 2.2 : 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Back button */}
            <button
              onClick={handleCloseSchedule}
              className="absolute top-6 left-6 z-10 flex items-center gap-2 text-[#2D5A3D] hover:text-[#C4A052] transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Schedule section content */}
            <div className="w-full h-full flex flex-col items-center justify-center px-6 py-20">
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-[#2D5A3D] mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                Where to Find Us
              </motion.h2>

              <motion.div
                className="w-full max-w-4xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
              >
                <FoodTruckTimeline />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRUCK ANIMATION - Drives across screen */}
      <AnimatePresence>
        {showTruck && (
          <motion.div
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(500px, 70vw, 900px)',
              height: 'clamp(300px, 42vw, 540px)',
            }}
            initial={{ left: '-900px' }}
            animate={{ left: 'calc(100vw + 100px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Dust cloud behind truck */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-[400px] h-[300px]">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#C4A052]/30"
                  style={{
                    width: 40 + Math.random() * 60,
                    height: 40 + Math.random() * 60,
                    right: i * 40,
                    top: `${30 + Math.random() * 40}%`,
                  }}
                  animate={{
                    opacity: [0.5, 0.2, 0],
                    scale: [0.5, 1.5, 2],
                    x: [-20, -100],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

            {/* Motion blur trails */}
            <div className="absolute inset-0 opacity-20" style={{ transform: 'translateX(-40px)' }}>
              <Image
                src="/nitos-truck.png"
                alt=""
                fill
                className="object-contain blur-[3px]"
              />
            </div>
            <div className="absolute inset-0 opacity-40" style={{ transform: 'translateX(-20px)' }}>
              <Image
                src="/nitos-truck.png"
                alt=""
                fill
                className="object-contain blur-[1px]"
              />
            </div>

            {/* Main truck image */}
            <Image
              src="/nitos-truck.png"
              alt="Nito's Food Truck"
              fill
              className="object-contain"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated film grain overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-[-100%] opacity-[0.35] animate-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(3%, 2%); }
          30% { transform: translate(-1%, 4%); }
          40% { transform: translate(4%, -1%); }
          50% { transform: translate(-3%, 3%); }
          60% { transform: translate(2%, -4%); }
          70% { transform: translate(-4%, 1%); }
          80% { transform: translate(1%, -2%); }
          90% { transform: translate(3%, 4%); }
        }
        .animate-grain {
          animation: grain 0.8s steps(10) infinite;
        }
      `}</style>

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

      {/* Damian - Positioned on the "floor line" (same as button bottom) */}
      {showDamian && (
        <motion.div
          className="absolute -right-4 sm:-right-2 md:-right-4 lg:-right-8 z-[5]"
          style={{
            bottom: 'clamp(24px, 4vh, 40px)',
            width: 'clamp(221px, 44vw, 400px)',
            height: 'clamp(331px, 67vw, 580px)',
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

      {/* Logo - Absolutely positioned, higher up */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-[10]"
        style={{
          top: 'clamp(70px, 8vh, 100px)',
          width: 'clamp(280px, 50vw, 580px)',
          height: 'clamp(280px, 50vw, 580px)',
        }}
      >
        <Image
          src="/nitos-logo.avif"
          alt="Nito's Empanadas Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Text Content - Nudged up on mobile, aligned with floor on desktop */}
      <div
        className="absolute left-0 right-0 z-[10] px-6 bottom-[60px] sm:bottom-[40px]"
      >
        <div className="max-w-4xl mx-auto text-left sm:text-center pr-[35%] sm:pr-0">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#2D5A3D] italic mb-2 sm:mb-4 leading-[0.95] sm:leading-tight">
            {showHeadline ? <TypewriterText text="You want empanadas?" speed={80} /> : <span className="invisible">You want empanadas?</span>}
          </h1>

          {/* Subtitle */}
          <div className="text-lg sm:text-xl md:text-2xl text-[#4A5A3C] mb-4 sm:mb-6">
            {showSubtitle ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <span className="block sm:inline">Come to Nito's</span>
                <span className="hidden sm:inline"> — </span>
                <span className="block sm:inline">Best empanadas in town!</span>
              </motion.div>
            ) : (
              <span className="invisible block sm:inline">Come to Nito's — Best empanadas in town!</span>
            )}
          </div>

          {/* Button */}
          <div className="h-[52px] sm:h-[56px]">
            {showButton && (
              <motion.button
                onClick={handleFindUsClick}
                disabled={showTruck || isPanning}
                className="relative z-[30] bg-[#C4A052] hover:bg-[#B8944A] text-[#2D5A3D] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold tracking-wide rounded-full shadow-lg hover:shadow-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 600,
                  damping: 12,
                }}
                whileHover={{ scale: (showTruck || isPanning) ? 1 : 1.05 }}
                whileTap={{ scale: (showTruck || isPanning) ? 1 : 0.95 }}
              >
                Find Us This Week
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - hidden on mobile, visible on desktop */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[15] hidden sm:block"
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

// Typewriter effect component
function TypewriterText({ text, speed = 80 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
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
