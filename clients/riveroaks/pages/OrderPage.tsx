'use client';

import { MapPin, Smartphone, DollarSign } from 'lucide-react';
import Nav from '../components/Nav';
import content from '../content';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

const featureIcons = [MapPin, Smartphone, DollarSign];

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
            {content.order.sectionLabel}
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
          {content.order.heading}
        </h1>

        <p
          className="mt-6 leading-relaxed max-w-[600px] mx-auto"
          style={{
            fontFamily: 'var(--font-lora)',
            color: 'rgba(245,237,224,0.8)',
            fontSize: '18px',
          }}
        >
          {content.order.description}
        </p>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.order.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <div key={f.heading} className="text-center">
                <Icon
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
            );
          })}
        </div>

        {/* See it in action */}
        <div className="mt-20 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          >
            {content.order.demoLabel}
          </p>
          <h2
            className="mt-4 italic font-bold"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: OFF_WHITE,
              fontSize: 'clamp(26px, 5vw, 36px)',
            }}
          >
            {content.order.demoHeading}
          </h2>
          <p
            className="mt-4 max-w-[600px] mx-auto"
            style={{
              fontFamily: 'var(--font-lora)',
              color: 'rgba(245,237,224,0.75)',
              fontSize: '16px',
            }}
          >
            {content.order.demoDescription}
          </p>
          <div className="mt-8">
            <a
              href={content.order.demoUrl}
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
              {content.order.demoButtonText}
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
            {content.order.backButtonText}
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
          {content.order.softPitch}
        </p>
      </div>
    </main>
  );
}
