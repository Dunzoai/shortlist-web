'use client';

import { MapPin, Smartphone, DollarSign } from 'lucide-react';
import Nav from '../components/Nav';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

const features = [
  {
    icon: MapPin,
    heading: 'All your locations',
    description: 'Customers pick which spot to order from at checkout.',
  },
  {
    icon: Smartphone,
    heading: 'One unified app',
    description: 'Replace whatever patchwork you\'re using now. Everything in one place.',
  },
  {
    icon: DollarSign,
    heading: 'Keep your margin',
    description: 'No third-party platform fees. The money stays yours.',
  },
];

export default function OrderPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: BG }}>
      <Nav />
      <div className="max-w-[700px] mx-auto px-6 py-32 text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          >
            Demo Preview
          </p>
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>

        <h1
          className="italic font-bold leading-tight"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: OFF_WHITE,
            fontSize: 'clamp(36px, 7vw, 56px)',
          }}
        >
          Online ordering, on the way.
        </h1>

        <p
          className="mt-6 leading-relaxed max-w-[600px] mx-auto"
          style={{
            fontFamily: 'var(--font-lora)',
            color: 'rgba(245,237,224,0.8)',
            fontSize: '18px',
          }}
        >
          Online ordering is part of the Shortlist platform — one app, all your
          locations, no third-party fees eating into your margin.
        </p>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.heading} className="text-center">
              <f.icon
                className="w-6 h-6 mx-auto mb-3"
                style={{ color: GOLD }}
              />
              <p
                className="font-bold text-base mb-1"
                style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }}
              >
                {f.heading}
              </p>
              <p
                className="text-sm"
                style={{
                  color: 'rgba(245,237,224,0.65)',
                  fontFamily: 'var(--font-lora)',
                }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* See it in action */}
        <div className="mt-20 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          >
            See It In Action
          </p>
          <h2
            className="mt-4 italic font-bold"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: OFF_WHITE,
              fontSize: 'clamp(26px, 5vw, 36px)',
            }}
          >
            Here&apos;s a working demo.
          </h2>
          <p
            className="mt-4 max-w-[600px] mx-auto"
            style={{
              fontFamily: 'var(--font-lora)',
              color: 'rgba(245,237,224,0.75)',
              fontSize: '16px',
            }}
          >
            Yours would be tailored to your business. More than online ordering
            — you&apos;d get your own app on customers&apos; phones, push
            notifications, and a direct channel to keep them coming back.
          </p>
          <div className="mt-8">
            <a
              href="https://foodtruckdemo.shortlistpass.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.18em] font-normal transition-all duration-200"
              style={{
                fontFamily: 'var(--font-lora)',
                color: GOLD,
                border: `1px solid ${GOLD}`,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = GOLD;
                e.currentTarget.style.color = BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = GOLD;
              }}
            >
              View Live Demo &rarr;
            </a>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-16">
          <a
            href="/clients/riveroaks/preview"
            className="inline-block px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.18em] font-normal transition-all duration-200"
            style={{
              fontFamily: 'var(--font-lora)',
              color: GOLD,
              border: `1px solid ${GOLD}`,
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = GOLD;
              e.currentTarget.style.color = BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = GOLD;
            }}
          >
            Back to Home
          </a>
        </div>

        {/* Soft pitch */}
        <p
          className="mt-20 italic text-center"
          style={{
            fontFamily: 'var(--font-lora)',
            color: 'rgba(245,237,224,0.4)',
            fontSize: '13px',
          }}
        >
          Demo built by Shortlist. This page is a preview of what we&apos;ll
          build for you.
        </p>
      </div>
    </main>
  );
}
