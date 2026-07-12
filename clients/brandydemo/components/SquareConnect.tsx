'use client';

import { useState, useEffect } from 'react';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const BORDER = '#ECDECB';
const GREEN = '#4C9A6E';
const ERR = '#C56B6B';

type Status = {
  connected: boolean;
  merchant_id: string | null;
  location_id: string | null;
  environment: string | null;
  updated_at: string | null;
};

export default function SquareConnect() {
  const t = content.admin.square;
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('square_error');
    if (params.get('square_connected') === 'true') {
      setFlash({ type: 'ok', msg: t.connectedFlash });
    } else if (err) {
      setFlash({ type: 'err', msg: `${t.errorFlash} ${err.replace(/_/g, ' ')}` });
    }
    if (params.get('square_connected') || err) {
      window.history.replaceState({}, '', '/studio-admin');
    }

    fetch('/api/square/status')
      .then((r) => r.json())
      .then((d) => setStatus(d))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, [t]);

  const connected = status?.connected === true;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: 'clamp(20px,3vw,28px)',
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ minWidth: 240 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 600,
              fontSize: 'clamp(20px,2.6vw,26px)',
              color: DARK,
            }}
          >
            {t.title}
          </h2>
          {!loading && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: connected ? '#E7F3EC' : '#F3EDE4',
                color: connected ? GREEN : MUTED,
                borderRadius: 999,
                padding: '4px 12px',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: connected ? GREEN : '#C9BCA9',
                  display: 'inline-block',
                }}
              />
              {connected ? t.connectedLabel : t.notConnectedLabel}
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: BODY, maxWidth: '46ch' }}>
          {t.subtitle}
        </p>
        {connected && (
          <p style={{ margin: '10px 0 0', fontSize: 12, color: MUTED }}>
            {t.merchantLabel}: {status?.merchant_id}
            {status?.location_id ? ` · ${t.locationLabel}: ${status.location_id}` : ''}
            {status?.environment ? ` · ${status.environment}` : ''}
          </p>
        )}
        {flash && (
          <p style={{ margin: '10px 0 0', fontSize: 13, color: flash.type === 'ok' ? GREEN : ERR }}>
            {flash.msg}
          </p>
        )}
      </div>

      <a
        href="/api/square/authorize"
        style={{
          cursor: 'pointer',
          background: connected ? 'none' : DARK,
          color: connected ? BODY : CREAM,
          border: connected ? '1px solid #C9BCA9' : 'none',
          borderRadius: 999,
          padding: '12px 26px',
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          fontSize: 12,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {connected ? t.reconnectButton : t.connectButton}
      </a>
    </div>
  );
}
