'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Nav from '@/clients/katerina/components/Nav';
import Footer from '@/clients/katerina/components/Footer';
import { useLanguage } from '@/clients/katerina/components/LanguageContext';
import { useStyle } from '@/clients/katerina/components/StyleContext';
import LanguageToggle from '@/clients/katerina/components/LanguageToggle';

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

const credentials = [
  { titleEn: 'Licensed Realtor', titleEs: 'Agente Inmobiliaria con Licencia' },
  { titleEn: 'Bilingual Certification', titleEs: 'Certificación Bilingüe' },
  { titleEn: 'Luxury Home Specialist', titleEs: 'Especialista en Casas de Lujo' },
  { titleEn: 'Relocation Expert', titleEs: 'Experta en Reubicación' },
];

export function AboutPage() {
  const { language, t } = useLanguage();
  const { styleMode } = useStyle();
  const isDark = styleMode === 'dark';

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />
      <LanguageToggle />

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#1B365D' : '#3D3D3D' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t('About Katerina', 'Sobre Katerina')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Your trusted bilingual partner in Lake Worth, Florida real estate',
                'Tu socia bilingüe de confianza en bienes raíces en Lake Worth, Florida'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Bio Section */}
      <section
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#FFFFFF' : '#FFFBF5' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-start"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
              <div className="w-full h-[750px] bg-gradient-to-br from-[#1B365D] to-[#C4A25A] shadow-2xl flex items-center justify-center"><span className="text-white text-2xl font-[family-name:var(--font-playfair)]">Your Photo Here</span></div>
              <div className="absolute -bottom-8 -left-8 bg-[#C4A25A] p-8 shadow-xl hidden md:block">
                <p className="font-[family-name:var(--font-playfair)] text-white text-4xl font-bold mb-2">
                  100+
                </p>
                <p className="text-white/90">
                  {t('Families Helped', 'Familias Ayudadas')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="lg:pt-8">
              <h2
                className="font-[family-name:var(--font-playfair)] text-4xl mb-8 transition-colors duration-500"
                style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
              >
                {t('Your Partner in South Florida Real Estate', 'Tu Socia en Bienes Raíces del Sur de Florida')}
              </h2>

              <div className="space-y-6 text-[#3D3D3D] text-lg leading-relaxed">
                <p>
                  {t(
                    "I'm Katerina, a dedicated bilingual Realtor serving the Lake Worth and Palm Beach County community. Real estate isn't just my career—it's my passion, and I bring that energy to every client I work with.",
                    "Soy Katerina, una agente inmobiliaria bilingüe dedicada que sirve a la comunidad de Lake Worth y el Condado de Palm Beach. Los bienes raíces no son solo mi carrera—son mi pasión, y llevo esa energía a cada cliente con el que trabajo."
                  )}
                </p>

                <p>
                  {t(
                    "I chose to build my life and career in South Florida because of its incredible diversity, warm community, and endless opportunity. This area has something special, and I love helping people discover that for themselves.",
                    "Elegí construir mi vida y carrera en el Sur de Florida por su increíble diversidad, comunidad cálida y oportunidades infinitas. Esta área tiene algo especial, y me encanta ayudar a las personas a descubrirlo por sí mismas."
                  )}
                </p>

                <p>
                  {t(
                    "I don't just help you buy or sell homes—I help you feel grounded, informed, and confident while making one of the biggest decisions of your life.",
                    "No solo te ayudo a comprar o vender casas—te ayudo a sentirte arraigado, informado y seguro mientras tomas una de las decisiones más grandes de tu vida."
                  )}
                </p>

                <p>
                  {t(
                    "Whether you're relocating from another state, investing in property, or buying your first home, I understand the questions you're afraid to ask, the details others overlook, and the emotional weight behind every decision. I'm here to make it easier.",
                    "Ya sea que te estés mudando desde otro estado, invirtiendo en una propiedad, o comprando tu primera casa, entiendo las preguntas que tienes miedo de hacer, los detalles que otros pasan por alto, y el peso emocional detrás de cada decisión. Estoy aquí para hacerlo más fácil."
                  )}
                </p>

                <p>
                  {t(
                    "I specialize in helping relocators, first-time buyers and sellers, and families navigate the Lake Worth and Palm Beach County market with transparency, education, and a client-first mindset.",
                    "Me especializo en ayudar a personas que se reubican, compradores y vendedores primerizos, y familias a navegar el mercado de Lake Worth y el Condado de Palm Beach con transparencia, educación, y una mentalidad que pone al cliente primero."
                  )}
                </p>

                <p className="font-semibold">
                  {t(
                    "My approach is simple: clarity over confusion, strategy over pressure, and guidance over transactions.",
                    "Mi enfoque es simple: claridad sobre confusión, estrategia sobre presión, y orientación sobre transacciones."
                  )}
                </p>

                <p>
                  {t(
                    "I'm your dedicated agent who listens, explains, protects your interests, and truly shows up for you every step of the way.",
                    "Soy tu agente dedicada que escucha, explica, protege tus intereses, y realmente se presenta por ti en cada paso del camino."
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Credentials Section */}
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
                className="font-[family-name:var(--font-playfair)] text-4xl mb-4 transition-colors duration-500"
                style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
              >
                {t('Credentials & Certifications', 'Credenciales y Certificaciones')}
              </h2>
              <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
                {t(
                  'Committed to excellence through continuous education and professional development',
                  'Comprometida con la excelencia a través de educación continua y desarrollo profesional'
                )}
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="overflow-x-auto pb-4 snap-x snap-mandatory md:overflow-visible"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#C4A25A transparent' }}
            >
              <div className="flex gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {credentials.map((credential, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow text-center w-[280px] md:w-auto flex-shrink-0 snap-center"
                  >
                  <div className="w-16 h-16 bg-[#D6BFAE] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8"
                      style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3
                    className="font-[family-name:var(--font-playfair)] text-xl"
                    style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
                  >
                    {language === 'en' ? credential.titleEn : credential.titleEs}
                  </h3>
                </div>
              ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#1B365D' : '#3D3D3D' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-white mb-8">
                {t('Why I Love What I Do', 'Por Qué Amo Lo Que Hago')}
              </h2>

              <div className="space-y-6 text-[#D6BFAE] text-lg leading-relaxed">
                <p>
                  {t(
                    "There's something magical about handing over keys to a family and watching their faces light up. That moment when a house becomes a home—when dreams become reality—that's why I wake up excited every single day.",
                    "Hay algo mágico en entregar las llaves a una familia y ver cómo se iluminan sus rostros. Ese momento cuando una casa se convierte en un hogar—cuando los sueños se hacen realidad—es por eso que me despierto emocionada todos los días."
                  )}
                </p>

                <p>
                  {t(
                    "Lake Worth isn't just where I work—it's where I chose to build my life. The beautiful weather year-round, the vibrant community, the stunning beaches, and the rich cultural diversity—I fell in love with South Florida, and I love helping others discover why it's such a special place to call home.",
                    "Lake Worth no es solo donde trabajo—es donde elegí construir mi vida. El hermoso clima durante todo el año, la comunidad vibrante, las impresionantes playas, y la rica diversidad cultural—me enamoré del Sur de Florida, y me encanta ayudar a otros a descubrir por qué es un lugar tan especial para llamar hogar."
                  )}
                </p>

                <p>
                  {t(
                    "When I'm not showing homes or negotiating contracts, you'll find me exploring local restaurants, enjoying the beaches with my family, or getting involved in community events that make Lake Worth such a wonderful place to live.",
                    "Cuando no estoy mostrando casas o negociando contratos, me encontrarás explorando restaurantes locales, disfrutando de las playas con mi familia, o participando en eventos comunitarios que hacen de Lake Worth un lugar tan maravilloso para vivir."
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 transition-colors duration-500"
        style={{ backgroundColor: isDark ? '#FFFFFF' : '#FFFBF5' }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-6 transition-colors duration-500"
              style={{ color: isDark ? '#1B365D' : '#3D3D3D' }}
            >
              {t("Let's Start Your Journey", 'Comencemos Tu Viaje')}
            </h2>
            <p className="text-[#3D3D3D] text-lg mb-8 max-w-2xl mx-auto">
              {t(
                "Whether you're buying your first home, selling your current one, or looking for your dream property in South Florida, I'm here to guide you every step of the way.",
                "Ya sea que estés comprando tu primera casa, vendiendo la actual, o buscando tu propiedad soñada en el Sur de Florida, estoy aquí para guiarte en cada paso del camino."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors"
              >
                {t('Contact Me', 'Contáctame')}
              </Link>
              <Link
                href="/listings"
                className="border-2 px-8 py-4 text-lg transition-colors"
                style={{
                  borderColor: isDark ? '#1B365D' : '#3D3D3D',
                  color: isDark ? '#1B365D' : '#3D3D3D',
                }}
              >
                {t('View Listings', 'Ver Propiedades')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
