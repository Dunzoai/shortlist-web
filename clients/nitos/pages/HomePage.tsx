'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FoodTruckTimeline } from '@/clients/nitos/components/FoodTruckTimeline';
import { ParallaxSection } from '@/clients/nitos/components/ParallaxSection';
import { AnimatedHero } from '@/clients/nitos/components/AnimatedHero';

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

// TODO: Replace with SmartPage API data - this is placeholder
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: 'savory' | 'sweet';
}

const menuItems: MenuItem[] = [
  // Savory
  {
    id: 1,
    name: 'Steak and Cheese Empanada',
    description: 'Shaved beef, American cheese, onions, and peppers',
    price: '$6',
    category: 'savory',
  },
  {
    id: 2,
    name: 'Mexican Street Corn Empanada',
    description: 'Corn, crema, cotija cheese, Tajin, onions, and Hot Cheetos',
    price: '$6',
    category: 'savory',
  },
  {
    id: 3,
    name: 'Bacon Cheeseburger Empanada',
    description: 'Ground beef, bacon, American cheese, and onions',
    price: '$6',
    category: 'savory',
  },
  {
    id: 4,
    name: 'Chicken Empanada',
    description: 'Chicken, cheddar cheese, onions, and peppers',
    price: '$6',
    category: 'savory',
  },
  {
    id: 5,
    name: 'Buffalo Chicken Empanada',
    description: 'Chicken marinated in buffalo sauce and cream cheese',
    price: '$6',
    category: 'savory',
  },
  // Sweet
  {
    id: 6,
    name: 'Guava and Brie Empanada',
    description: 'The name says it all!',
    price: '$4',
    category: 'sweet',
  },
  {
    id: 7,
    name: 'Pumpkin Pecan Cheesecake Empanada',
    description: 'The name says it all!',
    price: '$4',
    category: 'sweet',
  },
];

