'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import EmailSubscribe from '../components/EmailSubscribe';

import { supabase } from '@/lib/supabase';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';

type GalleryItem = {
  id: string;
  image_url: string;
  caption: string;
};

export function GalleryPage() {
  const c = content;
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function load() {
      const { data: client } = await supabase
        .from('web_clients')
        .select('id')
        .eq('slug', 'brandydemo')
        .single();

      if (client) {
        const { data } = await supabase
          .from('sunday_gallery')
          .select('id, image_url, caption')
          .eq('client_id', client.id)
          .order('sort_order', { ascending: true });

        if (data) setItems(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main
      style={{
        backgroundColor: CREAM,
        color: DARK,
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
        minHeight: '100vh',
      }}
    >
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      {/* ───── Header ───── */}
      <header
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(44px,7vw,96px) clamp(20px,4vw,40px) clamp(32px,4vw,48px)',
          textAlign: 'center',
          position: 'relative',
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
          Previous work
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
          Galler
          <span
            style={{
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontWeight: 600,
              color: BLUE_DARK,
              fontSize: '1.12em',
            }}
          >
            y
          </span>
        </h1>
        <p
          style={{
            margin: '20px auto 0',
            maxWidth: '48ch',
            fontSize: 'clamp(16px,1.5vw,18px)',
            lineHeight: 1.65,
            color: BODY,
          }}
        >
          A look at some of the sets I&apos;ve created for clients. Every set is handmade and one of a kind.
        </p>

      </header>

      {/* ───── Gallery Grid ───── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 clamp(20px,4vw,40px) clamp(64px,9vw,110px)',
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', color: MUTED, padding: '60px 0', fontSize: 16 }}>
            Loading gallery...
          </p>
        ) : items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'clamp(60px,10vw,120px) 20px',
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontSize: 'clamp(24px,3vw,36px)',
                color: BLUE_DARK,
                marginBottom: 12,
              }}
            >
              Coming soon...
            </p>
            <p style={{ fontSize: 15, color: BODY }}>
              Gallery photos will appear here once added from the{' '}
              <a href="/studio-admin" style={{ color: BLUE_DARK, textDecoration: 'underline', textUnderlineOffset: 4 }}>
                Studio Admin
              </a>
              .
            </p>
          </div>
        ) : (
          <div
            style={{
              columns: 'clamp(1, 3, 3)',
              columnWidth: 300,
              columnGap: 'clamp(12px,2vw,20px)',
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightbox(item)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: 'clamp(12px,2vw,20px)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform .2s ease, box-shadow .2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(51,65,77,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.caption || 'Nail set'}
                  style={{ width: '100%', display: 'block' }}
                />
                {item.caption && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '24px 16px 14px',
                      background: 'linear-gradient(transparent, rgba(51,65,77,0.7))',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {item.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ───── Lightbox ───── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(51,65,77,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            cursor: 'pointer',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={lightbox.image_url}
              alt={lightbox.caption || 'Nail set'}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                borderRadius: 12,
                objectFit: 'contain',
              }}
            />
            {lightbox.caption && (
              <p
                style={{
                  textAlign: 'center',
                  color: '#FFFFFF',
                  marginTop: 16,
                  fontSize: 16,
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                }}
              >
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}

      <EmailSubscribe />
      <Footer footer={c.footer} />
    </main>
  );
}
