'use client';

import { useState, useEffect } from 'react';
import content from '../content';

const BLUE_DARK = '#5E86AD';
const CREAM = '#FBF4EA';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const BORDER = '#ECDECB';
const GREEN = '#4C9A6E';

type OrderItem = { product_id: string; name: string; quantity: number; price_cents: number };
type Address = {
  address_line_1?: string;
  address_line_2?: string;
  locality?: string;
  administrative_district_level_1?: string;
  postal_code?: string;
  country?: string;
};
type Order = {
  id: string;
  order_number: string | null;
  items: OrderItem[];
  subtotal: number;
  total: number;
  customer_name: string | null;
  customer_email: string | null;
  shipping_address: Address | null;
  status: string;
  created_at: string;
  paid_at: string | null;
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function money(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

const statusColor: Record<string, { bg: string; fg: string }> = {
  paid: { bg: '#E7F3EC', fg: GREEN },
  shipped: { bg: '#E7F0FA', fg: BLUE_DARK },
  refunded: { bg: '#F6E7E7', fg: '#C56B6B' },
  pending: { bg: '#F3EDE4', fg: MUTED },
};

function formatAddress(a: Address | null): string | null {
  if (!a) return null;
  const parts = [
    a.address_line_1,
    a.address_line_2,
    [a.locality, a.administrative_district_level_1].filter(Boolean).join(', '),
    a.postal_code,
    a.country,
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : null;
}

type ChipKey = 'current' | 'pendingShipment' | 'completed' | 'refunded';

export default function OrdersList() {
  const t = content.admin.orders;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [chip, setChip] = useState<ChipKey>('current');
  const [year, setYear] = useState<string>('all');
  const [month, setMonth] = useState<string>('all');
  const [markingId, setMarkingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/studio-admin/orders')
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d.orders) ? d.orders : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const markShipped = async (id: string) => {
    setMarkingId(id);
    const res = await fetch('/api/studio-admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'shipped' }),
    });
    if (res.ok) setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'shipped' } : o)));
    setMarkingId(null);
  };

  // Pending (unpaid) orders are hidden entirely for now.
  const visible = orders.filter((o) => o.status !== 'pending');

  const chipMatch: Record<ChipKey, (o: Order) => boolean> = {
    current: (o) => o.status === 'paid' || o.status === 'shipped',
    pendingShipment: (o) => o.status === 'paid',
    completed: (o) => o.status === 'shipped',
    refunded: (o) => o.status === 'refunded',
  };

  const chipDefs: { key: ChipKey; label: string }[] = [
    { key: 'current', label: t.chips.current },
    { key: 'pendingShipment', label: t.chips.pendingShipment },
    { key: 'completed', label: t.chips.completed },
    { key: 'refunded', label: t.chips.refunded },
  ];

  const years = Array.from(new Set(visible.map((o) => new Date(o.created_at).getFullYear()))).sort((a, b) => b - a);

  const filtered = visible
    .filter((o) => chipMatch[chip](o))
    .filter((o) => {
      if (year === 'all' && month === 'all') return true;
      const d = new Date(o.created_at);
      if (year !== 'all' && d.getFullYear() !== Number(year)) return false;
      if (month !== 'all' && d.getMonth() !== Number(month)) return false;
      return true;
    });

  const selectStyle: React.CSSProperties = {
    border: `1px solid ${BORDER}`,
    borderRadius: 999,
    padding: '8px 14px',
    background: '#FFFFFF',
    fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
    fontSize: 13,
    color: DARK,
    cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div>
      <h2
        style={{
          margin: '0 0 6px',
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontWeight: 600,
          fontSize: 'clamp(26px,3.4vw,38px)',
          color: DARK,
        }}
      >
        {t.title}
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: BODY, maxWidth: '60ch' }}>{t.subtitle}</p>

      {/* Status chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {chipDefs.map((cd) => {
          const count = visible.filter(chipMatch[cd.key]).length;
          const active = chip === cd.key;
          return (
            <button
              key={cd.key}
              onClick={() => setChip(cd.key)}
              style={{
                cursor: 'pointer',
                border: active ? '1.5px solid transparent' : `1.5px solid ${BORDER}`,
                background: active ? DARK : 'transparent',
                color: active ? CREAM : BODY,
                borderRadius: 999,
                padding: '8px 16px',
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: 12,
                letterSpacing: '0.06em',
                fontWeight: active ? 600 : 400,
              }}
            >
              {cd.label}
              <span style={{ marginLeft: 8, opacity: 0.7 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Month / year filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        <select value={month} onChange={(e) => setMonth(e.target.value)} style={selectStyle}>
          <option value="all">{t.allMonths}</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle}>
          <option value="all">{t.allYears}</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 15 }}>{t.loading}</p>
      ) : visible.length === 0 ? (
        <p style={{ color: MUTED, fontSize: 15 }}>{t.empty}</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: MUTED, fontSize: 15 }}>{t.noneInView}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((o) => {
            const sc = statusColor[o.status] || statusColor.pending;
            const addr = formatAddress(o.shipping_address);
            return (
              <div key={o.id} style={{ background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", fontWeight: 600, fontSize: 14, color: DARK }}>
                      {o.order_number || o.id.slice(0, 8)}
                    </span>
                    <span
                      style={{
                        background: sc.bg,
                        color: sc.fg,
                        borderRadius: 999,
                        padding: '3px 12px',
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {o.status}
                    </span>
                    <span style={{ fontSize: 12, color: MUTED }}>
                      {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {o.status === 'paid' && (
                      <button
                        onClick={() => markShipped(o.id)}
                        disabled={markingId === o.id}
                        style={{
                          cursor: 'pointer',
                          background: 'none',
                          border: `1px solid ${BLUE_DARK}`,
                          color: BLUE_DARK,
                          borderRadius: 999,
                          padding: '7px 14px',
                          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                          fontSize: 11,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          opacity: markingId === o.id ? 0.6 : 1,
                        }}
                      >
                        {markingId === o.id ? t.marking : t.markShipped}
                      </button>
                    )}
                    <span style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 18, color: DARK }}>
                      {money(o.total)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div>
                    <p style={{ margin: '0 0 4px', ...labelStyle }}>{t.itemsLabel}</p>
                    {(o.items || []).map((it, i) => (
                      <p key={i} style={{ margin: 0, fontSize: 14, color: BODY }}>
                        {it.quantity}× {it.name} <span style={{ color: MUTED }}>({money(it.price_cents)})</span>
                      </p>
                    ))}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', ...labelStyle }}>{t.shipLabel}</p>
                    {o.customer_name && <p style={{ margin: 0, fontSize: 14, color: BODY }}>{o.customer_name}</p>}
                    {o.customer_email && <p style={{ margin: 0, fontSize: 13, color: MUTED }}>{o.customer_email}</p>}
                    <p style={{ margin: '2px 0 0', fontSize: 14, color: addr ? BODY : MUTED }}>
                      {addr || t.noAddress}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: MUTED,
};
