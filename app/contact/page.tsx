'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Nav from '@/components/Nav';
import { useLanguage } from '@/components/LanguageContext';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function ContactPage() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
    preferredLanguage: 'english'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual form submission (email notification)
    // For now, simulate a submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              {t('Contact Me', 'Contáctame')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                "Let's start a conversation about your real estate goals",
                "Comencemos una conversación sobre tus metas inmobiliarias"
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-6">
                {t("Let's Connect", 'Conectemos')}
              </h2>
              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-8">
                {t(
                  "Whether you're ready to buy, sell, or just have questions about the Myrtle Beach real estate market, I'm here to help. Reach out in whichever way is most convenient for you.",
                  "Ya sea que estés listo para comprar, vender, o simplemente tengas preguntas sobre el mercado inmobiliario de Myrtle Beach, estoy aquí para ayudar. Contáctame de la manera que te sea más conveniente."
                )}
              </p>

              {/* Contact Details */}
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#D6BFAE] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-1">
                      {t('Phone', 'Teléfono')}
                    </h3>
                    <a href="tel:+18435550123" className="text-[#3D3D3D] hover:text-[#C4A25A] transition-colors">
                      (843) 555-0123
                    </a>
                    <p className="text-sm text-[#3D3D3D]/60 mt-1">
                      {t('Call or text anytime', 'Llama o envía mensaje en cualquier momento')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#D6BFAE] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-1">
                      Email
                    </h3>
                    <a href="mailto:dani@fairclothrealestate.com" className="text-[#3D3D3D] hover:text-[#C4A25A] transition-colors">
                      dani@fairclothrealestate.com
                    </a>
                    <p className="text-sm text-[#3D3D3D]/60 mt-1">
                      {t('I respond within 24 hours', 'Respondo en menos de 24 horas')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#D6BFAE] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-1">
                      {t('Office', 'Oficina')}
                    </h3>
                    <p className="text-[#3D3D3D]">
                      Faircloth Real Estate Group
                    </p>
                    <p className="text-[#3D3D3D]">
                      1234 Kings Highway
                    </p>
                    <p className="text-[#3D3D3D]">
                      Myrtle Beach, SC 29577
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-[#F7F7F7] p-6">
                <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-4">
                  {t('Office Hours', 'Horario de Oficina')}
                </h3>
                <div className="space-y-2 text-[#3D3D3D]">
                  <div className="flex justify-between">
                    <span>{t('Monday - Friday', 'Lunes - Viernes')}</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Saturday', 'Sábado')}</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('Sunday', 'Domingo')}</span>
                    <span>{t('By Appointment', 'Con Cita')}</span>
                  </div>
                </div>
                <p className="text-sm text-[#3D3D3D]/60 mt-4">
                  {t(
                    '* Showings available outside office hours by appointment',
                    '* Visitas disponibles fuera de horario de oficina con cita'
                  )}
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {isSubmitted ? (
                <div className="bg-[#F7F7F7] p-12 text-center">
                  <div className="w-20 h-20 bg-[#C4A25A] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
                    {t('Message Sent!', '¡Mensaje Enviado!')}
                  </h3>
                  <p className="text-[#3D3D3D] mb-6">
                    {t(
                      "Thank you for reaching out. I'll get back to you within 24 hours.",
                      "Gracias por contactarme. Te responderé en menos de 24 horas."
                    )}
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        interest: '',
                        message: '',
                        preferredLanguage: 'english'
                      });
                    }}
                    className="text-[#C4A25A] hover:underline"
                  >
                    {t('Send another message', 'Enviar otro mensaje')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#F7F7F7] p-8">
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-6">
                    {t('Send a Message', 'Enviar un Mensaje')}
                  </h2>

                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm text-[#3D3D3D] mb-2">
                          {t('First Name', 'Nombre')} *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm text-[#3D3D3D] mb-2">
                          {t('Last Name', 'Apellido')} *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm text-[#3D3D3D] mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm text-[#3D3D3D] mb-2">
                          {t('Phone', 'Teléfono')}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="interest" className="block text-sm text-[#3D3D3D] mb-2">
                        {t("I'm interested in...", 'Estoy interesado en...')} *
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                      >
                        <option value="">{t('Select an option', 'Selecciona una opción')}</option>
                        <option value="buying">{t('Buying a home', 'Comprar una casa')}</option>
                        <option value="selling">{t('Selling my home', 'Vender mi casa')}</option>
                        <option value="both">{t('Both buying and selling', 'Comprar y vender')}</option>
                        <option value="valuation">{t('Free home valuation', 'Valuación gratuita')}</option>
                        <option value="info">{t('Just getting information', 'Solo obtener información')}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="preferredLanguage" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Preferred Language', 'Idioma Preferido')}
                      </label>
                      <select
                        id="preferredLanguage"
                        name="preferredLanguage"
                        value={formData.preferredLanguage}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors bg-white"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Español</option>
                        <option value="both">{t('Either / Both', 'Cualquiera / Ambos')}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm text-[#3D3D3D] mb-2">
                        {t('Message', 'Mensaje')} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:border-[#1B365D] focus:outline-none transition-colors resize-none bg-white"
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
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-[#D6BFAE]/30 relative">
        {/* TODO: Replace with actual map integration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-[#1B365D]/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[#3D3D3D]/60">
              {t('Map placeholder - Myrtle Beach, SC', 'Mapa - Myrtle Beach, SC')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B365D] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="font-[family-name:var(--font-playfair)] text-white text-xl mb-2">
                Dani Díaz
              </p>
              <p className="text-white/60 text-sm">
                {t('Bilingual Realtor® at Faircloth Real Estate Group', 'Agente Inmobiliaria Bilingüe en Faircloth Real Estate Group')}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-white/60 text-sm">
                © {new Date().getFullYear()} Dani Díaz. {t('All rights reserved.', 'Todos los derechos reservados.')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
