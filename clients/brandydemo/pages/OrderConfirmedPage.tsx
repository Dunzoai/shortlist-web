'use client';

import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const BORDER = '#ECDECB';

export function OrderConfirmedPage() {
  const c = content;
  const t = c.orderConfirmed;
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderNumber(params.get('order') || params.get('order_success') || '');
  }, []);

  return (
    <main style={{ backgroundColor: CREAM, color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      <section
        style={{
          flex: 1,
          maxWidth: 640,
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(90px,11vw,150px) clamp(20px,4vw,40px) clamp(56px,7vw,88px)',
          textAlign: 'center',
        }}
      >
        {/* Check badge */}
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #D7E6F7 0%, #FFE6CB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={BLUE_DARK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <p style={{ margin: '0 0 12px', fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: MUTED }}>
          {t.eyebrow}
        </p>
        <h1
          style={{
            margin: '0 0 16px',
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(40px,6vw,64px)',
            lineHeight: 1.05,
            color: DARK,
          }}
        >
          {t.headingStart}
          <span style={{ fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive", fontWeight: 600, color: BLUE_DARK }}>
            {t.headingAccent}
          </span>
        </h1>
        <p style={{ margin: '0 auto 26px', maxWidth: '46ch', fontSize: 17, lineHeight: 1.7, color: BODY }}>
          {t.message}
        </p>

        {orderNumber && (
          <div
            style={{
              display: 'inline-block',
              background: '#FFFFFF',
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              padding: '14px 26px',
              marginBottom: 30,
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, marginRight: 10 }}>
              {t.orderLabel}
            </span>
            <span style={{ fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", fontWeight: 600, fontSize: 15, color: DARK }}>
              {orderNumber}
            </span>
          </div>
        )}

        {/* What happens next */}
        <div
          style={{
            background: '#E7F0FA',
            borderRadius: 16,
            padding: 'clamp(22px,3vw,30px)',
            textAlign: 'left',
            maxWidth: 520,
            margin: '0 auto 32px',
          }}
        >
          <h2
            style={{
              margin: '0 0 8px',
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 600,
              fontSize: 20,
              color: DARK,
            }}
          >
            {t.processingTitle}
          </h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: BODY }}>{t.processing}</p>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={t.keepShoppingHref}
            style={{
              background: PEACH,
              color: DARK,
              fontWeight: 600,
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: 999,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {t.keepShoppingText}
          </a>
          <a
            href={t.galleryHref}
            style={{
              background: 'none',
              color: DARK,
              fontWeight: 600,
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: 999,
              border: '1px solid #C9BCA9',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {t.galleryText}
          </a>
        </div>
      </section>

      <Footer footer={c.footer} />
    </main>
  );
}
