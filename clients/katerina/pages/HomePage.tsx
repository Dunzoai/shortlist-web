'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import Nav from '@/clients/katerina/components/Nav';
import { useLanguage } from '@/clients/katerina/components/LanguageContext';
import { useStyle } from '@/clients/katerina/components/StyleContext';
import { supabase } from '@/lib/supabase';
import InstagramFeed from '@/clients/katerina/components/InstagramFeed';
import NeighborhoodGuides from '@/clients/katerina/components/NeighborhoodGuides';
import ParallaxSection from '@/clients/katerina/components/ParallaxSection';
import ParallaxSection2 from '@/clients/katerina/components/ParallaxSection2';
import Footer from '@/clients/katerina/components/Footer';

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


// Client testimonials
const testimonials = [
  {
    id: 1,
    text: "Katerina made our first home purchase an absolute breeze. She was always available to answer our questions and walked us through every step with patience and genuine care. We never felt rushed or pressured — just supported.",
    textEs: "",
    author: 'Sarah M.',
    location: 'Lake Worth, FL'
  },
  {
    id: 2,
    text: "We were relocating from out of state and Katerina went above and beyond to help us find the perfect neighborhood. She knew every corner of South Florida and matched us with a home we absolutely love.",
    textEs: "",
    author: 'James T.',
    location: 'Boynton Beach, FL'
  },
  {
    id: 3,
    text: "Katerina helped our family sell our old home and buy a bigger one for our growing family. She handled both transactions seamlessly and negotiated a fantastic deal on our new place. We could not have done it without her!",
    textEs: "",
    author: 'The Rodriguez Family',
    location: 'West Palm Beach, FL'
  },
  {
    id: 4,
    text: "From the first phone call to closing day, Katerina was professional, responsive, and incredibly knowledgeable about the local market. She found us a beautiful waterfront property that checked every box on our wish list.",
    textEs: "",
    author: 'Michael & Lisa P.',
    location: 'Lantana, FL'
  },
  {
    id: 5,
    text: "I was nervous about selling my condo in a competitive market, but Katerina's marketing strategy and pricing expertise got us multiple offers within the first week. Her energy and positivity made the whole experience enjoyable.",
    textEs: "",
    author: 'Amanda K.',
    location: 'Lake Worth, FL'
  }
];


