'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import Nav from '@/components/Nav';
import { useLanguage } from '@/components/LanguageContext';
import { useStyle } from '@/components/StyleContext';
import { supabase } from '@/lib/supabase';
import InstagramFeed from '@/components/InstagramFeed';
import NeighborhoodGuides from '@/components/NeighborhoodGuides';
import ParallaxSection from '@/components/ParallaxSection';
import ParallaxSection2 from '@/components/ParallaxSection2';
import Footer from '@/components/Footer';

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
    text: "Throughout our home-buying process, Dani was incredibly communicative. She promptly answered every time our calls and emails, keeping us informed about every detail of the process. She took the time to understand our preferences and needs and helped us with the whole negotiation, which gave us a really good deal. She gave us more than a 5-star treatment, and even after the purchase, she kept helping us.",
    textEs: "Durante todo nuestro proceso de compra de casa, Dani fue increíblemente comunicativa. Respondió puntualmente cada vez a nuestras llamadas y correos, manteniéndonos informados sobre cada detalle del proceso. Se tomó el tiempo para entender nuestras preferencias y necesidades y nos ayudó con toda la negociación, lo que nos dio un muy buen trato. Nos dio más que un tratamiento de 5 estrellas, e incluso después de la compra, siguió ayudándonos.",
    author: 'Rudy Duarte',
    location: ''
  },
  {
    id: 2,
    text: "Dani is such an amazing Realtor and a very kind person! I absolutely recommend her; she makes the process easier. She really cares about her clients, always responds to our answers, and helps us with everything!!!",
    textEs: "¡Dani es una agente inmobiliaria increíble y una persona muy amable! La recomiendo absolutamente; ella hace el proceso más fácil. ¡Realmente se preocupa por sus clientes, siempre responde a nuestras preguntas y nos ayuda con todo!!!",
    author: 'Katherin Chaparro',
    location: ''
  },
  {
    id: 3,
    text: "Dani helped me buy and sell at the same time, and she was incredibly diligent throughout the entire process. She always made sure I felt comfortable with the numbers without being unrealistic, which gave me so much confidence. She did an amazing job marketing my property and negotiated exceptionally well, always looking out for my best interests and going above and beyond to get me the best possible deal.",
    textEs: "Dani me ayudó a comprar y vender al mismo tiempo, y fue increíblemente diligente durante todo el proceso. Siempre se aseguró de que me sintiera cómodo con los números sin ser poco realista, lo que me dio tanta confianza. Hizo un trabajo increíble comercializando mi propiedad y negoció excepcionalmente bien, siempre cuidando mis mejores intereses y yendo más allá para conseguirme el mejor trato posible.",
    author: 'Mario Leguisamo',
    location: ''
  },
  {
    id: 4,
    text: "Any time we contacted Dani, she was very responsive and professional. She listened to our needs and was able to share multiple property listings with us throughout our search. Dani was always able to adapt to our schedule and show us properties when we were in the area. She was also very supportive during the process of making an offer and the process of closing.",
    textEs: "Cada vez que contactamos a Dani, fue muy receptiva y profesional. Escuchó nuestras necesidades y pudo compartir múltiples listados de propiedades con nosotros durante nuestra búsqueda. Dani siempre pudo adaptarse a nuestro horario y mostrarnos propiedades cuando estábamos en la zona. También fue muy solidaria durante el proceso de hacer una oferta y el proceso de cierre.",
    author: 'Joshua Feichtel',
    location: ''
  },
  {
    id: 5,
    text: "I felt very good working with you Dani Diaz as she is an excellent 100% recommendable, capable and professional agent in her work. The truth is, I never felt so comfortable and impressed with her way of working and helping me. Excellent service and professionalism, thank you.",
    textEs: "Me sentí muy bien trabajando con usted Dani Diaz ya que es una excelente agente 100% recomendable capaz y profesional en su trabajo. La verdad, nunca me sentí tan cómodo e impresionado con su manera de trabajar y ayudarme. Excelente servicio y profesionalismo, gracias.",
    author: 'Ismael Arguello',
    location: ''
  },
  {
    id: 6,
    text: "I am very grateful to Dani Diaz. I thought it was going to be impossible or very difficult to buy my first house, but Dani was very patient and always kept in mind the type of property we wanted and what our needs were. She was able to negotiate a good price on our home and even helped us secure credit for our closing. She always explained the whole process to us very well and I felt very comfortable. She is a great professional.",
    textEs: "Estoy muy agradecida con Dani Diaz, Yo pensaba que iba a ser imposible o muy difícil comprar mi primera casa, pero Dani fue muy paciente y siempre tuvo en mente el tipo de propiedad que queríamos y cuáles eran nuestras necesidades. Pudo negociar un buen precio en nuestra casa e incluso nos ayudó a conseguir crédito para nuestro cierre. Siempre nos explicó muy bien todo el proceso y me sentí muy a gusto. Es una gran profesional.",
    author: 'Elvira',
    location: ''
  }
];


export default function Home() {
  const { language, t } = useLanguage();
  const { styleMode, colors } = useStyle();
  const isDark = styleMode === 'dark';
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);

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
            {t('Bilingual Realtor at Faircloth Real Estate Group', 'Agente Inmobiliaria Bilingüe en Faircloth Real Estate Group')}
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
                  "As a bilingual Realtor, I guide Spanish and English-speaking clients through every step of buying or selling on the Grand Strand. Whether you're a first-time buyer or looking for your next investment, I'm here to make the journey personal.",
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
                  'Discover exceptional homes along the Grand Strand. From beachfront condos to luxury estates.',
                  'Descubre hogares excepcionales a lo largo del Grand Strand. Desde condominios frente al mar hasta propiedades de lujo.'
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
                    <p style={{ color: isDark ? '#1B365D' : '#3D3D3D' }} className="font-semibold">(843) 503-5038</p>
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

              {/* Faircloth Real Estate Logo */}
              <div className="mt-6 relative w-[600px] h-[150px] md:w-[1200px] md:h-[300px]">
                <Image
                  src="/faircloth-real-estate-logo.png"
                  alt="Faircloth Real Estate Group"
                  fill
                  className="object-contain object-left"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(16%) sepia(47%) saturate(1634%) hue-rotate(194deg) brightness(94%) contrast(92%)'
                  }}
                />
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
      <Footer />
    </main>
  );
}
