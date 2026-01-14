'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ClipboardCheck, CheckCircle, Circle, Download } from 'lucide-react';
import Nav from '@/clients/danidiaz/components/Nav';
import Footer from '@/clients/danidiaz/components/Footer';
import { useLanguage } from '@/clients/danidiaz/components/LanguageContext';

interface ChecklistItem {
  id: string;
  titleEn: string;
  titleEs: string;
  descEn?: string;
  descEs?: string;
}

interface ChecklistSection {
  titleEn: string;
  titleEs: string;
  items: ChecklistItem[];
}

const checklistSections: ChecklistSection[] = [
  {
    titleEn: 'Getting Started',
    titleEs: 'Comenzando',
    items: [
      {
        id: '1-1',
        titleEn: 'Research local real estate market conditions',
        titleEs: 'Investiga las condiciones del mercado inmobiliario local'
      },
      {
        id: '1-2',
        titleEn: 'Review your mortgage and understand payoff amount',
        titleEs: 'Revisa tu hipoteca y entiende el monto a pagar'
      },
      {
        id: '1-3',
        titleEn: 'Gather important documents (deed, mortgage, warranties)',
        titleEs: 'Reúne documentos importantes (escritura, hipoteca, garantías)'
      },
      {
        id: '1-4',
        titleEn: 'Interview and select a real estate agent',
        titleEs: 'Entrevista y selecciona un agente inmobiliario'
      },
      {
        id: '1-5',
        titleEn: 'Discuss pricing strategy with your agent',
        titleEs: 'Discute estrategia de precios con tu agente'
      }
    ]
  },
  {
    titleEn: 'Preparing Your Home',
    titleEs: 'Preparando Tu Casa',
    items: [
      {
        id: '2-1',
        titleEn: 'Deep clean entire house (or hire professionals)',
        titleEs: 'Limpieza profunda de toda la casa (o contrata profesionales)'
      },
      {
        id: '2-2',
        titleEn: 'Declutter and depersonalize all rooms',
        titleEs: 'Organiza y despersonaliza todas las habitaciones'
      },
      {
        id: '2-3',
        titleEn: 'Make necessary repairs (leaky faucets, cracked tiles, etc.)',
        titleEs: 'Haz reparaciones necesarias (grifos que gotean, azulejos agrietados, etc.)'
      },
      {
        id: '2-4',
        titleEn: 'Paint walls in neutral colors',
        titleEs: 'Pinta las paredes en colores neutros'
      },
      {
        id: '2-5',
        titleEn: 'Enhance curb appeal (lawn, landscaping, front door)',
        titleEs: 'Mejora el atractivo exterior (césped, paisajismo, puerta frontal)'
      },
      {
        id: '2-6',
        titleEn: 'Clean windows inside and out',
        titleEs: 'Limpia ventanas por dentro y por fuera'
      },
      {
        id: '2-7',
        titleEn: 'Remove excess furniture to make rooms appear larger',
        titleEs: 'Retira muebles excesivos para hacer que las habitaciones parezcan más grandes'
      },
      {
        id: '2-8',
        titleEn: 'Consider professional staging',
        titleEs: 'Considera la preparación profesional'
      }
    ]
  },
  {
    titleEn: 'Before Listing',
    titleEs: 'Antes de Listar',
    items: [
      {
        id: '3-1',
        titleEn: 'Schedule professional photography',
        titleEs: 'Programa fotografía profesional'
      },
      {
        id: '3-2',
        titleEn: 'Consider video walkthrough or virtual tour',
        titleEs: 'Considera video recorrido o tour virtual'
      },
      {
        id: '3-3',
        titleEn: 'Write compelling property description with your agent',
        titleEs: 'Escribe una descripción atractiva de la propiedad con tu agente'
      },
      {
        id: '3-4',
        titleEn: 'Review and sign listing agreement',
        titleEs: 'Revisa y firma el acuerdo de listado'
      },
      {
        id: '3-5',
        titleEn: 'Decide on showing schedule and access method',
        titleEs: 'Decide el horario de visitas y método de acceso'
      },
      {
        id: '3-6',
        titleEn: 'Plan where you\'ll go during showings',
        titleEs: 'Planifica dónde estarás durante las visitas'
      }
    ]
  },
  {
    titleEn: 'During Active Listing',
    titleEs: 'Durante el Listado Activo',
    items: [
      {
        id: '4-1',
        titleEn: 'Keep home clean and show-ready at all times',
        titleEs: 'Mantén la casa limpia y lista para mostrar en todo momento'
      },
      {
        id: '4-2',
        titleEn: 'Be flexible with showing times',
        titleEs: 'Sé flexible con los horarios de visita'
      },
      {
        id: '4-3',
        titleEn: 'Leave during showings to let buyers explore freely',
        titleEs: 'Sal durante las visitas para que los compradores exploren libremente'
      },
      {
        id: '4-4',
        titleEn: 'Review feedback from showings with your agent',
        titleEs: 'Revisa comentarios de las visitas con tu agente'
      },
      {
        id: '4-5',
        titleEn: 'Stay in regular communication with your agent',
        titleEs: 'Mantén comunicación regular con tu agente'
      },
      {
        id: '4-6',
        titleEn: 'Be prepared to adjust price if necessary',
        titleEs: 'Prepárate para ajustar el precio si es necesario'
      }
    ]
  },
  {
    titleEn: 'Under Contract',
    titleEs: 'Bajo Contrato',
    items: [
      {
        id: '5-1',
        titleEn: 'Review and respond to buyer\'s offer with your agent',
        titleEs: 'Revisa y responde a la oferta del comprador con tu agente'
      },
      {
        id: '5-2',
        titleEn: 'Negotiate terms if needed',
        titleEs: 'Negocia términos si es necesario'
      },
      {
        id: '5-3',
        titleEn: 'Prepare for home inspection',
        titleEs: 'Prepárate para la inspección de la casa'
      },
      {
        id: '5-4',
        titleEn: 'Review inspection report and negotiate repairs',
        titleEs: 'Revisa el informe de inspección y negocia reparaciones'
      },
      {
        id: '5-5',
        titleEn: 'Complete agreed-upon repairs',
        titleEs: 'Completa las reparaciones acordadas'
      },
      {
        id: '5-6',
        titleEn: 'Prepare for appraisal',
        titleEs: 'Prepárate para la tasación'
      },
      {
        id: '5-7',
        titleEn: 'Gather requested documents for closing',
        titleEs: 'Reúne los documentos solicitados para el cierre'
      },
      {
        id: '5-8',
        titleEn: 'Start planning your move',
        titleEs: 'Comienza a planificar tu mudanza'
      }
    ]
  },
  {
    titleEn: 'Before Closing',
    titleEs: 'Antes del Cierre',
    items: [
      {
        id: '6-1',
        titleEn: 'Review closing disclosure carefully',
        titleEs: 'Revisa la divulgación de cierre cuidadosamente'
      },
      {
        id: '6-2',
        titleEn: 'Schedule moving company or truck rental',
        titleEs: 'Programa empresa de mudanzas o alquiler de camión'
      },
      {
        id: '6-3',
        titleEn: 'Transfer or cancel utilities',
        titleEs: 'Transfiere o cancela servicios públicos'
      },
      {
        id: '6-4',
        titleEn: 'Forward mail to new address',
        titleEs: 'Reenvía el correo a la nueva dirección'
      },
      {
        id: '6-5',
        titleEn: 'Complete final walkthrough with buyers',
        titleEs: 'Completa el recorrido final con los compradores'
      },
      {
        id: '6-6',
        titleEn: 'Remove all personal belongings',
        titleEs: 'Retira todas las pertenencias personales'
      },
      {
        id: '6-7',
        titleEn: 'Leave appliance manuals, warranties, and garage door openers',
        titleEs: 'Deja manuales de electrodomésticos, garantías y controles de garaje'
      },
      {
        id: '6-8',
        titleEn: 'Do final cleaning of the property',
        titleEs: 'Haz limpieza final de la propiedad'
      }
    ]
  },
  {
    titleEn: 'Closing Day',
    titleEs: 'Día del Cierre',
    items: [
      {
        id: '7-1',
        titleEn: 'Bring photo ID to closing',
        titleEs: 'Lleva identificación con foto al cierre'
      },
      {
        id: '7-2',
        titleEn: 'Review and sign all closing documents',
        titleEs: 'Revisa y firma todos los documentos de cierre'
      },
      {
        id: '7-3',
        titleEn: 'Hand over all keys, remotes, and access codes',
        titleEs: 'Entrega todas las llaves, controles y códigos de acceso'
      },
      {
        id: '7-4',
        titleEn: 'Receive your proceeds check or wire transfer',
        titleEs: 'Recibe tu cheque de ganancias o transferencia bancaria'
      },
      {
        id: '7-5',
        titleEn: 'Celebrate your successful sale!',
        titleEs: '¡Celebra tu venta exitosa!'
      }
    ]
  }
];