export function HomePage() {
  const [menuCategory, setMenuCategory] = useState<'savory' | 'sweet'>('savory');

  const filteredMenuItems = menuItems.filter(item => item.category === menuCategory);

  return (
    <main className="font-sans">
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* About Section */}
      <section className="py-24 bg-[#D4C5A9]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
              <div className="w-full aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/damian-truck-window.png"
                  alt="Damian at the Nito's Empanadas truck window"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2D5A3D] mb-8">
                The Name Behind the Truck
              </h2>

              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-6">
                I'm Damian — but this truck isn't named after me. It's named after my abuelo, Nito, who started making empanadas for his neighbors back in Uruguay in 1975. My dad carried on the tradition, and now it's my turn.
              </p>
              <p className="text-[#3D3D3D] text-lg leading-relaxed mb-6">
                I studied culinary, spent 15 years in construction, and one day realized: if I don't chase this now, I never will. So here we are. Same fold. Same fillings. Same love. Rolling through Myrtle Beach with the name that means the most to me.
              </p>

              <p className="text-[#2D5A3D] font-semibold text-lg mb-10">
                — Damian, Nito's Empanadas
              </p>

              <blockquote className="border-l-4 border-[#C4A052] pl-6 py-4 bg-white/50 rounded-r-xl">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#C4A052] italic">
                  "You want empanadas?"
                </p>
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Parallax - Empanada */}
      <ParallaxSection imageSrc="/empanada-paralax.png" />

      {/* Schedule Section */}
      <section id="schedule" className="py-24 bg-[#D4C5A9]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-[#2D5A3D] mb-8 text-center"
            >
              Where to Find Us
            </motion.h2>

            <motion.div variants={fadeInUp}>
              <FoodTruckTimeline />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Parallax - Truck Line */}
      <ParallaxSection imageSrc="/truck-line-paralax.png" />

      {/* Menu Section - Food Truck Order Window */}
      <section className="py-24 bg-[#2D5A3D]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
            >
              Our Menu
            </motion.h2>

            {/* Metal Frame Container */}
            <motion.div
              variants={fadeInUp}
              className="relative rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #8a8a8a 0%, #c0c0c0 10%, #a0a0a0 20%, #d4d4d4 50%, #a0a0a0 80%, #c0c0c0 90%, #8a8a8a 100%)',
                padding: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.2)',
              }}
            >
              {/* Inner metal border */}
              <div
                className="rounded-md overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #606060 0%, #909090 5%, #707070 95%, #505050 100%)',
                  padding: '8px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {/* Backlit Menu Board */}
                <div
                  className="rounded relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
                    boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(196, 160, 82, 0.1)',
                  }}
                >
                  {/* Subtle backlight glow */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(196, 160, 82, 0.3) 0%, transparent 70%)',
                    }}
                  />

                  <div className="relative z-10 p-8">
                    {/* Toggle Tabs */}
                    <div className="flex justify-center gap-4 mb-8">
                      <button
                        onClick={() => setMenuCategory('savory')}
                        className="relative px-8 py-3 font-bold text-sm uppercase tracking-widest transition-all duration-300"
                        style={{
                          background: menuCategory === 'savory'
                            ? 'linear-gradient(180deg, #d4d4d4 0%, #a0a0a0 50%, #b8b8b8 100%)'
                            : 'linear-gradient(180deg, #404040 0%, #2a2a2a 50%, #353535 100%)',
                          color: menuCategory === 'savory' ? '#1a1a1a' : '#666666',
                          boxShadow: menuCategory === 'savory'
                            ? '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)'
                            : 'inset 0 2px 4px rgba(0,0,0,0.5)',
                          borderRadius: '4px',
                          border: menuCategory === 'savory' ? '1px solid #888' : '1px solid #333',
                        }}
                      >
                        Savory
                      </button>
                      <button
                        onClick={() => setMenuCategory('sweet')}
                        className="relative px-8 py-3 font-bold text-sm uppercase tracking-widest transition-all duration-300"
                        style={{
                          background: menuCategory === 'sweet'
                            ? 'linear-gradient(180deg, #d4d4d4 0%, #a0a0a0 50%, #b8b8b8 100%)'
                            : 'linear-gradient(180deg, #404040 0%, #2a2a2a 50%, #353535 100%)',
                          color: menuCategory === 'sweet' ? '#1a1a1a' : '#666666',
                          boxShadow: menuCategory === 'sweet'
                            ? '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)'
                            : 'inset 0 2px 4px rgba(0,0,0,0.5)',
                          borderRadius: '4px',
                          border: menuCategory === 'sweet' ? '1px solid #888' : '1px solid #333',
                        }}
                      >
                        Sweet
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="min-h-[320px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={menuCategory}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          {filteredMenuItems.map((item) => (
                            <div key={item.id} className="border-b border-white/10 pb-5 last:border-b-0">
                              <div className="flex justify-between items-baseline mb-2">
                                <h3
                                  className="text-xl md:text-2xl font-bold"
                                  style={{
                                    color: '#C4A052',
                                    textShadow: '0 0 20px rgba(196, 160, 82, 0.5), 0 0 40px rgba(196, 160, 82, 0.3)',
                                  }}
                                >
                                  {item.name}
                                </h3>
                                <span
                                  className="text-xl font-bold ml-4 shrink-0"
                                  style={{
                                    color: '#C4A052',
                                    textShadow: '0 0 20px rgba(196, 160, 82, 0.5), 0 0 40px rgba(196, 160, 82, 0.3)',
                                  }}
                                >
                                  {item.price}
                                </span>
                              </div>
                              <p
                                className="text-sm md:text-base"
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                                }}
                              >
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#D4C5A9] py-16 border-t border-[#C4A052]/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-[#2D5A3D] mb-6">
              Nito's Empanadas
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-[#4A5A3C]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hello@nitosempanadas.com</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-[#4A5A3C]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-[#4A5A3C]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Myrtle Beach, SC</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4 mb-8">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[#2D5A3D] flex items-center justify-center text-white hover:bg-[#C4A052] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[#2D5A3D] flex items-center justify-center text-white hover:bg-[#C4A052] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-[#2D5A3D] flex items-center justify-center text-white hover:bg-[#C4A052] transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>

            <p className="text-[#4A5A3C]/60 text-sm">
              © {new Date().getFullYear()} Nito's Empanadas. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
