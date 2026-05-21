'use client';

import contentFallback from '../content';

const BG = '#f5ede0';
const TEXT = '#1a1410';
const GOLD = '#c9a96e';

type OurStoryProps = {
  story?: { sectionLabel: string; body: string; pullQuote: string; closingLine: string; signature: string; attribution: string };
};

export default function OurStory({ story }: OurStoryProps) {
  const s = story ?? contentFallback.story;
  return (
    <section id="our-story" className="py-24 md:py-32 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-[700px] mx-auto">
        {/* Section header with decorative lines */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          >
            {s.sectionLabel}
          </p>
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>

        {/* Main story paragraph */}
        <p
          className="text-lg leading-relaxed"
          style={{ color: TEXT, fontFamily: 'var(--font-lora)' }}
        >
          {s.body}
        </p>

        {/* Pull-quote */}
        <p
          className="mt-8 italic text-center leading-snug"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: TEXT,
            fontSize: 'clamp(18px, 3vw, 22px)',
          }}
        >
          {s.pullQuote}
        </p>

        {/* Final line */}
        <p
          className="mt-4 text-lg font-bold text-center"
          style={{ color: TEXT, fontFamily: 'var(--font-lora)' }}
        >
          {s.closingLine}
        </p>

        {/* Signature */}
        <p
          className="mt-12 text-center"
          style={{
            fontFamily: 'var(--font-caveat)',
            color: TEXT,
            fontSize: 'clamp(28px, 5vw, 36px)',
          }}
        >
          {s.signature}
        </p>

        {/* Attribution */}
        <p
          className="mt-2 text-sm text-center uppercase tracking-[0.25em]"
          style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
        >
          {s.attribution}
        </p>
      </div>
    </section>
  );
}
