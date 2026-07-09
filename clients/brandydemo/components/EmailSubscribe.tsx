'use client';

import { useState } from 'react';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const PEACH = '#FFC6A1';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to email service (Mailchimp, ConvertKit, etc.)
    setSubmitted(true);
  };

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #F5EDE0 0%, #EAF2F8 50%, #FDEBDA 100%)',
        padding: 'clamp(48px,7vw,80px) clamp(20px,4vw,40px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <div style={{ position: 'absolute', top: 20, left: '15%', fontSize: 24, opacity: 0.3, color: PEACH }}>~</div>
      <div style={{ position: 'absolute', top: 30, right: '20%', fontSize: 18, opacity: 0.4, color: '#D6A93A' }}>✦</div>
      <div style={{ position: 'absolute', bottom: 24, left: '25%', fontSize: 14, opacity: 0.3, color: BLUE }}>✿</div>
      <div style={{ position: 'absolute', top: 16, right: '12%', fontSize: 12, opacity: 0.25, color: '#D6A93A' }}>✦</div>

      {/* Subscribe stamp */}
      <div
        style={{
          display: 'inline-block',
          marginBottom: 12,
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: MUTED,
          border: `1.5px solid ${MUTED}`,
          borderRadius: '50%',
          width: 64,
          height: 64,
          lineHeight: '64px',
          fontWeight: 600,
        }}
      >
        Join
      </div>

      <h2
        style={{
          margin: '0 0 4px',
          fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
          fontWeight: 600,
          fontSize: 'clamp(36px,5vw,52px)',
          color: DARK,
        }}
      >
        Subscribe
      </h2>
      <p
        style={{
          margin: '0 0 6px',
          fontSize: 13,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: MUTED,
        }}
      >
        to our emails
      </p>

      <p
        style={{
          margin: '16px auto 28px',
          maxWidth: '38ch',
          fontSize: 15,
          lineHeight: 1.6,
          color: BODY,
        }}
      >
        We promise not to spam your inbox!
        <br />
        Sign up for special newsletter discounts and new launches!
      </p>

      {submitted ? (
        <div
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            borderRadius: 999,
            backgroundColor: BLUE,
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          You&apos;re on the list! ✨
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'inline-flex',
            gap: 0,
            maxWidth: 400,
            width: '100%',
            borderRadius: 8,
            overflow: 'hidden',
            border: `1.5px solid #E0D4C4`,
            backgroundColor: '#FFFFFF',
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{
              flex: 1,
              padding: '14px 16px',
              border: 'none',
              outline: 'none',
              fontSize: 15,
              color: DARK,
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              backgroundColor: 'transparent',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '14px 24px',
              border: 'none',
              backgroundColor: BLUE_DARK,
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              transition: 'background-color .15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = DARK; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = BLUE_DARK; }}
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
