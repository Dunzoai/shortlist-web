'use client';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const DARK = '#33414D';
const INFO_BG = '#E7F0FA';
const BODY = '#55606B';

export function TermsPage() {
  const c = content;

  return (
    <main style={{ backgroundColor: CREAM, color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", minHeight: '100vh' }}>
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      <section
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: 'clamp(100px,10vw,140px) clamp(20px,4vw,40px) clamp(60px,8vw,100px)',
        }}
      >
        <h1
          style={{
            margin: '0 0 clamp(28px,4vw,48px)',
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(36px,5vw,56px)',
            lineHeight: 1.1,
            color: DARK,
          }}
        >
          Terms &amp; Conditions
        </h1>

        <div
          style={{
            backgroundColor: INFO_BG,
            border: `2px dashed ${BLUE}`,
            borderRadius: 14,
            padding: 'clamp(28px,4vw,48px)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'monospace',
              fontSize: 16,
              lineHeight: 1.6,
              color: DARK,
            }}
          >
            [[ PASTE TERMS &amp; CONDITIONS TEXT HERE ]]
          </p>
          <p
            style={{
              margin: '18px 0 0',
              fontSize: 14,
              lineHeight: 1.5,
              color: BODY,
            }}
          >
            Replace this placeholder with your full terms and conditions content.
          </p>
        </div>
      </section>

      <Footer footer={c.footer} />
    </main>
  );
}
