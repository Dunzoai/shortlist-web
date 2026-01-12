'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { KeyRound, UserCheck, ListChecks, Search, FileText, ClipboardCheck, Home } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';

const checklistSteps = [
  {
    number: 1,
    titleEn: 'Get Pre-Approved',
    titleEs: 'Obtén Pre-Aprobación',
    icon: KeyRound,
    itemsEn: [
      'Know your budget before you start shopping',
      'Gather documents: pay stubs, W-2s, tax returns, bank statements',
      'Compare rates from multiple lenders'
    ],
    itemsEs: [
      'Conoce tu presupuesto antes de comenzar a buscar',
      'Reúne documentos: talones de pago, W-2s, declaraciones de impuestos, estados de cuenta',
      'Compara tasas de múltiples prestamistas'
    ]
  },
  {
    number: 2,
    titleEn: 'Choose Your Realtor',
    titleEs: 'Elige Tu Agente',
    icon: UserCheck,
    itemsEn: [
      'Find an agent who knows the local market',
      'Look for someone who communicates your way',
      'Ask about their experience with buyers like you'
    ],
    itemsEs: [
      'Encuentra un agente que conozca el mercado local',
      'Busca alguien que se comunique de tu manera',
      'Pregunta sobre su experiencia con compradores como tú'
    ]
  },
  {
    number: 3,
    titleEn: 'Define Your Must-Haves',
    titleEs: 'Define Tus Prioridades',
    icon: ListChecks,
    itemsEn: [
      'List your non-negotiables (beds, baths, location)',
      'Separate "must-haves" from "nice-to-haves"',
      'Consider commute, schools, and lifestyle'
    ],
    itemsEs: [
      'Lista tus no negociables (habitaciones, baños, ubicación)',
      'Separa "imprescindibles" de "sería bueno tener"',
      'Considera traslado, escuelas y estilo de vida'
    ]
  },
  {
    number: 4,
    titleEn: 'Start Your Search',
    titleEs: 'Comienza Tu Búsqueda',
    icon: Search,
    itemsEn: [
      'Tour homes and take notes',
      'Stay open-minded but trust your gut',
      'In a hot market, be ready to move quickly'
    ],
    itemsEs: [
      'Visita casas y toma notas',
      'Mantén la mente abierta pero confía en tu instinto',
      'En un mercado activo, prepárate para actuar rápido'
    ]
  },
  {
    number: 5,
    titleEn: 'Make an Offer',
    titleEs: 'Haz Una Oferta',
    icon: FileText,
    itemsEn: [
      'Your agent will help with pricing strategy',
      'Be prepared for negotiation',
      'Expect counteroffers in competitive markets'
    ],
    itemsEs: [
      'Tu agente te ayudará con la estrategia de precio',
      'Prepárate para negociar',
      'Espera contraofertas en mercados competitivos'
    ]
  },
  {
    number: 6,
    titleEn: 'Under Contract',
    titleEs: 'Bajo Contrato',
    icon: ClipboardCheck,
    itemsEn: [
      'Schedule your home inspection',
      'Lender orders appraisal',
      'Stay in touch with your loan officer'
    ],
    itemsEs: [
      'Programa tu inspección de la casa',
      'El prestamista ordena la tasación',
      'Mantente en contacto con tu oficial de préstamos'
    ]
  },
  {
    number: 7,
    titleEn: 'Closing Day',
    titleEs: 'Día de Cierre',
    icon: Home,
    itemsEn: [
      'Do your final walkthrough',
      'Sign the paperwork',
      'Get your keys and celebrate!'
    ],
    itemsEs: [
      'Haz tu recorrido final',
      'Firma los documentos',
      '¡Recibe tus llaves y celebra!'
    ]
  }
];

export default function BuyerChecklistPage() {
  const { language, t } = useLanguage();

  return (
    <main className="font-[family-name:var(--font-lora)]">
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-[#1B365D]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t('Your Home Buying Checklist', 'Tu Lista de Compra de Casa')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'A step-by-step guide to buying your first (or next) home',
                'Una guía paso a paso para comprar tu primera (o próxima) casa'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Checklist Timeline */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative">
            {/* Vertical Line - Desktop only */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-[#D6BFAE]" />

            {/* Steps */}
            <div className="space-y-12">
              {checklistSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative flex flex-col md:flex-row gap-6 md:gap-8"
                  >
                    {/* Step Number Circle */}
                    <div className="flex items-start md:items-center">
                      <div className="relative z-10 w-16 h-16 rounded-full bg-[#C4A25A] flex items-center justify-center shadow-lg">
                        <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="flex-1 bg-white rounded-lg shadow-lg p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#1B365D]/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent size={24} className="text-[#1B365D]" />
                        </div>
                        <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] font-bold">
                          {language === 'en' ? step.titleEn : step.titleEs}
                        </h3>
                      </div>
                      <ul className="space-y-3 ml-16">
                        {(language === 'en' ? step.itemsEn : step.itemsEs).map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-[#C4A25A] mr-3 mt-1">•</span>
                            <span className="text-[#3D3D3D]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
              {t("Ready to Start? Let's Talk", '¿Listo para Comenzar? Hablemos')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                "I'll guide you through every step of the home buying process. Let's find your perfect home together.",
                'Te guiaré en cada paso del proceso de compra. Encontremos tu casa perfecta juntos.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors"
              >
                {t('Contact Dani', 'Contacta a Dani')}
              </Link>
              <Link
                href="/calculator"
                className="border-2 border-white text-white px-8 py-4 text-lg hover:bg-white hover:text-[#1B365D] transition-colors"
              >
                {t('Use Mortgage Calculator', 'Usa la Calculadora')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
