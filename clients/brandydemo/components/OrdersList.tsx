'use client';

import { useState, useEffect } from 'react';
import content from '../content';

const BLUE_DARK = '#5E86AD';
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

function money(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

const statusColor: Record<string, { bg: string; fg: string }> = {
  paid: { bg: '#E7F3EC', fg: GREEN },
  shipped: { bg: '#E7F0FA', fg: BLUE_DARK },
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

export default function OrdersList() {
  const t = content.admin.orders;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/studio-admin/orders')
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d.orders) ? d.orders : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ marginTop: 'clamp(48px,6vw,72px)', borderTop: `1px solid ${BORDER}`, paddingTop: 'clamp(32px,4vw,48px)' }}>
      <h2
        style={{
          margin: '0 0 6px',
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontWeight: 600,
          fontSize: 'clamp(26px,3.4vw,38px)',
          color: DARK,
        }}
      >
        {t.title}{' '}
        <span style={{ fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive", fontSize: '0.7em', color: BLUE_DARK, fontWeight: 600 }}>
          ({orders.length})
        </span>
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: BODY, maxWidth: '60ch' }}>{t.subtitle}</p>

      {loading ? (
        <p style={{ color: MUTED, fontSize: 15 }}>{t.loading}</p>
      ) : orders.length === 0 ? (
        <p style={{ color: MUTED, fontSize: 15 }}>{t.empty}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {orders.map((o) => {
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
                  </div>
                  <span style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontWeight: 600, fontSize: 18, color: DARK }}>
                    {money(o.total)}
                  </span>
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
