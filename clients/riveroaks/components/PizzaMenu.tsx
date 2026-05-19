'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { squarePizzas, roundPizzas } from '../content/menu';
import type { MenuItem } from '../content/menu';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

type PizzaStyle = 'squares' | 'rounds';

const tiles: {
  key: PizzaStyle;
  image: string;
  label: string;
  teaser: string;
  items: MenuItem[];
}[] = [
  {
    key: 'squares',
    image: '/clients/riveroaks/square_pie.png',
    label: 'The Squares',
    teaser: 'Sheet-pan style. Bronx-born. Built to share.',
    items: squarePizzas,
  },
  {
    key: 'rounds',
    image: '/clients/riveroaks/pizza.png',
    label: 'The Rounds',
    teaser: 'Personal or large. Bold combinations.',
    items: roundPizzas,
  },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
  exit: {},
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.25 },
  },
};

export default function PizzaMenu() {
  const [active, setActive] = useState<PizzaStyle | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSelect = (style: PizzaStyle) => {
    setActive(style);
    if (isMobile && menuRef.current) {
      setTimeout(() => {
        menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const activeItems = active
    ? tiles.find((t) => t.key === active)!.items
    : [];

  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          >
            Menu
          </p>
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>
        <h1
          className="italic font-bold text-center mb-4"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: OFF_WHITE,
            fontSize: 'clamp(40px, 7vw, 64px)',
          }}
        >
          The Pizza.
        </h1>
        <p
          className="text-center italic mb-16"
          style={{
            fontFamily: 'var(--font-lora)',
            color: 'rgba(245,237,224,0.7)',
            fontSize: '18px',
          }}
        >
          Two styles. One family recipe.
        </p>

        {/* Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {tiles.map((tile) => {
            const isActive = active === tile.key;
            const isInactive = active !== null && !isActive;

            return (
              <motion.button
                key={tile.key}
                onClick={() => handleSelect(tile.key)}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer text-left"
                animate={{
                  opacity: isInactive ? 0.3 : 1,
                  scale: isInactive ? 0.95 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Image — rounds rotate, squares pulse */}
                <motion.div
                  className="absolute inset-0"
                  animate={
                    tile.key === 'rounds'
                      ? { rotate: 360, scale: [1, 1, 1] }
                      : { rotate: 0, scale: [1, 1.02, 1] }
                  }
                  transition={
                    tile.key === 'rounds'
                      ? {
                          rotate: {
                            duration: 90,
                            repeat: Infinity,
                            ease: 'linear',
                          },
                        }
                      : {
                          scale: {
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          },
                        }
                  }
                >
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-[#0a0807]/70 to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                  <h2
                    className="italic font-bold leading-tight tracking-tight"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      color: OFF_WHITE,
                      fontSize: 'clamp(32px, 5vw, 48px)',
                      textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                    }}
                  >
                    {tile.label}
                  </h2>
                  <motion.p
                    className="mt-2 italic"
                    style={{
                      fontFamily: 'var(--font-lora)',
                      color: 'rgba(245,237,224,0.85)',
                      fontSize: '16px',
                    }}
                    animate={{ opacity: isActive ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tile.teaser}
                  </motion.p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Menu list */}
        <div ref={menuRef} className="max-w-[720px] mx-auto mt-16">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active}
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    className={
                      i < activeItems.length - 1
                        ? 'pb-12 mb-12 border-b border-[#c9a96e]/15'
                        : ''
                    }
                  >
                    <h3
                      className="italic font-bold mb-2"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: OFF_WHITE,
                        fontSize: 'clamp(22px, 3vw, 28px)',
                      }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-lora)',
                        color: 'rgba(245,237,224,0.75)',
                        fontSize: '16px',
                      }}
                    >
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
