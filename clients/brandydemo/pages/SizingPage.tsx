'use client';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content from '../content';
import CloudMascot from '../components/CloudMascot';
import EmailSubscribe from '../components/EmailSubscribe';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const INFO_BG = '#E7F0FA';

export function SizingPage() {
  const c = content.sizing;

  return (
    <main
      style={{
        backgroundColor: CREAM,
        color: DARK,
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
      }}
    >
      <Nav nav={content.nav} brandLabel={content.brandLabel} />

      {/* ───── Header ───── */}
      <header
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(100px,10vw,140px) clamp(20px,4vw,40px) clamp(44px,6vw,84px)',
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
            {c.eyebrow}
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
            {c.headlineStart}
            <span
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontWeight: 600,
                color: BLUE_DARK,
                fontSize: '1.12em',
              }}
            >
              {c.headlineAccent}
            </span>
          </h1>
          <p
            style={{
              margin: '24px 0 0',
              fontSize: 'clamp(17px,1.6vw,20px)',
              lineHeight: 1.65,
              color: BODY,
              maxWidth: '46ch',
            }}
          >
            {c.intro}
          </p>
          <p
            style={{
              margin: '16px 0 0',
              fontSize: 'clamp(15px,1.4vw,17px)',
              lineHeight: 1.65,
              color: BODY,
              maxWidth: '46ch',
            }}
          >
            {c.introDetail}
          </p>
        </div>

        {/* Hero image with gradient border */}
        <div style={{ marginTop: 'clamp(0px,3vw,44px)', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: -14,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${BLUE} 0%, #FFE6CB 55%, #FFF2B6 100%)`,
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ color: MUTED, fontSize: 14, textAlign: 'center', padding: 20 }}>
              Sizing photo placeholder
            </p>
          </div>
        </div>
      </header>

      {/* ───── Steps Section ───── */}
      <section style={{ backgroundColor: INFO_BG }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: 'clamp(60px,9vw,120px) clamp(20px,4vw,40px)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'clamp(18px,2.6vw,28px)',
            }}
          >
            {c.steps.map((step, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  padding: 'clamp(24px,3vw,32px)',
                  boxShadow: '0 6px 24px rgba(51,65,77,0.08)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: '16px',
                    alignItems: 'start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                      fontWeight: 600,
                      fontSize: 48,
                      lineHeight: 1,
                      color: c.stepColors[i],
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2
                      style={{
                        margin: '4px 0 10px',
                        fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                        fontWeight: 600,
                        fontSize: 'clamp(20px,2vw,24px)',
                        color: DARK,
                      }}
                    >
                      {step.title}
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: 1.65,
                        color: BODY,
                      }}
                    >
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA Section ───── */}
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
            margin: '0 0 28px',
            fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
            fontWeight: 600,
            fontSize: 'clamp(30px,4.4vw,48px)',
            color: BLUE_DARK,
          }}
        >
          {c.ctaCursive}
        </p>
        <CloudMascot size={300} mobileSize={90} behavior="peek" style={{ marginBottom: 20 }} />
        <a
          href={c.ctaHref}
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
            e.currentTarget.style.boxShadow = '0 8px 22px rgba(255,198,161,0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {c.ctaText}
        </a>
      </section>

      <EmailSubscribe />
      <Footer footer={content.footer} />
    </main>
  );
}
