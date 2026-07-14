'use client';

import { useState, useEffect } from 'react';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const BORDER = '#ECDECB';

type Subscriber = { email: string; created_at: string };

export default function SubscribersList() {
  const t = content.admin.subscribers;
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/studio-admin/subscribers')
      .then((r) => r.json())
      .then((d) => setSubs(Array.isArray(d.subscribers) ? d.subscribers : []))
      .catch(() => setSubs([]))
      .finally(() => setLoading(false));
  }, []);

  const downloadCsv = () => {
    const rows = [['email', 'subscribed_at'], ...subs.map((s) => [s.email, s.created_at])];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sunday-subscribers.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 600,
            fontSize: 'clamp(28px,4vw,42px)',
            color: DARK,
          }}
        >
          {t.title}{' '}
          <span style={{ fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive", fontSize: '0.7em', color: BLUE_DARK, fontWeight: 600 }}>
            ({subs.length})
          </span>
        </h1>
        {subs.length > 0 && (
          <button
            onClick={downloadCsv}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: DARK,
              color: CREAM,
              border: 'none',
              borderRadius: 999,
              padding: '11px 22px',
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            {t.download}
          </button>
        )}
      </div>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: BODY, maxWidth: '60ch' }}>{t.subtitle}</p>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 15 }}>{t.loading}</p>
      ) : subs.length === 0 ? (
        <p style={{ color: MUTED, fontSize: 15 }}>{t.empty}</p>
      ) : (
        <div style={{ background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
          {subs.map((s, i) => (
            <div
              key={s.email}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '13px 18px',
                borderTop: i === 0 ? 'none' : `1px solid ${BORDER}`,
              }}
            >
              <span style={{ fontSize: 15, color: DARK, wordBreak: 'break-all' }}>{s.email}</span>
              <span style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>
                {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
