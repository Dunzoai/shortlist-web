'use client';

import contentFallback from '../content';

const DARK = '#33414D';
const BLUE_DARK = '#5E86AD';
const CREAM = '#FBF4EA';
const BODY = '#55606B';
const MUTED = '#A99E92';

type FooterProps = {
  footer?: typeof contentFallback.footer;
};

export default function Footer({ footer }: FooterProps) {
  const f = footer ?? contentFallback.footer;

  return (
    <footer>
      {/* Main footer — gradient from design */}
      <div style={{ background: 'linear-gradient(180deg, #E7F0FA 0%, #FDEBDA 100%)', borderTop: '1px solid #ECDECB' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: 'clamp(40px,6vw,64px) clamp(20px,4vw,40px) 28px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(28px,5vw,72px)',
            justifyContent: 'space-between',
          }}
        >
          {/* Left — logo + tagline + motto */}
          <div style={{ maxWidth: 340 }}>
            <img
              src="/clients/brandydemo/sunday-logo.jpg"
              alt="Sunday Nail Press"
              style={{ height: 96, width: 'auto', display: 'block', mixBlendMode: 'multiply', marginLeft: -8 }}
            />
            <p style={{ margin: '14px 0 0', fontSize: 15, lineHeight: 1.6, color: BODY }}>
              {f.tagline}
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontWeight: 600,
                fontSize: 20,
                color: BLUE_DARK,
              }}
            >
              {f.motto}
            </p>
          </div>

          {/* Middle — nav links */}
          <nav
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            aria-label="Footer"
          >
            {f.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: DARK,
                  transition: 'color .15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = BLUE_DARK; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = DARK; }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — say hi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span
              style={{
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: MUTED,
              }}
            >
              {f.sayHiLabel}
            </span>
            <a
              href={f.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 15,
                textDecoration: 'underline',
                textUnderlineOffset: 4,
                color: DARK,
              }}
            >
              Instagram — {f.instagram}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 clamp(20px,4vw,40px) 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            borderTop: '1px solid rgba(51,65,77,0.12)',
          }}
        >
          <p style={{ margin: '16px 0 0', fontSize: 13, color: MUTED }}>
            {f.copyright}
          </p>

          {/* Powered by Shortlist Pass */}
          <a
            href={f.poweredByHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              letterSpacing: '0.04em',
              color: MUTED,
              textDecoration: 'none',
              transition: 'color .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = DARK; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = MUTED; }}
          >
            <img
              src="/shortlist-mark.png"
              alt="Shortlist Pass"
              style={{ height: 20, width: 'auto', display: 'block', mixBlendMode: 'multiply' }}
            />
            {f.poweredByText}
          </a>

          <a
            href={f.adminHref}
            style={{
              marginTop: 16,
              fontSize: 12,
              color: MUTED,
              textDecoration: 'none',
              transition: 'color .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = DARK; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = MUTED; }}
          >
            {f.adminText}
          </a>
        </div>
      </div>
    </footer>
  );
}
