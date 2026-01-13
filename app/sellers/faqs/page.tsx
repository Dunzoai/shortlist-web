'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';

interface FAQ {
  questionEn: string;
  questionEs: string;
  answerEn: string;
  answerEs: string;
}

const faqs: FAQ[] = [
  {
    questionEn: 'How do I know when it\'s the right time to sell?',
    questionEs: '¿Cómo sé cuándo es el momento adecuado para vender?',
    answerEn: 'The right time depends on your personal circumstances and local market conditions. Consider factors like job changes, family needs, and financial goals. I can provide a market analysis to help you understand current conditions and whether now is a good time based on inventory levels, buyer demand, and price trends in your area.',
    answerEs: 'El momento adecuado depende de tus circunstancias personales y las condiciones del mercado local. Considera factores como cambios de trabajo, necesidades familiares y metas financieras. Puedo proporcionar un análisis de mercado para ayudarte a entender las condiciones actuales y si ahora es un buen momento según los niveles de inventario, demanda de compradores y tendencias de precios en tu área.'
  },
  {
    questionEn: 'How do you determine my home\'s value?',
    questionEs: '¿Cómo determinas el valor de mi casa?',
    answerEn: 'I conduct a comprehensive market analysis comparing your home to recently sold properties with similar features in your neighborhood. I consider factors like square footage, condition, upgrades, location, and current market trends. This data-driven approach ensures your home is priced competitively to attract qualified buyers while maximizing your return.',
    answerEs: 'Realizo un análisis de mercado integral comparando tu casa con propiedades vendidas recientemente con características similares en tu vecindario. Considero factores como pies cuadrados, condición, mejoras, ubicación y tendencias actuales del mercado. Este enfoque basado en datos asegura que tu casa tenga un precio competitivo para atraer compradores calificados mientras maximiza tu retorno.'
  },
  {
    questionEn: 'What repairs should I make before listing?',
    questionEs: '¿Qué reparaciones debo hacer antes de listar?',
    answerEn: 'Focus on repairs that offer the best return on investment: fix obvious issues like leaky faucets, repair damaged walls or floors, ensure all systems work properly, and enhance curb appeal. Not all repairs are necessary—I\'ll walk through your home and recommend which improvements will add the most value versus what buyers can handle themselves.',
    answerEs: 'Concéntrate en reparaciones que ofrecen el mejor retorno de inversión: arregla problemas obvios como grifos que gotean, repara paredes o pisos dañados, asegura que todos los sistemas funcionen correctamente y mejora el atractivo exterior. No todas las reparaciones son necesarias—caminaré por tu casa y recomendaré qué mejoras agregarán más valor versus lo que los compradores pueden manejar ellos mismos.'
  },
  {
    questionEn: 'How long will it take to sell my home?',
    questionEs: '¿Cuánto tiempo tomará vender mi casa?',
    answerEn: 'The timeline varies based on price, condition, location, and market conditions. In our current market, well-priced homes in good condition typically sell within 30-60 days. Factors like pricing strategy, professional presentation, and marketing approach significantly impact how quickly your home sells. I\'ll provide realistic expectations based on comparable sales in your area.',
    answerEs: 'El tiempo varía según el precio, condición, ubicación y condiciones del mercado. En nuestro mercado actual, casas con buen precio y en buena condición típicamente se venden dentro de 30-60 días. Factores como estrategia de precios, presentación profesional y enfoque de marketing impactan significativamente qué tan rápido se vende tu casa. Proporcionaré expectativas realistas basadas en ventas comparables en tu área.'
  },
  {
    questionEn: 'What are the costs of selling a home?',
    questionEs: '¿Cuáles son los costos de vender una casa?',
    answerEn: 'Typical costs include real estate commission (usually 5-6% split between agents), closing costs (1-3% of sale price including title fees and transfer taxes), any repairs or improvements, home warranty if offered, and prorated property taxes. I\'ll provide a detailed net proceeds estimate so you know exactly what to expect at closing with no surprises.',
    answerEs: 'Los costos típicos incluyen comisión inmobiliaria (usualmente 5-6% dividido entre agentes), costos de cierre (1-3% del precio de venta incluyendo tarifas de título e impuestos de transferencia), cualquier reparación o mejora, garantía de casa si se ofrece, e impuestos de propiedad prorrateados. Proporcionaré una estimación detallada de ganancias netas para que sepas exactamente qué esperar en el cierre sin sorpresas.'
  },
  {
    questionEn: 'Do I need to stage my home?',
    questionEs: '¿Necesito preparar mi casa?',
    answerEn: 'While not required, staging helps buyers envision themselves in the space and often leads to faster sales at higher prices. At minimum, declutter, deep clean, and arrange furniture to showcase your home\'s best features. For vacant homes or significant updates, professional staging can be a worthwhile investment. I\'ll assess your situation and recommend the approach that makes sense for your property.',
    answerEs: 'Aunque no es requerido, la preparación ayuda a los compradores a imaginarse en el espacio y a menudo conduce a ventas más rápidas a precios más altos. Como mínimo, organiza, limpia profundamente y arregla los muebles para mostrar las mejores características de tu casa. Para casas vacías o actualizaciones significativas, la preparación profesional puede ser una inversión valiosa. Evaluaré tu situación y recomendaré el enfoque que tiene sentido para tu propiedad.'
  },
  {
    questionEn: 'What happens once I accept an offer?',
    questionEs: '¿Qué sucede una vez que acepto una oferta?',
    answerEn: 'After accepting an offer, the buyer typically has a due diligence period for inspections and appraisal. We\'ll negotiate any repair requests, ensure the appraisal meets the contract price, and work toward closing. I\'ll coordinate with the buyer\'s agent, title company, and other parties to keep everything on track. The process usually takes 30-45 days from contract to closing.',
    answerEs: 'Después de aceptar una oferta, el comprador típicamente tiene un período de diligencia debida para inspecciones y tasación. Negociaremos cualquier solicitud de reparación, aseguraremos que la tasación cumpla con el precio del contrato y trabajaremos hacia el cierre. Coordinaré con el agente del comprador, compañía de título y otras partes para mantener todo en marcha. El proceso usualmente toma 30-45 días desde el contrato hasta el cierre.'
  },
  {
    questionEn: 'Can I sell my home if I still have a mortgage?',
    questionEs: '¿Puedo vender mi casa si todavía tengo hipoteca?',
    answerEn: 'Yes, absolutely! Most home sellers still have a mortgage. At closing, your mortgage will be paid off from the proceeds of the sale, and you\'ll receive the remaining equity. If you owe more than your home is worth, we\'ll need to discuss options like a short sale. I\'ll help you understand your equity position and net proceeds before listing.',
    answerEs: 'Sí, ¡absolutamente! La mayoría de los vendedores de casas todavía tienen hipoteca. En el cierre, tu hipoteca se pagará con las ganancias de la venta y recibirás el capital restante. Si debes más de lo que vale tu casa, necesitaremos discutir opciones como una venta corta. Te ayudaré a entender tu posición de capital y ganancias netas antes de listar.'
  },
  {
    questionEn: 'How do showings and open houses work?',
    questionEs: '¿Cómo funcionan las visitas y casas abiertas?',
    answerEn: 'Showings are scheduled through me with notice (usually a few hours). You\'ll want to leave the home during showings so buyers can explore freely. Open houses are optional but can generate interest, especially in the first few weeks. I recommend keeping your home show-ready at all times and being flexible with showing times to maximize exposure to potential buyers.',
    answerEs: 'Las visitas se programan a través de mí con aviso (usualmente unas pocas horas). Querrás salir de la casa durante las visitas para que los compradores puedan explorar libremente. Las casas abiertas son opcionales pero pueden generar interés, especialmente en las primeras semanas. Recomiendo mantener tu casa lista para mostrar en todo momento y ser flexible con los horarios de visita para maximizar la exposición a compradores potenciales.'
  },
  {
    questionEn: 'Why should I work with a Realtor instead of selling myself?',
    questionEs: '¿Por qué debería trabajar con un agente en lugar de vender yo mismo?',
    answerEn: 'A Realtor brings market expertise, pricing strategy, professional marketing, negotiation skills, and handles complex paperwork and legal requirements. We have access to the MLS, professional networks, and buyer databases you can\'t reach alone. Most importantly, studies show that homes sold with an agent typically sell for more money and faster than for-sale-by-owner properties, even after commission costs.',
    answerEs: 'Un agente aporta experiencia de mercado, estrategia de precios, marketing profesional, habilidades de negociación y maneja papeleo complejo y requisitos legales. Tenemos acceso al MLS, redes profesionales y bases de datos de compradores que no puedes alcanzar solo. Más importante, estudios muestran que las casas vendidas con un agente típicamente se venden por más dinero y más rápido que propiedades vendidas por el dueño, incluso después de los costos de comisión.'
  }
];

