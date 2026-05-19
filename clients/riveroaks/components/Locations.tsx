'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Phone } from 'lucide-react';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';
const OFF_WHITE_80 = 'rgba(245,237,224,0.8)';

const locations = [
  {
    name: 'Carolina Forest',
    street: '154 Sapwood Rd, Unit 107',
    city: 'Myrtle Beach, SC 29579',
    hours: 'Open 7 Days \u00B7 12pm \u2013 9pm',
    phone: '843-796-1350',
    tel: '+18437961350',
    directions:
      'https://www.google.com/maps/search/?api=1&query=154+Sapwood+Rd+Unit+107+Myrtle+Beach+SC+29579',
  },
  {
    name: 'Surfside',
    street: '1399 S. Commons Dr, Unit A5',
    city: 'Myrtle Beach, SC 29588',
    hours: 'Open 7 Days \u00B7 12pm \u2013 9pm',
    phone: '843-750-0056',
    tel: '+18437500056',
    directions:
      'https://www.google.com/maps/search/?api=1&query=1399+S+Commons+Dr+Unit+A5+Myrtle+Beach+SC+29588',
  },
];

const faqs = [
  {
    q: 'Where is River Oaks Pizzeria located?',
    a: 'River Oaks Pizzeria has two locations in the Myrtle Beach, SC area: 154 Sapwood Rd, Unit 107 in Carolina Forest (Myrtle Beach, SC 29579) and 1399 S. Commons Dr, Unit A5 in Surfside (Myrtle Beach, SC 29588).',
  },
  {
    q: "What are River Oaks Pizzeria's hours?",
    a: 'Both River Oaks Pizzeria locations are open 7 days a week from 12pm to 9pm.',
  },
  {
    q: 'Does River Oaks Pizzeria have a full bar?',
    a: 'Yes. River Oaks Pizzeria offers a full bar with cocktails, wine, and a rotating draft beer list at both Myrtle Beach locations.',
  },
];

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
const restaurantSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'River Oaks Pizzeria - Carolina Forest',
    image:
      'https://riveroakspizzeria.com/wp-content/uploads/2023/02/main_logo-1.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '154 Sapwood Rd, Unit 107',
      addressLocality: 'Myrtle Beach',
      addressRegion: 'SC',
      postalCode: '29579',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '0.0', // TODO: replace with real latitude from Google Maps
      longitude: '0.0', // TODO: replace with real longitude from Google Maps
    },
    telephone: '+1-843-796-1350',
    servesCuisine: ['Italian', 'Pizza'],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '12:00',
        closes: '21:00',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'River Oaks Pizzeria - Surfside',
    image:
      'https://riveroakspizzeria.com/wp-content/uploads/2023/02/main_logo-1.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1399 S. Commons Dr, Unit A5',
      addressLocality: 'Myrtle Beach',
      addressRegion: 'SC',
      postalCode: '29588',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '0.0', // TODO: replace with real latitude from Google Maps
      longitude: '0.0', // TODO: replace with real longitude from Google Maps
    },
    telephone: '+1-843-750-0056',
    servesCuisine: ['Italian', 'Pizza'],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '12:00',
        closes: '21:00',
      },
    ],
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function Locations() {
  const prefersReducedMotion = useReducedMotion();

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
            Visit Us
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
          Two locations.
        </h2>

        {/* Location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((loc, i) => (
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
                Myrtle Beach, SC
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
                <GoldButton href={loc.directions}>Get Directions</GoldButton>
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
              Frequently Asked
            </p>
            <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          </div>

          <dl className="max-w-[700px] mx-auto">
            {faqs.map((faq, i) => (
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
