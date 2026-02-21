"use client";

import { motion } from "framer-motion";

export default function Food() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 md:py-24 px-6 bg-[#E4DED4]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-4"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.08em',
              transform: 'scaleY(1.2)',
              transformOrigin: 'center',
            }}
          >
            FOOD AT THE TAPS
          </motion.h1>
          <div className="w-24 h-[2px] bg-[#1F1F1E] mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#5A5A56] text-lg md:text-xl max-w-2xl mx-auto"
          >
            Great beer deserves great food. Here's what's cooking.
          </motion.p>
        </div>
      </section>

      {/* Section 1: Build-Your-Own Salad Bar - Light Background */}
      <section className="py-16 md:py-24 px-6 bg-[#F3EFE8]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/palmetto-taps/salad-bar.png"
                alt="Build Your Own Salad Bar"
                className="w-full aspect-[4/3] object-cover rounded-lg shadow-lg"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-3">
                House Feature
              </p>
              <h2
                className="text-3xl md:text-5xl font-black uppercase mb-6"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.06em',
                  transform: 'scaleY(1.15)',
                  transformOrigin: 'top',
                }}
              >
                BUILD YOUR OWN<br />SALAD BAR
              </h2>
              <div className="space-y-4 text-[#3A3A38] text-lg leading-relaxed">
                <p>
                  Fresh greens. Loaded toppings. Made your way.
                </p>
                <p>
                  Our all-you-can-eat salad bar puts you in control. Load up your bowl with crisp greens, fresh veggies, proteins, and all the fixings.
                </p>
                <p className="font-semibold text-[#1F1F1E]">
                  Available daily.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Project Smashburger - Dark Background */}
      <section className="py-16 md:py-24 px-6 bg-[#1F1F1E]">
        <div className="max-w-6xl mx-auto">
          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <img
              src="/palmetto-taps/smashburger-web.png"
              alt="Project Smashburger"
              className="w-full max-w-3xl mx-auto rounded-lg shadow-lg object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-3">
              Kitchen Partner
            </p>
            <h2
              className="text-3xl md:text-5xl font-black uppercase mb-6 text-white"
              style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                letterSpacing: '0.06em',
                transform: 'scaleY(1.15)',
                transformOrigin: 'top',
              }}
            >
              PROJECT SMASHBURGER
            </h2>
            <div className="space-y-4 text-white/80 text-lg leading-relaxed">
              <p>
                We've partnered with Project Smashburger to bring you smashed-to-order burgers made right here in our kitchen. Each burger is crafted fresh with crispy edges, juicy centers, and the perfect char — the kind that pairs perfectly with a cold draft.
              </p>
              <p>
                Choose from our signature smashburgers or build your own with premium toppings. This isn't fast food. It's fresh food, made fast.
              </p>
            </div>

            {/* Hours Block */}
            <div className="mt-8 p-6 bg-[#2A2A2A] rounded-lg inline-block">
              <p className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-3">Hours</p>
              <div className="text-white/90 space-y-2">
                <p><strong>Monday - Thursday:</strong> 11am - 8pm</p>
                <p><strong>Friday - Saturday:</strong> 11am - 10pm</p>
                <p className="text-white/70 text-sm mt-3">(Shareable menu only after 8pm)</p>
                <p className="text-white/60 text-sm italic">Smashburgers are not available on Sundays</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Sundays & Kitchen Takeovers - Warm Light Background */}
      <section className="py-16 md:py-24 px-6 bg-[#D1CBC1]">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#E4DED4] p-8 md:p-12 shadow-lg text-center"
          >
            <img
              src="/palmetto-taps/pizza-squared.JPG"
              alt="Pizza Squared"
              className="w-full max-w-md mx-auto rounded mb-8 shadow-lg"
            />

            <p className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-3">
              Something Different
            </p>
            <h2
              className="text-2xl md:text-4xl font-black uppercase mb-6"
              style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                letterSpacing: '0.06em',
                transform: 'scaleY(1.15)',
                transformOrigin: 'top',
              }}
            >
              SUNDAYS
            </h2>
            <div className="space-y-4 text-[#3A3A38] text-lg leading-relaxed">
              <p>
                On Sundays, we offer our full salad bar and shareable menu items from 11am - 7pm. Perfect for a relaxed afternoon with friends.
              </p>
              <p>
                We also host rotating food trucks, guest chefs, and kitchen takeovers throughout the month. Follow along to see who's cooking next.
              </p>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="https://www.instagram.com/palmettotaps/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#1F1F1E] hover:bg-[#2F2F2D] text-white font-semibold px-6 py-3 rounded transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Follow on Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-6 bg-[#E4DED4]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#5A5A56] text-lg mb-6"
          >
            Ready to eat? Come hungry.
          </motion.p>
          <motion.a
            href="/contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-block bg-[#1F1F1E] hover:bg-[#2F2F2D] text-white font-semibold px-8 py-4 rounded transition-all duration-300 uppercase tracking-wide"
          >
            Plan Your Visit
          </motion.a>
        </div>
      </section>
    </div>
  );
}
