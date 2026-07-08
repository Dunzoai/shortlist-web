'use client';

import { useEffect, useRef, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const YELLOW = '#FFF2B6';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';

export function HomePage() {
  const c = content;

  // Parallax state
  const bandRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize);

    let raf: number;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        const el = bandRef.current;
        if (el) {
          const r = el.getBoundingClientRect();
          if (isMobile) {
            // Mobile: JS-based parallax via transform
            if (r.top < vh && r.bottom > 0) {
              const scrollProgress = -r.top;
              if (imageRef.current) {
                imageRef.current.style.transform = `translateY(${scrollProgress * 0.4}px)`;
              }
            }
          } else {
            // Desktop: state-driven parallax for cards
            const progress = (vh - r.top) / (vh + r.height);
            setY(Math.max(-1, Math.min(1, (progress - 0.5) * 2)));
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  const t = (f: number) => (isMobile ? 'none' : `translateY(${Math.round(y * f)}px)`);

  return (
    <main style={{ backgroundColor: CREAM, color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif" }}>
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      {/* ───── Hero ───── */}
      <header
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(44px,7vw,96px) clamp(20px,4vw,40px) clamp(44px,6vw,84px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(28px,5vw,72px)',
          alignItems: 'center',
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 14px',
              fontSize: 12,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: BLUE_DARK,
            }}
          >
            {c.hero.eyebrow}
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 'clamp(44px,6.8vw,88px)',
              lineHeight: 1.04,
              letterSpacing: '-0.005em',
              color: DARK,
            }}
          >
            {c.hero.headlineTop}
            <br />
            <span
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontWeight: 600,
                color: BLUE_DARK,
                fontSize: '1.12em',
              }}
            >
              {c.hero.headlineCursive}
            </span>
          </h1>
          <p
            style={{
              margin: '24px 0 32px',
              fontSize: 'clamp(17px,1.6vw,20px)',
              lineHeight: 1.65,
              color: BODY,
              maxWidth: '46ch',
            }}
          >
            {c.hero.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
            <a
              href={c.hero.ctaHref}
              style={{
                background: PEACH,
                color: DARK,
                textDecoration: 'none',
                padding: '15px 32px',
                borderRadius: 999,
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                transition: 'transform .15s ease, box-shadow .15s ease',
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
              {c.hero.ctaText}
            </a>
            <a
              href={c.hero.secondaryHref}
              style={{
                fontSize: 15,
                letterSpacing: '0.02em',
                textDecoration: 'underline',
                textUnderlineOffset: 5,
                textDecorationColor: BLUE,
                color: DARK,
              }}
            >
              {c.hero.secondaryText}
            </a>
          </div>
        </div>

        {/* Hero image */}
        <div style={{ marginTop: 'clamp(0px,3vw,44px)', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: -14,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${BLUE} 0%, #FFE6CB 55%, ${YELLOW} 100%)`,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: 'clamp(320px,42vw,540px)',
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: '#e8ddd0',
            }}
          >
            <img
              src={c.hero.heroImage}
              alt="Custom press-on nail set"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </header>

      {/* ───── Sky Parallax Region ───── */}
      <div ref={bandRef} style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Parallax sky background — works on both mobile (JS transform) and desktop (CSS fixed) */}
        <div
          ref={imageRef}
          className="will-change-transform"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: isMobile ? '-40%' : -140,
            bottom: isMobile ? undefined : -140,
            height: isMobile ? '180%' : undefined,
            transform: isMobile ? undefined : `translateY(${Math.round(y * 90)}px)`,
            zIndex: 0,
            backgroundImage: 'url(/clients/brandydemo/sky-parallax.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(94,134,173,0.30) 0%, rgba(255,255,255,0.06) 45%, rgba(94,134,173,0.34) 100%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* ── The Sunday Difference ── */}
        <section
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1200,
            margin: '0 auto',
            padding: 'clamp(60px,9vw,120px) clamp(20px,4vw,40px) clamp(28px,4vw,44px)',
          }}
        >
          <p
            style={{
              margin: '0 0 clamp(22px,4vw,40px)',
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontWeight: 600,
              fontSize: 'clamp(30px,4.4vw,52px)',
              color: '#FFFFFF',
              textShadow: '0 2px 14px rgba(51,65,77,0.4)',
            }}
          >
            {c.promisesHeading}
          </p>
          {/* 2-col grid with 3rd card centered below */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'clamp(16px,2.6vw,28px)',
            }}
          >
            {c.promises.map((p, i) => (
              <div
                key={p.num}
                style={{
                  background: 'rgba(251,244,234,0.92)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: 16,
                  padding: '26px 24px',
                  boxShadow: '0 14px 34px rgba(51,65,77,0.16)',
                  // 3rd card: span centered
                  ...(i === 2
                    ? { gridColumn: '1 / -1', maxWidth: 'calc(50% - 8px)' }
                    : {}),
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                    fontWeight: 600,
                    fontSize: 32,
                    color: p.color,
                    lineHeight: 1,
                  }}
                >
                  {p.num}
                </div>
                <h3
                  style={{
                    margin: '6px 0 10px',
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: 24,
                    color: DARK,
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: BODY }}>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why You'll Love Them ── */}
        <section
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1200,
            margin: '0 auto',
            padding: 'clamp(28px,4vw,48px) clamp(20px,4vw,40px) clamp(60px,9vw,130px)',
          }}
        >
          <p
            style={{
              margin: '0 0 clamp(22px,4vw,40px)',
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontWeight: 600,
              fontSize: 'clamp(30px,4.4vw,52px)',
              color: '#FFFFFF',
              textShadow: '0 2px 14px rgba(51,65,77,0.4)',
            }}
          >
            {c.whyHeading}
          </p>
          {/* 2-col grid with 3rd card centered below */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'clamp(18px,3vw,36px)',
              alignItems: 'start',
            }}
          >
            {c.whyCards.map((card, i) => (
              <div
                key={card.label}
                style={{
                  background: card.bg,
                  borderRadius: 16,
                  padding: '26px 24px',
                  boxShadow: '0 14px 34px rgba(51,65,77,0.2)',
                  transform: t([-45, 48, -22][i]),
                  marginTop: i === 1 ? 'clamp(0px,5vw,64px)' : i === 2 ? 'clamp(0px,2.5vw,28px)' : 0,
                  // 3rd card: span centered
                  ...(i === 2
                    ? { gridColumn: '1 / -1', maxWidth: 'calc(50% - 10px)' }
                    : {}),
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: card.labelColor,
                  }}
                >
                  {card.label}
                </div>
                <p
                  style={{
                    margin: '10px 0 0',
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 22,
                    lineHeight: 1.35,
                    fontWeight: 500,
                    color: card.textColor,
                  }}
                >
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ───── About Strip ───── */}
      <section
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: 'clamp(64px,9vw,120px) clamp(20px,4vw,40px)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 450,
            fontSize: 'clamp(26px,3.4vw,40px)',
            lineHeight: 1.35,
            color: DARK,
          }}
        >
          {c.aboutStrip.quote}
        </p>
        <p
          style={{
            margin: '20px 0 0',
            fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
            fontWeight: 600,
            fontSize: 26,
            color: BLUE_DARK,
          }}
        >
          {c.aboutStrip.attribution}
        </p>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: MUTED,
          }}
        >
          {c.aboutStrip.credential}
        </p>
        <a
          href={c.aboutStrip.linkHref}
          style={{
            display: 'inline-block',
            marginTop: 22,
            fontSize: 15,
            textDecoration: 'underline',
            textUnderlineOffset: 5,
            textDecorationColor: BLUE,
            color: DARK,
          }}
        >
          {c.aboutStrip.linkText}
        </a>
      </section>

      {/* ───── CTA Band ───── */}
      <section style={{ backgroundColor: BLUE }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: 'clamp(64px,9vw,120px) clamp(20px,4vw,40px)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 'clamp(38px,5.6vw,72px)',
              lineHeight: 1.08,
              color: '#FFFFFF',
            }}
          >
            {c.ctaBand.headlineStart}
            <span
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontWeight: 600,
                color: YELLOW,
                fontSize: '1.1em',
              }}
            >
              {c.ctaBand.headlineAccent}
            </span>
            {c.ctaBand.headlineEnd}
          </h2>
          <p
            style={{
              margin: '22px auto 34px',
              maxWidth: '52ch',
              fontSize: 17,
              lineHeight: 1.65,
              color: '#EAF2F8',
            }}
          >
            {c.ctaBand.description}
          </p>
          <a
            href={c.ctaBand.ctaHref}
            style={{
              display: 'inline-block',
              background: PEACH,
              color: DARK,
              textDecoration: 'none',
              padding: '16px 36px',
              borderRadius: 999,
              fontSize: 13,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              transition: 'transform .15s ease, box-shadow .15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 26px rgba(31,46,58,0.28)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {c.ctaBand.ctaText}
          </a>
        </div>
      </section>

      <Footer footer={c.footer} />
    </main>
  );
}
