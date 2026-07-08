'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content, { Product } from '../content';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';

const LS_KEY = 'sunday_products_v1';

function loadProducts(): Product[] {
  if (typeof window === 'undefined') return content.shop.seedProducts;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return content.shop.seedProducts;
}

export function ShopPage() {
  const c = content;
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState<Product[]>(content.shop.seedProducts);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter);

  return (
    <main style={{ backgroundColor: CREAM, color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", minHeight: '100vh' }}>
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      {/* ───── Header ───── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(100px,10vw,140px) clamp(20px,4vw,40px) clamp(20px,3vw,40px)',
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
          {c.shop.eyebrow}
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(44px,6.8vw,88px)',
            lineHeight: 1.04,
            color: DARK,
          }}
        >
          Sho
          <span
            style={{
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontWeight: 600,
              color: BLUE,
              fontSize: '1.12em',
            }}
          >
            p
          </span>
        </h1>
      </section>

      {/* ───── Intro Kit Feature Card ───── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,40px) clamp(32px,5vw,56px)' }}>
        <div
          style={{
            background: 'linear-gradient(120deg, #D7E6F7 0%, #FFE6CB 50%, #FFF2B6 100%)',
            borderRadius: 18,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(20px,4vw,48px)',
              alignItems: 'center',
              padding: 'clamp(28px,4vw,48px)',
            }}
          >
            {/* Left */}
            <div>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: BLUE_DARK,
                }}
              >
                {c.shop.introKit.eyebrow}
              </p>
              <h2
                style={{
                  margin: '0 0 14px',
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontWeight: 500,
                  fontSize: 'clamp(28px,3.6vw,42px)',
                  lineHeight: 1.15,
                  color: DARK,
                }}
              >
                {c.shop.introKit.headlineStart}
                <span
                  style={{
                    fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                    fontWeight: 600,
                    color: BLUE,
                    fontSize: '1.1em',
                  }}
                >
                  {c.shop.introKit.headlineAccent}
                </span>
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 16, lineHeight: 1.65, color: BODY, maxWidth: '44ch' }}>
                {c.shop.introKit.description}
              </p>
              <a
                href={c.shop.introKit.ctaHref}
                style={{
                  display: 'inline-block',
                  background: PEACH,
                  color: DARK,
                  textDecoration: 'none',
                  padding: '14px 30px',
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
                {c.shop.introKit.ctaText}
              </a>
            </div>

            {/* Right — image placeholder */}
            <div
              style={{
                width: '100%',
                height: 260,
                borderRadius: 14,
                backgroundColor: 'rgba(251,244,234,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{ color: MUTED, fontSize: 14 }}>Intro kit photo placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Filter Buttons ───── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(20px,3vw,36px) clamp(20px,4vw,40px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {c.shop.categories.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: 999,
                  fontSize: 13,
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: active ? 'none' : `1.5px solid ${DARK}`,
                  backgroundColor: active ? DARK : 'transparent',
                  color: active ? CREAM : DARK,
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  transition: 'all .15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ───── Product Grid ───── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,40px) clamp(48px,7vw,80px)' }}>
        {filtered.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: MUTED,
              padding: '60px 20px',
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontSize: 22,
            }}
          >
            {c.shop.emptyMessage}
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'clamp(16px,2.6vw,24px)',
            }}
          >
            {filtered.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #ECDECB',
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image placeholder */}
                <div
                  style={{
                    width: '100%',
                    height: 220,
                    backgroundColor: '#F3EDE4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p style={{ color: MUTED, fontSize: 13 }}>Product photo</p>
                </div>

                {/* Card body */}
                <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        backgroundColor: '#D7E6F7',
                        color: BLUE_DARK,
                      }}
                    >
                      {product.level}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        backgroundColor: c.shop.categoryColors[product.category] ?? '#E7F0FA',
                        color: DARK,
                      }}
                    >
                      {product.category}
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: '0 0 8px',
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontWeight: 600,
                      fontSize: 20,
                      color: DARK,
                    }}
                  >
                    {product.name}
                  </h3>
                  <p style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.55, color: BODY, flex: 1 }}>
                    {product.desc}
                  </p>

                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      borderRadius: 999,
                      border: `1.5px solid #ECDECB`,
                      backgroundColor: 'transparent',
                      color: MUTED,
                      fontSize: 12,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      cursor: 'not-allowed',
                      fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                    }}
                  >
                    Checkout coming soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer footer={c.footer} />
    </main>
  );
}
