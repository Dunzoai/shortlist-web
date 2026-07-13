'use client';

import { useState } from 'react';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const BORDER = '#ECDECB';
const INPUT_BORDER = '#E0D4C4';

type Settings = {
  tax_rate: number;
  shipping_flat_cents: number;
  shipping_carrier: string | null;
  free_shipping_threshold_cents: number | null;
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: MUTED,
  marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${INPUT_BORDER}`,
  borderRadius: 8,
  padding: '11px 12px',
  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
  fontSize: 16,
  color: DARK,
  backgroundColor: CREAM,
  outline: 'none',
};
const hintStyle: React.CSSProperties = { margin: '6px 0 0', fontSize: 12, color: MUTED, lineHeight: 1.5 };

export default function OrderSettings() {
  const t = content.admin.settings;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [taxRate, setTaxRate] = useState('');
  const [shipping, setShipping] = useState('');
  const [carrier, setCarrier] = useState('');
  const [freeOver, setFreeOver] = useState('');

  const openPanel = async () => {
    setOpen(true);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch('/api/studio-admin/settings');
      const { settings } = await res.json();
      const s: Settings = settings || {};
      setTaxRate(s.tax_rate ? String(s.tax_rate) : '');
      setShipping(s.shipping_flat_cents ? (s.shipping_flat_cents / 100).toFixed(2) : '');
      setCarrier(s.shipping_carrier || '');
      setFreeOver(s.free_shipping_threshold_cents != null ? String(s.free_shipping_threshold_cents / 100) : '');
    } catch {
      /* leave fields as-is */
    }
    setLoading(false);
  };

  const toCents = (v: string) => {
    const n = Number(v.replace(/[^0-9.]/g, ''));
    return Number.isNaN(n) ? 0 : Math.round(n * 100);
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const body = {
      tax_rate: Number(taxRate.replace(/[^0-9.]/g, '')) || 0,
      shipping_flat_cents: toCents(shipping),
      shipping_carrier: carrier.trim() || null,
      free_shipping_threshold_cents: freeOver.trim() === '' ? null : toCents(freeOver),
    };
    const res = await fetch('/api/studio-admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setOpen(false), 700);
    }
  };

  const field = (
    label: string,
    hint: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    prefix?: string,
  ) => (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 16 }}>
            {prefix}
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={prefix ? 'decimal' : undefined}
          style={{ ...inputStyle, paddingLeft: prefix ? 24 : 12 }}
        />
      </div>
      <p style={hintStyle}>{hint}</p>
    </div>
  );

  return (
    <>
      <style>{`
        .osx-overlay { position: fixed; inset: 0; background: rgba(51,65,77,0.35); z-index: 70;
          opacity: 0; pointer-events: none; transition: opacity .25s ease; }
        .osx-overlay.open { opacity: 1; pointer-events: auto; }
        .osx-panel { position: fixed; z-index: 71; background: ${CREAM}; display: flex; flex-direction: column;
          transition: transform .3s cubic-bezier(.22,.61,.36,1); }
        /* Mobile: bottom sheet */
        .osx-panel { left: 0; right: 0; bottom: 0; max-height: 88vh; border-radius: 20px 20px 0 0;
          box-shadow: 0 -16px 44px rgba(51,65,77,0.22); transform: translateY(100%); }
        .osx-panel.open { transform: translateY(0); }
        .osx-grip { width: 40px; height: 4px; border-radius: 999px; background: #D8CBBA; margin: 10px auto 2px; }
        /* Desktop: right drawer */
        @media (min-width: 860px) {
          .osx-panel { top: 0; right: 0; bottom: 0; left: auto; width: min(420px, 100vw); max-height: none;
            border-radius: 0; box-shadow: -16px 0 44px rgba(51,65,77,0.18); transform: translateX(100%); }
          .osx-panel.open { transform: translateX(0); }
          .osx-grip { display: none; }
        }
      `}</style>

      <button
        onClick={openPanel}
        style={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: `1px solid ${BORDER}`,
          borderRadius: 999,
          padding: '9px 16px',
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: 12,
          letterSpacing: '0.06em',
          color: BODY,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
        {t.toggle}
      </button>

      <div className={`osx-overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`osx-panel${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="osx-grip" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '18px 24px 12px', borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 24, color: DARK }}>
              {t.title}
            </h2>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: BODY, maxWidth: '40ch' }}>{t.subtitle}</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close" style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: 26, lineHeight: 1, color: MUTED }}>
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {loading ? (
            <p style={{ color: MUTED, fontSize: 15 }}>{t.loading}</p>
          ) : (
            <>
              {field(t.taxLabel, t.taxHint, taxRate, setTaxRate, t.taxPlaceholder, '%')}
              {field(t.shippingLabel, t.shippingHint, shipping, setShipping, t.shippingPlaceholder, '$')}
              {field(t.carrierLabel, t.carrierHint, carrier, setCarrier, t.carrierPlaceholder)}
              {field(t.freeLabel, t.freeHint, freeOver, setFreeOver, t.freePlaceholder, '$')}
            </>
          )}
        </div>

        <div style={{ padding: '16px 24px calc(20px + env(safe-area-inset-bottom))', borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={save}
            disabled={saving || loading}
            style={{
              width: '100%',
              cursor: saving || loading ? 'default' : 'pointer',
              background: saved ? BLUE_DARK : DARK,
              color: CREAM,
              border: 'none',
              borderRadius: 999,
              padding: '14px 24px',
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: 13,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              opacity: saving || loading ? 0.6 : 1,
            }}
          >
            {saving ? t.saving : saved ? t.saved : t.save}
          </button>
        </div>
      </aside>
    </>
  );
}
