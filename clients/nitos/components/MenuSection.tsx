"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D5A3D] mb-4" style={{ fontFamily: "serif" }}>
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
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === "Savory"
                  ? "bg-[#2D5A3D] text-white"
                  : "text-[#2D5A3D] hover:bg-[#2D5A3D]/10"
              }`}
            >
              Savory
            </button>
            <button
              onClick={() => setActiveTab("Sweet")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
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
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Empanada Image - slides from left for Savory, right for Sweet */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "Savory" ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "Savory" ? 100 : -100 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="w-full lg:w-1/3 flex justify-center"
          >
            <div className="relative">
              {/* Plate/glow effect */}
              <div className="absolute inset-0 bg-[#C9A227]/20 rounded-full blur-3xl scale-110" />
              <Image
                src={activeTab === "Savory" ? "/nitos-savory-empanada.png" : "/nitos-sweet-empanada.png"}
                alt={`${activeTab} Empanada`}
                width={300}
                height={300}
                className="relative z-10 drop-shadow-2xl"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).src = "/nitos-empanada.png";
                }}
              />
            </div>
          </motion.div>

          {/* Chalkboard Menu */}
          <motion.div
            key={`menu-${activeTab}`}
            initial={{ opacity: 0, x: activeTab === "Savory" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
            className="w-full lg:w-2/3"
          >
            <div
              className="relative rounded-lg p-8 md:p-10"
              style={{
                background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.1), 0 10px 40px rgba(0,0,0,0.5)",
                border: "8px solid #4a3728",
                borderRadius: "8px",
              }}
            >
              {/* Chalkboard texture overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none rounded"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Menu Header */}
              <div className="relative text-center mb-8">
                <h3
                  className="text-3xl md:text-4xl text-white mb-2"
                  style={{
                    fontFamily: "'Caveat', cursive, serif",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {activeTab} Empanadas
                </h3>
                <div className="w-24 h-0.5 bg-[#C9A227] mx-auto" />
              </div>

              {/* Menu Items */}
              {isLoading ? (
                <div className="text-white/60 text-center py-8">Loading menu...</div>
              ) : (
                <div className="relative space-y-4">
                  {currentItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <h4
                            className="text-lg md:text-xl text-white font-medium"
                            style={{
                              fontFamily: "'Caveat', cursive, serif",
                              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                            }}
                          >
                            {item.title.replace(" Empanada", "")}
                          </h4>
                          <div className="flex-1 border-b border-dotted border-white/30 mb-1" />
                          <span
                            className="text-[#C9A227] text-lg md:text-xl font-bold"
                            style={{ fontFamily: "'Caveat', cursive, serif" }}
                          >
                            ${item.price}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm mt-1">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Chalk dust decoration */}
              <div className="absolute bottom-4 right-4 text-white/20 text-xs">
                🥟 Made fresh daily
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
