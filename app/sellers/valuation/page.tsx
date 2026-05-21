'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, CheckCircle } from 'lucide-react';
import Nav from '@/clients/danidiaz/components/Nav';
import Footer from '@/clients/danidiaz/components/Footer';
import { useLanguage } from '@/clients/danidiaz/components/LanguageContext';
import { supabase } from '@/lib/supabase';

export default function ValuationPage() {
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyType: 'single-family',
    yearBuilt: '',
    squareFootage: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('valuation_leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            property_type: formData.propertyType,
            year_built: formData.yearBuilt || null,
            square_footage: formData.squareFootage || null,
            message: formData.message || null,
            client_id: '3c125122-f3d9-4f75-91d9-69cf84d6d20e',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        propertyType: 'single-family',
        yearBuilt: '',
        squareFootage: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('There was an error submitting your request. Please try again.', 'Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.'));
    } finally {
      setLoading(false);
    }
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
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C4A25A] rounded-full mb-6">
              <Home size={32} className="text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold text-white mb-6">
              {t('Free Home Valuation', 'Valuación Gratuita de Casa')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'Discover what your home is worth in today\'s market with a comprehensive analysis from a local expert.',
                'Descubre cuánto vale tu casa en el mercado actual con un análisis completo de un experto local.'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C4A25A]/10 rounded-full mb-4">
                <CheckCircle size={24} className="text-[#C4A25A]" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-2">
                {t('100% Free', '100% Gratis')}
              </h3>
              <p className="text-[#3D3D3D] text-sm">
                {t('No obligation or commitment required', 'Sin obligación ni compromiso requerido')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C4A25A]/10 rounded-full mb-4">
                <CheckCircle size={24} className="text-[#C4A25A]" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-2">
                {t('Local Expertise', 'Experiencia Local')}
              </h3>
              <p className="text-[#3D3D3D] text-sm">
                {t('In-depth knowledge of Myrtle Beach market', 'Conocimiento profundo del mercado de Myrtle Beach')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C4A25A]/10 rounded-full mb-4">
                <CheckCircle size={24} className="text-[#C4A25A]" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#1B365D] mb-2">
                {t('Fast Response', 'Respuesta Rápida')}
              </h3>
              <p className="text-[#3D3D3D] text-sm">
                {t('Receive your analysis within 24 hours', 'Recibe tu análisis en 24 horas')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-2xl mx-auto px-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 shadow-lg text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-4">
                {t('Thank You!', '¡Gracias!')}
              </h2>
              <p className="text-[#3D3D3D] mb-6">
                {t(
                  'Your home valuation request has been received. I\'ll be in touch within 24 hours with your comprehensive market analysis.',
                  'Tu solicitud de valuación ha sido recibida. Me pondré en contacto dentro de 24 horas con tu análisis completo del mercado.'
                )}
              </p>
              <Link
                href="/sellers"
                className="inline-block bg-[#C4A25A] text-white px-8 py-3 hover:bg-[#b3923f] transition-colors"
              >
                {t('Back to Seller Resources', 'Volver a Recursos para Vendedores')}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white p-8 shadow-lg">
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-6 text-center">
                  {t('Request Your Free Valuation', 'Solicita Tu Valuación Gratuita')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                      {t('Full Name', 'Nombre Completo')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                      {t('Email Address', 'Correo Electrónico')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                      {t('Phone Number', 'Número de Teléfono')} *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                      {t('Property Address', 'Dirección de la Propiedad')} *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder={t('123 Main St, Myrtle Beach, SC', '123 Main St, Myrtle Beach, SC')}
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                      {t('Property Type', 'Tipo de Propiedad')} *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                    >
                      <option value="single-family">{t('Single Family Home', 'Casa Unifamiliar')}</option>
                      <option value="townhouse">{t('Townhouse', 'Casa Adosada')}</option>
                      <option value="condo">{t('Condominium', 'Condominio')}</option>
                      <option value="multi-family">{t('Multi-Family', 'Multifamiliar')}</option>
                      <option value="land">{t('Land', 'Terreno')}</option>
                      <option value="other">{t('Other', 'Otro')}</option>
                    </select>
                  </div>

                  {/* Year Built & Square Footage */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="yearBuilt" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                        {t('Year Built', 'Año de Construcción')}
                      </label>
                      <input
                        type="text"
                        id="yearBuilt"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleChange}
                        placeholder={t('e.g., 2005', 'ej., 2005')}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                      />
                    </div>
                    <div>
                      <label htmlFor="squareFootage" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                        {t('Square Footage', 'Pies Cuadrados')}
                      </label>
                      <input
                        type="text"
                        id="squareFootage"
                        name="squareFootage"
                        value={formData.squareFootage}
                        onChange={handleChange}
                        placeholder={t('e.g., 2000', 'ej., 2000')}
                        className="w-full px-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#3D3D3D] mb-2">
                      {t('Additional Information', 'Información Adicional')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder={t('Any additional details about your property...', 'Cualquier detalle adicional sobre tu propiedad...')}
                      className="w-full px-4 py-3 border border-[#D6BFAE] focus:outline-none focus:ring-2 focus:ring-[#C4A25A]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C4A25A] text-white px-8 py-4 text-lg font-semibold hover:bg-[#b3923f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('Submitting...', 'Enviando...') : t('Request Free Valuation', 'Solicitar Valuación Gratuita')}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-6">
              {t('Why Work With Me?', '¿Por Qué Trabajar Conmigo?')}
            </h2>
            <p className="text-[#3D3D3D] text-lg mb-8 max-w-2xl mx-auto">
              {t(
                'As a bilingual realtor with deep roots in the Myrtle Beach community, I provide personalized service and expert guidance throughout your home selling journey. From accurate pricing to strategic marketing, I\'m committed to getting you the best results.',
                'Como agente inmobiliaria bilingüe con raíces profundas en la comunidad de Myrtle Beach, proporciono servicio personalizado y orientación experta durante todo tu proceso de venta. Desde precios precisos hasta marketing estratégico, estoy comprometida a obtener los mejores resultados para ti.'
              )}
            </p>
            <Link
              href="/about"
              className="inline-block border-2 border-[#1B365D] text-[#1B365D] px-8 py-3 hover:bg-[#1B365D] hover:text-white transition-colors"
            >
              {t('Learn More About Me', 'Conoce Más Sobre Mí')}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
