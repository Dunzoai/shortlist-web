"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Offering {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

interface OfferingsResponse {
  business: {
    name: string;
    subdomain: string;
  };
  offerings: {
    Savory?: Offering[];
    Sweet?: Offering[];
  };
}

export function MenuSection() {
  const [activeTab, setActiveTab] = useState<"Savory" | "Sweet">("Savory");
  const [offerings, setOfferings] = useState<OfferingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Track when initial animation completes
  useEffect(() => {
    if (isInView && !hasAnimatedIn) {
      const timer = setTimeout(() => setHasAnimatedIn(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimatedIn]);

  // Fetch menu from SmartPage API
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch(
          "https://app.shortlistpass.com/api/smartpage/nitos/offerings"
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setOfferings(data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const currentItems = offerings?.offerings?.[activeTab] || [];

  // Colors matching his real chalkboard
  const colors = {
    savoryHeader: "#4ECDC4", // teal
    sweetHeader: "#FF6B9D", // pink
    price: "#FFD93D", // yellow/gold
    item: "#FFFFFF", // white
    description: "rgba(255,255,255,0.6)",
  };

  // Desktop layout: Savory = menu left + empanada right, Sweet = empanada left + menu right
  const isSavory = activeTab === "Savory";

  const EmpanadaImage = (
    <motion.div
      key={`image-${activeTab}`}
      initial={{
        opacity: 0,
        x: !hasAnimatedIn ? -200 : isSavory ? 200 : -200,
      }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isSavory ? -200 : 200 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="w-full lg:w-1/3 flex justify-center"
    >
      <Image
        src={isSavory ? "/empanada-tower.png" : "/sweet-empanada.png"}
        alt={`${activeTab} Empanada`}
        width={300}
        height={300}
        className="drop-shadow-2xl"
      />
    </motion.div>
  );

  const ChalkboardMenu = (
    <motion.div
      key={`menu-${activeTab}`}
      initial={{ opacity: 0, x: isSavory ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isSavory ? 100 : -100 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: 0.1,
      }}
      className="w-full lg:w-2/3"
    >
      <div
        className="relative rounded-lg p-8 md:p-10"
        style={{
          background:
            "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.1), 0 10px 40px rgba(0,0,0,0.5)",
          border: "8px solid #4a3728",
          borderRadius: "8px",
        }}
      >
        {/* Chalkboard texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none rounded"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Menu Header */}
        <div className="relative text-center mb-6">
          <h3
            className="text-3xl md:text-4xl font-bold uppercase tracking-wide"
            style={{
              color: isSavory ? colors.savoryHeader : colors.sweetHeader,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
            }}
          >
            {activeTab}
          </h3>
          {/* Price info */}
          <p
            className="text-lg mt-2 font-bold"
            style={{
              color: colors.price,
              fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
            }}
          >
            {isSavory ? "$6 each • $5 when you buy 3+" : "$4 each"}
          </p>
          <div
            className="w-32 h-1 mx-auto mt-3"
            style={{
              background: isSavory ? colors.savoryHeader : colors.sweetHeader,
            }}
          />
        </div>

        {/* Menu Items */}
        {isLoading ? (
          <div className="text-white/60 text-center py-8">Loading menu...</div>
        ) : (
          <div className="relative space-y-5">
            {currentItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-3"
              >
                {/* Bullet point */}
                <span
                  className="text-2xl leading-none mt-1"
                  style={{
                    color: isSavory ? colors.savoryHeader : colors.sweetHeader,
                  }}
                >
                  •
                </span>
                <div className="flex-1">
                  <h4
                    className="text-xl md:text-2xl font-bold uppercase tracking-wide"
                    style={{
                      color: colors.item,
                      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                      fontFamily:
                        "var(--font-permanent-marker), cursive, sans-serif",
                    }}
                  >
                    {item.title.replace(" Empanada", "")}
                  </h4>
                  <p
                    className="text-sm mt-1"
                    style={{ color: colors.description }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <div
          className="mt-8 pt-4 border-t border-white/10 text-center"
          style={{
            color: colors.price,
            fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
          }}
        >
          <p className="text-sm">* Prices do not include tax</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section ref={sectionRef} className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D5A3D] mb-4"
            style={{ fontFamily: "serif" }}
          >
            Our Menu
          </h2>
          <p className="text-[#5A6570] text-lg">
            Handcrafted empanadas made fresh daily
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-[#2D5A3D]/10 rounded-full p-1 flex gap-1">
            <button
              onClick={() => setActiveTab("Savory")}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                activeTab === "Savory"
                  ? "bg-[#2D5A3D] text-white"
                  : "text-[#2D5A3D] hover:bg-[#2D5A3D]/10"
              }`}
            >
              Savory
            </button>
            <button
              onClick={() => setActiveTab("Sweet")}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                activeTab === "Sweet"
                  ? "bg-[#2D5A3D] text-white"
                  : "text-[#2D5A3D] hover:bg-[#2D5A3D]/10"
              }`}
            >
              Sweet
            </button>
          </div>
        </motion.div>

        {/* Menu Content - Desktop: swap positions based on tab */}
        <AnimatePresence mode="wait">
          <div
            key={activeTab}
            className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
          >
            {/* Mobile: always image first, then menu */}
            <div className="lg:hidden w-full flex flex-col items-center gap-8">
              {EmpanadaImage}
              {ChalkboardMenu}
            </div>

            {/* Desktop: Savory = menu left + empanada right, Sweet = empanada left + menu right */}
            <div className="hidden lg:flex lg:flex-row items-center gap-12 w-full">
              {isSavory ? (
                <>
                  {ChalkboardMenu}
                  {EmpanadaImage}
                </>
              ) : (
                <>
                  {EmpanadaImage}
                  {ChalkboardMenu}
                </>
              )}
            </div>
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
}
