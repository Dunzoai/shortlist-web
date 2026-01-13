'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calculator, DollarSign, Info } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';

export default function NetProceedsPage() {
  const { language, t } = useLanguage();

  const [values, setValues] = useState({
    salePrice: '',
    mortgageBalance: '',
    commissionRate: '6',
    closingCosts: '2',
    homeWarranty: '500',
    repairs: '',
    propertyTax: '',
    hoaDues: '',
    otherCosts: ''
  });

  const [results, setResults] = useState({
    salePrice: 0,
    totalCosts: 0,
    netProceeds: 0,
    commission: 0,
    closingCosts: 0,
    mortgagePayoff: 0,
    otherExpenses: 0
  });

  useEffect(() => {
    calculateProceeds();
  }, [values]);

  const calculateProceeds = () => {
    const salePrice = parseFloat(values.salePrice) || 0;
    const mortgageBalance = parseFloat(values.mortgageBalance) || 0;
    const commissionRate = parseFloat(values.commissionRate) || 0;
    const closingCostsRate = parseFloat(values.closingCosts) || 0;
    const homeWarranty = parseFloat(values.homeWarranty) || 0;
    const repairs = parseFloat(values.repairs) || 0;
    const propertyTax = parseFloat(values.propertyTax) || 0;
    const hoaDues = parseFloat(values.hoaDues) || 0;
    const otherCosts = parseFloat(values.otherCosts) || 0;

    const commission = (salePrice * commissionRate) / 100;
    const closingCosts = (salePrice * closingCostsRate) / 100;
    const otherExpenses = homeWarranty + repairs + propertyTax + hoaDues + otherCosts;
    const totalCosts = commission + closingCosts + mortgageBalance + otherExpenses;
    const netProceeds = salePrice - totalCosts;

    setResults({
      salePrice,
      totalCosts,
      netProceeds,
      commission,
      closingCosts,
      mortgagePayoff: mortgageBalance,
      otherExpenses
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    setValues({
      ...values,
      [name]: numericValue
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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
              <Calculator size={32} className="text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold text-white mb-6">
              {t('Net Proceeds Calculator', 'Calculadora de Ganancias Netas')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Estimate how much money you\'ll receive from the sale of your home',
                'Estima cuánto dinero recibirás de la venta de tu casa'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white p-8 shadow-lg">
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-6">
                  {t('Enter Your Information', 'Ingresa Tu Información')}
                </h2>

                <div className="space-y-6">
                  {/* Sale Price */}
                  <div>
                    <label htmlFor="salePrice" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                      {t('Expected Sale Price', 'Precio de Venta Esperado')} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">$</span>
                      <input
                        type="text"
                        id="salePrice"
                        name="salePrice"
                        value={values.salePrice}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                      />
                    </div>
                  </div>

                  {/* Mortgage Balance */}
                  <div>
                    <label htmlFor="mortgageBalance" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                      {t('Outstanding Mortgage Balance', 'Saldo Hipotecario Pendiente')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">$</span>
                      <input
                        type="text"
                        id="mortgageBalance"
                        name="mortgageBalance"
                        value={values.mortgageBalance}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                      />
                    </div>
                  </div>

                  {/* Commission Rate */}
                  <div>
                    <label htmlFor="commissionRate" className="block text-sm font-semibold text-[#3D3D3D] mb-2 flex items-center gap-2">
                      {t('Real Estate Commission', 'Comisión Inmobiliaria')}
                      <div className="group relative">
                        <Info size={16} className="text-[#C4A25A] cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1B365D] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          {t('Typically 5-6% of the sale price, split between buyer and seller agents', 'Típicamente 5-6% del precio de venta, dividido entre agentes del comprador y vendedor')}
                        </div>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="commissionRate"
                        name="commissionRate"
                        value={values.commissionRate}
                        onChange={handleChange}
                        placeholder="6"
                        className="w-full pr-8 pl-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">%</span>
                    </div>
                  </div>

                  {/* Closing Costs */}
                  <div>
                    <label htmlFor="closingCosts" className="block text-sm font-semibold text-[#3D3D3D] mb-2 flex items-center gap-2">
                      {t('Closing Costs', 'Costos de Cierre')}
                      <div className="group relative">
                        <Info size={16} className="text-[#C4A25A] cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#1B365D] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          {t('Title fees, transfer taxes, attorney fees, etc. Typically 1-3% of sale price', 'Tarifas de título, impuestos de transferencia, honorarios de abogado, etc. Típicamente 1-3% del precio de venta')}
                        </div>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="closingCosts"
                        name="closingCosts"
                        value={values.closingCosts}
                        onChange={handleChange}
                        placeholder="2"
                        className="w-full pr-8 pl-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">%</span>
                    </div>
                  </div>

                  <div className="border-t border-[#D6BFAE] pt-6">
                    <h3 className="font-semibold text-[#3D3D3D] mb-4">
                      {t('Additional Costs (Optional)', 'Costos Adicionales (Opcional)')}
                    </h3>

                    {/* Home Warranty */}
                    <div className="mb-4">
                      <label htmlFor="homeWarranty" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Home Warranty', 'Garantía de Casa')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">$</span>
                        <input
                          type="text"
                          id="homeWarranty"
                          name="homeWarranty"
                          value={values.homeWarranty}
                          onChange={handleChange}
                          placeholder="500"
                          className="w-full pl-8 pr-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                        />
                      </div>
                    </div>

                    {/* Repairs */}
                    <div className="mb-4">
                      <label htmlFor="repairs" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Repairs/Improvements', 'Reparaciones/Mejoras')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">$</span>
                        <input
                          type="text"
                          id="repairs"
                          name="repairs"
                          value={values.repairs}
                          onChange={handleChange}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                        />
                      </div>
                    </div>

                    {/* Property Tax */}
                    <div className="mb-4">
                      <label htmlFor="propertyTax" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Prorated Property Tax', 'Impuesto Prorrateado')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">$</span>
                        <input
                          type="text"
                          id="propertyTax"
                          name="propertyTax"
                          value={values.propertyTax}
                          onChange={handleChange}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                        />
                      </div>
                    </div>

                    {/* HOA Dues */}
                    <div className="mb-4">
                      <label htmlFor="hoaDues" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('HOA Dues Owed', 'Cuotas de HOA Adeudadas')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">$</span>
                        <input
                          type="text"
                          id="hoaDues"
                          name="hoaDues"
                          value={values.hoaDues}
                          onChange={handleChange}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                        />
                      </div>
                    </div>

                    {/* Other Costs */}
                    <div>
                      <label htmlFor="otherCosts" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Other Costs', 'Otros Costos')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]">$</span>
                        <input
                          type="text"
                          id="otherCosts"
                          name="otherCosts"
                          value={values.otherCosts}
                          onChange={handleChange}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="bg-[#1B365D] p-8 shadow-lg text-white">
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl mb-6">
                  {t('Estimated Net Proceeds', 'Ganancias Netas Estimadas')}
                </h2>

                {/* Net Proceeds - Highlighted */}
                <div className="bg-[#C4A25A] p-6 rounded-lg mb-6">
                  <p className="text-white/80 text-sm mb-2">
                    {t('Your Estimated Proceeds', 'Tus Ganancias Estimadas')}
                  </p>
                  <p className="text-4xl font-bold font-[family-name:var(--font-playfair)]">
                    {formatCurrency(results.netProceeds)}
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-white/80">{t('Sale Price', 'Precio de Venta')}</span>
                    <span className="font-semibold">{formatCurrency(results.salePrice)}</span>
                  </div>

                  <div className="space-y-3 pl-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">{t('Commission', 'Comisión')} ({values.commissionRate}%)</span>
                      <span className="text-red-300">-{formatCurrency(results.commission)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">{t('Closing Costs', 'Costos de Cierre')} ({values.closingCosts}%)</span>
                      <span className="text-red-300">-{formatCurrency(results.closingCosts)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">{t('Mortgage Payoff', 'Pago de Hipoteca')}</span>
                      <span className="text-red-300">-{formatCurrency(results.mortgagePayoff)}</span>
                    </div>
                    {results.otherExpenses > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/60">{t('Other Expenses', 'Otros Gastos')}</span>
                        <span className="text-red-300">-{formatCurrency(results.otherExpenses)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/20 font-semibold">
                    <span>{t('Total Costs', 'Costos Totales')}</span>
                    <span className="text-red-300">-{formatCurrency(results.totalCosts)}</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-white/60 border-t border-white/20 pt-4">
                  <p>
                    {t(
                      '* This is an estimate only. Actual costs and proceeds may vary. Contact me for a detailed analysis of your specific situation.',
                      '* Esta es solo una estimación. Los costos y ganancias reales pueden variar. Contáctame para un análisis detallado de tu situación específica.'
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-6">
              {t('Want a More Accurate Estimate?', '¿Quieres una Estimación Más Precisa?')}
            </h2>
            <p className="text-[#3D3D3D] text-lg mb-8 max-w-2xl mx-auto">
              {t(
                'I can provide you with a detailed breakdown of all costs and help you maximize your net proceeds from the sale.',
                'Puedo proporcionarte un desglose detallado de todos los costos y ayudarte a maximizar tus ganancias netas de la venta.'
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
                className="border-2 border-[#1B365D] text-[#1B365D] px-8 py-4 text-lg hover:bg-[#1B365D] hover:text-white transition-colors"
              >
                {t('Contact Me', 'Contáctame')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
