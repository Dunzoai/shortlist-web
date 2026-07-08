'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import contentFallback from '../content';

const CREAM = '#FBF4EA';
const BLUE = '#5E86AD';
const DARK = '#33414D';
const PEACH = '#FFC6A1';

type NavProps = {
  nav?: typeof contentFallback.nav;
  brandLabel?: string;
};

export default function Nav({ nav, brandLabel }: NavProps) {
  const n = nav ?? contentFallback.nav;
  const brand = brandLabel ?? contentFallback.brandLabel;
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: `${CREAM}ee`,
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(142,182,217,0.15)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand logo */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img
            src="/clients/brandydemo/sunday-logo.jpg"
            alt="Sunday Nail Press"
            style={{ height: 58, width: 'auto', display: 'block', mixBlendMode: 'multiply' }}
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {n.links.map((link) => (
            <a
              key={link.label}
              href={link.anchor ?? link.path ?? '/'}
              className="text-sm uppercase tracking-[0.12em] transition-colors duration-200"
              style={{ color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = BLUE; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = DARK; }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={n.links.find((l) => l.label === 'Get Started')?.path ?? '/get-started'}
            className="px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.12em] font-semibold transition-all duration-200"
            style={{
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              color: DARK,
              backgroundColor: PEACH,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 22px rgba(255,198,161,0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {n.ctaText}
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
            style={{ backgroundColor: DARK }}
            animate={open ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-6 h-[1.5px]"
            style={{ backgroundColor: DARK }}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block w-6 h-[1.5px] origin-center"
            style={{ backgroundColor: DARK }}
            animate={open ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
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
              backgroundColor: CREAM,
              borderBottom: '1px solid rgba(142,182,217,0.15)',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1">
              {n.links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.anchor ?? link.path ?? '/'}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base uppercase tracking-[0.12em]"
                  style={{
                    color: DARK,
                    fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                    borderBottom: '1px solid rgba(142,182,217,0.1)',
                  }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="/get-started"
                onClick={() => setOpen(false)}
                className="mt-4 block text-center py-3 rounded-full text-sm uppercase tracking-[0.12em] font-semibold"
                style={{
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  color: DARK,
                  backgroundColor: PEACH,
                }}
              >
                {n.ctaText}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
