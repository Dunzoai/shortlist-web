'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import Nav from '@/components/Nav';
import { useLanguage } from '@/components/LanguageContext';
import { useStyle } from '@/components/StyleContext';
import LanguageToggle from '@/components/LanguageToggle';
import InstagramFeed from '@/components/InstagramFeed';
import NeighborhoodGuides from '@/components/NeighborhoodGuides';

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

// Placeholder featured listings
const featuredListings = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    price: '$425,000',
    address: '123 Ocean Boulevard',
    city: 'Myrtle Beach, SC',
    beds: 4,
    baths: 3,
    sqft: '2,450'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    price: '$575,000',
    address: '456 Marsh View Drive',
    city: 'Pawleys Island, SC',
    beds: 5,
    baths: 4,
    sqft: '3,200'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    price: '$325,000',
    address: '789 Coastal Lane',
    city: 'Surfside Beach, SC',
    beds: 3,
    baths: 2,
    sqft: '1,850'
  }
];

// Placeholder testimonials
const testimonials = [
  {
    id: 1,
    text: "Dani made our home buying experience seamless. Her bilingual skills were invaluable for our family!",
    textEs: "Dani hizo que nuestra experiencia de compra de casa fuera perfecta. ¡Sus habilidades bilingües fueron invaluables para nuestra familia!",
    author: 'Maria & Carlos Rodriguez',
    location: 'Myrtle Beach'
  },
  {
    id: 2,
    text: "Professional, knowledgeable, and always available. Dani found us our dream beach home.",
    textEs: "Profesional, conocedora y siempre disponible. Dani nos encontró la casa de playa de nuestros sueños.",
    author: 'The Thompson Family',
    location: 'Pawleys Island'
  },
  {
    id: 3,
    text: "Her global perspective and local expertise made all the difference in our relocation.",
    textEs: "Su perspectiva global y experiencia local marcaron toda la diferencia en nuestra reubicación.",
    author: 'James & Linda Park',
    location: 'Surfside Beach'
  }
];

