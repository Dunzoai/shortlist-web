'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Phone } from 'lucide-react';
import content from '../content';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';
const OFF_WHITE_80 = 'rgba(245,237,224,0.8)';

function GoldButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-7 py-3.5 rounded-sm text-xs uppercase tracking-[0.18em] font-normal transition-all duration-200"
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
      {children}
    </a>
  );
}

// JSON-LD structured data
// NOTE: latitude and longitude are placeholders — replace with real coordinates from Google Maps
function buildRestaurantSchemas() {
  return content.locations.items.map((loc) => ({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: `${content.businessName} - ${loc.name}`,
    image: content.seo.logoUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.street,
      addressLocality: loc.city.split(',')[0]?.trim(),
      addressRegion: 'SC',
      postalCode: loc.city.match(/\d{5}/)?.[0] ?? '',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '0.0', // TODO: replace with real latitude from Google Maps
      longitude: '0.0', // TODO: replace with real longitude from Google Maps
    },
    telephone: loc.tel.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1-$2-$3-$4'),
    servesCuisine: content.seo.cuisine,
    priceRange: content.seo.priceRange,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: content.seo.openDays,
        opens: content.seo.opens,
        closes: content.seo.closes,
      },
    ],
  }));
}

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.locations.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

export default function Locations() {
  const prefersReducedMotion = useReducedMotion();
  const restaurantSchemas = buildRestaurantSchemas();
  const faqSchema = buildFaqSchema();

  return (
    <section
      id="locations"
      aria-labelledby="locations-heading"
      className="py-24 md:py-32 px-6"
      style={{ backgroundColor: BG }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          >
            {content.locations.sectionLabel}
          </p>
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>
        <h2
          id="locations-heading"
          className="italic font-bold text-center mb-16"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: OFF_WHITE,
            fontSize: 'clamp(32px, 5vw, 48px)',
          }}
        >
          {content.locations.heading}
        </h2>

        {/* Location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.locations.items.map((loc, i) => (
            <motion.article
              key={loc.name}
              className="p-10 rounded-sm"
              style={{
                border: '1px solid rgba(201,169,110,0.3)',
                backgroundColor: 'rgba(245,237,224,0.04)',
              }}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : i === 0 ? -50 : 50,
                      y: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 0,
                    }
              }
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
                delay: i * 0.15,
              }}
            >
              <h3
                className="italic font-bold"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: OFF_WHITE,
                  fontSize: '36px',
                }}
              >
                {loc.name}
              </h3>
              <p
                className="mt-1 text-xs uppercase tracking-[0.25em]"
                style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
              >
                {loc.region}
              </p>

              <address
                className="mt-8 not-italic text-base leading-relaxed"
                style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }}
              >
                {loc.street}
                <br />
                {loc.city}
              </address>

              <p
                className="mt-6 text-base"
                style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }}
              >
                {loc.hours}
              </p>

              <a
                href={`tel:${loc.tel}`}
                className="mt-6 inline-flex items-center gap-2 text-lg hover:underline"
                style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
              >
                <Phone className="w-4 h-4" />
                {loc.phone}
              </a>

              <div className="mt-8">
                <GoldButton href={loc.directionsUrl}>{content.locations.buttonText}</GoldButton>
              </div>
            </motion.article>
          ))}
        </div>

        {/* FAQ block */}
        <div className="mt-16">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
            <p
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
            >
              {content.locations.faqLabel}
            </p>
            <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          </div>

          <dl className="max-w-[700px] mx-auto">
            {content.locations.faqs.map((faq, i) => (
              <div key={i} className={i > 0 ? 'mt-8' : ''}>
                <dt
                  className="text-lg font-bold"
                  style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }}
                >
                  {faq.q}
                </dt>
                <dd
                  className="mt-2 text-base"
                  style={{ color: OFF_WHITE_80, fontFamily: 'var(--font-lora)' }}
                >
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* JSON-LD structured data for SEO/GEO/AEO */}
      {restaurantSchemas.map((schema, i) => (
        <script
          key={`restaurant-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
