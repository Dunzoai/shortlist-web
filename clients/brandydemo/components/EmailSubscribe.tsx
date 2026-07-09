'use client';

import { useState } from 'react';

const LIGHT_BLUE = '#DAE4F2';
const BLUE_DARK = '#5E86AD';
const PEACH = '#F0C5A0';
const DARK = '#33414D';
const BODY = '#55606B';
const MAUVE = '#B48B96';
const SAGE = '#5C6B52';

// 4-point diamond sparkle (peach or blue)
function Diamond({ size, color, opacity = 1, style }: { size: number; color: string; opacity?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ position: 'absolute', ...style }}>
      <path d="M14 2C14.8 8.5 19.5 13.2 26 14C19.5 14.8 14.8 19.5 14 26C13.2 19.5 8.5 14.8 2 14C8.5 13.2 13.2 8.5 14 2Z" stroke={color} strokeWidth="1.5" fill="none" opacity={opacity} />
    </svg>
  );
}

// Small filled 4-point star
function Star({ size, color, opacity = 1, style }: { size: number; color: string; opacity?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', ...style }}>
      <path d="M10 1L11.2 7.8L18 10L11.2 12.2L10 19L8.8 12.2L2 10L8.8 7.8Z" fill={color} opacity={opacity} />
    </svg>
  );
}

// Heart outline
function Heart({ size, color, opacity = 1, style }: { size: number; color: string; opacity?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', ...style }}>
      <path d="M16 28S3 20 3 11.5C3 7.4 6.4 4 10.5 4C13 4 15 5.5 16 7C17 5.5 19 4 21.5 4C25.6 4 29 7.4 29 11.5C29 20 16 28 16 28Z" stroke={color} strokeWidth="1.8" fill="none" opacity={opacity} />
    </svg>
  );
}

// White 4-point sparkle for the blue background
function WhiteSparkle({ x, y, size }: { x: string; y: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', left: x, top: y }}>
      <path d="M10 1L11 8L18 10L11 12L10 19L9 12L2 10L9 8Z" fill="white" opacity="0.6" />
    </svg>
  );
}

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      style={{
        background: LIGHT_BLUE,
        padding: 'clamp(56px,8vw,96px) clamp(20px,4vw,40px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* White sparkle stars scattered across the blue bg */}
      <WhiteSparkle x="8%" y="15%" size={14} />
      <WhiteSparkle x="22%" y="35%" size={10} />
      <WhiteSparkle x="15%" y="70%" size={16} />
      <WhiteSparkle x="75%" y="12%" size={18} />
      <WhiteSparkle x="85%" y="40%" size={12} />
      <WhiteSparkle x="65%" y="65%" size={15} />
      <WhiteSparkle x="90%" y="75%" size={10} />
      <WhiteSparkle x="40%" y="10%" size={11} />
      <WhiteSparkle x="55%" y="80%" size={13} />
      <WhiteSparkle x="30%" y="85%" size={9} />
      <WhiteSparkle x="5%" y="50%" size={12} />
      <WhiteSparkle x="92%" y="20%" size={14} />

      {/* Peach diamond — left side */}
      <Diamond size={36} color={PEACH} style={{ left: 'clamp(20px,8vw,100px)', top: '30%' }} />
      {/* Blue sparkle cluster — left bottom */}
      <Star size={16} color={BLUE_DARK} opacity={0.5} style={{ left: 'clamp(16px,6vw,70px)', bottom: '25%' }} />
      <Star size={10} color={BLUE_DARK} opacity={0.35} style={{ left: 'clamp(36px,8vw,100px)', bottom: '20%' }} />
      <Star size={7} color={BLUE_DARK} opacity={0.25} style={{ left: 'clamp(28px,7vw,85px)', bottom: '30%' }} />

      {/* Heart outline — right side */}
      <Heart size={44} color={PEACH} opacity={0.7} style={{ right: 'clamp(30px,10vw,140px)', top: '25%' }} />
      {/* Blue sparkle cluster — right */}
      <Star size={14} color={BLUE_DARK} opacity={0.45} style={{ right: 'clamp(20px,6vw,80px)', bottom: '30%' }} />
      <Star size={8} color={BLUE_DARK} opacity={0.3} style={{ right: 'clamp(50px,10vw,130px)', bottom: '22%' }} />

      {/* Circular "Subscribe Now" badge */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8, zIndex: 1 }}>
        <svg width="90" height="90" viewBox="0 0 100 100" style={{ animation: 'spin-slow 12s linear infinite' }}>
          <defs>
            <path id="circlePath" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
          </defs>
          <text fontSize="10.5" fontFamily="var(--font-montserrat), Montserrat, sans-serif" fontWeight="600" letterSpacing="0.18em" fill={DARK} style={{ textTransform: 'uppercase' }}>
            <textPath href="#circlePath" startOffset="0%">
              SUBSCRIBE NOW · SUBSCRIBE NOW ·{' '}
            </textPath>
          </text>
        </svg>
        {/* Spiral sun in center */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x1 = 30 + Math.cos(angle) * 16;
              const y1 = 30 + Math.sin(angle) * 16;
              const x2 = 30 + Math.cos(angle) * (i % 2 === 0 ? 27 : 23);
              const y2 = 30 + Math.sin(angle) * (i % 2 === 0 ? 27 : 23);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={PEACH} strokeWidth="2.2" strokeLinecap="round" />;
            })}
            <circle cx="30" cy="30" r="14" stroke={PEACH} strokeWidth="2.2" fill="none" />
            <path d="M30 30 C30 27, 33 26, 34 28 C35 31, 32 34, 28 33 C24 32, 23 27, 26 24 C29 21, 36 22, 37 27 C38 33, 33 37, 27 36" stroke={PEACH} strokeWidth="2" strokeLinecap="round" fill="none" />
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
          position: 'relative',
          zIndex: 1,
        }}
      >
        Subscribe
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: BODY, fontWeight: 500, position: 'relative', zIndex: 1 }}>
        to our emails
      </p>

      <p style={{ margin: '0 auto 32px', maxWidth: '34ch', fontSize: 15, lineHeight: 1.65, color: DARK, position: 'relative', zIndex: 1 }}>
        We promise not to spam your inbox!
        <br />
        Sign up for special newsletter discounts
        <br />
        and new launches!
      </p>

      {submitted ? (
        <div style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 8, backgroundColor: MAUVE, color: '#FFFFFF', fontSize: 15, fontWeight: 600, position: 'relative', zIndex: 1 }}>
          You&apos;re on the list!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'inline-flex', gap: 0, maxWidth: 380, width: '100%', borderRadius: 8, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.6)', backgroundColor: '#FFFFFF', position: 'relative', zIndex: 1 }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ flex: 1, padding: '15px 18px', border: 'none', outline: 'none', fontSize: 15, color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", backgroundColor: 'transparent' }}
          />
          <button
            type="submit"
            style={{ padding: '15px 28px', border: 'none', borderRadius: '0 6px 6px 0', backgroundColor: MAUVE, color: '#FFFFFF', fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", transition: 'background-color .15s ease' }}
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
