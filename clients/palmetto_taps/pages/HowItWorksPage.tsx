"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 bg-[#E4DED4]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-6"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.08em',
              transform: 'scaleY(1.2)',
              transformOrigin: 'center',
            }}
          >
            HOW IT WORKS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#3A3A38] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8"
          >
            No waiting. No pressure.<br />
            Just you, 40+ taps, and the freedom to explore at your own pace.
          </motion.p>
          <div className="w-24 h-[2px] bg-[#1F1F1E] mx-auto" />
        </div>
      </section>

      {/* Section 1 — The Experience (Step Flow) */}
      <section className="py-16 md:py-24 px-6 bg-[#E4DED4]">
        <div className="max-w-5xl mx-auto">

          {/* Step 01 — Walk In */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 md:mb-28"
          >
            <div className="grid md:grid-cols-[120px_1fr_1fr] gap-6 md:gap-12 items-start">
              {/* Step Number */}
              <div className="text-6xl md:text-8xl font-black text-[#D1CBC1]" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                01
              </div>

              {/* Content */}
              <div className="md:pt-4">
                <h2
                  className="text-2xl md:text-4xl font-black uppercase mb-4"
                  style={{
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    letterSpacing: '0.06em',
                    transform: 'scaleY(1.15)',
                    transformOrigin: 'top',
                  }}
                >
                  WALK IN
                </h2>
                <div className="space-y-4 text-[#3A3A38] text-lg leading-relaxed">
                  <p>
                    Step through the doors, grab a seat, and settle in.
                  </p>
                  <p>
                    No reservations. No lines. Just show up and get comfortable.
                  </p>
                </div>
              </div>

              {/* Image Placeholder */}
              <div className="md:pt-4">
                <div className="w-full aspect-[8/5] bg-[#D1CBC1] rounded-lg flex items-center justify-center border-2 border-dashed border-[#8B6A4F]">
                  <div className="text-center text-[#6B6B66] p-4">
                    <p className="text-xs uppercase tracking-wide mb-1">Image Placeholder</p>
                    <p className="text-sm font-medium">Interior Taproom</p>
                    <p className="text-xs mt-1">800 x 500px</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 02 — Grab Your Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 md:mb-28"
          >
            <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start max-w-3xl">
              {/* Step Number */}
              <div className="text-6xl md:text-8xl font-black text-[#D1CBC1]" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                02
              </div>

              {/* Content */}
              <div className="md:pt-4">
                <h2
                  className="text-2xl md:text-4xl font-black uppercase mb-4"
                  style={{
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    letterSpacing: '0.06em',
                    transform: 'scaleY(1.15)',
                    transformOrigin: 'top',
                  }}
                >
                  GRAB YOUR CARD
                </h2>
                <div className="space-y-4 text-[#3A3A38] text-lg leading-relaxed mb-6">
                  <p>
                    Pick up your digital tap card at the front.
                  </p>
                  <p>
                    It's your key to every tap on the wall — pour as little or as much as you want.
                  </p>
                </div>

                {/* Image Placeholder */}
                <div className="w-full max-w-md aspect-[3/2] bg-[#D1CBC1] rounded-lg flex items-center justify-center border-2 border-dashed border-[#8B6A4F]">
                  <div className="text-center text-[#6B6B66] p-4">
                    <p className="text-xs uppercase tracking-wide mb-1">Image Placeholder</p>
                    <p className="text-sm font-medium">Tap Card Close-up</p>
                    <p className="text-xs mt-1">600 x 400px</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 03 — Scan & Select */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 md:mb-28"
          >
            <div className="grid md:grid-cols-[120px_1fr_1fr] gap-6 md:gap-12 items-start">
              {/* Step Number */}
              <div className="text-6xl md:text-8xl font-black text-[#D1CBC1]" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                03
              </div>

              {/* Content */}
              <div className="md:pt-4">
                <h2
                  className="text-2xl md:text-4xl font-black uppercase mb-4"
                  style={{
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    letterSpacing: '0.06em',
                    transform: 'scaleY(1.15)',
                    transformOrigin: 'top',
                  }}
                >
                  SCAN & SELECT
                </h2>
                <div className="space-y-4 text-[#3A3A38] text-lg leading-relaxed">
                  <p>
                    See something you like?
                  </p>
                  <p>
                    Scan your card, check the details on the screen, and decide if it's your next pour.
                  </p>
                  <p>
                    Styles, ABV, and tasting notes are right there — no guessing.
                  </p>
                </div>
              </div>

              {/* Image Placeholder */}
              <div className="md:pt-4">
                <div className="w-full aspect-[7/4.5] bg-[#D1CBC1] rounded-lg flex items-center justify-center border-2 border-dashed border-[#8B6A4F]">
                  <div className="text-center text-[#6B6B66] p-4">
                    <p className="text-xs uppercase tracking-wide mb-1">Image Placeholder</p>
                    <p className="text-sm font-medium">Tap Screen</p>
                    <p className="text-xs mt-1">700 x 450px</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 04 — Pour Your Way */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 md:mb-28"
          >
            <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start max-w-3xl">
              {/* Step Number */}
              <div className="text-6xl md:text-8xl font-black text-[#D1CBC1]" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                04
              </div>

              {/* Content */}
              <div className="md:pt-4 md:pb-8">
                <h2
                  className="text-2xl md:text-4xl font-black uppercase mb-4"
                  style={{
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    letterSpacing: '0.06em',
                    transform: 'scaleY(1.15)',
                    transformOrigin: 'top',
                  }}
                >
                  POUR YOUR WAY
                </h2>
                <div className="space-y-4 text-[#3A3A38] text-lg leading-relaxed">
                  <p>
                    Pour a splash, a flight, or a full glass.
                  </p>
                  <p>
                    You're in control the entire time.
                  </p>
                  <p>
                    Try something new. Go back to a favorite. Switch it up whenever you want.
                  </p>
                </div>
                {/* No image — let this step breathe */}
              </div>
            </div>
          </motion.div>

          {/* Step 05 — Pay & Relax */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 items-start">
              {/* Step Number */}
              <div className="text-6xl md:text-8xl font-black text-[#D1CBC1]" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                05
              </div>

              {/* Content */}
              <div className="md:pt-4">
                <h2
                  className="text-2xl md:text-4xl font-black uppercase mb-4"
                  style={{
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    letterSpacing: '0.06em',
                    transform: 'scaleY(1.15)',
                    transformOrigin: 'top',
                  }}
                >
                  PAY & RELAX
                </h2>
                <div className="space-y-4 text-[#3A3A38] text-lg leading-relaxed mb-8">
                  <p>
                    When you're done, bring your card back to the front.
                  </p>
                  <p>
                    You only pay for what you poured.
                  </p>
                  <p>
                    Then hang out, grab food, or head back to the wall.
                  </p>
                </div>

                {/* Image Placeholder - Full Width */}
                <div className="w-full aspect-[8/5] bg-[#D1CBC1] rounded-lg flex items-center justify-center border-2 border-dashed border-[#8B6A4F]">
                  <div className="text-center text-[#6B6B66] p-4">
                    <p className="text-xs uppercase tracking-wide mb-1">Image Placeholder</p>
                    <p className="text-sm font-medium">Guests Relaxing</p>
                    <p className="text-xs mt-1">800 x 500px</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Section Break — Background Shift */}
      <div className="w-full h-[2px] bg-[#C4BDB2]" />

      {/* Section 2 — Why Pour-Your-Own */}
      <section className="py-16 md:py-24 px-6 bg-[#D8D2C8]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black uppercase text-center mb-12 md:mb-16"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.06em',
              transform: 'scaleY(1.15)',
              transformOrigin: 'center',
            }}
          >
            Why people love pour-your-own
          </motion.h2>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#E4DED4] p-6 md:p-8 rounded-lg"
            >
              <h3
                className="text-xl md:text-2xl font-black uppercase mb-3"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                No waiting
              </h3>
              <p className="text-[#5A5A56] text-base leading-relaxed">
                No lines at the bar. No waiting for refills.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-[#E4DED4] p-6 md:p-8 rounded-lg"
            >
              <h3
                className="text-xl md:text-2xl font-black uppercase mb-3"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                No pressure
              </h3>
              <p className="text-[#5A5A56] text-base leading-relaxed">
                Taste before you commit. Take your time.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#E4DED4] p-6 md:p-8 rounded-lg"
            >
              <h3
                className="text-xl md:text-2xl font-black uppercase mb-3"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                Total control
              </h3>
              <p className="text-[#5A5A56] text-base leading-relaxed">
                You choose what you pour and how much.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="bg-[#E4DED4] p-6 md:p-8 rounded-lg"
            >
              <h3
                className="text-xl md:text-2xl font-black uppercase mb-3"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                Always something new
              </h3>
              <p className="text-[#5A5A56] text-base leading-relaxed">
                Rotating taps keep things interesting.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Break */}
      <div className="w-full h-[2px] bg-[#C4BDB2]" />

      {/* Section 3 — The Vibe */}
      <section className="py-16 md:py-24 px-6 bg-[#E4DED4]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black uppercase mb-8"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.06em',
              transform: 'scaleY(1.15)',
              transformOrigin: 'center',
            }}
          >
            It's not just about the beer
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6 text-[#3A3A38] text-lg leading-relaxed"
          >
            <p>
              Palmetto Taps is built for hanging out.
            </p>
            <p>
              Whether you're here for lunch, an event, a night out, or just one quick pour,
              the space is relaxed, welcoming, and easy to enjoy on your terms.
            </p>
            <p className="text-[#5A5A56] italic">
              Come for one. Stay for a few.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-6 bg-[#1F1F1E]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/90 text-xl md:text-2xl mb-8"
          >
            Explore the tap wall. Pour your way.
          </motion.p>
          <motion.a
            href="/"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-block bg-[#8B6A4F] hover:bg-[#A07D5C] text-white font-semibold px-8 py-4 rounded transition-all duration-300 uppercase tracking-wide"
          >
            See What's On Tap
          </motion.a>
        </div>
      </section>
    </div>
  );
}
