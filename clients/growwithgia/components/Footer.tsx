'use client';

import { GraduationCap, Mail, Phone, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-3" style={{ color: '#C6B4E2', fontFamily: "'Georgia', serif" }}>
            <GraduationCap className="w-5 h-5" />
            Grow With Gia
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Personalized tutoring that meets every student where they are and helps them grow.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Quick Links</h4>
          <div className="space-y-2">
            <a href="#about" className="block text-sm text-slate-300 hover:text-white transition-colors">About Gia</a>
            <a href="#method" className="block text-sm text-slate-300 hover:text-white transition-colors">Method</a>
            <a href="#testimonials" className="block text-sm text-slate-300 hover:text-white transition-colors">Testimonials</a>
            <a href="#contact" className="block text-sm text-slate-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Get in Touch</h4>
          <div className="space-y-3">
            <a href="mailto:grow.withgia26@gmail.com" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <Mail className="w-4 h-4" style={{ color: '#C6B4E2' }} /> grow.withgia26@gmail.com
            </a>
            <a href="#" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <Instagram className="w-4 h-4" style={{ color: '#C6B4E2' }} /> @growwithgia
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-700 text-center space-y-2">
        <p className="text-xs text-slate-500">&copy; 2026 Growing With Gia. All rights reserved.</p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://shortlistpass.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: '#C6B4E240' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C6B4E2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#C6B4E240')}
          >
            <span style={{ fontSize: '10px' }}>✿</span> Built by The Shortlist Co.
          </a>
          <span className="text-slate-700">·</span>
          <a
            href="/dashboard"
            className="text-xs transition-colors"
            style={{ color: '#C6B4E230' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C6B4E2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#C6B4E230')}
          >
            Dashboard
          </a>
        </div>
      </div>
    </footer>
  );
}
