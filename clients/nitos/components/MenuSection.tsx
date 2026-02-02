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
  accentColor,
  onTap,
}: {
  item: Offering;
  index: number;
  accentColor: string;
  onTap: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
      onClick={onTap}
      className="relative cursor-pointer active:scale-95 transition-transform"
      style={{
        background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 4px 15px rgba(0,0,0,0.4)",
        border: "4px solid #4a3728",
        borderRadius: "6px",
        padding: "14px 12px",
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

        {/* Description always visible */}
        {item.description && (
          <p
            className="text-[11px] md:text-xs mt-2 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {item.description}
          </p>
        )}

        {/* Accent line */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <div
            className="w-8 h-0.5"
            style={{ background: accentColor }}
          />
          <div
            className="w-8 h-0.5"
            style={{ background: accentColor }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Modal component for expanded empanada details
function EmpanadaModal({
  item,
  accentColor,
  isSavory,
  onClose,
}: {
  item: Offering;
  accentColor: string;
  isSavory: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm"
        style={{
          background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.6)",
          border: "6px solid #4a3728",
          borderRadius: "12px",
          padding: "24px 20px",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <span className="text-white text-lg">&times;</span>
        </button>

        {/* Chalk texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none rounded-lg"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Modal content */}
        <div className="relative text-center">
          {/* Title */}
          <h3
            className="text-2xl md:text-3xl font-bold uppercase tracking-wide"
            style={{
              color: accentColor,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
            }}
          >
            {item.title.replace(" Empanada", "")}
          </h3>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="w-12 h-0.5" style={{ background: accentColor }} />
            <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
            <div className="w-12 h-0.5" style={{ background: accentColor }} />
          </div>

          {/* Description */}
          {item.description && (
            <p
              className="text-sm md:text-base leading-relaxed mb-4"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {item.description}
            </p>
          )}

          {/* Price */}
          <div
            className="inline-block px-4 py-2 rounded-full mb-4"
            style={{
              background: "rgba(0,0,0,0.5)",
            }}
          >
            <span
              className="text-lg font-bold"
              style={{
                color: "#FFD93D",
                fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
              }}
            >
              {isSavory ? "$6 each • $5 when you buy 3+" : "$4 each"}
            </span>
          </div>

          {/* Future features placeholder */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 italic">
              {/* Space for: allergy chips, photos, order button */}
              Tap outside to close
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MenuSection() {
  const [activeTab, setActiveTab] = useState<"Savory" | "Sweet">("Savory");
  const [offerings, setOfferings] = useState<OfferingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Offering | null>(null);

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
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
          }}
        >
          {activeTab}
        </h3>
        {/* Price with better visibility - dark background pill */}
        <div
          className="inline-block mt-3 px-4 py-2 rounded-full"
          style={{
            background: "rgba(0,0,0,0.7)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <p
            className="text-base md:text-lg font-bold"
            style={{
              color: colors.price,
              fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            {isSavory ? "$6 each • $5 when you buy 3+" : "$4 each"}
          </p>
        </div>
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
                onTap={() => setSelectedItem(item)}
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
                  onTap={() => setSelectedItem(lastItem)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer note */}
      <p
        className="text-center mt-5 text-sm px-3 py-1 inline-block rounded-full mx-auto"
        style={{
          color: colors.price,
          fontFamily: "var(--font-permanent-marker), cursive, sans-serif",
          background: "rgba(0,0,0,0.5)",
          display: "table",
          margin: "20px auto 0",
        }}
      >
        * Prices do not include tax
      </p>

      {/* Order Online CTA */}
      <div className="flex justify-center mt-8">
        <a
          href="https://nitos.shortlistpass.com"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-[#FF6B35] text-white px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-[#e55a2a] hover:scale-105 active:scale-95 transition-all animate-order-pulse"
          style={{ fontFamily: "var(--font-permanent-marker), cursive, sans-serif" }}
        >
          Order Online
        </a>
      </div>
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

        {/* Menu Content - Desktop with floating empanadas */}
        <div className="relative">
          {/* Desktop: Left floating empanada */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
            className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10"
          >
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={isSavory ? "/empanada-tower.png" : "/sweet-empanada.png"}
                alt="Empanada"
                width={280}
                height={280}
                className="drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

          {/* Desktop: Right floating empanada */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
            className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10"
          >
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Image
                src={isSavory ? "/empanada.png" : "/sweet-empanada-2.png"}
                alt="Empanada"
                width={240}
                height={240}
                className={`drop-shadow-2xl ${isSavory ? "rotate-12" : ""}`}
              />
            </motion.div>
          </motion.div>

          {/* Menu Cards - centered */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="relative z-20"
            >
              {MenuCards}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: Empanada images - positioned at corners */}
        <div className="lg:hidden relative h-32 mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="absolute left-4 bottom-0"
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-5, 0, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={isSavory ? "/empanada-tower.png" : "/sweet-empanada.png"}
                alt="Empanada"
                width={120}
                height={120}
                className="drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="absolute right-4 bottom-0"
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [5, 0, 5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Image
                src={isSavory ? "/empanada.png" : "/sweet-empanada-2.png"}
                alt="Empanada"
                width={100}
                height={100}
                className={`drop-shadow-2xl ${isSavory ? "rotate-45" : ""}`}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <EmpanadaModal
            item={selectedItem}
            accentColor={accentColor}
            isSavory={isSavory}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
