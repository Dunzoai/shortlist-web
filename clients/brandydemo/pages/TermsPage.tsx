'use client';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content from '../content';
import EmailSubscribe from '../components/EmailSubscribe';

const CREAM = '#FBF4EA';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const BORDER = '#ECDECB';

export function TermsPage() {
  const c = content;
  const t = c.terms;

  return (
    <main style={{ backgroundColor: CREAM, color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", minHeight: '100vh' }}>
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      <section
        style={{
          maxWidth: 780,
          margin: '0 auto',
          padding: 'clamp(96px,10vw,140px) clamp(20px,4vw,40px) clamp(56px,7vw,88px)',
        }}
      >
        {/* Header */}
        <p style={{ margin: '0 0 14px', fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: MUTED }}>
          {t.eyebrow}
        </p>
        <h1
          style={{
            margin: '0 0 12px',
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(38px,5.5vw,60px)',
            lineHeight: 1.08,
            color: DARK,
          }}
        >
          Terms &amp;{' '}
          <span style={{ fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive", fontWeight: 600, color: BLUE_DARK }}>
            Conditions
          </span>
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 13, fontStyle: 'italic', color: MUTED }}>{t.updated}</p>
        <p style={{ margin: '0 0 8px', fontSize: 17, lineHeight: 1.75, color: BODY }}>{t.intro}</p>

        {/* Sections */}
        <div style={{ marginTop: 'clamp(36px,5vw,56px)' }}>
          {t.sections.map((s, i) => (
            <section
              key={s.heading}
              style={{
                paddingTop: 'clamp(28px,4vw,40px)',
                marginTop: 'clamp(28px,4vw,40px)',
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
                <span
                  style={{
                    fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                    fontSize: 26,
                    fontWeight: 600,
                    color: BLUE_DARK,
                    lineHeight: 1,
                    minWidth: 30,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(21px,2.6vw,27px)',
                    color: DARK,
                  }}
                >
                  {s.heading}
                </h2>
              </div>
              {s.body.map((para, j) => (
                <p
                  key={j}
                  style={{
                    margin: j === 0 ? '0' : '14px 0 0',
                    fontSize: 15.5,
                    lineHeight: 1.75,
                    color: BODY,
                    paddingLeft: 'clamp(0px,1vw,44px)',
                  }}
                >
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </section>

      <EmailSubscribe />
      <Footer footer={c.footer} />
    </main>
  );
}
