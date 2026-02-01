'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Users, Handshake, Building2, Sun, TrendingUp, Home, Plane } from 'lucide-react';
import Nav from '@/clients/danidiaz/components/Nav';
import Footer from '@/clients/danidiaz/components/Footer';
import { useLanguage } from '@/clients/danidiaz/components/LanguageContext';
import { useStyle } from '@/clients/danidiaz/components/StyleContext';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface Destination {
  id: string
  slug: string
  city: string
  country: string
  country_es: string | null
  image_url: string | null
  description_en: string | null
  description_es: string | null
  highlights_en: string[]
  highlights_es: string[]
  why_invest_en: string[]
  why_invest_es: string[]
  external_url: string | null
  display_order: number
}

interface IntlListing {
  id: string
  address: string
  city: string
  state: string
  price: number
  beds: number | null
  baths: number | null
  sqft: number | null
  property_type: string
  description: string | null
  images: string[]
  status: string
  country: string | null
}

const howItWorks = [
  {
    step: 1,
    icon: Users,
    titleEn: 'Share Your Vision',
    titleEs: 'Comparte Tu Visión',
    descriptionEn: 'Tell me about your international real estate goals, budget, and preferred destinations.',
    descriptionEs: 'Cuéntame sobre tus metas inmobiliarias internacionales, presupuesto y destinos preferidos.',
  },
  {
    step: 2,
    icon: Handshake,
    titleEn: 'Connect with Experts',
    titleEs: 'Conecta con Expertos',
    descriptionEn: "I'll introduce you to trusted, vetted agents in your target market who specialize in working with international buyers.",
    descriptionEs: 'Te presentaré a agentes de confianza verificados en tu mercado objetivo que se especializan en trabajar con compradores internacionales.',
  },
  {
    step: 3,
    icon: Globe,
    titleEn: 'Explore with Confidence',
    titleEs: 'Explora con Confianza',
    descriptionEn: 'Get local expertise while maintaining a familiar point of contact throughout your entire journey.',
    descriptionEs: 'Obtén experiencia local mientras mantienes un punto de contacto familiar durante todo tu viaje.',
  },
];

