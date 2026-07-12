'use client';

import { useState } from 'react';
import content from '@/clients/brandydemo/content';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const INPUT_BORDER = '#E0D4C4';

export default function StudioAdminLoginPage() {
  const t = content.studioLogin;
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    if (!password.trim()) return;

    setLoading(true);
    const res = await fetch('/api/studio-admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.trim() }),
    });
    setLoading(false);

    if (res.ok) {
      window.location.href = '/studio-admin';
    } else {
      setError(t.error);
      setPassword('');
    }
  }

  return (
    <main
      style={{
        backgroundColor: CREAM,
        color: DARK,
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28, lineHeight: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: '0.24em',
              color: DARK,
            }}
          >
            {t.brand}
          </div>
          <div
            style={{
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontWeight: 600,
              fontSize: 22,
              color: BLUE_DARK,
              marginTop: 2,
            }}
          >
            {t.sub}
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #ECDECB',
            borderRadius: 20,
            padding: 'clamp(28px,5vw,40px)',
            boxShadow: '0 12px 40px rgba(94,134,173,0.12)',
          }}
        >
          <h1
            style={{
              margin: '0 0 6px',
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 600,
              fontSize: 26,
              color: DARK,
            }}
          >
            {t.heading}
          </h1>
          <p style={{ margin: '0 0 22px', fontSize: 14, lineHeight: 1.5, color: BODY }}>{t.prompt}</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.placeholder}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: `1px solid ${INPUT_BORDER}`,
              borderRadius: 10,
              padding: '12px 14px',
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: 16,
              color: DARK,
              backgroundColor: CREAM,
              outline: 'none',
              marginBottom: 16,
            }}
          />

          <button
            onClick={handleLogin}
            disabled={loading || !password.trim()}
            style={{
              width: '100%',
              cursor: loading || !password.trim() ? 'default' : 'pointer',
              background: DARK,
              color: CREAM,
              border: 'none',
              borderRadius: 999,
              padding: '13px 24px',
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              opacity: loading || !password.trim() ? 0.55 : 1,
              transition: 'opacity .15s ease',
            }}
          >
            {loading ? '…' : t.button}
          </button>

          {error && (
            <p style={{ margin: '16px 0 0', fontSize: 13, textAlign: 'center', color: '#C56B6B' }}>{error}</p>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span
            style={{
              fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
              fontSize: 18,
              color: MUTED,
            }}
          >
            Salon nails, on your schedule.
          </span>
        </div>
      </div>
    </main>
  );
}
