'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Home, DollarSign, Calendar, Clock } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';

export default function MarketReportPage() {
  const { language, t } = useLanguage();

  // Placeholder market data - in a real scenario, this would be fetched from an API or database
  const marketStats = [
    {
      labelEn: 'Median Home Price',
      labelEs: 'Precio Medio de Casa',
      value: '$385,000',
      change: '+5.2%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      labelEn: 'Average Days on Market',
      labelEs: 'Días Promedio en el Mercado',
      value: '42',
      change: '-8 days',
      trend: 'down' as const,
      icon: Calendar
    },
    {
      labelEn: 'Homes Sold (Last 30 Days)',
      labelEs: 'Casas Vendidas (Últimos 30 Días)',
      value: '287',
      change: '+12%',
      trend: 'up' as const,
      icon: Home
    },
    {
      labelEn: 'Inventory Available',
      labelEs: 'Inventario Disponible',
      value: '1,245',
      change: '-3%',
      trend: 'down' as const,
      icon: TrendingUp
    }
  ];

  const neighborhoods = [
    {
      nameEn: 'Market Common',
      nameEs: 'Market Common',
      medianPrice: '$425,000',
      avgDays: 35,
      status: 'hot' as const
    },
    {
      nameEn: 'Carolina Forest',
      nameEs: 'Carolina Forest',
      medianPrice: '$365,000',
      avgDays: 45,
      status: 'hot' as const
    },
    {
      nameEn: 'Surfside Beach',
      nameEs: 'Surfside Beach',
      medianPrice: '$520,000',
      avgDays: 52,
      status: 'warm' as const
    },
    {
      nameEn: 'Murrells Inlet',
      nameEs: 'Murrells Inlet',
      medianPrice: '$445,000',
      avgDays: 48,
      status: 'warm' as const
    },
    {
      nameEn: 'Little River',
      nameEs: 'Little River',
      medianPrice: '$315,000',
      avgDays: 58,
      status: 'moderate' as const
    },
    {
      nameEn: 'North Myrtle Beach',
      nameEs: 'North Myrtle Beach',
      medianPrice: '$475,000',
      avgDays: 41,
      status: 'hot' as const
    }
  ];

  const insights = [
    {
      titleEn: 'Strong Seller\'s Market',
      titleEs: 'Fuerte Mercado de Vendedores',
      descEn: 'With inventory levels remaining low and buyer demand high, sellers are in a favorable position. Homes priced correctly are receiving multiple offers.',
      descEs: 'Con niveles de inventario bajos y alta demanda de compradores, los vendedores están en una posición favorable. Las casas con precios correctos están recibiendo múltiples ofertas.'
    },
    {
      titleEn: 'Faster Sales',
      titleEs: 'Ventas Más Rápidas',
      descEn: 'The average time on market has decreased significantly, indicating strong buyer interest. Well-presented homes are selling even faster than the market average.',
      descEs: 'El tiempo promedio en el mercado ha disminuido significativamente, indicando un fuerte interés de los compradores. Las casas bien presentadas se venden aún más rápido que el promedio del mercado.'
    },
    {
      titleEn: 'Price Appreciation',
      titleEs: 'Apreciación de Precios',
      descEn: 'Home values continue to appreciate steadily. The coastal lifestyle and growing job market make Myrtle Beach an attractive destination for buyers.',
      descEs: 'Los valores de las casas continúan apreciándose constantemente. El estilo de vida costero y el creciente mercado laboral hacen de Myrtle Beach un destino atractivo para compradores.'
    },
    {
      titleEn: 'Competitive Environment',
      titleEs: 'Ambiente Competitivo',
      descEn: 'Buyers are acting quickly on well-priced homes. Professional presentation, strategic pricing, and strong marketing are essential for maximizing your sale price.',
      descEs: 'Los compradores están actuando rápidamente en casas con buenos precios. La presentación profesional, precios estratégicos y marketing fuerte son esenciales para maximizar tu precio de venta.'
    }
  ];

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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C4A25A] rounded-full mb-6">
              <TrendingUp size={32} className="text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold text-white mb-6">
              {t('Myrtle Beach Market Report', 'Reporte del Mercado de Myrtle Beach')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Current market conditions and insights to help you make informed decisions',
                'Condiciones actuales del mercado e información para ayudarte a tomar decisiones informadas'
              )}
            </p>
            <p className="text-white/60 text-sm mt-4">
              {t('Updated', 'Actualizado')}: {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Market Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-4">
              {t('Key Market Indicators', 'Indicadores Clave del Mercado')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#F7F7F7] p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C4A25A]/10 rounded-full">
                      <IconComponent size={24} className="text-[#C4A25A]" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                      {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-[#3D3D3D] text-sm">
                    {language === 'en' ? stat.labelEn : stat.labelEs}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Neighborhood Breakdown */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-4">
              {t('Neighborhood Snapshot', 'Vista de Vecindarios')}
            </h2>
            <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
              {t(
                'Popular areas in the Grand Strand and their current market activity',
                'Áreas populares en Grand Strand y su actividad actual del mercado'
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map((neighborhood, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D]">
                    {language === 'en' ? neighborhood.nameEn : neighborhood.nameEs}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    neighborhood.status === 'hot' ? 'bg-red-100 text-red-700' :
                    neighborhood.status === 'warm' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {neighborhood.status === 'hot' ? t('Hot', 'Caliente') :
                     neighborhood.status === 'warm' ? t('Warm', 'Cálido') :
                     t('Moderate', 'Moderado')}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#3D3D3D] text-sm">{t('Median Price', 'Precio Medio')}</span>
                    <span className="font-semibold text-[#1B365D]">{neighborhood.medianPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#3D3D3D] text-sm">{t('Avg. Days on Market', 'Días Promedio')}</span>
                    <span className="font-semibold text-[#1B365D]">{neighborhood.avgDays} {t('days', 'días')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-4">
              {t('Market Insights', 'Análisis del Mercado')}
            </h2>
            <p className="text-[#3D3D3D] text-lg max-w-2xl mx-auto">
              {t(
                'What these numbers mean for sellers in today\'s market',
                'Lo que estos números significan para los vendedores en el mercado actual'
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#F7F7F7] p-6"
              >
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-3">
                  {language === 'en' ? insight.titleEn : insight.titleEs}
                </h3>
                <p className="text-[#3D3D3D]">
                  {language === 'en' ? insight.descEn : insight.descEs}
                </p>
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
              {t('Ready to Capitalize on Market Conditions?', '¿Listo para Capitalizar las Condiciones del Mercado?')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                'Get a personalized market analysis for your specific property and neighborhood.',
                'Obtén un análisis de mercado personalizado para tu propiedad y vecindario específicos.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sellers/valuation"
                className="bg-[#C4A25A] text-white px-8 py-4 text-lg hover:bg-[#b3923f] transition-colors"
              >
                {t('Get Free Home Valuation', 'Obtener Valuación Gratuita')}
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 text-lg hover:bg-white hover:text-[#1B365D] transition-colors"
              >
                {t('Schedule Consultation', 'Programar Consulta')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
