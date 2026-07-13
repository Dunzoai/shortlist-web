'use client';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import content from '../content';
import EmailSubscribe from '../components/EmailSubscribe';

const CREAM = '#FBF4EA';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const BORDER = '#ECDECB';

type Section = { heading: string; body?: string[]; list?: string[]; outro?: string };
type Group = { title: string; points?: string[]; sections?: Section[] };

export function TermsPage() {
  const c = content;
  const t = c.terms;
  const groups = t.groups as unknown as Group[];

  return (
    <main style={{ backgroundColor: CREAM, color: DARK, fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif", minHeight: '100vh' }}>
      <Nav nav={c.nav} brandLabel={c.brandLabel} />

      <section
        style={{
          maxWidth: 780,
          margin: '0 auto',
          padding: 'clamp(96px,10vw,140px) clamp(20px,4vw,40px) clamp(56px,7vw,88px)',
        }}
      >
        {/* Header */}
        <p style={{ margin: '0 0 14px', fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: MUTED }}>
          {t.eyebrow}
        </p>
        <h1
          style={{
            margin: '0 0 12px',
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontWeight: 500,
            fontSize: 'clamp(38px,5.5vw,60px)',
            lineHeight: 1.08,
            color: DARK,
          }}
        >
          Terms &amp;{' '}
          <span style={{ fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive", fontWeight: 600, color: BLUE_DARK }}>
            Conditions
          </span>
        </h1>
        <p style={{ margin: '0 0 26px', fontSize: 13, fontStyle: 'italic', color: MUTED }}>{t.updated}</p>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.75, color: BODY }}>{t.intro}</p>

        {/* Groups */}
        {groups.map((g) => (
          <div key={g.title} style={{ marginTop: 'clamp(44px,6vw,72px)' }}>
            <h2
              style={{
                margin: '0 0 8px',
                paddingBottom: 16,
                borderBottom: `2px solid ${BLUE_DARK}`,
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontWeight: 600,
                fontSize: 'clamp(26px,3.4vw,36px)',
                color: DARK,
              }}
            >
              {g.title}
            </h2>

            {/* Rule list */}
            {g.points && (
              <ul style={{ listStyle: 'none', margin: '24px 0 0', padding: 0 }}>
                {g.points.map((p, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 0', borderBottom: `1px solid ${BORDER}` }}>
                    <span style={{ flexShrink: 0, marginTop: 6, width: 7, height: 7, borderRadius: '50%', background: BLUE_DARK, display: 'inline-block' }} />
                    <span style={{ fontSize: 15.5, lineHeight: 1.65, color: BODY }}>{p}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Sections */}
            {g.sections?.map((s) => (
              <section key={s.heading} style={{ marginTop: 'clamp(26px,3.5vw,38px)' }}>
                <h3
                  style={{
                    margin: '0 0 12px',
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(19px,2.4vw,24px)',
                    color: DARK,
                  }}
                >
                  {s.heading}
                </h3>
                {s.body?.map((para, j) => (
                  <p key={j} style={{ margin: j === 0 ? 0 : '12px 0 0', fontSize: 15.5, lineHeight: 1.75, color: BODY }}>
                    {para}
                  </p>
                ))}
                {s.list && (
                  <ul style={{ margin: '12px 0 0', paddingLeft: 22 }}>
                    {s.list.map((li, k) => (
                      <li key={k} style={{ margin: '8px 0', fontSize: 15.5, lineHeight: 1.7, color: BODY, paddingLeft: 4 }}>
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
                {s.outro && (
                  <p style={{ margin: '14px 0 0', fontSize: 15.5, lineHeight: 1.75, color: BODY }}>{s.outro}</p>
                )}
              </section>
            ))}
          </div>
        ))}
      </section>

      <EmailSubscribe />
      <Footer footer={c.footer} />
    </main>
  );
}
