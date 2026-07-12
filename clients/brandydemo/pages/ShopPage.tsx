'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { supabase } from '@/lib/supabase';
import content from '../content';
import EmailSubscribe from '../components/EmailSubscribe';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';

type Product = {
  id: string;
  name: string;
  description: string;
  level: string;
  category: string;
  image_url: string | null;
  price: number | null;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function ShopPage() {
  const c = content;
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: client } = await supabase
        .from('web_clients')
        .select('id')
        .eq('slug', 'brandydemo')
        .single();

      if (client) {
        const { data } = await supabase
          .from('sunday_products')
          .select('id, name, description, level, category, image_url, price')
          .eq('client_id', client.id)
          .order('sort_order', { ascending: true });

        if (data) setProducts(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter);

  // Filter buttons reflect the categories that actually exist on products,
  // ordered by the content list first, then any custom categories after.
  const productCats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const orderedBase = c.shop.categories.filter((cat) => cat === 'All' || productCats.includes(cat));
  const extraCats = productCats.filter((cat) => !c.shop.categories.includes(cat));
  const filterCats = [...orderedBase, ...extraCats];

  return (
    <main style={{ backgroundColor: CREAM, color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", minHeight: '100vh' }}>
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      {/* ───── Header ───── */}
      <header
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(44px,7vw,96px) clamp(20px,4vw,40px) clamp(20px,3vw,32px)',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <p style={{ margin: '0 0 14px', fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: MUTED }}>
          {c.shop.eyebrow}
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(44px,6.5vw,84px)',
            lineHeight: 1.05,
            color: DARK,
          }}
        >
          Sho
          <span style={{ fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive", fontWeight: 600, color: BLUE_DARK, fontSize: '1.12em' }}>
            p
          </span>
        </h1>
        {/* Cloud — positioned right, gentle idle animation, doesn't affect layout */}
        <img
          src="/clients/brandydemo/cloud-mascot.png"
          alt=""
          style={{
            position: 'absolute',
            top: 'clamp(-20px,-2vw,-40px)',
            right: 'clamp(-20px,2vw,40px)',
            width: 'clamp(200px,28vw,400px)',
            height: 'auto',
            animation: 'cloud-idle 5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      </header>
      <style>{`
        @keyframes cloud-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* ───── Intro Kit Feature Card ───── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,40px) clamp(40px,5vw,64px)' }}>
        <div
          style={{
            background: 'linear-gradient(120deg, #D7E6F7 0%, #FFE6CB 60%, #FFF2B6 100%)',
            borderRadius: 18,
            padding: 'clamp(28px,4vw,48px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(24px,4vw,48px)',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ margin: '0 0 12px', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#42505C' }}>
              {c.shop.introKit.eyebrow}
            </p>
            <h2
              style={{
                margin: '0 0 14px',
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontWeight: 600,
                fontSize: 'clamp(28px,3.6vw,42px)',
                color: DARK,
              }}
            >
              {c.shop.introKit.headlineStart}
              <span style={{ fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive", fontWeight: 600, color: BLUE_DARK }}>
                {c.shop.introKit.headlineAccent}
              </span>
            </h2>
            <p style={{ margin: '0 0 22px', fontSize: 16, lineHeight: 1.65, color: '#42505C', maxWidth: '50ch' }}>
              {c.shop.introKit.description}
            </p>
            <a
              href={c.shop.introKit.ctaHref}
              style={{
                display: 'inline-block',
                background: PEACH,
                color: DARK,
                fontWeight: 600,
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: 999,
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transition: 'transform .15s ease, box-shadow .15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,198,161,0.65)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {c.shop.introKit.ctaText}
            </a>
          </div>
          <div style={{ width: '100%', height: 'clamp(240px,28vw,340px)', borderRadius: 12, backgroundColor: 'rgba(251,244,234,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: MUTED, fontSize: 14 }}>Intro kit photo</p>
          </div>
        </div>
      </section>

      {/* ───── Filter Buttons ───── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(20px,3vw,36px) clamp(20px,4vw,40px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'clamp(28px,4vw,40px)' }}>
          {filterCats.map((cat) => {
            const active = filter === cat;
            const pastelColors: Record<string, string> = {
              'All': '#D7E6F7',
              'Custom': '#FFE6CB',
              'Pre-designed': '#FFF2B6',
              'Solid color': '#E7F0FA',
              'Sizing kits': '#FDEBDA',
            };
            const bg = active ? (pastelColors[cat] || '#D7E6F7') : 'transparent';
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  cursor: 'pointer',
                  border: active ? '1.5px solid transparent' : '1.5px solid #D4C5BE',
                  borderRadius: 999,
                  padding: '9px 20px',
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: bg,
                  color: DARK,
                  fontWeight: active ? 600 : 400,
                  transition: 'all .15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ───── Product Grid ───── */}
        {loading ? (
          <p style={{ textAlign: 'center', color: MUTED, padding: '60px 20px', fontSize: 16 }}>Loading products...</p>
        ) : filtered.length === 0 ? (
          <p style={{ margin: '32px 0 0', fontSize: 16, color: BODY }}>{c.shop.emptyMessage}</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'clamp(20px,3vw,32px)',
            }}
          >
            {filtered.map((product) => (
              <article
                key={product.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #ECDECB',
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform .15s ease, box-shadow .15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(51,65,77,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Product image */}
                <div style={{ height: 220, backgroundColor: '#F3EDE4', overflow: 'hidden' }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ color: MUTED, fontSize: 13 }}>Photo coming soon</p>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: '#D7E6F7', borderRadius: 999, padding: '4px 12px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: DARK }}>
                      {product.level}
                    </span>
                    <span style={{ background: c.shop.categoryColors[product.category] || '#F2F2F2', borderRadius: 999, padding: '4px 12px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#42505C' }}>
                      {product.category}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 22, color: DARK }}>
                    {product.name}
                  </h3>
                  {product.price != null && (
                    <p style={{ margin: 0, fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 19, color: BLUE_DARK }}>
                      {formatPrice(product.price)}
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: BODY, flex: 1 }}>
                    {product.description}
                  </p>
                  <button
                    disabled
                    style={{
                      marginTop: 6,
                      border: '1px solid #C9BCA9',
                      background: 'none',
                      borderRadius: 999,
                      padding: 12,
                      fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                      fontSize: 12,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: MUTED,
                      cursor: 'not-allowed',
                    }}
                  >
                    Checkout coming soon
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <EmailSubscribe />
      <Footer footer={c.footer} />
    </main>
  );
}
