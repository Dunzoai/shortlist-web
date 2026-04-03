'use client';

import { useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Subjects', href: '#subjects' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF5EF]/90 backdrop-blur-md border-b border-[#C6B4E2]/15">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: '#A08EC8', fontFamily: "'Georgia', serif" }}>
          <GraduationCap className="w-6 h-6" />
          Grow With Gia
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: '#A08EC8' }}>
            Book a Session
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-600">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#FAF5EF] border-t border-[#C6B4E2]/15 px-6 pb-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-slate-600 hover:text-slate-800 font-medium border-b border-slate-100 last:border-0">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="block mt-3 text-center text-white font-semibold px-5 py-3 rounded-lg" style={{ backgroundColor: '#A08EC8' }}>
            Book a Session
          </a>
        </div>
      )}
    </nav>
  );
}
