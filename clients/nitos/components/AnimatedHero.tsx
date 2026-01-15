'use client';

import { useState, useEffect, useRef } from 'react';
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
  const damianAudioRef = useRef<HTMLAudioElement | null>(null);

  // Animation sequence states
  const [showDamian, setShowDamian] = useState(false);
  const [isDamianShaking, setIsDamianShaking] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Truck animation state
  const [showTruck, setShowTruck] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [truckKey, setTruckKey] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowDamian(true), 500),
      setTimeout(() => setShowHeadline(true), 1800),
      setTimeout(() => setShowSubtitle(true), 4200),
      setTimeout(() => setShowButton(true), 4800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleFindUsClick = () => {
    if (showTruck || isPanning) return;

    setIsPanning(true);
    setTruckKey(prev => prev + 1);
    setShowTruck(true);

    // After truck animation completes, scroll to schedule section
    // Desktop is slower (8.75s), mobile is 4s, plus 0.15s delay
    const animationDuration = isDesktop ? 9200 : 4500;

    setTimeout(() => {
      setShowTruck(false);
      setIsPanning(false);

      // Scroll to the schedule section in the main page
      const scheduleSection = document.getElementById('schedule');
      if (scheduleSection) {
        scheduleSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, animationDuration);
  };

  // Easter egg: Damian shake and voice
  const handleDamianClick = () => {
    // Trigger shake animation
    setIsDamianShaking(true);
    setTimeout(() => setIsDamianShaking(false), 500);

    // Play voice audio
    const audio = damianAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      // Try to play, handle any autoplay restrictions
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio play failed:', error);
        });
      }
    }
  };

  return (
    <section className="relative h-[100dvh] bg-[#D4C5A9] overflow-hidden">

      {/* Optional: Audio element for truck horn */}
      {/* <audio ref={audioRef} src="/truck-horn.mp3" preload="auto" /> */}

      {/* Hidden audio for Damian easter egg */}
      <audio
        ref={damianAudioRef}
        src="/nitos-voice.m4a"
        preload="auto"
        playsInline
      />

      {/* TRUCK - Using inline animation to ensure it works on first render */}
      {showTruck && (
        <>
          <style>{`
            @keyframes truck-drive-anim {
              0% { left: -1000px; }
              100% { left: calc(100vw + 1000px); }
            }
            .truck-animate {
              animation: truck-drive-anim 4s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s forwards;
            }
            @media (min-width: 1024px) {
              .truck-animate {
                animation: truck-drive-anim 8.75s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s forwards;
              }
            }
          `}</style>
          <div
            key={`truck-${truckKey}`}
            className="fixed z-[9999] pointer-events-none truck-animate"
            style={{
              top: '50%',
              width: 'clamp(800px, 120vw, 1600px)',
              height: 'clamp(480px, 72vw, 960px)',
              transform: 'translateY(-50%)',
              left: '-1000px',
            }}
          >
            <Image
              src="/nitos-truck.png"
              alt="Nito's Food Truck"
              fill
              className="object-contain"
              style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))' }}
              priority
            />
          </div>
        </>
      )}

      {/* HERO OVERLAY - Gets pulled away to the right, revealing schedule underneath */}
      {showTruck && (
        <motion.div
          key={`hero-overlay-${truckKey}`}
          className="fixed z-[9998] bg-[#D4C5A9] overflow-hidden"
          style={{
            top: 0,
            width: '100vw',
            height: '100vh',
          }}
          initial={{ left: 0 }}
          animate={{ left: 'calc(100vw + 2000px)' }}
          transition={{ duration: isDesktop ? 8.75 : 4, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* Film grain */}
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

            {/* Logo */}
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
              />
            </div>
          </motion.div>
        )}

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
      {/* Easter egg: Click Damian to hear his voice! */}
      {showDamian && (
        <motion.div
          className="absolute -right-4 sm:-right-2 md:-right-4 lg:-right-8 z-[15] cursor-pointer"
          style={{
            bottom: 'clamp(24px, 4vh, 40px)',
            width: 'clamp(221px, 44vw, 400px)',
            height: 'clamp(331px, 67vw, 580px)',
          }}
          initial={{ y: '100%' }}
          animate={{
            y: 0,
            x: isDamianShaking ? [0, -10, 10, -10, 10, -5, 5, 0] : 0,
          }}
          transition={{
            y: {
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
            x: {
              duration: 0.5,
              ease: 'easeInOut',
            },
          }}
          onClick={handleDamianClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
          {/* Headline - breaks after "want" on mobile */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#2D5A3D] italic mb-2 sm:mb-4 leading-[0.95] sm:leading-tight whitespace-pre-line">
            {showHeadline ? (
              <>
                <span className="sm:hidden">
                  <TypewriterText text={"You want\nempanadas?"} speed={80} />
                </span>
                <span className="hidden sm:inline">
                  <TypewriterText text="You want empanadas?" speed={80} />
                </span>
              </>
            ) : (
              <span className="invisible">{"You want\nempanadas?"}</span>
            )}
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
