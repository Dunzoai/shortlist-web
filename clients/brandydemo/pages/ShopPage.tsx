'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { supabase } from '@/lib/supabase';
import content from '../content';
import EmailSubscribe from '../components/EmailSubscribe';
import { computeTotals, DEFAULT_SETTINGS, type StoreSettings } from '@/lib/storeSettings';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';

// The intro kit is a real product but rendered as the hero card, not in the grid.
const INTRO_KIT_ID = 'intro-kit';

type Product = {
  id: string;
  name: string;
  description: string;
  level: string;
  category: string;
  image_url: string | null;
  price: number | null;
};

type CartLine = { id: string; name: string; price: number; qty: number };

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
  const cc = content.shop.cart;
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

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

      const { data: s } = await supabase
        .from('sunday_settings')
        .select('tax_rate, shipping_flat_cents, shipping_carrier, free_shipping_threshold_cents')
        .eq('client_slug', 'brandydemo')
        .maybeSingle();
      if (s) setSettings(s);

      setLoading(false);
    }
    load();
  }, []);

  const introProduct = products.find((p) => p.id === INTRO_KIT_ID);
  const shopProducts = products.filter((p) => p.id !== INTRO_KIT_ID);

  const filtered = filter === 'All' ? shopProducts : shopProducts.filter((p) => p.category === filter);

  // Filter buttons reflect the categories that actually exist on products,
  // ordered by the content list first, then any custom categories after.
  const productCats = Array.from(new Set(shopProducts.map((p) => p.category).filter(Boolean)));
  const orderedBase = c.shop.categories.filter((cat) => cat === 'All' || productCats.includes(cat));
  const extraCats = productCats.filter((cat) => !c.shop.categories.includes(cat));
  const filterCats = [...orderedBase, ...extraCats];

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = cart.reduce((sum, l) => sum + l.price * l.qty, 0);
  const totals = computeTotals(Math.round(subtotal * 100), settings);
  const shippingLabel = settings.shipping_carrier ? `${cc.shippingLabel} — ${settings.shipping_carrier}` : cc.shippingLabel;

  const addToCart = (p: Product) => {
    if (p.price == null) return;
    setError('');
    setCart((prev) => {
      const existing = prev.find((l) => l.id === p.id);
      if (existing) {
        return prev.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { id: p.id, name: p.name, price: p.price as number, qty: 1 }];
    });
    setCartOpen(true);
  };

  const setQty = (id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    setError('');
    try {
      const res = await fetch('/api/square/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map((l) => ({ product_id: l.id, quantity: l.qty })) }),
      });
      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      setError(data.error ? `${cc.error}` : cc.error);
      setCheckingOut(false);
    } catch {
      setError(cc.error);
      setCheckingOut(false);
    }
  };

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
            {introProduct && introProduct.price != null ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <button
                  onClick={() => addToCart(introProduct)}
                  style={{
                    background: PEACH,
                    color: DARK,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    padding: '14px 28px',
                    borderRadius: 999,
                    fontSize: 12,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                    transition: 'transform .15s ease, box-shadow .15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,198,161,0.65)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {cc.addButton}
                </button>
                <span style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 26, color: DARK }}>
                  {formatPrice(introProduct.price)}
                </span>
              </div>
            ) : (
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
            )}
          </div>
          <div style={{ width: '100%', height: 'clamp(240px,28vw,340px)', borderRadius: 12, overflow: 'hidden' }}>
            <img
              src="/clients/brandydemo/intro-kit.jpg"
              alt={c.shop.introKit.headlineStart + c.shop.introKit.headlineAccent}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
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
                    onClick={() => addToCart(product)}
                    disabled={product.price == null}
                    style={{
                      marginTop: 6,
                      border: 'none',
                      background: product.price == null ? 'none' : DARK,
                      borderRadius: 999,
                      padding: 12,
                      fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                      fontSize: 12,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: product.price == null ? MUTED : CREAM,
                      fontWeight: 600,
                      cursor: product.price == null ? 'not-allowed' : 'pointer',
                      ...(product.price == null ? { border: '1px solid #C9BCA9' } : {}),
                    }}
                  >
                    {product.price == null ? cc.soldOut : cc.addButton}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ───── Floating Cart Button ───── */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 40,
            cursor: 'pointer',
            background: DARK,
            color: CREAM,
            border: 'none',
            borderRadius: 999,
            padding: '14px 24px',
            fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
            fontSize: 13,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(51,65,77,0.28)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {cc.cartLabel}
          <span style={{ background: PEACH, color: DARK, borderRadius: 999, padding: '2px 9px', fontSize: 12 }}>{cartCount}</span>
        </button>
      )}

      {/* ───── Cart Drawer ───── */}
      {cartOpen && (
        <>
          <div
            onClick={() => setCartOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(51,65,77,0.35)', zIndex: 50 }}
          />
          <aside
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(400px, 100vw)',
              background: CREAM,
              zIndex: 51,
              boxShadow: '-14px 0 40px rgba(51,65,77,0.2)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 24px', borderBottom: '1px solid #ECDECB' }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, color: DARK }}>
                {cc.title}
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: 26, lineHeight: 1, color: MUTED }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {cart.length === 0 ? (
                <p style={{ color: BODY, fontSize: 15, marginTop: 24 }}>{cc.empty}</p>
              ) : (
                cart.map((line) => (
                  <div key={line.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #ECDECB' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 600, color: DARK }}>{line.name}</p>
                      <p style={{ margin: 0, fontSize: 13, color: BLUE_DARK }}>{formatPrice(line.price)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => setQty(line.id, line.qty - 1)} style={stepperStyle} aria-label="Decrease">−</button>
                      <span style={{ minWidth: 20, textAlign: 'center', fontSize: 15 }}>{line.qty}</span>
                      <button onClick={() => setQty(line.id, line.qty + 1)} style={stepperStyle} aria-label="Increase">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '18px 24px 24px', borderTop: '1px solid #ECDECB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14, color: BODY }}>
                <span>{cc.subtotalLabel}</span>
                <span>{formatPrice(totals.subtotal / 100)}</span>
              </div>
              {cart.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14, color: BODY }}>
                  <span>{shippingLabel}</span>
                  <span>{totals.shipping === 0 ? cc.freeShipping : formatPrice(totals.shipping / 100)}</span>
                </div>
              )}
              {totals.tax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14, color: BODY }}>
                  <span>{cc.taxLabel}</span>
                  <span>{formatPrice(totals.tax / 100)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '10px 0 12px', paddingTop: 10, borderTop: '1px solid #ECDECB' }}>
                <span style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>{cc.totalLabel}</span>
                <span style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 22, color: DARK }}>
                  {formatPrice(totals.total / 100)}
                </span>
              </div>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED }}>{cc.shippingNote}</p>
              {error && <p style={{ margin: '0 0 12px', fontSize: 13, color: '#C56B6B' }}>{error}</p>}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkingOut}
                style={{
                  width: '100%',
                  cursor: cart.length === 0 || checkingOut ? 'default' : 'pointer',
                  background: DARK,
                  color: CREAM,
                  border: 'none',
                  borderRadius: 999,
                  padding: '15px 24px',
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  opacity: cart.length === 0 || checkingOut ? 0.55 : 1,
                }}
              >
                {checkingOut ? cc.checkingOut : cc.checkoutButton}
              </button>
            </div>
          </aside>
        </>
      )}

      <EmailSubscribe />
      <Footer footer={c.footer} />
    </main>
  );
}

const stepperStyle: React.CSSProperties = {
  cursor: 'pointer',
  width: 30,
  height: 30,
  borderRadius: 999,
  border: '1px solid #C9BCA9',
  background: '#FFFFFF',
  color: DARK,
  fontSize: 16,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
