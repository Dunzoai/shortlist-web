'use client';

const BG = '#f5ede0';
const TEXT = '#1a1410';
const GOLD = '#c9a96e';

export default function OurStory() {
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
            Our Story
          </p>
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>

        {/* Main story paragraph */}
        <p
          className="text-lg leading-relaxed"
          style={{ color: TEXT, fontFamily: 'var(--font-lora)' }}
        >
          We at River Oaks Pizzeria are proud to be family-owned and operated. In the
          1980&apos;s our father, Kole, started as a baker in the Little Italy section of
          the Bronx, NY. His passion for the art of dough and bread baking was what
          sparked his interest in the pizza business. In 1998 he bought his first pizzeria
          in Bronx, NY; and since then we have expanded to the NY metro area and beautiful
          Myrtle Beach as a family.
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
          We don&apos;t do things the easy way — we do things the right way.
        </p>

        {/* Final line */}
        <p
          className="mt-4 text-lg font-bold text-center"
          style={{ color: TEXT, fontFamily: 'var(--font-lora)' }}
        >
          We put a lot of love into everything we do, and hope to bring you joy in every
          bite.
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
          — Andrew, Albert, George &amp; Frank
        </p>

        {/* Attribution */}
        <p
          className="mt-2 text-sm text-center uppercase tracking-[0.25em]"
          style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
        >
          The Next Generation
        </p>
      </div>
    </section>
  );
}
