'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import contentFallback from '../content';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

const PREVIEW_PREFIX = '/clients/riveroaks/preview';

type NavProps = {
  nav?: { links: { label: string; path: string | null; anchor: string | null }[]; orderButtonText: string };
  brandLabel?: string;
};

export default function Nav({ nav, brandLabel }: NavProps) {
  const n = nav ?? contentFallback.nav;
  const brand = brandLabel ?? contentFallback.brandLabel;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Detect if we're on preview routes vs production subdomain
  const isPreview = pathname.startsWith(PREVIEW_PREFIX);
  const base = isPreview ? PREVIEW_PREFIX : '';

  const navLinks = useMemo(
    () =>
      n.links.map((link) => ({
        label: link.label,
        href: `${base}${link.anchor ?? link.path ?? '/'}`,
      })),
    [base, n.links]
  );

  const orderHref = `${base}/order`;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: `${BG}ee`,
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,169,110,0.15)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <a
          href={`${base}/`}
          className="uppercase tracking-[0.2em] text-sm font-semibold"
          style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
        >
          {brand}
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm uppercase tracking-[0.15em] transition-colors duration-200"
              style={{
                color: 'rgba(245,237,224,0.6)',
                fontFamily: 'var(--font-lora)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = GOLD;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(245,237,224,0.6)';
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={orderHref}
            className="px-5 py-2 rounded-sm text-xs uppercase tracking-[0.18em] font-normal transition-all duration-200"
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
            {n.orderButtonText}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[6px]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-6 h-[1.5px] origin-center"
            style={{ backgroundColor: OFF_WHITE }}
            animate={
              open
                ? { rotate: 45, y: 7.5 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-6 h-[1.5px]"
            style={{ backgroundColor: OFF_WHITE }}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block w-6 h-[1.5px] origin-center"
            style={{ backgroundColor: OFF_WHITE }}
            animate={
              open
                ? { rotate: -45, y: -7.5 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.25 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 px-6 pb-8 pt-4"
            style={{
              backgroundColor: BG,
              borderBottom: '1px solid rgba(201,169,110,0.15)',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base uppercase tracking-[0.15em]"
                  style={{
                    color: OFF_WHITE,
                    fontFamily: 'var(--font-lora)',
                    borderBottom: '1px solid rgba(201,169,110,0.1)',
                  }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={orderHref}
                onClick={() => setOpen(false)}
                className="mt-4 block text-center py-3 rounded-sm text-sm uppercase tracking-[0.18em] transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-lora)',
                  color: GOLD,
                  border: `1px solid ${GOLD}`,
                }}
              >
                {n.orderButtonText}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
