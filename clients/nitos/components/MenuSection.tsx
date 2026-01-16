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

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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

  const isSavory = activeTab === "Savory";

  const ChalkboardMenu = (
    <motion.div
      key={`menu-${activeTab}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full lg:w-1/2"
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

        {/* Menu Content */}
        <AnimatePresence mode="wait">
          {isSavory ? (
            /* SAVORY: Menu LEFT, Empanada Tower RIGHT */
            <motion.div
              key="savory-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
            >
              {/* Mobile: image first */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                className="w-full lg:hidden flex justify-center"
              >
                <Image
                  src="/empanada-tower.png"
                  alt="Savory Empanadas"
                  width={400}
                  height={400}
                  className="drop-shadow-2xl"
                />
              </motion.div>

              {/* Desktop: Menu left */}
              <div className="hidden lg:block lg:w-1/2">
                {ChalkboardMenu}
              </div>

              {/* Mobile: menu */}
              <div className="lg:hidden w-full">
                {ChalkboardMenu}
              </div>

              {/* Desktop: Empanada Tower right - slides in from right on scroll */}
              <motion.div
                initial={{ opacity: 0, x: 150 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                className="hidden lg:flex w-1/2 justify-center items-center"
              >
                <Image
                  src="/empanada-tower.png"
                  alt="Savory Empanadas"
                  width={450}
                  height={450}
                  className="drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          ) : (
            /* SWEET: Sweet Empanada LEFT, Menu RIGHT */
            <motion.div
              key="sweet-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
            >
              {/* Mobile: image first */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full lg:hidden flex justify-center"
              >
                <Image
                  src="/sweet-empanada.png"
                  alt="Sweet Empanadas"
                  width={350}
                  height={350}
                  className="drop-shadow-2xl"
                />
              </motion.div>

              {/* Desktop: Sweet empanada left */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                className="hidden lg:flex w-1/2 justify-center items-center"
              >
                <Image
                  src="/sweet-empanada.png"
                  alt="Sweet Empanadas"
                  width={400}
                  height={400}
                  className="drop-shadow-2xl"
                />
              </motion.div>

              {/* Mobile: menu */}
              <div className="lg:hidden w-full">
                {ChalkboardMenu}
              </div>

              {/* Desktop: Menu right */}
              <div className="hidden lg:block lg:w-1/2">
                {ChalkboardMenu}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