export function InternationalPage() {
  const { language, t } = useLanguage();
  const { styleMode } = useStyle();
  const isDark = styleMode === 'dark';

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [listings, setListings] = useState<IntlListing[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [translatedCache, setTranslatedCache] = useState<Record<string, { description: string, country: string, highlights: string[], why_invest: string[] }>>({})

  useEffect(() => {
    async function load() {
      const [{ data: destData }, { data: listData }] = await Promise.all([
        supabase
          .from('international_destinations')
          .select('*')
          .eq('is_active', true)
          .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
          .order('display_order'),
        supabase
          .from('featured_properties')
          .select('*')
          .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
          .eq('listing_type', 'international')
          .eq('status', 'active')
          .order('display_order')
      ])
      setDestinations((destData as Destination[]) || [])
      setListings((listData as IntlListing[]) || [])
    }
    load()
  }, [])

  // Auto-translate destinations when language switches to ES
  useEffect(() => {
    if (language !== 'es' || destinations.length === 0) return

    destinations.forEach(async (dest) => {
      // Skip if already has Spanish data in DB or cache
      if (dest.description_es || translatedCache[dest.id]) return

      try {
        const res = await fetch('/api/international/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: dest.description_en || '',
            highlights: dest.highlights_en || [],
            why_invest: dest.why_invest_en || [],
            country: dest.country,
          })
        })
        if (res.ok) {
          const data = await res.json()
          setTranslatedCache(prev => ({ ...prev, [dest.id]: {
            description: data.description_es,
            country: data.country_es,
            highlights: data.highlights_es,
            why_invest: data.why_invest_es,
          }}))
        }
      } catch (e) {
        // Fallback to English silently
      }
    })
  }, [language, destinations])

  // Helper to get translated content for a destination
  const getDesc = (d: Destination) => {
    if (language === 'es') return d.description_es || translatedCache[d.id]?.description || d.description_en
    return d.description_en
  }
  const getCountry = (d: Destination) => {
    if (language === 'es') return d.country_es || translatedCache[d.id]?.country || d.country
    return d.country
  }
  const getHighlights = (d: Destination) => {
    if (language === 'es') return (d.highlights_es?.length ? d.highlights_es : translatedCache[d.id]?.highlights) || d.highlights_en || []
    return d.highlights_en || []
  }
  const getWhyInvest = (d: Destination) => {
    if (language === 'es') return (d.why_invest_es?.length ? d.why_invest_es : translatedCache[d.id]?.why_invest) || d.why_invest_en || []
    return d.why_invest_en || []
  }

  const countries = Array.from(new Set(destinations.map(d => d.country)))
  const filtered = selectedCountry === 'all'
    ? destinations
    : destinations.filter(d => d.country === selectedCountry)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    destination: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('real_estate_leads')
      .insert({
        client_id: '3c125122-f3d9-4f75-91d9-69cf84d6d20e',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || null,
        lead_type: 'international',
        message: `Destination: ${formData.destination}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\n${formData.message}`,
        source: 'international_page',
        status: 'new'
      });

    setIsSubmitting(false);

    if (error) {
      console.error('Error submitting lead:', error);
      alert('There was an error submitting your message. Please try again.');
    } else {
      setIsSubmitted(true);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        destination: '', budget: '', timeline: '', message: ''
      });
    }
  };

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {/* Placeholder gradient - replace with actual image */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B365D] via-[#2a4a7a] to-[#1B365D]" />
          {/* TODO: Replace with actual world map or luxury destination image */}
          {/* <Image src="/international/hero-bg.jpg" alt="" fill className="object-cover" /> */}
          <div className="absolute inset-0 bg-[#1B365D]/70" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#C4A25A]/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#D6BFAE]/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Globe className="w-4 h-4 text-[#C4A25A]" />
            <span className="text-white/80 text-sm tracking-wide">
              {t('International Real Estate', 'Bienes Raíces Internacionales')}
            </span>
          </motion.div>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('Global Real Estate,', 'Bienes Raíces Globales,')}
            <br />
            <span className="text-[#C4A25A]">{t('Local Expertise', 'Experiencia Local')}</span>
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            {t(
              "From Myrtle Beach to the world's most sought-after destinations",
              'Desde Myrtle Beach hasta los destinos más codiciados del mundo'
            )}
          </p>

          <motion.a
            href="#destinations"
            className="inline-flex items-center gap-2 bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plane className="w-5 h-5" />
            {t('Explore Destinations', 'Explorar Destinos')}
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#FFFFFF' : '#FFFBF5' }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl mb-8 transition-colors duration-500"
              style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
            >
              {t('Your Gateway to Global Property', 'Tu Puerta a Propiedades Globales')}
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-[#3D3D3D] text-lg leading-relaxed mb-6"
            >
              {t(
                "As your trusted real estate advisor, my network extends beyond the Grand Strand. Whether you're dreaming of a beachfront villa in Cancun or an investment property in Dubai, I connect you with vetted international partners to make your global real estate dreams a reality.",
                'Como tu asesora inmobiliaria de confianza, mi red se extiende más allá del Grand Strand. Ya sea que sueñes con una villa frente al mar en Cancún o una propiedad de inversión en Dubai, te conecto con socios internacionales verificados para hacer realidad tus sueños inmobiliarios globales.'
              )}
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-[#3D3D3D] text-lg leading-relaxed"
            >
              {t(
                "I've built relationships with top-performing agents in key international markets, ensuring you receive the same level of care and expertise you'd expect from me—no matter where in the world your property search takes you.",
                'He construido relaciones con agentes de alto rendimiento en mercados internacionales clave, asegurando que recibas el mismo nivel de atención y experiencia que esperarías de mí, sin importar a dónde te lleve tu búsqueda de propiedades en el mundo.'
              )}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section
        id="destinations"
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#F7F7F7' : '#F5F0E8' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2
                className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4 transition-colors duration-500"
                style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
              >
                {t('Featured Destinations', 'Destinos Destacados')}
              </h2>
              <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
                {t(
                  'Explore prime investment opportunities in these world-class markets',
                  'Explora oportunidades de inversión premium en estos mercados de clase mundial'
                )}
              </p>

              {/* Country Filter Chips */}
              {countries.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  <button
                    onClick={() => setSelectedCountry('all')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCountry === 'all'
                        ? 'bg-[#1B365D] text-white'
                        : 'bg-white/80 text-[#3D3D3D] hover:bg-[#1B365D]/10'
                    }`}
                  >
                    {t('All', 'Todos')}
                  </button>
                  {countries.map(c => {
                    const dest = destinations.find(d => d.country === c)
                    const label = dest ? getCountry(dest) : c
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedCountry(c)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCountry === c
                            ? 'bg-[#1B365D] text-white'
                            : 'bg-white/80 text-[#3D3D3D] hover:bg-[#1B365D]/10'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>

            <div className="space-y-16">
              {filtered.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative h-[400px] lg:h-[500px] overflow-hidden shadow-2xl">
                      {destination.image_url && (
                        <Image
                          src={destination.image_url}
                          alt={destination.city}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    {/* City Badge */}
                    <div className="absolute -bottom-4 left-6 bg-[#C4A25A] text-white px-6 py-3">
                      <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold">
                        {destination.city}
                      </p>
                      <p className="text-sm opacity-80">
                        {getCountry(destination)}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <h3
                      className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl mb-6 transition-colors duration-500"
                      style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                    >
                      {destination.city}, {getCountry(destination)}
                    </h3>

                    <p className="text-[#3D3D3D] text-lg leading-relaxed mb-8">
                      {getDesc(destination)}
                    </p>

                    {/* Highlights */}
                    {getHighlights(destination).length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-[#C4A25A] font-semibold mb-4 flex items-center gap-2">
                          <Sun className="w-5 h-5" />
                          {t('Market Highlights', 'Aspectos Destacados del Mercado')}
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {getHighlights(destination).map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-[#3D3D3D]">
                              <div className="w-2 h-2 bg-[#C4A25A] rounded-full" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Why Invest */}
                    {getWhyInvest(destination).length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-[#1B365D] font-semibold mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          {t(`Why ${destination.city}`, `¿Por qué ${destination.city}?`)}
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {getWhyInvest(destination).map((r, i) => (
                            <div key={i} className="flex items-center gap-2 text-[#3D3D3D]">
                              <div className="w-2 h-2 bg-[#1B365D] rounded-full" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <a
                      href={destination.external_url || '#contact'}
                      target={destination.external_url ? '_blank' : undefined}
                      rel={destination.external_url ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 bg-[#1B365D] text-white px-6 py-3 hover:bg-[#C4A25A] transition-colors"
                    >
                      <Home className="w-5 h-5" />
                      {t(`Explore ${destination.city} Opportunities`, `Explorar Oportunidades en ${destination.city}`)}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* International Listings */}
      {listings.length > 0 && (
        <section
          className="py-24 transition-colors duration-500"
          style={{ backgroundColor: isDark ? '#FFFFFF' : '#FFFBF5' }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-16">
                <h2
                  className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4 transition-colors duration-500"
                  style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                >
                  {t('International Listings', 'Propiedades Internacionales')}
                </h2>
                <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
                  {t(
                    'Featured properties available in international markets',
                    'Propiedades destacadas disponibles en mercados internacionales'
                  )}
                </p>
              </div>

              {/* Desktop: grid, Mobile: horizontal swipe */}
              <div className="hidden md:grid md:grid-cols-3 gap-8">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="relative h-96 overflow-hidden shadow-lg md:hover:shadow-2xl transition-shadow duration-300 group cursor-pointer"
                  >
                    <div className="absolute inset-0">
                      {listing.images?.[0] ? (
                        <Image src={listing.images[0]} alt={listing.address} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#D6BFAE] to-[#F7F7F7]" />
                      )}
                    </div>
                    <div className="absolute top-4 left-4 text-white px-4 py-2 font-semibold z-10" style={{ backgroundColor: isDark ? '#1B365D' : '#3D3D3D' }}>
                      ${listing.price?.toLocaleString()}
                    </div>
                    {listing.country && (
                      <div className="absolute top-4 right-4 bg-[#C4A25A] text-white px-3 py-1 text-xs font-semibold z-10">{listing.country}</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-1" style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}>{listing.address}</h3>
                      <p className="text-[#3D3D3D] mb-4">{listing.city}, {listing.state}</p>
                      <div className="flex gap-4 text-sm text-[#3D3D3D]">
                        {listing.beds && <span>{listing.beds} {t('beds', 'hab')}</span>}
                        {listing.beds && listing.baths && <span>•</span>}
                        {listing.baths && <span>{listing.baths} {t('baths', 'baños')}</span>}
                        {listing.baths && listing.sqft && <span>•</span>}
                        {listing.sqft && <span>{listing.sqft.toLocaleString()} {t('sq ft', 'pies²')}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile: horizontal swipe carousel */}
              <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="relative flex-shrink-0 w-[80vw] h-96 overflow-hidden shadow-lg snap-center"
                  >
                    <div className="absolute inset-0">
                      {listing.images?.[0] ? (
                        <Image src={listing.images[0]} alt={listing.address} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#D6BFAE] to-[#F7F7F7]" />
                      )}
                    </div>
                    <div className="absolute top-4 left-4 text-white px-4 py-2 font-semibold z-10" style={{ backgroundColor: isDark ? '#1B365D' : '#3D3D3D' }}>
                      ${listing.price?.toLocaleString()}
                    </div>
                    {listing.country && (
                      <div className="absolute top-4 right-4 bg-[#C4A25A] text-white px-3 py-1 text-xs font-semibold z-10">{listing.country}</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-6">
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-1" style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}>{listing.address}</h3>
                      <p className="text-[#3D3D3D] mb-4">{listing.city}, {listing.state}</p>
                      <div className="flex gap-4 text-sm text-[#3D3D3D]">
                        {listing.beds && <span>{listing.beds} {t('beds', 'hab')}</span>}
                        {listing.beds && listing.baths && <span>•</span>}
                        {listing.baths && <span>{listing.baths} {t('baths', 'baños')}</span>}
                        {listing.baths && listing.sqft && <span>•</span>}
                        {listing.sqft && <span>{listing.sqft.toLocaleString()} {t('sq ft', 'pies²')}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All International Listings */}
              <div className="text-center mt-12">
                <Link
                  href="/listings?type=international"
                  className="inline-flex items-center gap-2 bg-[#1B365D] text-white px-8 py-4 text-lg hover:bg-[#C4A25A] transition-colors"
                >
                  {t('View All International Listings', 'Ver Todas las Propiedades Internacionales')}
                  <span className="ml-1">&rarr;</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#1B365D' : '#3D3D3D' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-white mb-4">
                {t('How It Works', 'Cómo Funciona')}
              </h2>
              <p className="text-[#D6BFAE] text-lg max-w-2xl mx-auto">
                {t(
                  'A seamless process to help you invest internationally',
                  'Un proceso sin complicaciones para ayudarte a invertir internacionalmente'
                )}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step) => (
                <div
                  key={step.step}
                  className="relative bg-white/10 backdrop-blur p-8 border border-white/20"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#C4A25A] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 mt-4">
                    <step.icon className="w-8 h-8 text-[#C4A25A]" />
                  </div>

                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-white mb-4">
                    {language === 'en' ? step.titleEn : step.titleEs}
                  </h3>

                  <p className="text-white/70 leading-relaxed">
                    {language === 'en' ? step.descriptionEn : step.descriptionEs}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section
        id="contact"
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#FFFFFF' : '#FFFBF5' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* CTA Content */}
            <motion.div variants={fadeInUp}>
              <h2
                className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-6 transition-colors duration-500"
                style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
              >
                {t('Ready to Go Global?', '¿Listo para Ir Global?')}
              </h2>

              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-8">
                {t(
                  "Let's discuss your international real estate interests. I'll connect you with the right people to make it happen. Whether you're looking for a vacation home, investment property, or relocation opportunity, I'm here to guide you every step of the way.",
                  'Hablemos sobre tus intereses inmobiliarios internacionales. Te conectaré con las personas adecuadas para hacerlo realidad. Ya sea que busques una casa de vacaciones, propiedad de inversión u oportunidad de reubicación, estoy aquí para guiarte en cada paso del camino.'
                )}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D6BFAE] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#3D3D3D]/60">{t('Phone', 'Teléfono')}</p>
                    <p style={{ color: isDark ? '#1B365D' : '#3D3D3D' }} className="font-semibold">(843) 503-5038</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D6BFAE] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#3D3D3D]/60">{t('Email', 'Correo')}</p>
                    <p style={{ color: isDark ? '#1B365D' : '#3D3D3D' }} className="font-semibold">danidiazrealestate@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-[#F7F7F7] px-4 py-2 rounded-full">
                  <Globe className="w-4 h-4 text-[#C4A25A]" />
                  <span className="text-sm text-[#3D3D3D]">{t('Global Network', 'Red Global')}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F7F7F7] px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-[#C4A25A]" />
                  <span className="text-sm text-[#3D3D3D]">{t('Vetted Partners', 'Socios Verificados')}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F7F7F7] px-4 py-2 rounded-full">
                  <Handshake className="w-4 h-4 text-[#C4A25A]" />
                  <span className="text-sm text-[#3D3D3D]">{t('Personal Service', 'Servicio Personal')}</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp}>
              {isSubmitted ? (
                <div className="bg-white shadow-xl p-8 border border-[#D6BFAE]/30 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-2">
                    {t('Message Sent!', '¡Mensaje Enviado!')}
                  </h3>
                  <p className="text-[#3D3D3D] mb-4">
                    {t("Thank you for your interest! I'll be in touch soon to discuss your international real estate goals.", '¡Gracias por tu interés! Me pondré en contacto pronto para discutir tus metas inmobiliarias internacionales.')}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#C4A25A] hover:underline"
                  >
                    {t('Send another message', 'Enviar otro mensaje')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white shadow-xl p-8 border border-[#D6BFAE]/30">
                  <h3
                    className="font-[family-name:var(--font-playfair)] text-2xl mb-6 transition-colors duration-500"
                    style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                  >
                    {t('Schedule a Consultation', 'Agenda una Consulta')}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm text-[#3D3D3D] mb-2">
                          {t('First Name', 'Nombre')} *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm text-[#3D3D3D] mb-2">
                          {t('Last Name', 'Apellido')} *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm text-[#3D3D3D] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Phone', 'Teléfono')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="destination" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Destination of Interest', 'Destino de Interés')} *
                      </label>
                      <select
                        id="destination"
                        required
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                      >
                        <option value="">{t('Select a destination', 'Selecciona un destino')}</option>
                        {destinations.map(d => (
                          <option key={d.slug} value={d.slug}>
                            {d.city}, {language === 'en' ? d.country : (d.country_es || d.country)}
                          </option>
                        ))}
                        <option value="other">{t('Other (specify in message)', 'Otro (especificar en mensaje)')}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Budget Range', 'Rango de Presupuesto')}
                      </label>
                      <select
                        id="budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                      >
                        <option value="">{t('Select budget range', 'Selecciona rango de presupuesto')}</option>
                        <option value="under-250k">{t('Under $250,000', 'Menos de $250,000')}</option>
                        <option value="250k-500k">$250,000 - $500,000</option>
                        <option value="500k-1m">$500,000 - $1,000,000</option>
                        <option value="1m-plus">{t('$1,000,000+', '$1,000,000+')}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Tell me about your goals', 'Cuéntame sobre tus metas')}
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors resize-none"
                        placeholder={t(
                          'What type of property are you looking for? Investment, vacation home, relocation?',
                          '¿Qué tipo de propiedad buscas? ¿Inversión, casa de vacaciones, reubicación?'
                        )}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plane className="w-5 h-5" />
                      {isSubmitting ? t('Sending...', 'Enviando...') : t('Start Your Global Journey', 'Comienza Tu Viaje Global')}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
