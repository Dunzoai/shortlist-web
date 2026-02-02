'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#schedule', label: 'Location' },
  { href: '#menu', label: 'Menu' },
  { href: '#about', label: 'About' },
];

const CTA_LABELS = ['Order Now', 'Book Me'];
const CTA_HREF = 'https://nitos.shortlistpass.com';

function RotatingCTA({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % CTA_LABELS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href={CTA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <span className="relative inline-block w-[5.5rem] text-center">
        <span
          key={index}
          className="animate-fade-in"
        >
          {CTA_LABELS[index]}
        </span>
      </span>
    </a>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#D4C5A9]/95 backdrop-blur-sm border-b border-[#2D5A3D]/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-[#2D5A3D] font-bold text-xl italic">
            Nito&apos;s
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#2D5A3D] hover:text-[#C4A052] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <RotatingCTA className="bg-[#2D5A3D] text-white px-4 py-2 rounded-full font-medium hover:bg-[#C4A052] transition-colors" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#2D5A3D]"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2D5A3D]/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#2D5A3D] hover:text-[#C4A052] transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={CTA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 mt-2 bg-[#C4A052] text-white text-center px-4 py-3 rounded-full font-bold animate-pulse-glow"
                onClick={() => setIsMenuOpen(false)}
              >
                Order Online
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
