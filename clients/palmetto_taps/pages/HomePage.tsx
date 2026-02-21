"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { business, features, alwaysOnTap } from "@/clients/palmetto_taps/content/business";
import AccordionItem from "@/clients/palmetto_taps/components/AccordionItem";
import AgeVerification from "@/clients/palmetto_taps/components/AgeVerification";
import { WeeklyEventsPreview } from "@/clients/palmetto_taps/components/WeeklyEventsPreview";

// Reusable noise texture overlay component
function NoiseTexture({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function FeaturedDrinksCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alwaysOnTap.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const prevIdx = (currentIndex - 1 + alwaysOnTap.length) % alwaysOnTap.length;
  const nextIdx = (currentIndex + 1) % alwaysOnTap.length;

  return (
    <section className="py-12 md:py-24 px-6 bg-[#E4DED4] overflow-hidden relative shadow-[inset_0_8px_20px_-10px_rgba(0,0,0,0.1)]">
      <NoiseTexture opacity={0.06} />
      {/* Background Image - Mobile */}
      <div
        className="absolute inset-x-0 top-40 bottom-0 opacity-40 contrast-125 md:hidden"
        style={{
          backgroundImage: "url('/clients/palmetto_taps/taps_sketch.png')",
          backgroundPosition: "center 39%",
          backgroundSize: "180%",
          backgroundRepeat: "no-repeat"
        }}
      />
      {/* Background Image - Desktop */}
      <div
        className="absolute inset-x-0 top-32 bottom-[25%] opacity-40 contrast-125 hidden md:block overflow-hidden"
      >
        <img
          src="/clients/palmetto_taps/taps_sketch.png"
          alt=""
          className="w-[120%] absolute bottom-0 left-1/2 -translate-x-1/2"
        />
      </div>
      {/* Noise texture overlay */}
      <div
        className="absolute inset-x-0 top-32 bottom-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Vignette overlay - deeper */}
      <div className="absolute inset-x-0 top-32 bottom-0 bg-[radial-gradient(circle_at_center,transparent_10%,#E4DED4_55%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="w-full h-[2px] bg-[#1F1F1E] mb-6" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold uppercase tracking-widest font-heading"
          >
            What We're Pouring
          </motion.h2>
          <div className="w-full h-[2px] bg-[#1F1F1E] mt-6 mb-4" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#5A5A56] text-lg font-medium"
          >
            40+ rotating taps to explore but these never leave the wall.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="flex justify-center items-end gap-2 md:gap-8 max-w-5xl mx-auto h-[350px] md:h-[450px]">
          {/* Left Beer - Grayscale */}
          <div className="flex flex-col items-end justify-end h-full">
            <img
              src={alwaysOnTap[prevIdx].image}
              alt={alwaysOnTap[prevIdx].name}
              className="w-24 md:w-40 h-auto max-h-[200px] md:max-h-[280px] object-contain opacity-50"
              style={{
                filter: 'grayscale(0.7) sepia(0.2) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
              }}
            />
          </div>

          {/* Center Beer - Full color with name card */}
          <div className="flex flex-col items-center justify-end h-full">
            {/* Digital Tap Screen Card */}
            <div className="mb-2">
              <div className="bg-[#1F1F1E] border-2 border-[#8B6A4F] rounded-lg px-4 py-3 min-w-[180px] md:min-w-[260px]"
                style={{
                  boxShadow: '0 8px 20px rgba(139, 106, 79, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <p className="text-[#8B6A4F] text-xs uppercase tracking-widest mb-1 text-center">Now Pouring</p>
                <h3 className="text-white font-bold text-sm md:text-lg uppercase tracking-wide text-center h-[40px] md:h-[56px] flex items-center justify-center">
                  {alwaysOnTap[currentIndex].name}
                </h3>
              </div>
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#8B6A4F] mx-auto" />
            </div>
            <img
              src={alwaysOnTap[currentIndex].image}
              alt={alwaysOnTap[currentIndex].name}
              className="w-48 md:w-72 h-auto max-h-[200px] md:max-h-[300px] object-contain"
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.6)) drop-shadow(0 10px 20px rgba(139, 106, 79, 0.2))',
              }}
            />
          </div>

          {/* Right Beer - Grayscale */}
          <div className="flex flex-col items-start justify-end h-full">
            <img
              src={alwaysOnTap[nextIdx].image}
              alt={alwaysOnTap[nextIdx].name}
              className="w-24 md:w-40 h-auto max-h-[200px] md:max-h-[280px] object-contain opacity-50"
              style={{
                filter: 'grayscale(0.7) sepia(0.2) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
              }}
            />
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {alwaysOnTap.map((beer, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-[#8B6A4F] w-6"
                  : "bg-neutral-400 hover:bg-neutral-600 w-2"
              }`}
              aria-label={`Go to ${beer.name}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <a
            href="https://untappd.com/v/palmetto-taps/12893204"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1F1F1E] hover:bg-[#2F2F2D] text-white font-semibold px-8 py-4 rounded transition-all duration-300 hover:scale-105 inline-block uppercase tracking-wide"
          >
            View All 40+ Taps
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <>
      <AgeVerification />
      <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - 2.4:1 aspect ratio video (1920x800) */}
      <section className="relative w-full flex items-center justify-center overflow-hidden bg-[#1F1F1E]" style={{ aspectRatio: '1920/800' }}>
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/clients/palmetto_taps/tap-wall.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/palmetto-taps/taps video.mov" type="video/mp4" />
        </video>

      </section>

      {/* Welcome to Conway Section */}
      <section className="py-16 md:py-32 px-6 bg-[#E4DED4] relative overflow-hidden">
        <NoiseTexture opacity={0.05} />

        {/* Background Image with opacity - bleeds into next section - Mobile */}
        <div
          className="absolute inset-0 z-0 md:hidden"
          style={{
            backgroundImage: 'url(/clients/palmetto_taps/visit-us-mobile.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
          }}
        />

        {/* Background Image with opacity - bleeds into next section - Desktop */}
        <div
          className="absolute inset-0 z-0 hidden md:block"
          style={{
            backgroundImage: 'url(/clients/palmetto_taps/visit-us.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Mobile Layout - Image left-aligned on top, text below */}
          <div className="md:hidden px-4">
            {/* Image with Bronze Frame - Mobile - Left-aligned, 65% size */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
              style={{ width: '65%' }}
            >
              <div className="relative w-full">
                {/* Black Frame Background Layer - top-right offset (opposite of Brooklyn) */}
                <div
                  className="absolute -top-6 -right-6 w-full h-full bg-[#1F1F1E]"
                  style={{ zIndex: 0 }}
                />
                {/* Image on top */}
                <img
                  src="/clients/palmetto_taps/Palmetto-taps-sign.png"
                  alt="Palmetto Taps"
                  className="w-full h-auto object-cover relative"
                  style={{ zIndex: 1 }}
                />
              </div>
            </motion.div>

            {/* Text Content - Mobile - Below image, left-aligned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2
                className="text-5xl font-black uppercase leading-[0.85] mb-6"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.08em',
                  fontWeight: 900,
                  WebkitFontSmoothing: 'antialiased',
                  transform: 'scaleY(1.2)',
                  transformOrigin: 'top',
                }}
              >
                WELCOME TO<br />CONWAY
              </h2>

              <p className="text-[#3A3A38] text-lg leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Housed in the historic Jerry Cox building, Palmetto Taps is Horry County's first self-serve taproom — built for the people who call this place home. With 40+ rotating taps, plus wine, prosecco, and more, there's always something new to discover.
              </p>
              <p className="text-[#3A3A38] text-lg leading-relaxed mt-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Come explore the wall, catch up with neighbors, and make yourself comfortable inside the taproom or out on the patio. This is where Conway comes together.
              </p>
            </motion.div>
          </div>

          {/* Desktop Layout - Side by side */}
          <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-6xl lg:text-7xl font-black uppercase leading-[0.85] mb-8"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  letterSpacing: '0.08em',
                  fontWeight: 900,
                  transform: 'scaleY(1.2)',
                  transformOrigin: 'top',
                }}
              >
                WELCOME TO<br />CONWAY
              </h2>

              <p className="text-[#3A3A38] text-xl leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Housed in the historic Jerry Cox building, Palmetto Taps is Horry County's first self-serve taproom — built for the people who call this place home. With 40+ rotating taps, plus wine, prosecco, and more, there's always something new to discover.
              </p>
              <p className="text-[#3A3A38] text-xl leading-relaxed mt-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Come explore the wall, catch up with neighbors, and make yourself comfortable inside the taproom or out on the patio. This is where Conway comes together.
              </p>
            </motion.div>

            {/* Image - Right Side, 25% smaller */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-end"
            >
              <div className="relative" style={{ width: '75%' }}>
                {/* Black Frame Background Layer - top-right offset (opposite of Brooklyn) */}
                <div
                  className="absolute -top-8 -right-8 w-full h-full bg-[#1F1F1E]"
                  style={{ zIndex: 0 }}
                />
                {/* Image on top */}
                <img
                  src="/clients/palmetto_taps/Palmetto-taps-sign.png"
                  alt="Palmetto Taps"
                  className="w-full h-auto object-cover relative"
                  style={{ zIndex: 1 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Happening This Week - Bronze Button */}
      <section className="py-8 md:py-12 px-6 bg-[#E4DED4]">
        <div className="max-w-6xl mx-auto">
          <motion.a
            href="#weekly-events"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('weekly-events')?.scrollIntoView({ behavior: 'smooth' });
            }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block bg-[#1F1F1E] text-white px-6 md:px-8 py-4 font-semibold uppercase tracking-wide hover:bg-[#2F2F2D] transition-colors rounded text-sm"
          >
            What's Happening This Week
          </motion.a>
        </div>
      </section>

      {/* Features Section - Commented out */}
      {/* <section className="py-24 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Your Pour. Your Way.
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1F1F1E] border border-white/10 rounded-lg p-6 hover:border-[#8B6A4F]/50 transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold mb-3 text-[#8B6A4F]">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Tap Wall Section */}
      <section className="py-12 md:py-24 px-6 bg-[#F3EFE8] relative overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.04)]">
        {/* Tap Wall Background - B&W - First layer - Mobile */}
        <div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            backgroundImage: 'url(/clients/palmetto_taps/tap-wall.png)',
            backgroundSize: '120%',
            backgroundPosition: 'center',
            opacity: 0.08,
            filter: 'grayscale(100%)',
            zIndex: 0,
          }}
        />
        {/* Tap Wall Background - B&W - First layer - Desktop */}
        <div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            backgroundImage: 'url(/clients/palmetto_taps/tap-wall.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08,
            filter: 'grayscale(100%)',
            zIndex: 0,
          }}
        />
        <NoiseTexture opacity={0.05} />
        {/* Stage Lighting Halo - Left offset for Beat A */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 25% 50%, rgba(180, 160, 140, 0.08) 0%, transparent 70%)',
          }}
        />
        {/* Subtle bronze ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 75% 50%, rgba(139, 106, 79, 0.03) 0%, transparent 50%)',
          }}
        />
        {/* Animated Pint Sketch Watermark - Mobile (left side) */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 0.31, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -left-[10%] bottom-[0%] pointer-events-none md:hidden z-0"
        >
          <img
            src="/clients/palmetto_taps/pint_sketch.png"
            alt=""
            className="w-[216px] rotate-[15deg]"
            style={{
              filter: 'sepia(0.8) saturate(1.2) hue-rotate(-10deg) brightness(0.7) contrast(1.1) drop-shadow(4px 8px 12px rgba(139, 106, 79, 0.25))',
            }}
          />
        </motion.div>
        {/* Animated Pint Sketch Watermark - Desktop */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 0.31, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute right-0 top-[35%] -translate-y-1/2 translate-x-1/4 pointer-events-none hidden md:block"
        >
          <img
            src="/clients/palmetto_taps/pint_sketch.png"
            alt=""
            className="w-[450px] opacity-100 rotate-[-15deg]"
            style={{
              filter: 'sepia(0.8) saturate(1.2) hue-rotate(-10deg) brightness(0.7) contrast(1.1) drop-shadow(8px 12px 20px rgba(139, 106, 79, 0.3))',
            }}
          />
        </motion.div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -150 }}
              whileInView={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -150 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ type: "tween", duration: 0.4 }}
              className="relative"
            >
              <img
                src="/clients/palmetto_taps/palmetto_tap_wall.png"
                alt="Palmetto Taps self-serve tap wall"
                className="rounded-lg w-full"
                style={{
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(139, 106, 79, 0.2), inset 0 -2px 8px rgba(139, 106, 79, 0.1)',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, rotate: -8 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center justify-end md:justify-center -mt-16 md:mt-0 mr-[-5%] md:mr-0 relative z-20"
            >
              <img
                src="/clients/palmetto_taps/palmetto-taps-coaster.png"
                alt="Palmetto Taps - Our Tap Wall"
                className="w-[350px] md:w-[625px]"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4)) drop-shadow(0 10px 25px rgba(139, 106, 79, 0.25))',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Food Section */}
      <section className="py-12 md:py-24 px-6 bg-[#D1CBC1] overflow-hidden relative shadow-[inset_0_8px_20px_-10px_rgba(0,0,0,0.12)]">
        {/* Wood Panel Background - B&W - First layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/wood-panel.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            filter: 'grayscale(100%)',
            zIndex: 0,
          }}
        />
        <NoiseTexture opacity={0.06} />
        {/* Subtle bronze ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(139, 106, 79, 0.04) 0%, transparent 50%)',
          }}
        />
        {/* Animated Burger Sketch Watermark - Mobile (bottom right corner) */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 0.25, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute right-0 bottom-0 translate-x-[20%] translate-y-[15%] pointer-events-none md:hidden z-[2]"
        >
          <img
            src="/clients/palmetto_taps/Burger.png"
            alt=""
            className="w-[432px] rotate-[-15deg]"
            style={{
              filter: 'sepia(0.8) saturate(1.2) hue-rotate(-10deg) brightness(0.7) contrast(1.1) drop-shadow(4px 8px 12px rgba(139, 106, 79, 0.25))',
            }}
          />
        </motion.div>
        {/* Animated Burger Sketch Watermark - Desktop (top left corner) */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 0.25, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-0 top-0 -translate-x-[35%] -translate-y-[25%] pointer-events-none hidden md:block z-[2]"
        >
          <img
            src="/clients/palmetto_taps/Burger.png"
            alt=""
            className="w-[845px] opacity-100 rotate-[15deg]"
            style={{
              filter: 'sepia(0.8) saturate(1.2) hue-rotate(-10deg) brightness(0.7) contrast(1.1) drop-shadow(8px 12px 20px rgba(139, 106, 79, 0.3))',
            }}
          />
        </motion.div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, rotate: 8 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center justify-start md:justify-center -mt-12 md:mt-0 ml-[-8%] md:ml-[3%] relative z-20 order-2 md:order-1"
            >
              <img
                src="/clients/palmetto_taps/palmetto-taps-menu.png"
                alt="Palmetto Taps - Our Food"
                className="w-[350px] md:w-[625px]"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4)) drop-shadow(0 10px 25px rgba(139, 106, 79, 0.25))',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 150 }}
              whileInView={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 150 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ type: "tween", duration: 0.4 }}
              className="relative order-1 md:order-2"
            >
              <img
                src="/clients/palmetto_taps/palmetto_taps_food.png"
                alt="Project Smashburger and salad bar"
                className="rounded-lg w-full"
                style={{
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(139, 106, 79, 0.2), inset 0 -2px 8px rgba(139, 106, 79, 0.1)',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Drinks Section - Carousel */}
      <FeaturedDrinksCarousel />

      {/* Let Us Tell You a Story Section */}
      <section className="relative overflow-hidden bg-[#D1CBC1]">
        <NoiseTexture opacity={0.06} />

        {/* Angled Background Image - Desktop Only */}
        <div
          className="absolute inset-0 hidden md:block pointer-events-none"
          style={{
            backgroundImage: 'url(/palmetto-taps-angled.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 50%',
            opacity: 0.1,
            filter: 'grayscale(100%)',
            zIndex: 0,
            top: '50%',
          }}
        />

        {/* Images at top - Mobile: single center image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full md:hidden"
        >
          <img
            src="/clients/palmetto_taps/palmetto-taps-opening.jpg"
            alt="Palmetto Taps Opening"
            className="w-full h-auto"
          />
        </motion.div>

        {/* Images at top - Desktop: three images side by side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden md:grid md:grid-cols-3 gap-0 md:max-h-[450px]"
        >
          <img
            src="/clients/palmetto_taps/tap-wall.jpg"
            alt="Tap Wall"
            className="w-full h-full object-cover"
          />
          <img
            src="/clients/palmetto_taps/palmetto-taps-opening.jpg"
            alt="Palmetto Taps Opening"
            className="w-full h-full object-cover"
          />
          <img
            src="/clients/palmetto_taps/tap-party.jpg"
            alt="Tap Party"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Tan box with heading and text */}
        <div className="relative z-10 px-6 md:px-0">
          <div className="max-w-2xl mx-auto md:mx-0 md:max-w-2xl px-8 md:px-12 py-12 md:py-20 -mt-16 md:-mt-24 bg-[#D1CBC1]">
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.85] mb-6 md:mb-12 text-center md:text-left"
              style={{
                fontFamily: 'Impact, Arial Black, sans-serif',
                letterSpacing: '0.08em',
                fontWeight: 900,
                transform: 'scaleY(1.2)',
                transformOrigin: 'top',
              }}
            >
              LET US TELL<br />YOU A STORY
            </motion.h2>

            {/* Story text - handwriting style (truncated) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-left"
              style={{ fontFamily: 'var(--font-caveat), cursive' }}
            >
              <p className="text-[#3A3A38] text-xl md:text-2xl leading-relaxed">
                When we first started planning Palmetto Taps inside the Jerry Cox Building, we knew how important this spot was—not just to downtown Conway, but to Horry County. We didn't want to just open a bar. We wanted to build something that felt right for this community...
              </p>
              <button
                onClick={() => document.getElementById('story-modal')?.classList.remove('hidden')}
                className="mt-4 text-[#1F1F1E] text-lg md:text-xl font-semibold underline underline-offset-4 hover:text-[#8B6A4F] transition-colors"
                style={{ fontFamily: 'var(--font-caveat), cursive' }}
              >
                Read More
              </button>
            </motion.div>
          </div>
        </div>

        {/* Story Modal */}
        <div
          id="story-modal"
          className="hidden fixed inset-0 z-50"
        >
          {/* Backdrop - clickable to close */}
          <div
            className="absolute inset-0 bg-black/60 cursor-pointer"
            onClick={() => document.getElementById('story-modal')?.classList.add('hidden')}
          />

          {/* Modal Content */}
          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div className="relative bg-[#E4DED4] max-w-2xl max-h-[80vh] shadow-2xl pointer-events-auto flex flex-col">
              {/* Close Button - X */}
              <button
                onClick={() => document.getElementById('story-modal')?.classList.add('hidden')}
                className="absolute top-4 right-4 text-[#1F1F1E] hover:text-[#8B6A4F] transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-8 md:p-12 pb-16">
                {/* Modal Heading */}
                <h2
                  className="text-3xl md:text-5xl font-black uppercase leading-[0.85] mb-6 md:mb-8"
                  style={{
                    fontFamily: 'Impact, Arial Black, sans-serif',
                    letterSpacing: '0.08em',
                    fontWeight: 900,
                    transform: 'scaleY(1.2)',
                    transformOrigin: 'top',
                  }}
                >
                  LET US TELL<br />YOU A STORY
                </h2>

                {/* Full Story Text */}
                <div
                  className="space-y-4"
                  style={{ fontFamily: 'var(--font-caveat), cursive' }}
                >
                  <p className="text-[#3A3A38] text-xl md:text-2xl leading-relaxed">
                    When we first started planning Palmetto Taps inside the Jerry Cox Building, we knew how important this spot was—not just to downtown Conway, but to Horry County.
                  </p>
                  <p className="text-[#3A3A38] text-xl md:text-2xl leading-relaxed">
                    We didn't want to just open a bar. We wanted to build something that felt right for this community.
                  </p>
                  <p className="text-[#3A3A38] text-xl md:text-2xl leading-relaxed">
                    The beer? Yeah, it had to be great. But the space? That had to be built around you. From the cornhole out front, to the board games on the patio, to the fact your dog's just as welcome to hang out outside as you are—we designed this place to be more than a taproom.
                  </p>
                  <p className="text-[#3A3A38] text-xl md:text-2xl leading-relaxed">
                    We wanted it to be where friends hang out, families meet up, and total strangers end up swapping stories over a pint.
                  </p>
                  <p className="text-[#3A3A38] text-xl md:text-2xl leading-relaxed">
                    We're proud to be the area's first self-serve taproom, but even prouder to say this:
                  </p>
                  <p className="text-[#3A3A38] text-2xl md:text-3xl leading-relaxed font-bold">
                    You've welcomed us like family.<br />
                    And that's exactly how we'll keep showing up—every day, every pour.
                  </p>
                </div>
              </div>

              {/* Close Button - Text - Fixed at bottom */}
              <button
                onClick={() => document.getElementById('story-modal')?.classList.add('hidden')}
                className="absolute bottom-4 right-6 text-[#6B6B66] text-lg hover:text-[#1F1F1E] transition-colors"
                style={{ fontFamily: 'var(--font-caveat), cursive' }}
              >
                close
              </button>
            </div>
          </div>
        </div>

        {/* Bottom padding for section */}
        <div className="h-6 md:h-24"></div>
      </section>

      {/* About Our Taproom Section */}
      <section className="py-16 md:py-32 px-6 bg-[#E4DED4] overflow-hidden relative shadow-[inset_0_8px_20px_-10px_rgba(0,0,0,0.1)]">
        <NoiseTexture opacity={0.05} />
        {/* Animated Background Logo Watermark - Mobile */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 0.12, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute right-0 top-12 translate-x-1/4 pointer-events-none md:hidden"
        >
          <img
            src="/clients/palmetto_taps/palmetto_taps_dark_logo.png"
            alt=""
            className="w-[250px] rotate-[-15deg]"
            style={{
              filter: 'sepia(0.8) saturate(1.2) hue-rotate(-10deg) brightness(0.7) contrast(1.1)',
            }}
          />
        </motion.div>
        {/* Animated Background Logo Watermark - Desktop */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 0.12, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-0 top-1/2 -translate-y-1/3 -translate-x-1/4 pointer-events-none hidden md:block"
        >
          <img
            src="/clients/palmetto_taps/palmetto_taps_dark_logo.png"
            alt=""
            className="w-[600px] rotate-[15deg]"
            style={{
              filter: 'sepia(0.8) saturate(1.2) hue-rotate(-10deg) brightness(0.7) contrast(1.1)',
            }}
          />
        </motion.div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left side - Title */}
            <div className="text-center md:text-left">
              <p className="text-sm uppercase tracking-widest text-[#6B6B66] mb-2">About Our</p>
              <h2 className="text-5xl md:text-6xl font-bold uppercase font-heading">Taproom</h2>
            </div>

            {/* Right side - Accordion */}
            <div className="space-y-0">
              <AccordionItem
                title="Family Friendly"
                content="Bring the whole crew — kids are welcome here. We've designed a laid-back space where families can hang out, catch a game, and enjoy good drinks without the stuffy atmosphere. Regular events, outdoor games, and a relaxed vibe make us a go-to spot for all ages."
              />
              <AccordionItem
                title="Pet Friendly"
                content="Your four-legged friends are part of the family too. Our outdoor patio is fully pet-friendly, so grab a seat, order a cold one, and let your pup enjoy the fresh air with you."
              />
              <AccordionItem
                title="More than Just Beer"
                content="Yes, we have 40+ taps but we've also got wine, prosecco, seltzers, shots, and more. Whatever you're in the mood for, Palmetto Taps has you covered."
              />
              <AccordionItem
                title="Free Parking"
                content="No meters, no hassle. We've got free parking right on-site so you can focus on what matters — relaxing with friends and trying something new on tap."
              />
              <AccordionItem
                title="Community Events"
                content="We're more than a taproom — we're a gathering place for Conway. From holiday parties to live music nights, (sometimes) food trucks to bouncy houses for the kids, we host events that bring our community together. Follow us on social media to stay in the loop."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Calendar Section */}
      <section id="weekly-events" className="pt-12 md:pt-20 pb-12 md:pb-16 px-6 bg-[#D1CBC1] overflow-visible relative shadow-[inset_0_8px_20px_-10px_rgba(0,0,0,0.12)]">
        <NoiseTexture opacity={0.06} />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Pint Pour Image with Frame - Mobile */}
          <div className="md:hidden px-4 mb-12 flex justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
              style={{ width: '65%' }}
            >
              <div className="relative w-full">
                {/* Black Frame Background Layer - top-right offset */}
                <div
                  className="absolute -top-6 -right-6 w-full h-full bg-[#1F1F1E]"
                  style={{ zIndex: 0 }}
                />
                {/* Image on top */}
                <img
                  src="/clients/palmetto_taps/pint-pour.png"
                  alt="Pint Pour"
                  className="w-full h-auto object-cover relative"
                  style={{ zIndex: 1 }}
                />
              </div>
            </motion.div>
          </div>

          {/* Pint Pour Image with Frame - Desktop */}
          <div className="hidden md:block mb-12">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-end"
            >
              <div className="relative" style={{ width: '35%' }}>
                {/* Black Frame Background Layer - top-right offset */}
                <div
                  className="absolute -top-8 -right-8 w-full h-full bg-[#1F1F1E]"
                  style={{ zIndex: 0 }}
                />
                {/* Image on top */}
                <img
                  src="/clients/palmetto_taps/pint-pour.png"
                  alt="Pint Pour"
                  className="w-full h-auto object-cover relative"
                  style={{ zIndex: 1 }}
                />
              </div>
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-4 uppercase tracking-wide font-heading"
          >
            What's On Tap Weekly
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-[2px] bg-[#1F1F1E] mt-4 mb-8" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-12"
          >
            <div className="relative inline-block px-2" style={{ transform: 'rotate(-2deg)' }}>
              {/* Hand-drawn circle SVG - animated on scroll */}
              <motion.svg
                className="absolute -inset-5 md:-inset-7 w-[calc(100%+40px)] md:w-[calc(100%+56px)] h-[calc(100%+40px)] md:h-[calc(100%+56px)]"
                viewBox="0 0 220 80"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M 15 40 C 10 12, 55 2, 110 5 C 165 2, 208 12, 212 40 C 215 58, 175 75, 110 78 C 45 81, 5 62, 8 40 C 10 22, 40 8, 110 6"
                  stroke="#1F1F1E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </motion.svg>
              <p className="text-[#3A3A38] text-lg md:text-xl font-semibold text-center relative z-10">
                Happy Hour Daily 4pm – 7pm
              </p>
            </div>
          </motion.div>

          {/* Weekly Events from PWA Dashboard */}
          <div className="mb-12">
            <WeeklyEventsPreview />
          </div>

          {/* Events Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <a
              href="/events"
              className="inline-block bg-[#1F1F1E] text-white px-8 py-4 font-semibold uppercase tracking-wide hover:bg-[#2F2F2D] transition-colors rounded"
            >
              View All Events
            </a>
          </motion.div>

          {/* Animated Background Building Sketch - Pops from footer bottom */}
          {/* TEMPORARILY HIDDEN - Building animation needs fixing */}
          {/* <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 0.2, y: 0 }}
            viewport={{ once: false, amount: 0.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 pointer-events-none flex justify-center"
            style={{ transform: 'translateY(0)' }}
          >
            <img
              src="/clients/palmetto_taps/taps_drawing.png"
              alt=""
              className="w-[100%] md:w-full md:max-w-3xl object-contain object-bottom"
              style={{
                filter: 'sepia(0.8) saturate(1.2) hue-rotate(-10deg) brightness(0.7) contrast(1.1)',
              }}
            />
          </motion.div> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#1F1F1E] border-t border-[#3A3A38] relative">
        {/* Subtle speckled noise texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
            zIndex: 0,
          }}
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#F5F2EC]">{business.name}</h3>
            <p className="text-[#D6D2C8] text-sm">{business.tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#F5F2EC]">Location</h4>
            <p className="text-[#D6D2C8] text-sm">
              {business.address.street}<br />
              {business.address.city}, {business.address.state} {business.address.zip}
            </p>
            <p className="text-[#D6D2C8] text-sm mt-2">{business.phone}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#F5F2EC]">Hours</h4>
            <div className="text-[#D6D2C8] text-sm space-y-1">
              <p>Sun: {business.hours.sunday}</p>
              <p>Mon-Tue, Thu: {business.hours.monday}</p>
              <p>Wed: Closed</p>
              <p>Fri-Sat: {business.hours.friday}</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[#3A3A38] flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-[#A8A59D] text-sm">© 2024 {business.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href={business.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-[#1F1F1E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={business.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 text-[#1F1F1E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={business.untappd.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors text-[#1F1F1E] font-bold text-sm"
              aria-label="Untappd"
            >
              UT
            </a>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
