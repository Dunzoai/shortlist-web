'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Users, Handshake, Building2, Sun, TrendingUp, Home, Plane } from 'lucide-react';
import Nav from '@/clients/danidiaz/components/Nav';
import Footer from '@/clients/danidiaz/components/Footer';
import { useLanguage } from '@/clients/danidiaz/components/LanguageContext';
import { useStyle } from '@/clients/danidiaz/components/StyleContext';

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

const destinations = [
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'UAE',
    countryEs: 'EAU',
    image: '/international/dubai-skyline.jpg',
    highlights: [
      { en: 'Tax-free investment', es: 'Inversión libre de impuestos' },
      { en: 'Luxury lifestyle', es: 'Estilo de vida de lujo' },
      { en: 'World-class amenities', es: 'Comodidades de clase mundial' },
      { en: 'Booming expat community', es: 'Comunidad de expatriados en auge' },
    ],
    whyInvest: [
      { en: 'Strong rental yields (5-9%)', es: 'Altos rendimientos de alquiler (5-9%)' },
      { en: 'Residency visa options', es: 'Opciones de visa de residencia' },
      { en: 'Iconic developments', es: 'Desarrollos icónicos' },
      { en: 'Growing tourism sector', es: 'Sector turístico en crecimiento' },
    ],
    descriptionEn: "Dubai offers unparalleled luxury living with zero property taxes and a thriving international community. From stunning beachfront apartments to iconic skyscraper residences, Dubai's real estate market continues to attract global investors.",
    descriptionEs: "Dubai ofrece una vida de lujo sin igual con cero impuestos sobre la propiedad y una próspera comunidad internacional. Desde impresionantes apartamentos frente al mar hasta residencias icónicas en rascacielos, el mercado inmobiliario de Dubai sigue atrayendo inversores globales.",
  },
  {
    id: 'cancun',
    city: 'Cancun',
    country: 'Mexico',
    countryEs: 'México',
    image: '/international/cancun-beach.jpg',
    highlights: [
      { en: 'Caribbean paradise', es: 'Paraíso caribeño' },
      { en: 'Tourism-driven rentals', es: 'Alquileres impulsados por turismo' },
      { en: 'Affordable luxury', es: 'Lujo accesible' },
      { en: 'Growing expat community', es: 'Comunidad de expatriados en crecimiento' },
    ],
    whyInvest: [
      { en: 'Vacation rental income', es: 'Ingresos por alquiler vacacional' },
      { en: 'Lower cost of living', es: 'Menor costo de vida' },
      { en: 'Beautiful beaches', es: 'Hermosas playas' },
      { en: 'Strong tourism market', es: 'Fuerte mercado turístico' },
    ],
    descriptionEn: "Cancun combines stunning Caribbean beaches with excellent investment potential. The Riviera Maya region offers everything from beachfront condos to gated communities, with strong vacation rental demand year-round.",
    descriptionEs: "Cancún combina impresionantes playas del Caribe con excelente potencial de inversión. La región de la Riviera Maya ofrece desde condominios frente al mar hasta comunidades cerradas, con fuerte demanda de alquileres vacacionales durante todo el año.",
  },
];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    alert(t('Thank you for your inquiry! I will be in touch soon.', '¡Gracias por tu consulta! Me pondré en contacto pronto.'));
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
            </motion.div>

            <div className="space-y-16">
              {destinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  variants={fadeInUp}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative h-[400px] lg:h-[500px] overflow-hidden shadow-2xl">
                      {/* Placeholder gradient - replace with actual image */}
                      <div
                        className={`absolute inset-0 ${
                          destination.id === 'dubai'
                            ? 'bg-gradient-to-br from-[#1B365D] via-[#C4A25A]/30 to-[#1B365D]'
                            : 'bg-gradient-to-br from-[#00CED1]/30 via-[#C4A25A]/20 to-[#1B365D]'
                        }`}
                      />
                      {/* TODO: Replace with actual images */}
                      {/* <Image src={destination.image} alt={destination.city} fill className="object-cover" /> */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm opacity-50">
                            {t('Image placeholder', 'Imagen de marcador de posición')}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* City Badge */}
                    <div className="absolute -bottom-4 left-6 bg-[#C4A25A] text-white px-6 py-3">
                      <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold">
                        {destination.city}
                      </p>
                      <p className="text-sm opacity-80">
                        {language === 'en' ? destination.country : destination.countryEs}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <h3
                      className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl mb-6 transition-colors duration-500"
                      style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                    >
                      {destination.city}, {language === 'en' ? destination.country : destination.countryEs}
                    </h3>

                    <p className="text-[#3D3D3D] text-lg leading-relaxed mb-8">
                      {language === 'en' ? destination.descriptionEn : destination.descriptionEs}
                    </p>

                    {/* Highlights */}
                    <div className="mb-8">
                      <h4 className="text-[#C4A25A] font-semibold mb-4 flex items-center gap-2">
                        <Sun className="w-5 h-5" />
                        {t('Market Highlights', 'Aspectos Destacados del Mercado')}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {destination.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-2 text-[#3D3D3D]">
                            <div className="w-2 h-2 bg-[#C4A25A] rounded-full" />
                            <span>{language === 'en' ? highlight.en : highlight.es}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Why Invest */}
                    <div className="mb-8">
                      <h4 className="text-[#1B365D] font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {t(`Why ${destination.city}`, `¿Por qué ${destination.city}?`)}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {destination.whyInvest.map((reason, i) => (
                          <div key={i} className="flex items-center gap-2 text-[#3D3D3D]">
                            <div className="w-2 h-2 bg-[#1B365D] rounded-full" />
                            <span>{language === 'en' ? reason.en : reason.es}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <a
                      href="#contact"
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
                      <option value="dubai">Dubai, UAE</option>
                      <option value="cancun">{t('Cancun, Mexico', 'Cancún, México')}</option>
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
                    className="w-full bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors flex items-center justify-center gap-2"
                  >
                    <Plane className="w-5 h-5" />
                    {t('Start Your Global Journey', 'Comienza Tu Viaje Global')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
