"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────

interface Offering {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number | null;
  price_type: "fixed" | "range" | "call_for_pricing";
  price_max: number | null;
  is_featured: boolean;
  image_url?: string | null;
}

interface OfferingsResponse {
  business?: { name: string };
  offerings: {
    byCategory: Record<string, Offering[]>;
  };
}

// ── Category icons (inline SVG for zero dependencies) ──

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Tappetizers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6 2 10c0 2.5 1.5 4.5 3.5 5.5L4 22h16l-1.5-6.5C20.5 14.5 22 12.5 22 10c0-4-4.48-8-10-8z" />
    </svg>
  ),
  "Tapwiches & Tacos": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 11h18M3 11c0-4 3.5-7 9-7s9 3 9 7M3 11v2c0 1 .5 2 1.5 2.5L3 22h18l-1.5-6.5C20.5 15 21 14 21 13v-2" />
    </svg>
  ),
  "A La Carte Sides": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  "Salad Bar": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 2c-3 0-6 2-7 5h14c-1-3-4-5-7-5zM5 7c-1 2-.5 4 0 5h14c.5-1 1-3 0-5M7 12v3c0 2 2 4 5 4s5-2 5-4v-3" />
    </svg>
  ),
  Drinks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M8 2h8l-1 10H9L8 2zM9 12v7M15 12v7M7 19h10M11 2v3M13 2v2" />
    </svg>
  ),
};

function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS["Tappetizers"];
}

// ── Category accent colors ──

const CATEGORY_COLORS: Record<string, string> = {
  Tappetizers: "#8B6A4F",
  "Tapwiches & Tacos": "#6B5B4F",
  "A La Carte Sides": "#7A6B5A",
  "Salad Bar": "#5A6B4F",
  Drinks: "#4F5A6B",
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || "#8B6A4F";
}

// ── Price display ──

function PriceTag({ item }: { item: Offering }) {
  if (item.price_type === "call_for_pricing" || item.price == null) {
    return <span className="text-[#8B6A4F] text-sm italic">By the ounce</span>;
  }
  if (item.price_type === "range" && item.price_max) {
    return (
      <span className="text-[#1F1F1E] font-semibold">
        ${item.price}–${item.price_max}
      </span>
    );
  }
  return <span className="text-[#1F1F1E] font-semibold">${item.price}</span>;
}

// ── Category order ──

const CATEGORY_ORDER = [
  "Tappetizers",
  "Tapwiches & Tacos",
  "A La Carte Sides",
  "Salad Bar",
  "Drinks",
];

