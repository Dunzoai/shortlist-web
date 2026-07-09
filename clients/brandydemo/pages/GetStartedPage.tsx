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
const WARM_BG = '#FDEBDA';

export function GetStartedPage() {
  const c = content;
  const gs = c.getStarted;

  return (
    <main
      style={{
        backgroundColor: CREAM,
        color: DARK,
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
      }}
    >
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      {/* ───── Header ───── */}
      <section
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: 'clamp(100px,10vw,140px) clamp(20px,4vw,40px) clamp(32px,4vw,56px)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: '0 0 14px',
            fontSize: 12,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: MUTED,
          }}
        >
          {gs.eyebrow}
        </p>
        <h1
          style={{
            margin: '0 0 20px',
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(38px,5.4vw,64px)',
            lineHeight: 1.1,
            color: DARK,
          }}
        >
          {gs.headlineStart}
          <span
            style={{
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontWeight: 600,
              color: BLUE_DARK,
              fontSize: '1.12em',
            }}
          >
            {gs.headlineAccent}
          </span>
        </h1>
        <p
          style={{
            margin: '0 auto',
            maxWidth: '58ch',
            fontSize: 17,
            lineHeight: 1.7,
            color: BODY,
          }}
        >
          {gs.intro}
        </p>
      </section>

      {/* ───── Blue info section — Kit items ───── */}
      <section style={{ backgroundColor: INFO_BG }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,40px)',
          }}
        >
          <h2
            style={{
              margin: '0 0 clamp(24px,4vw,44px)',
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 'clamp(26px,3.6vw,40px)',
              lineHeight: 1.15,
              color: DARK,
              textAlign: 'center',
            }}
          >
            {gs.kitHeading}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'clamp(16px,2.4vw,24px)',
            }}
          >
            {gs.kitItems.map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  padding: '24px 22px',
                  boxShadow: '0 2px 12px rgba(51,65,77,0.06)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                    fontWeight: 600,
                    fontSize: 32,
                    lineHeight: 1,
                    color: gs.kitColors[i] || BLUE_DARK,
                    marginBottom: 8,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: BODY,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: 'clamp(56px,8vw,100px) clamp(20px,4vw,40px)',
        }}
      >
        <h2
          style={{
            margin: '0 0 clamp(28px,4vw,48px)',
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(28px,3.8vw,44px)',
            lineHeight: 1.15,
            color: DARK,
            textAlign: 'center',
          }}
        >
          {gs.howItWorksHeading}
          <span
            style={{
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontWeight: 600,
              color: BLUE_DARK,
              fontSize: '1.12em',
            }}
          >
            {gs.howItWorksAccent}
          </span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px,4vw,44px)' }}>
          {gs.steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                gap: 'clamp(14px,2vw,24px)',
                alignItems: 'start',
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                  fontWeight: 600,
                  fontSize: 'clamp(36px,4.4vw,52px)',
                  lineHeight: 1,
                  color: BLUE,
                }}
              >
                {i + 1}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: BODY,
                  paddingTop: 6,
                }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Things to know ───── */}
      <section
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 clamp(20px,4vw,40px) clamp(56px,8vw,100px)',
        }}
      >
        <div
          style={{
            background: WARM_BG,
            borderRadius: 16,
            padding: 'clamp(28px,4vw,48px) clamp(24px,4vw,44px)',
          }}
        >
          <h2
            style={{
              margin: '0 0 20px',
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 'clamp(22px,2.8vw,32px)',
              lineHeight: 1.2,
              color: DARK,
            }}
          >
            {gs.thingsToKnowHeading}
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              listStyleType: 'disc',
            }}
          >
            {gs.thingsToKnow.map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: BODY,
                  marginBottom: i < gs.thingsToKnow.length - 1 ? 10 : 0,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section
        style={{
          textAlign: 'center',
          padding: '0 clamp(20px,4vw,40px) clamp(64px,9vw,120px)',
        }}
      >
        <a
          href={gs.ctaHref}
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
          {gs.ctaText}
        </a>
      </section>

      <EmailSubscribe />
      <Footer footer={c.footer} />
    </main>
  );
}
