'use client';

import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const DARK = '#33414D';
const BODY = '#55606B';
const BORDER = '#ECDECB';

export function FAQPage() {
  const c = content.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

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
          maxWidth: 820,
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
          FA
          <span
            style={{
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontWeight: 600,
              color: BLUE_DARK,
              fontSize: '1.12em',
            }}
          >
            Q
          </span>
        </h1>
      </header>

      {/* ───── Accordion ───── */}
      <section
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: '0 clamp(20px,4vw,40px) clamp(64px,9vw,120px)',
        }}
      >
        {c.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              style={{
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <button
                onClick={() => toggle(i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '24px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  textAlign: 'left',
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: 'clamp(17px,1.8vw,21px)',
                  lineHeight: 1.35,
                  color: DARK,
                }}
              >
                <span>{item.q}</span>
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: BLUE_DARK,
                    transition: 'transform .2s ease',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  overflow: 'hidden',
                  maxHeight: isOpen ? 600 : 0,
                  transition: 'max-height .3s ease',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    padding: '0 0 24px',
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: BODY,
                  }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}

        {/* ───── Bottom Note ───── */}
        <p
          style={{
            margin: 'clamp(40px,5vw,64px) 0 0',
            fontSize: 16,
            lineHeight: 1.7,
            color: BODY,
            textAlign: 'center',
          }}
        >
          Still curious? See the full{' '}
          <a
            href="/sizing"
            style={{
              color: BLUE_DARK,
              textDecoration: 'underline',
              textUnderlineOffset: 4,
            }}
          >
            sizing how-to
          </a>{' '}
          or{' '}
          <a
            href="/get-started"
            style={{
              color: BLUE_DARK,
              textDecoration: 'underline',
              textUnderlineOffset: 4,
            }}
          >
            get started with the intro kit
          </a>
          .
        </p>
      </section>

      <Footer footer={content.footer} />
    </main>
  );
}