function sortCategories(categories: string[]) {
  return categories.sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

// ── Main component ─────────────────────────────────

export default function FoodPage() {
  const [offerings, setOfferings] = useState<OfferingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(
          "https://app.shortlistpass.com/api/smartpage/palmettotaps/offerings"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setOfferings(data);
        // Set first category as active
        const cats = Object.keys(data.offerings?.byCategory || {});
        if (cats.length > 0) {
          setActiveCategory(sortCategories(cats)[0]);
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const categories = offerings
    ? sortCategories(Object.keys(offerings.offerings.byCategory))
    : [];
  const currentItems = activeCategory
    ? offerings?.offerings.byCategory[activeCategory] || []
    : [];
  const featuredItems = offerings
    ? Object.values(offerings.offerings.byCategory)
        .flat()
        .filter((i) => i.is_featured)
    : [];

  return (
    <div className="min-h-screen bg-[#E4DED4]">
      {/* ── Hero header ── */}
      <section className="relative py-20 md:py-28 px-6 bg-[#1F1F1E] overflow-hidden">
        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#8B6A4F] text-sm uppercase tracking-[0.3em] mb-4"
          >
            Kitchen Menu
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-7xl font-black uppercase text-white"
            style={{
              fontFamily: "Impact, Arial Black, sans-serif",
              letterSpacing: "0.06em",
              transform: "scaleY(1.15)",
              transformOrigin: "center",
            }}
          >
            FOOD AT THE TAPS
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="w-24 h-[2px] bg-[#8B6A4F] mx-auto mt-6 mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-xl mx-auto"
          >
            Great beer deserves great food. Updated live from our kitchen.
          </motion.p>
        </div>
      </section>

      {/* ── Featured items banner ── */}
      {featuredItems.length > 0 && !isLoading && (
        <section className="bg-[#F3EFE8] border-b border-[#D1CBC1] py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-[#8B6A4F] text-xs uppercase tracking-[0.3em] mb-4 text-center">
              Featured
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {featuredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveCategory(item.category);
                    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-2 bg-[#1F1F1E] text-white text-sm rounded-full hover:bg-[#2F2F2D] transition-colors"
                >
                  {item.title}
                  {item.price != null && (
                    <span className="ml-2 text-[#8B6A4F]">
                      ${item.price}
                      {item.price_max ? `–$${item.price_max}` : ""}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Category tabs + menu ── */}
      <section id="menu-section" className="py-12 md:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-[#8B6A4F] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-[#5A5A56]">Loading menu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-[#5A5A56] text-lg">
                Couldn&apos;t load the menu right now. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Category tabs — horizontal scroll on mobile */}
              <div className="flex overflow-x-auto gap-2 pb-4 mb-8 scrollbar-hide -mx-2 px-2">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const color = getCategoryColor(cat);
                  const count = offerings?.offerings.byCategory[cat]?.length || 0;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                        isActive
                          ? "text-white shadow-lg scale-[1.02]"
                          : "bg-[#F3EFE8] text-[#5A5A56] hover:bg-[#E8E2D8]"
                      }`}
                      style={isActive ? { backgroundColor: color } : undefined}
                    >
                      <span className={isActive ? "text-white/80" : `text-[${color}]`}>
                        {getCategoryIcon(cat)}
                      </span>
                      {cat}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#D1CBC1] text-[#5A5A56]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Menu items */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: getCategoryColor(activeCategory || "") }}
                    >
                      {getCategoryIcon(activeCategory || "")}
                    </div>
                    <div>
                      <h2
                        className="text-2xl md:text-3xl font-black uppercase"
                        style={{
                          fontFamily: "Impact, Arial Black, sans-serif",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {activeCategory}
                      </h2>
                      <p className="text-[#5A5A56] text-sm">
                        {currentItems.length} item{currentItems.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Items grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className={`group relative bg-[#F3EFE8] rounded-lg overflow-hidden transition-shadow hover:shadow-md ${
                          item.is_featured ? "ring-2 ring-[#8B6A4F]/30" : ""
                        }`}
                      >
                        <div className="flex">
                          {/* Image or accent bar */}
                          {item.image_url ? (
                            <div className="w-28 md:w-36 flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div
                              className="w-1.5 flex-shrink-0 rounded-l-lg"
                              style={{
                                backgroundColor: getCategoryColor(
                                  activeCategory || ""
                                ),
                              }}
                            />
                          )}

                          {/* Content */}
                          <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <h3
                                  className="text-base md:text-lg font-black uppercase leading-tight"
                                  style={{
                                    fontFamily:
                                      "Impact, Arial Black, sans-serif",
                                    letterSpacing: "0.03em",
                                  }}
                                >
                                  {item.title}
                                </h3>
                                <div className="flex-shrink-0 mt-0.5">
                                  <PriceTag item={item} />
                                </div>
                              </div>
                              {item.description && (
                                <p className="mt-2 text-[#5A5A56] text-sm leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {item.is_featured && (
                              <div className="mt-3">
                                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#8B6A4F] bg-[#8B6A4F]/10 px-2 py-1 rounded">
                                  Featured
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      {/* ── Salad bar callout ── */}
      <section className="py-16 md:py-24 px-6 bg-[#F3EFE8] border-t border-[#D1CBC1]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/palmetto-taps/salad-bar.png"
                alt="Build Your Own Salad Bar"
                className="w-full aspect-[4/3] object-cover rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-3">
                House Feature
              </p>
              <h2
                className="text-3xl md:text-5xl font-black uppercase mb-6"
                style={{
                  fontFamily: "Impact, Arial Black, sans-serif",
                  letterSpacing: "0.06em",
                  transform: "scaleY(1.15)",
                  transformOrigin: "top",
                }}
              >
                BUILD YOUR OWN
                <br />
                SALAD BAR
              </h2>
              <div className="space-y-4 text-[#3A3A38] text-lg leading-relaxed">
                <p>Fresh greens. Loaded toppings. Made your way.</p>
                <p>
                  Our all-you-can-eat salad bar puts you in control. Load up
                  your bowl with crisp greens, fresh veggies, proteins, and
                  all the fixings.
                </p>
                <p className="font-semibold text-[#1F1F1E]">
                  Available daily. $7 all-you-can-eat &middot; $5 side salad to go.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 px-6 bg-[#E4DED4]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#5A5A56] text-lg mb-6">
            Ready to eat? Come hungry.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#1F1F1E] hover:bg-[#2F2F2D] text-white font-semibold px-8 py-4 rounded transition-all duration-300 uppercase tracking-wide"
          >
            Plan Your Visit
          </a>
        </div>
      </section>
    </div>
  );
}
