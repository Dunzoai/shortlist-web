'use client';

import { motion } from 'framer-motion';
import Nav from '@/clients/danidiaz/components/Nav';
import Footer from '@/clients/danidiaz/components/Footer';
import MortgageCalculator from '@/clients/danidiaz/components/MortgageCalculator';
import { useLanguage } from '@/clients/danidiaz/components/LanguageContext';
import Link from 'next/link';

export function CalculatorPage() {
  const { t } = useLanguage();

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
              {t('Mortgage Calculator', 'Calculadora de Hipoteca')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Estimate your monthly mortgage payment and plan your budget',
                'Estima tu pago mensual de hipoteca y planifica tu presupuesto'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MortgageCalculator />
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-6 text-center">
              {t('Understanding Your Mortgage', 'Entendiendo Tu Hipoteca')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-3">
                  {t('What affects your payment?', '¿Qué afecta tu pago?')}
                </h3>
                <ul className="space-y-2 text-[#3D3D3D]">
                  <li className="flex items-start">
                    <span className="text-[#C4A25A] mr-2">•</span>
                    <span>
                      {t(
                        'Home price and down payment amount',
                        'Precio de la casa y monto del pago inicial'
                      )}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#C4A25A] mr-2">•</span>
                    <span>
                      {t('Interest rate and loan term', 'Tasa de interés y plazo del préstamo')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#C4A25A] mr-2">•</span>
                    <span>
                      {t('Property taxes and insurance', 'Impuestos sobre la propiedad y seguros')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#C4A25A] mr-2">•</span>
                    <span>{t('HOA fees (if applicable)', 'Tarifas de HOA (si aplica)')}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-3">
                  {t('Next steps', 'Próximos pasos')}
                </h3>
                <ul className="space-y-2 text-[#3D3D3D]">
                  <li className="flex items-start">
                    <span className="text-[#C4A25A] mr-2">•</span>
                    <span>
                      {t('Get pre-approved by a lender', 'Obtén pre-aprobación de un prestamista')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#C4A25A] mr-2">•</span>
                    <span>
                      {t(
                        'Determine your comfortable budget',
                        'Determina tu presupuesto cómodo'
                      )}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#C4A25A] mr-2">•</span>
                    <span>
                      {t('Start viewing homes in your range', 'Comienza a ver casas en tu rango')}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#C4A25A] mr-2">•</span>
                    <span>
                      {t(
                        'Work with Dani to find your dream home',
                        'Trabaja con Dani para encontrar tu casa soñada'
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
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
              {t('Ready to Start Your Home Search?', '¿Listo para Comenzar Tu Búsqueda?')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                "Let's discuss your goals and find the perfect home within your budget.",
                'Hablemos sobre tus metas y encontremos la casa perfecta dentro de tu presupuesto.'
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
                href="/buyers"
                className="border-2 border-white text-white px-8 py-4 text-lg hover:bg-white hover:text-[#1B365D] transition-colors"
              >
                {t('Buyer Resources', 'Recursos para Compradores')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