export function HomePage() {
  const { language, t } = useLanguage();
  const { styleMode, colors } = useStyle();
  const isDark = styleMode === 'dark';
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('real_estate_leads')
      .insert({
        client_id: '3c125122-f3d9-4f75-91d9-69cf84d6d20e',
        name: `${contactForm.firstName} ${contactForm.lastName}`,
        email: contactForm.email,
        lead_type: contactForm.interest || 'general',
        message: contactForm.message,
        source: 'homepage_contact',
        status: 'new'
      });

    setIsSubmitting(false);

    if (error) {
      console.error('Error submitting lead:', error);
      alert('There was an error submitting your message. Please try again.');
    } else {
      setIsSubmitted(true);
      setContactForm({ firstName: '', lastName: '', email: '', interest: '', message: '' });
    }
  };

  // Failsafe: Force video to show after 500ms even if events don't fire
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchProperties() {
      const { data } = await supabase
        .from('featured_properties')
        .select('*')
        .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
        .eq('status', 'active')
        .neq('listing_type', 'international')
        .order('display_order', { ascending: true })
        .limit(3);

      if (data) {
        setFeaturedListings(data);
      }
    }
    fetchProperties();
  }, []);


  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />

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
            onCanPlay={() => setVideoLoaded(true)}
            onPlaying={() => setVideoLoaded(true)}
            onError={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Video source removed - add your own video file */}
            <source src="" type="video/mp4" />
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
            Katerina Sells Florida
          </h1>
          <p className="text-[#C4A25A] text-xl md:text-2xl mb-4 tracking-wide">
            {t('Your Trusted Real Estate Partner', 'Tu Socia Inmobiliaria de Confianza')}
          </p>
          <p
            className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl italic mb-12 transition-colors duration-500"
            style={{ color: isDark ? '#FFFFFF' : '#3D3D3D' }}
          >
            {t('Finding Your Perfect Place in the Sunshine State', 'Encontrando Tu Lugar Perfecto en el Estado del Sol')}
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
              <div className="w-[500px] h-[600px] bg-gradient-to-br from-[#1B365D] to-[#C4A25A] shadow-lg flex items-center justify-center">
                <p className="text-white text-2xl font-[family-name:var(--font-playfair)]">Your Photo Here</p>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#C4A25A] text-white px-6 py-4 font-[family-name:var(--font-playfair)]">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm">{t('Personalized Service', 'Servicio Personalizado')}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2
                className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-6 transition-colors duration-500"
                style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
              >
                {t('Meet Katerina', 'Conoce a Katerina')}
              </h2>
              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-6">
                {t(
                  "I'm a dedicated real estate professional based in the Lake Worth, Florida area with a genuine passion for helping clients find their dream homes in South Florida. Every client deserves personalized attention and expert guidance through one of life's biggest decisions.",
                  "Soy una profesional inmobiliaria dedicada en el area de Lake Worth, Florida, con una verdadera pasion por ayudar a mis clientes a encontrar la casa de sus suenos en el Sur de la Florida. Cada cliente merece atencion personalizada y orientacion experta en una de las decisiones mas importantes de la vida."
                )}
              </p>
              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-8">
                {t(
                  "Whether you're searching for a cozy bungalow, a waterfront retreat, or your next investment property, I bring local market expertise and a commitment to making your real estate journey smooth and rewarding. Let me help you find your perfect place in the Sunshine State.",
                  "Ya sea que busques un acogedor bungalow, un refugio frente al agua o tu proxima propiedad de inversion, ofrezco experiencia en el mercado local y un compromiso de hacer tu viaje inmobiliario fluido y gratificante. Dejame ayudarte a encontrar tu lugar perfecto en el Estado del Sol."
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
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#1B365D] flex items-center justify-center text-white hover:bg-[#C4A25A] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#1B365D] flex items-center justify-center text-white hover:bg-[#C4A25A] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#1B365D] flex items-center justify-center text-white hover:bg-[#C4A25A] transition-colors font-[family-name:var(--font-playfair)] text-xl font-bold"
                  aria-label="Realtor.com"
                >
                  R
                </a>
                <a
                  href="#"
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
        className="relative z-10 py-24 transition-colors duration-500"
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
                  'Discover exceptional homes in South Florida. From waterfront properties to charming bungalows.',
                  'Descubre hogares excepcionales en el Sur de la Florida. Desde propiedades frente al agua hasta encantadores bungalows.'
                )}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="relative h-96 overflow-hidden shadow-lg md:hover:shadow-2xl transition-shadow duration-300 group cursor-pointer"
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.address}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#D6BFAE] to-[#F7F7F7]" />
                    )}
                  </div>

                  {/* Price Badge */}
                  <div
                    className="absolute top-4 left-4 text-white px-4 py-2 font-semibold z-10"
                    style={{ backgroundColor: isDark ? '#1B365D' : '#3D3D3D' }}
                  >
                    ${listing.price?.toLocaleString()}
                  </div>

                  {/* Content Box - Slides up on hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-6 translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <h3
                      className="font-[family-name:var(--font-playfair)] text-xl mb-1"
                      style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                    >
                      {listing.address}
                    </h3>
                    <p className="text-[#3D3D3D] mb-4">{listing.city}, {listing.state}</p>
                    <div className="flex gap-4 text-sm text-[#3D3D3D]">
                      {listing.beds && <span>{listing.beds} {t('beds', 'hab')}</span>}
                      {listing.beds && listing.baths && <span>•</span>}
                      {listing.baths && <span>{listing.baths} {t('baths', 'baños')}</span>}
                      {listing.baths && listing.sqft && <span>•</span>}
                      {listing.sqft && <span>{listing.sqft.toLocaleString()} {t('sq ft', 'pies²')}</span>}
                    </div>
                  </div>

                  {/* Mobile - Always show content at bottom */}
                  <div className="md:hidden absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-6">
                    <h3
                      className="font-[family-name:var(--font-playfair)] text-xl mb-1"
                      style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                    >
                      {listing.address}
                    </h3>
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

      {/* Parallax Section 1 - CURRENTLY HIDDEN */}
      {/*
        TEMPLATIZATION NOTE: This parallax section provides visual depth and engagement
        on desktop screens. It displays a background image with parallax scroll effect.
        To re-enable: Remove the 'hidden' class below.
        Image location: /public/beach-parallax.png
      */}
      <div className="hidden">
        <ParallaxSection />
      </div>

      {/* Neighborhood Guides Section */}
      <NeighborhoodGuides />

      {/* Parallax Section 2 - CURRENTLY HIDDEN */}
      {/*
        TEMPLATIZATION NOTE: Second parallax section for additional visual interest.
        Provides scrolling depth effect between content sections.
        To re-enable: Remove the 'hidden' class below.
        Image location: /public/front-door-paralax.png
      */}
      <div className="hidden">
        <ParallaxSection2 />
      </div>

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

            <motion.div
              variants={fadeInUp}
              className="overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#C4A25A transparent' }}
            >
              <div className="flex gap-8">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white/10 backdrop-blur p-8 border border-white/20 w-[85vw] md:w-[450px] flex-shrink-0 snap-center"
                  >
                  <svg className="w-10 h-10 text-[#C4A25A] mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    {language === 'en' ? testimonial.text : testimonial.textEs}
                  </p>
                  <div>
                    <p className="text-[#C4A25A] font-semibold">{testimonial.author}</p>
                    {testimonial.location && <p className="text-white/60 text-sm">{testimonial.location}</p>}
                  </div>
                </div>
              ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="py-24 transition-colors duration-500 overflow-hidden"
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
              <div className="relative mb-8">
                {/* Decorative Animated Circle - Scroll-based */}
                <svg
                  className="absolute pointer-events-none hidden md:block"
                  style={{
                    left: '-50px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 'calc(100% + 80px)',
                    height: '100px',
                    zIndex: 0
                  }}
                  viewBox="0 0 400 100"
                  preserveAspectRatio="xMinYMid meet"
                >
                  <motion.path
                    d="M 10,50 C 10,20 50,10 200,10 C 350,10 390,20 390,50 C 390,80 350,90 200,90 C 50,90 10,80 10,50 Z"
                    fill="none"
                    stroke="#C4A25A"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>

                {/* Mobile version with different positioning */}
                <svg
                  className="absolute pointer-events-none md:hidden"
                  style={{
                    left: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 'calc(100% + 40px)',
                    height: '100px',
                    zIndex: 0
                  }}
                  viewBox="0 0 400 100"
                  preserveAspectRatio="xMinYMid meet"
                >
                  <motion.path
                    d="M 10,50 C 10,20 50,10 200,10 C 350,10 390,20 390,50 C 390,80 350,90 200,90 C 50,90 10,80 10,50 Z"
                    fill="none"
                    stroke="#C4A25A"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>

                <h2
                  className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl transition-colors duration-500 relative z-10"
                  style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                >
                  {t("Let's Connect", 'Conectemos')}
                </h2>
              </div>
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
                    <p style={{ color: isDark ? '#1B365D' : '#3D3D3D' }} className="font-semibold">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:katerina@example.com"
                    className="w-12 h-12 bg-[#D6BFAE] rounded-full flex items-center justify-center hover:bg-[#C4A25A] transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                  <div>
                    <p className="text-sm text-[#3D3D3D]/60">{t('Email', 'Correo')}</p>
                    <p style={{ color: isDark ? '#1B365D' : '#3D3D3D' }} className="font-semibold">katerina@example.com</p>
                  </div>
                </div>
              </div>

            </motion.div>

            <motion.div variants={fadeInUp} className="relative z-20">
              {isSubmitted ? (
                <div className="bg-white p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-2">
                    {t('Message Sent!', '¡Mensaje Enviado!')}
                  </h3>
                  <p className="text-[#3D3D3D] mb-4">
                    {t("Thank you for reaching out. I'll get back to you soon!", '¡Gracias por contactarme. Te responderé pronto!')}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#C4A25A] hover:underline"
                  >
                    {t('Send another message', 'Enviar otro mensaje')}
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('First Name', 'Nombre')}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        required
                        value={contactForm.firstName}
                        onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
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
                        required
                        value={contactForm.lastName}
                        onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
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
                      name="email"
                      required
                      autoComplete="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="interest" className="block text-sm text-[#3D3D3D] mb-2">
                      {t("I'm interested in...", 'Estoy interesado en...')}
                    </label>
                    <select
                      id="interest"
                      value={contactForm.interest}
                      onChange={(e) => setContactForm({ ...contactForm, interest: e.target.value })}
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
                      name="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors resize-none bg-white relative z-10"
                      placeholder={t('Tell me about your real estate goals...', 'Cuéntame sobre tus metas inmobiliarias...')}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('Sending...', 'Enviando...') : t('Send Message', 'Enviar Mensaje')}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Instagram Feed */}
      {/* Instagram Feed - DISABLED - See INSTAGRAM_FEED_DEBUG.md for details */}
      {/* <InstagramFeed clientId="katerina" /> */}

      {/* Footer */}
      <Footer />
    </main>
  );
}
