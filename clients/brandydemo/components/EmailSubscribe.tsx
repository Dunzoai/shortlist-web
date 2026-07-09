'use client';

import { useState } from 'react';

const BLUSH = '#F3E8E2';
const MAUVE = '#B48B96';
const SAGE = '#5C6B52';
const GOLD = '#C9A84C';
const BODY = '#55606B';
const DARK = '#33414D';
const PEACH_WAVE = '#E8A8A0';

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to email service
    setSubmitted(true);
  };

  return (
    <section
      style={{
        background: BLUSH,
        padding: 'clamp(56px,8vw,96px) clamp(20px,4vw,40px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative waves — top left */}
      <svg
        style={{ position: 'absolute', top: 'clamp(24px,4vw,48px)', left: 'clamp(16px,6vw,80px)', opacity: 0.4 }}
        width="48" height="32" viewBox="0 0 48 32" fill="none"
      >
        <path d="M2 8c6-6 10 2 16 0s10-8 16 0 10 6 14 0" stroke={PEACH_WAVE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M2 18c6-6 10 2 16 0s10-8 16 0 10 6 14 0" stroke={PEACH_WAVE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M2 28c6-6 10 2 16 0s10-8 16 0 10 6 14 0" stroke={PEACH_WAVE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>

      {/* Decorative sparkle — top right */}
      <svg
        style={{ position: 'absolute', top: 'clamp(20px,3vw,40px)', right: 'clamp(20px,8vw,120px)' }}
        width="36" height="36" viewBox="0 0 36 36" fill="none"
      >
        <path d="M18 2L20.5 14.5L33 18L20.5 21.5L18 34L15.5 21.5L3 18L15.5 14.5Z" fill={GOLD} />
      </svg>

      {/* Small sparkle top-right */}
      <svg
        style={{ position: 'absolute', top: 'clamp(44px,6vw,72px)', right: 'clamp(12px,5vw,80px)' }}
        width="18" height="18" viewBox="0 0 36 36" fill="none"
      >
        <path d="M18 2L20.5 14.5L33 18L20.5 21.5L18 34L15.5 21.5L3 18L15.5 14.5Z" fill={GOLD} opacity="0.6" />
      </svg>

      {/* ── Sparkle cluster — left side ── */}
      <div style={{ position: 'absolute', left: 'clamp(10px,4vw,60px)', top: '45%', transform: 'translateY(-50%)' }}>
        {/* Large 4-point diamond */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ display: 'block' }}>
          <path d="M14 0L16 11L28 14L16 17L14 28L12 17L0 14L12 11Z" fill={SAGE} opacity="0.7" />
        </svg>
        {/* Small diamond offset */}
        <svg width="14" height="14" viewBox="0 0 28 28" fill="none" style={{ display: 'block', marginLeft: 22, marginTop: -6 }}>
          <path d="M14 0L16 11L28 14L16 17L14 28L12 17L0 14L12 11Z" fill={SAGE} opacity="0.45" />
        </svg>
        {/* Tiny dot */}
        <svg width="6" height="6" viewBox="0 0 6 6" style={{ display: 'block', marginLeft: 8, marginTop: 4 }}>
          <circle cx="3" cy="3" r="2.5" fill={SAGE} opacity="0.3" />
        </svg>
      </div>

      {/* ── Sparkle cluster — right side ── */}
      <div style={{ position: 'absolute', right: 'clamp(10px,4vw,60px)', bottom: 'clamp(30px,5vw,80px)' }}>
        {/* Medium 4-point diamond */}
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" style={{ display: 'block', marginLeft: 'auto' }}>
          <path d="M14 0L16 11L28 14L16 17L14 28L12 17L0 14L12 11Z" fill={MAUVE} opacity="0.5" />
        </svg>
        {/* Large diamond */}
        <svg width="32" height="32" viewBox="0 0 28 28" fill="none" style={{ display: 'block', marginRight: 18, marginTop: -4 }}>
          <path d="M14 0L16 11L28 14L16 17L14 28L12 17L0 14L12 11Z" fill={MAUVE} opacity="0.35" />
        </svg>
        {/* Tiny dots */}
        <svg width="5" height="5" viewBox="0 0 6 6" style={{ display: 'block', marginLeft: 'auto', marginTop: 6 }}>
          <circle cx="3" cy="3" r="2" fill={MAUVE} opacity="0.4" />
        </svg>
      </div>

      {/* Circular "Subscribe Now" badge */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
        <svg width="90" height="90" viewBox="0 0 100 100" style={{ animation: 'spin-slow 12s linear infinite' }}>
          <defs>
            <path id="circlePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
          </defs>
          <text fontSize="10.5" fontFamily="var(--font-montserrat), Montserrat, sans-serif" fontWeight="600" letterSpacing="0.18em" fill={BODY} style={{ textTransform: 'uppercase' }}>
            <textPath href="#circlePath" startOffset="0%">
              SUBSCRIBE NOW · SUBSCRIBE NOW ·{' '}
            </textPath>
          </text>
        </svg>
        {/* Spiral sun in center */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
            {/* Rays */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x1 = 30 + Math.cos(angle) * 16;
              const y1 = 30 + Math.sin(angle) * 16;
              const x2 = 30 + Math.cos(angle) * (i % 2 === 0 ? 27 : 23);
              const y2 = 30 + Math.sin(angle) * (i % 2 === 0 ? 27 : 23);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" />
              );
            })}
            {/* Outer circle */}
            <circle cx="30" cy="30" r="14" stroke={GOLD} strokeWidth="2.2" fill="none" />
            {/* Spiral */}
            <path
              d="M30 30 C30 27, 33 26, 34 28 C35 31, 32 34, 28 33 C24 32, 23 27, 26 24 C29 21, 36 22, 37 27 C38 33, 33 37, 27 36"
              stroke={GOLD} strokeWidth="2" strokeLinecap="round" fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h2
        style={{
          margin: '0 0 2px',
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontWeight: 700,
          fontSize: 'clamp(40px,6vw,60px)',
          color: SAGE,
          lineHeight: 1.1,
        }}
      >
        Subscribe
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: 13,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: BODY,
          fontWeight: 500,
        }}
      >
        to our emails
      </p>

      <p
        style={{
          margin: '0 auto 32px',
          maxWidth: '34ch',
          fontSize: 15,
          lineHeight: 1.65,
          color: DARK,
        }}
      >
        We promise not to spam your inbox!
        <br />
        Sign up for special newsletter discounts
        <br />
        and new launches!
      </p>

      {submitted ? (
        <div
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            borderRadius: 8,
            backgroundColor: MAUVE,
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          }}
        >
          You&apos;re on the list!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'inline-flex',
            gap: 0,
            maxWidth: 380,
            width: '100%',
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{
              flex: 1,
              padding: '15px 18px',
              border: `1.5px solid #D4C5BE`,
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              outline: 'none',
              fontSize: 15,
              color: DARK,
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              backgroundColor: '#FFFFFF',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '15px 28px',
              border: 'none',
              borderRadius: '0 8px 8px 0',
              backgroundColor: MAUVE,
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              transition: 'background-color .15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#9A7580'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = MAUVE; }}
          >
            Subscribe
          </button>
        </form>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