export default function FAQsPage() {
  const { language, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-[#1B365D]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C4A25A] rounded-full mb-6">
              <HelpCircle size={32} className="text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold text-white mb-6">
              {t('Common Seller Questions', 'Preguntas Comunes de Vendedores')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Answers to frequently asked questions about selling your home',
                'Respuestas a preguntas frecuentes sobre la venta de tu casa'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="bg-white shadow-md overflow-hidden">
                  {/* Question Button */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-[#F7F7F7] transition-colors"
                  >
                    <span className="font-[family-name:var(--font-playfair)] text-lg md:text-xl text-[#1B365D] pr-4">
                      {language === 'en' ? faq.questionEn : faq.questionEs}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={24} className="text-[#C4A25A]" />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-2 text-[#3D3D3D] leading-relaxed border-t border-[#D6BFAE]/30">
                          {language === 'en' ? faq.answerEn : faq.answerEs}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1B365D]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-white mb-6">
              {t('Have More Questions?', '¿Tienes Más Preguntas?')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                'Let\'s talk! I\'m here to answer all your questions and guide you through every step of the selling process.',
                '¡Hablemos! Estoy aquí para responder todas tus preguntas y guiarte en cada paso del proceso de venta.'
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
                href="/sellers/valuation"
                className="border-2 border-white text-white px-8 py-4 text-lg hover:bg-white hover:text-[#1B365D] transition-colors"
              >
                {t('Get Free Home Valuation', 'Obtener Valuación Gratuita')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