export default function Home() {
  const { language, t } = useLanguage();
  const { styleMode, colors } = useStyle();
  const isDark = styleMode === 'dark';
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />
      <LanguageToggle />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-[#1B365D]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/dani-diaz-hero-video.m4v" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 transition-colors duration-500 pointer-events-none"
            style={{ backgroundColor: isDark ? 'rgba(27, 54, 93, 0.7)' : 'rgba(255, 251, 245, 0.85)' }}
          />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1
            className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-bold mb-6 transition-colors duration-500"
            style={{ color: isDark ? '#FFFFFF' : '#3D3D3D' }}
          >
            Dani Díaz
          </h1>
          <p className="text-[#C4A25A] text-xl md:text-2xl mb-4 tracking-wide">
            {t('Bilingual Realtor® at Faircloth Real Estate Group', 'Agente Inmobiliaria Bilingüe en Faircloth Real Estate Group')}
          </p>
          <p
            className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl italic mb-12 transition-colors duration-500"
            style={{ color: isDark ? '#FFFFFF' : '#3D3D3D' }}
          >
            {t('From Global Roots to Local Roofs', 'De Raíces Globales a Techos Locales')}
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/buyers"
              className="bg-[#C4A25A] text-white px-8 py-4 text-lg tracking-wide hover:bg-[#b3923f] transition-colors"
            >
              {t("I'm Buying", 'Quiero Comprar')}
            </Link>
            <Link
              href="/sellers"
              className="border-2 px-8 py-4 text-lg tracking-wide transition-colors"
              style={{
                borderColor: isDark ? '#FFFFFF' : '#3D3D3D',
                color: isDark ? '#FFFFFF' : '#3D3D3D',
              }}
            >
              {t("I'm Selling", 'Quiero Vender')}
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6 transition-colors duration-500"
            fill="none"
            stroke={isDark ? '#FFFFFF' : '#3D3D3D'}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* About Preview Section */}
      <section
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#FFFFFF' : '#FFFBF5' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
              <Image
                src="/dani-diaz-home-about.JPG"
                alt="Dani Díaz - Bilingual Realtor"
                width={500}
                height={600}
                className="object-cover shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#C4A25A] text-white px-6 py-4 font-[family-name:var(--font-playfair)]">
                <p className="text-2xl font-bold">10+</p>
                <p className="text-sm">{t('Years Experience', 'Años de Experiencia')}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2
                className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-6 transition-colors duration-500"
                style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
              >
                {t('Meet Dani', 'Conoce a Dani')}
              </h2>
              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-6">
                {t(
                  "Originally from Colombia, I moved to Myrtle Beach in 2018 and found more than a new home—I found my family. After purchasing and renovating my first home with my husband in 2019, I discovered my passion for helping others find their perfect place.",
                  "Originaria de Colombia, me mudé a Myrtle Beach en 2018 y encontré más que un nuevo hogar: encontré a mi familia. Después de comprar y renovar mi primera casa con mi esposo en 2019, descubrí mi pasión por ayudar a otros a encontrar su lugar perfecto."
                )}
              </p>
              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-8">
                {t(
                  "As a bilingual Realtor®, I guide Spanish and English-speaking clients through every step of buying or selling on the Grand Strand. Whether you're a first-time buyer or looking for your next investment, I'm here to make the journey personal.",
                  "Como Agente Inmobiliaria bilingüe, guío a clientes hispanohablantes e angloparlantes a través de cada paso de compra o venta en el Grand Strand. Ya sea que seas un comprador primerizo o estés buscando tu próxima inversión, estoy aquí para hacer el viaje personal."
                )}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-[#C4A25A] text-lg hover:text-[#1B365D] transition-colors"
              >
                {t('Learn More About Me', 'Conoce Más Sobre Mí')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Social Icons */}
              <div className="flex gap-3 mt-8">
                <a
                  href="https://www.instagram.com/dani.globalhomes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#1B365D] flex items-center justify-center text-white hover:bg-[#C4A25A] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.facebook.com/daniampudiazv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#1B365D] flex items-center justify-center text-white hover:bg-[#C4A25A] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.realtor.com/realestateagents/66abbb21e7320c7ad682b6a8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#1B365D] flex items-center justify-center text-white hover:bg-[#C4A25A] transition-colors font-[family-name:var(--font-playfair)] text-xl font-bold"
                  aria-label="Realtor.com"
                >
                  R
                </a>
                <a
                  href="https://www.linkedin.com/in/danidiazrealtor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#1B365D] flex items-center justify-center text-white hover:bg-[#C4A25A] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section
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
                {t('Featured Properties', 'Propiedades Destacadas')}
              </h2>
              <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
                {t(
                  'Discover exceptional homes along the Grand Strand. From beachfront condos to luxury estates.',
                  'Descubre hogares excepcionales a lo largo del Grand Strand. Desde condominios frente al mar hasta propiedades de lujo.'
                )}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white shadow-lg md:hover:shadow-2xl md:hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    {/* TODO: Replace with actual listing photos */}
                    <Image
                      src={listing.image}
                      alt={listing.address}
                      fill
                      className="object-cover"
                    />
                    <div
                      className="absolute top-4 left-4 text-white px-4 py-2 font-semibold"
                      style={{ backgroundColor: isDark ? '#1B365D' : '#3D3D3D' }}
                    >
                      {listing.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3
                      className="font-[family-name:var(--font-playfair)] text-xl mb-1"
                      style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                    >
                      {listing.address}
                    </h3>
                    <p className="text-[#3D3D3D] mb-4">{listing.city}</p>
                    <div className="flex gap-4 text-sm text-[#3D3D3D]">
                      <span>{listing.beds} {t('beds', 'hab')}</span>
                      <span>•</span>
                      <span>{listing.baths} {t('baths', 'baños')}</span>
                      <span>•</span>
                      <span>{listing.sqft} {t('sq ft', 'pies²')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center mt-12">
              <Link
                href="/listings"
                className="inline-flex items-center text-white px-8 py-4 text-lg transition-colors"
                style={{ backgroundColor: isDark ? '#1B365D' : '#3D3D3D' }}
              >
                {t('View All Listings', 'Ver Todas las Propiedades')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Neighborhood Guides Section */}
      <NeighborhoodGuides />

      {/* Testimonials Section */}
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
                {t('What Clients Say', 'Lo Que Dicen los Clientes')}
              </h2>
              <p className="text-[#D6BFAE] text-lg max-w-2xl mx-auto">
                {t(
                  "Don't just take my word for it. Here's what families I've helped have to say.",
                  "No solo me creas a mí. Esto es lo que dicen las familias que he ayudado."
                )}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white/10 backdrop-blur p-8 border border-white/20"
                >
                  <svg className="w-10 h-10 text-[#C4A25A] mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    {language === 'en' ? testimonial.text : testimonial.textEs}
                  </p>
                  <div>
                    <p className="text-[#C4A25A] font-semibold">{testimonial.author}</p>
                    <p className="text-white/60 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#FFFFFF' : '#FFFBF5' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h2
                className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-6 transition-colors duration-500"
                style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
              >
                {t("Let's Connect", 'Conectemos')}
              </h2>
              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-8">
                {t(
                  "Ready to start your real estate journey? Whether you're buying, selling, or just exploring your options, I'm here to help. Reach out today for a free consultation.",
                  "¿Listo para comenzar tu viaje inmobiliario? Ya sea que estés comprando, vendiendo o simplemente explorando tus opciones, estoy aquí para ayudar. Contáctame hoy para una consulta gratuita."
                )}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D6BFAE] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#3D3D3D]/60">{t('Phone', 'Teléfono')}</p>
                    <p style={{ color: isDark ? '#1B365D' : '#3D3D3D' }} className="font-semibold">(843) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:danidiazrealestate@gmail.com"
                    className="w-12 h-12 bg-[#D6BFAE] rounded-full flex items-center justify-center hover:bg-[#C4A25A] transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                  <div>
                    <p className="text-sm text-[#3D3D3D]/60">{t('Email', 'Correo')}</p>
                    <p style={{ color: isDark ? '#1B365D' : '#3D3D3D' }} className="font-semibold">danidiazrealestate@gmail.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-[#3D3D3D] mb-2">
                      {t('First Name', 'Nombre')}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
                      placeholder={t('John', 'Juan')}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm text-[#3D3D3D] mb-2">
                      {t('Last Name', 'Apellido')}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
                      placeholder={t('Doe', 'García')}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-[#3D3D3D] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="interest" className="block text-sm text-[#3D3D3D] mb-2">
                    {t("I'm interested in...", 'Estoy interesado en...')}
                  </label>
                  <select
                    id="interest"
                    className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                  >
                    <option value="">{t('Select an option', 'Selecciona una opción')}</option>
                    <option value="buying">{t('Buying a home', 'Comprar una casa')}</option>
                    <option value="selling">{t('Selling my home', 'Vender mi casa')}</option>
                    <option value="both">{t('Both buying and selling', 'Comprar y vender')}</option>
                    <option value="info">{t('Just getting information', 'Solo obtener información')}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm text-[#3D3D3D] mb-2">
                    {t('Message', 'Mensaje')}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors resize-none"
                    placeholder={t('Tell me about your real estate goals...', 'Cuéntame sobre tus metas inmobiliarias...')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors"
                >
                  {t('Send Message', 'Enviar Mensaje')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Instagram Feed */}
      {/* Instagram Feed - DISABLED - See INSTAGRAM_FEED_DEBUG.md for details */}
      {/* <InstagramFeed clientId="danidiaz" /> */}

      {/* Footer */}
      <footer
        className="py-16 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#1B365D' : '#1B365D' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Brand Section */}
          <div className="mb-12">
            <h2 className="font-[family-name:var(--font-playfair)] text-white text-5xl md:text-6xl font-bold">
              Dani Díaz
            </h2>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
            {/* Contact Section */}
            <div className="md:col-span-3">
              <h3 className="text-white text-sm font-semibold tracking-wider mb-4">
                {t('CONTACT', 'CONTACTO')}
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+18437994566"
                  className="block text-white hover:text-[#C4A25A] transition-colors"
                >
                  (843) 799-4566
                </a>
                <a
                  href="mailto:danidiazrealestate@gmail.com"
                  className="block text-white hover:text-[#C4A25A] transition-colors uppercase text-sm"
                >
                  DANIDIAZREALESTATE@GMAIL.COM
                </a>
              </div>
            </div>

            {/* Address Section */}
            <div className="md:col-span-3">
              <h3 className="text-white text-sm font-semibold tracking-wider mb-4">
                {t('ADDRESS', 'DIRECCIÓN')}
              </h3>
              <div className="text-white">
                <p>1274 Professional Dr</p>
                <p>Myrtle Beach SC 29577</p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block md:col-span-1">
              <div className="h-full w-px bg-white/20 mx-auto"></div>
            </div>

            {/* Social Icons Section */}
            <div className="md:col-span-5 flex items-start justify-start md:justify-end">
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/daniampudiazv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B365D] hover:bg-[#C4A25A] hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/dani.globalhomes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B365D] hover:bg-[#C4A25A] hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/danidiazrealtor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B365D] hover:bg-[#C4A25A] hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://www.realtor.com/realestateagents/66abbb21e7320c7ad682b6a8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1B365D] hover:bg-[#C4A25A] hover:text-white transition-colors font-bold text-xl"
                  aria-label="Realtor.com"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  R
                </a>
              </div>
            </div>
          </div>

          {/* Horizontal Divider */}
          <div className="border-t border-white/20 pt-8">
            {/* Navigation Links */}
            <div className="flex flex-wrap gap-6 md:gap-8 justify-center md:justify-start mb-6">
              <a
                href="/about"
                className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
              >
                {t('ABOUT', 'ACERCA DE')}
              </a>
              <a
                href="/buyers"
                className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
              >
                {t('BUYERS', 'COMPRADORES')}
              </a>
              <a
                href="/sellers"
                className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
              >
                {t('SELLERS', 'VENDEDORES')}
              </a>
              <a
                href="#contact"
                className="text-white hover:text-[#C4A25A] transition-colors text-sm font-semibold tracking-wider"
              >
                {t("LET'S CONNECT", 'CONECTEMOS')}
              </a>
            </div>

            {/* Copyright */}
            <p className="text-white/60 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Dani Díaz. {t('All rights reserved.', 'Todos los derechos reservados.')}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
