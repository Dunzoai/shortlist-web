'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

type HeroProps = {
  backdropImage?: string;
};

export default function Hero({ backdropImage }: HeroProps) {
  const hasCinematic = !!backdropImage;
  const [phase, setPhase] = useState(hasCinematic ? 0 : 3);

  useEffect(() => {
    if (!hasCinematic) return;

    const t1 = setTimeout(() => setPhase(1), 2000);
    const t2 = setTimeout(() => setPhase(2), 3500);
    const t3 = setTimeout(() => setPhase(3), 4300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [hasCinematic]);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: BG }}
    >
      {/* Backdrop image (cinematic) or warm glow (fallback) */}
      {hasCinematic ? (
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backdropImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          initial={{ opacity: 0.7, filter: 'blur(0px)' }}
          animate={{
            opacity: phase >= 1 ? 0.15 : 0.7,
            filter: phase >= 1 ? 'blur(24px)' : 'blur(0px)',
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(circle at center, rgba(201,169,110,0.15) 0%, transparent 60%)',
          }}
        />
      )}

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(10,8,7,0.7) 100%)',
        }}
      />

      {/* Pizza + text + button container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinning pizza */}
        <motion.div
          className="relative w-[80vw] h-[80vw] md:w-[55vh] md:h-[55vh]"
          initial={
            hasCinematic
              ? { opacity: 0, scale: 0.8 }
              : { opacity: 0 }
          }
          animate={
            hasCinematic
              ? {
                  opacity: phase >= 1 ? 1 : 0,
                  scale: phase >= 1 ? 1 : 0.8,
                }
              : { opacity: 1 }
          }
          transition={
            hasCinematic
              ? { duration: 1.5, ease: 'easeOut' }
              : { duration: 0.5, ease: 'easeOut' }
          }
        >
          <motion.div
            className="relative w-full h-full rounded-full overflow-hidden"
            animate={{ rotate: 360 }}
            transition={{
              duration: 75,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Image
              src="/clients/riveroaks/pizza.png"
              alt="Wood-fired grandma pizza"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Text block — below the pizza in normal flow */}
        <motion.div
          className="mt-6 flex flex-col items-center text-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: hasCinematic ? (phase >= 2 ? 1 : 0) : 1 }}
          transition={
            hasCinematic
              ? { duration: 0.8, ease: 'easeOut' }
              : { duration: 0.5, ease: 'easeOut' }
          }
        >
          <p
            className="font-serif italic text-xs md:text-base tracking-wide mb-1"
            style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }}
          >
            Family-owned since 1998
          </p>
          <h1
            className="font-black italic text-center leading-[0.9] tracking-tight"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: OFF_WHITE,
              fontSize: 'clamp(36px, 8vw, 56px)',
            }}
          >
            REAL PIZZA
          </h1>
          <p
            className="mt-3 text-xs md:text-sm uppercase tracking-[0.25em] font-normal"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          >
            Pizza &middot; Pasta &middot; Wine &middot; Cocktails
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-6 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          transition={
            hasCinematic
              ? { duration: 0.6, ease: 'easeOut' }
              : { duration: 0.5, ease: 'easeOut' }
          }
        >
          <a
            href="/order"
            className="px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.18em] font-normal transition-all duration-200"
            style={{
              fontFamily: 'var(--font-lora)',
              color: GOLD,
              border: `1px solid ${GOLD}`,
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = GOLD;
              e.currentTarget.style.color = BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = GOLD;
            }}
          >
            Start Your Order
          </a>
        </motion.div>
      </div>

    </section>
  );
}
