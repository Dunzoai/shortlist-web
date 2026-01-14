'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FoodTruckTimeline } from '@/clients/nitos/components/FoodTruckTimeline';

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

// Placeholder empanada menu items
const menuItems = [
  {
    id: 1,
    name: 'Beef Empanada',
    description: 'Seasoned ground beef with onions, peppers, and traditional spices',
    price: '$4.50'
  },
  {
    id: 2,
    name: 'Chicken Empanada',
    description: 'Tender shredded chicken with a blend of herbs and vegetables',
    price: '$4.50'
  },
  {
    id: 3,
    name: 'Veggie Empanada',
    description: 'Fresh vegetables with cheese and aromatic seasonings',
    price: '$4.00'
  }
];

export function HomePage() {
  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById('schedule');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D5A3D] via-[#1E3D29] to-[#152A1C]">
        {/* Decorative overlay pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            Nito's Empanadas
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light tracking-wide">
            Flavors of the World. Straight to Your Hands.
          </p>

          <button
            onClick={scrollToSchedule}
            className="bg-[#F5A623] hover:bg-[#E09000] text-white px-8 py-4 text-lg font-semibold tracking-wide transition-colors rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Find Us This Week
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6 text-white/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-24 bg-[#FFFBF5]">
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

      {/* Menu Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-[#2D5A3D] mb-16 text-center"
            >
              Our Menu
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="grid md:grid-cols-3 gap-8"
            >
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FFFBF5] rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Placeholder empanada image */}
                  <div className="w-full h-48 bg-gradient-to-br from-[#F5A623] to-[#E09000] rounded-xl mb-6 flex items-center justify-center">
                    <span className="text-6xl">🥟</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2D5A3D] mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <p className="text-xl font-bold text-[#F5A623]">
                    {item.price}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#2D5A3D]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
              {/* TODO: Replace with actual photo of Damian */}
              <div className="w-full aspect-square bg-gradient-to-br from-[#1E3D29] to-[#152A1C] rounded-2xl flex items-center justify-center">
                <div className="text-center text-white/60">
                  <div className="text-8xl mb-4">👨‍🍳</div>
                  <p className="text-sm">Photo placeholder</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet Damian
              </h2>

              {/* TODO: Pull bio from web_clients table */}
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                Born with a passion for bringing people together through food, Damian started Nito's Empanadas to share the authentic flavors of his heritage with the community.
              </p>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                Each empanada is handcrafted with love, using family recipes passed down through generations. From our kitchen to your hands, we bring you a taste of tradition.
              </p>

              <blockquote className="border-l-4 border-[#F5A623] pl-6 py-2">
                <p className="text-2xl md:text-3xl font-bold text-[#F5A623] italic">
                  "You want empanadas?"
                </p>
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#152A1C] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Nito's Empanadas
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-white/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hello@nitosempanadas.com</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/80">
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
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#F5A623] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#F5A623] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#F5A623] transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>

            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Nito's Empanadas. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
