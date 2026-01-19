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
  business?: {
    name: string;
    subdomain: string;
  };
  offerings: {
    byCategory: {
      Savory?: Offering[];
      Sweet?: Offering[];
    };
  };
}

// Mini chalkboard card component
function MenuCard({
  item,
  index,
  accentColor
}: {
  item: Offering;
  index: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
      className="relative"
      style={{
        background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 4px 15px rgba(0,0,0,0.4)",
        border: "4px solid #4a3728",
        borderRadius: "6px",
        padding: "12px",
      }}
    >
      {/* Chalk texture overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none rounded"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Card content */}
      <div className="relative text-center">
        <h4
          className="text-sm md:text-base font-bold uppercase tracking-wide leading-tight"
          style={{
            color: "#FFFFFF",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
          }}
        >
          {item.title.replace(" Empanada", "")}
        </h4>
        {item.description && (
          <p
            className="text-[10px] md:text-xs mt-1 leading-tight"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {item.description}
          </p>
        )}
        {/* Accent line */}
        <div
          className="w-8 h-0.5 mx-auto mt-2"
          style={{ background: accentColor }}
        />
      </div>
    </motion.div>
  );
}

export function MenuSection() {
  const [activeTab, setActiveTab] = useState<"Savory" | "Sweet">("Savory");
  const [offerings, setOfferings] = useState<OfferingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Swipe handling for mobile
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && activeTab === "Savory") {
      setActiveTab("Sweet");
    } else if (info.offset.x > swipeThreshold && activeTab === "Sweet") {
      setActiveTab("Savory");
    }
  };

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

  const currentItems = offerings?.offerings?.byCategory?.[activeTab] || [];
  const isSavory = activeTab === "Savory";

  // Colors matching his real chalkboard
  const colors = {
    savoryHeader: "#4ECDC4", // teal
    sweetHeader: "#FF6B9D", // pink
    price: "#FFD93D", // yellow/gold
  };

  const accentColor = isSavory ? colors.savoryHeader : colors.sweetHeader;

  const Toggle = (
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
  );

  // Split items into pairs for grid, with last odd item separate
  const isOdd = currentItems.length % 2 !== 0;
  const pairedItems = isOdd ? currentItems.slice(0, -1) : currentItems;
  const lastItem = isOdd ? currentItems[currentItems.length - 1] : null;

  const MenuCards = (
    <div className="w-full max-w-md mx-auto">
      {/* Menu Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h3
          className="text-3xl md:text-4xl font-bold uppercase tracking-wide"
          style={{
            color: accentColor,
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
          }}
        >
          {activeTab}
        </h3>
        <p
          className="text-base md:text-lg mt-2 font-bold"
          style={{
            color: colors.price,
            fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
          }}
        >
          {isSavory ? "$6 each • $5 when you buy 3+" : "$4 each"}
        </p>
      </motion.div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="text-[#5A6570] text-center py-8">Loading menu...</div>
      ) : (
        <div className="space-y-3">
          {/* Paired rows */}
          <div className="grid grid-cols-2 gap-3">
            {pairedItems.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                accentColor={accentColor}
              />
            ))}
          </div>

          {/* Centered last item if odd */}
          {lastItem && (
            <div className="flex justify-center">
              <div className="w-[calc(50%-6px)]">
                <MenuCard
                  item={lastItem}
                  index={pairedItems.length}
                  accentColor={accentColor}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer note */}
      <p
        className="text-center mt-4 text-sm"
        style={{
          color: colors.price,
          fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
        }}
      >
        * Prices do not include tax
      </p>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative py-20 px-4 overflow-hidden">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/empanada-to-go.png"
          alt=""
          fill
          className="opacity-30 object-cover"
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
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
          className="flex justify-center mb-8"
        >
          {Toggle}
        </motion.div>

        {/* Menu Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: isSavory ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSavory ? 20 : -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col lg:flex-row items-center gap-8"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Desktop: Empanada image LEFT for Savory, RIGHT for Sweet */}
            {isSavory && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                className="hidden lg:flex w-1/3 justify-center items-center"
              >
                <Image
                  src="/empanada-tower.png"
                  alt="Savory Empanadas"
                  width={400}
                  height={400}
                  className="drop-shadow-2xl"
                />
              </motion.div>
            )}

            {/* Menu Cards */}
            <div className="w-full lg:w-1/3">
              {MenuCards}
            </div>

            {/* Desktop: Empanada image */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
              className="hidden lg:flex w-1/3 justify-center items-center"
            >
              <Image
                src={isSavory ? "/empanada.png" : "/sweet-empanada.png"}
                alt={isSavory ? "Empanada" : "Sweet Empanada"}
                width={350}
                height={350}
                className={`drop-shadow-2xl ${isSavory ? "rotate-12" : ""}`}
              />
            </motion.div>

            {!isSavory && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
                className="hidden lg:flex w-1/3 justify-center items-center"
              >
                <Image
                  src="/sweet-empanada-2.png"
                  alt="Sweet Empanada"
                  width={300}
                  height={300}
                  className="drop-shadow-2xl"
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mobile: Empanada images below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="lg:hidden flex justify-center items-end gap-4 mt-8"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={isSavory ? "/empanada-tower.png" : "/sweet-empanada.png"}
              alt="Empanada"
              width={150}
              height={150}
              className="drop-shadow-2xl"
            />
          </motion.div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Image
              src={isSavory ? "/empanada.png" : "/sweet-empanada-2.png"}
              alt="Empanada"
              width={130}
              height={130}
              className={`drop-shadow-2xl ${isSavory ? "rotate-90" : ""}`}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
