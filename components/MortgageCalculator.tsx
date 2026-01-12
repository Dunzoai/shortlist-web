'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function MortgageCalculator() {
  const { t } = useLanguage();
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [isPercentMode, setIsPercentMode] = useState(true);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  // Update down payment based on mode
  const handleHomePriceChange = (value: number) => {
    setHomePrice(value);
    if (isPercentMode) {
      setDownPayment((value * downPaymentPercent) / 100);
    }
  };

  const handleDownPaymentChange = (value: number) => {
    if (isPercentMode) {
      setDownPaymentPercent(value);
      setDownPayment((homePrice * value) / 100);
    } else {
      setDownPayment(value);
      setDownPaymentPercent((value / homePrice) * 100);
    }
  };

  const toggleDownPaymentMode = () => {
    setIsPercentMode(!isPercentMode);
  };

  // Calculate monthly payment
  // M = P[r(1+r)^n]/[(1+r)^n-1]
  const calculateMonthlyPayment = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const monthlyPayment =
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalLoanAmount = homePrice - downPayment;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Home Price */}
          <div>
            <label className="block text-sm font-semibold text-[#1B365D] mb-2">
              {t('Home Price', 'Precio de la Casa')}
            </label>
            <input
              type="number"
              value={homePrice}
              onChange={(e) => handleHomePriceChange(Number(e.target.value))}
              className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
              min="100000"
              max="2000000"
              step="10000"
            />
            <input
              type="range"
              value={homePrice}
              onChange={(e) => handleHomePriceChange(Number(e.target.value))}
              className="w-full mt-2"
              min="100000"
              max="2000000"
              step="10000"
              style={{
                accentColor: '#1B365D'
              }}
            />
            <div className="flex justify-between text-xs text-[#3D3D3D] mt-1">
              <span>$100K</span>
              <span>$2M</span>
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-[#1B365D]">
                {t('Down Payment', 'Pago Inicial')}
              </label>
              <button
                onClick={toggleDownPaymentMode}
                className="text-xs bg-[#C4A25A] text-white px-3 py-1 rounded hover:bg-[#1B365D] transition-colors"
              >
                {isPercentMode ? '$' : '%'}
              </button>
            </div>
            <input
              type="number"
              value={isPercentMode ? downPaymentPercent : downPayment}
              onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
              className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
              min={isPercentMode ? 0 : 0}
              max={isPercentMode ? 100 : homePrice}
              step={isPercentMode ? 1 : 1000}
            />
            <div className="text-sm text-[#3D3D3D] mt-2">
              {isPercentMode
                ? `$${downPayment.toLocaleString()}`
                : `${downPaymentPercent.toFixed(1)}%`}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-semibold text-[#1B365D] mb-2">
              {t('Interest Rate', 'Tasa de Interés')} (%)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors"
              min="0"
              max="20"
              step="0.1"
            />
            <input
              type="range"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full mt-2"
              min="0"
              max="20"
              step="0.1"
              style={{
                accentColor: '#1B365D'
              }}
            />
            <div className="flex justify-between text-xs text-[#3D3D3D] mt-1">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-semibold text-[#1B365D] mb-2">
              {t('Loan Term', 'Plazo del Préstamo')}
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setLoanTerm(15)}
                className={`flex-1 py-3 border-2 transition-colors ${
                  loanTerm === 15
                    ? 'border-[#1B365D] bg-[#1B365D] text-white'
                    : 'border-[#D6BFAE] text-[#3D3D3D] hover:border-[#1B365D]'
                }`}
              >
                {t('15 Years', '15 Años')}
              </button>
              <button
                onClick={() => setLoanTerm(30)}
                className={`flex-1 py-3 border-2 transition-colors ${
                  loanTerm === 30
                    ? 'border-[#1B365D] bg-[#1B365D] text-white'
                    : 'border-[#D6BFAE] text-[#3D3D3D] hover:border-[#1B365D]'
                }`}
              >
                {t('30 Years', '30 Años')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="bg-[#F7F7F7] p-6 rounded-lg mb-6">
              <p className="text-sm text-[#3D3D3D] mb-2">
                {t('Estimated Monthly Payment', 'Pago Mensual Estimado')}
              </p>
              <p className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] font-bold">
                ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-[#3D3D3D] mt-2">
                {t('Principal & Interest only', 'Solo capital e intereses')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-[#D6BFAE]">
                <span className="text-[#3D3D3D]">{t('Home Price', 'Precio de la Casa')}</span>
                <span className="font-semibold text-[#1B365D]">
                  ${homePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#D6BFAE]">
                <span className="text-[#3D3D3D]">{t('Down Payment', 'Pago Inicial')}</span>
                <span className="font-semibold text-[#1B365D]">
                  ${downPayment.toLocaleString()} ({downPaymentPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#D6BFAE]">
                <span className="text-[#3D3D3D]">{t('Loan Amount', 'Monto del Préstamo')}</span>
                <span className="font-semibold text-[#1B365D]">
                  ${totalLoanAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#D6BFAE]">
                <span className="text-[#3D3D3D]">{t('Interest Rate', 'Tasa de Interés')}</span>
                <span className="font-semibold text-[#1B365D]">{interestRate}%</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#D6BFAE]">
                <span className="text-[#3D3D3D]">{t('Loan Term', 'Plazo')}</span>
                <span className="font-semibold text-[#1B365D]">
                  {loanTerm} {t('years', 'años')}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <p className="text-sm text-[#3D3D3D] mb-4">
              {t(
                'Ready to take the next step? Get pre-approved and start your home search with confidence.',
                '¿Listo para dar el siguiente paso? Obtén una pre-aprobación y comienza tu búsqueda con confianza.'
              )}
            </p>
            <Link
              href="/#contact"
              className="block w-full bg-[#C4A25A] text-white px-6 py-4 text-center hover:bg-[#1B365D] transition-colors"
            >
              {t('Get Pre-Approved - Talk to Dani', 'Obtén Pre-Aprobación - Habla con Dani')}
            </Link>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-[#D6BFAE]">
        <p className="text-xs text-[#3D3D3D] text-center">
          {t(
            'This calculator provides an estimate only. Actual monthly payment may vary based on property taxes, insurance, HOA fees, and other factors. Contact Dani for a detailed breakdown.',
            'Esta calculadora proporciona solo una estimación. El pago mensual real puede variar según los impuestos a la propiedad, seguros, tarifas de HOA y otros factores. Contacta a Dani para un desglose detallado.'
          )}
        </p>
      </div>
    </div>
  );
}
