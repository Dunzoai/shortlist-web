'use client';

import Image from 'next/image';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content from '../content';
import EmailSubscribe from '../components/EmailSubscribe';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const YELLOW = '#FFF2B6';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';

export function AboutPage() {
  const c = content;

  return (
    <main
      style={{
        backgroundColor: CREAM,
        color: DARK,
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
      }}
    >
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      {/* ───── Two-column about section ───── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(100px,10vw,140px) clamp(20px,4vw,40px) clamp(40px,5vw,72px)',
          position: 'relative',
          overflow: 'visible',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(32px,6vw,80px)',
          alignItems: 'center',
        }}
      >
        <img
          src="/clients/brandydemo/cloud-mascot.png"
          alt=""
          style={{
            position: 'absolute',
            top: 'clamp(10px,2vw,30px)',
            right: 'clamp(-20px,2vw,40px)',
            width: 'clamp(200px,28vw,400px)',
            height: 'auto',
            animation: 'cloud-idle 5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        {/* Left — Image with gradient border */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: -14,
              borderRadius: 24,
              background: `linear-gradient(135deg, #D7E6F7 0%, #FFE6CB 50%, ${YELLOW} 100%)`,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: 'clamp(380px,48vw,580px)',
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: '#e8ddd0',
            }}
          >
            <Image
              src={c.about.image}
              alt="Brandy"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 700px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right — Text content */}
        <div>
          <p
            style={{
              margin: '0 0 14px',
              fontSize: 12,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            {c.about.eyebrow}
          </p>

          <h1
            style={{
              margin: '0 0 24px',
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 'clamp(38px,5.4vw,64px)',
              lineHeight: 1.1,
              color: DARK,
            }}
          >
            {c.about.headlineStart}
            <span
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontWeight: 600,
                color: BLUE_DARK,
                fontSize: '1.12em',
              }}
            >
              {c.about.headlineAccent}
            </span>
          </h1>

          <p
            style={{
              margin: '0 0 28px',
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontStyle: 'italic',
              fontWeight: 450,
              fontSize: 20,
              lineHeight: 1.5,
              color: DARK,
            }}
          >
            {c.about.heroQuote}
          </p>

          {c.about.paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                margin: i < c.about.paragraphs.length - 1 ? '0 0 20px' : '0 0 36px',
                fontSize: 17,
                lineHeight: 1.75,
                color: '#42505C',
              }}
            >
              {para}
            </p>
          ))}

          <a
            href={c.about.ctaHref}
            style={{
              display: 'inline-block',
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
            {c.about.ctaText}
          </a>
        </div>
      </section>
      <style>{`
        @keyframes cloud-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <EmailSubscribe />
      <Footer footer={c.footer} />
    </main>
  );
}