export default function ChecklistPage() {
  const { language, t } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleToggle = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const totalItems = checklistSections.reduce((sum, section) => sum + section.items.length, 0);
  const completedItems = checkedItems.size;
  const progressPercentage = (completedItems / totalItems) * 100;

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
              <ClipboardCheck size={32} className="text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold text-white mb-6">
              {t('Seller Checklist', 'Lista de Verificación del Vendedor')}
            </h1>
            <p className="text-[#D6BFAE] text-xl max-w-2xl mx-auto">
              {t(
                'A comprehensive step-by-step guide to prepare your home for a successful sale',
                'Una guía completa paso a paso para preparar tu casa para una venta exitosa'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-8 bg-white border-b border-[#D6BFAE]/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-4">
            <p className="text-[#3D3D3D] text-lg">
              {t('Your Progress', 'Tu Progreso')}: <span className="font-semibold text-[#C4A25A]">{completedItems}</span> {t('of', 'de')} <span className="font-semibold">{totalItems}</span> {t('completed', 'completados')}
            </p>
          </div>
          <div className="w-full bg-[#F7F7F7] h-4 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#C4A25A]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </section>

      {/* Checklist Sections */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            {checklistSections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              >
                <div className="bg-white shadow-lg p-8">
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-6 flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-[#C4A25A] text-white rounded-full text-lg font-bold">
                      {sectionIndex + 1}
                    </span>
                    {language === 'en' ? section.titleEn : section.titleEs}
                  </h2>

                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 rounded hover:bg-[#F7F7F7] transition-colors cursor-pointer"
                        onClick={() => handleToggle(item.id)}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {checkedItems.has(item.id) ? (
                            <CheckCircle size={24} className="text-[#C4A25A]" />
                          ) : (
                            <Circle size={24} className="text-[#D6BFAE]" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className={`text-[#3D3D3D] ${checkedItems.has(item.id) ? 'line-through opacity-60' : ''}`}>
                            {language === 'en' ? item.titleEn : item.titleEs}
                          </p>
                          {item.descEn && item.descEs && (
                            <p className="text-sm text-[#3D3D3D]/60 mt-1">
                              {language === 'en' ? item.descEn : item.descEs}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Download/Print Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-[#3D3D3D] mb-4">
              {t('Want to save this checklist?', '¿Quieres guardar esta lista?')}
            </p>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-[#1B365D] text-white px-6 py-3 hover:bg-[#2a4d7f] transition-colors"
            >
              <Download size={20} />
              {t('Print Checklist', 'Imprimir Lista')}
            </button>
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
              {t('Need Help Selling Your Home?', '¿Necesitas Ayuda para Vender Tu Casa?')}
            </h2>
            <p className="text-[#D6BFAE] text-lg mb-8">
              {t(
                'I\'ll guide you through every step of the process and help you achieve the best results.',
                'Te guiaré en cada paso del proceso y te ayudaré a lograr los mejores resultados.'
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
