"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface EventData {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  city: string;
  state: string;
}

interface DayData {
  day: string;
  fullDay: string;
  location: string;
  details: string;
}

// Format time from "14:30:00" to "2:30pm"
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes}${ampm}`;
}

// Get day abbreviation from date
function getDayAbbrev(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

// Get full day name from date
function getFullDay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
}

// Transform API events to component format
function transformEvents(events: EventData[]): DayData[] {
  return events.map((event) => ({
    day: getDayAbbrev(event.event_date),
    fullDay: getFullDay(event.event_date),
    location: event.title,
    details: `${formatTime(event.start_time)} - ${formatTime(event.end_time)} in ${event.city}, ${event.state}`,
  }));
}

export function FoodTruckTimeline() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [truckX, setTruckX] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [scheduleData, setScheduleData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from SmartPage API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(
          "https://app.shortlistpass.com/api/smartpage/nitos/events"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        const transformed = transformEvents(data.events || []);
        setScheduleData(transformed);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Could not load schedule");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || scheduleData.length === 0) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(containerCenter - cardCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);

      const activeCard = cardRefs.current[closestIndex];
      if (activeCard && container) {
        const cardRect = activeCard.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const cardCenterRelative =
          cardRect.left - containerRect.left + cardRect.width / 2;
        setTruckX(cardCenterRelative);
      }
    };

    container.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [scheduleData]);

  const scrollToCard = (index: number) => {
    const card = cardRefs.current[index];
    const container = scrollContainerRef.current;
    if (card && container) {
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft +
        (cardRect.left - containerRect.left) -
        containerRect.width / 2 +
        cardRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative">
        <div
          className="relative rounded-[28px] p-6 md:p-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(45, 90, 61, 0.95) 0%, rgba(30, 60, 40, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 40px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="text-center py-12">
            <div className="animate-pulse text-[#F4F1EC]/60">
              Loading schedule...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or no events state
  if (error || scheduleData.length === 0) {
    return (
      <div className="relative">
        <div
          className="relative rounded-[28px] p-6 md:p-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(45, 90, 61, 0.95) 0%, rgba(30, 60, 40, 0.98) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 40px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="text-center py-12">
            <p className="text-[#F4F1EC]/60">
              {error || "No upcoming events scheduled. Check back soon! 🚚"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="relative rounded-[28px] p-6 md:p-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(45, 90, 61, 0.95) 0%, rgba(30, 60, 40, 0.98) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow:
            "0 40px 80px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-[#F4F1EC] mb-2">
            Follow the truck this week.
          </h3>
          <p className="text-sm text-[#F4F1EC]/60">
            Tap a day. Watch the truck move. Get the details instantly.
          </p>
        </div>

        <div className="relative h-32 flex justify-center mb-2">
          <motion.div
            className="absolute -top-3"
            style={{ left: 0 }}
            animate={{ x: truckX - 80 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 0.8,
            }}
          >
            <Image
              src="/nitos-truck.png"
              alt="Nito's Food Truck"
              width={160}
              height={96}
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="shrink-0 w-[calc(50%-140px)]" />

          {scheduleData.map((day, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => scrollToCard(index)}
              className="shrink-0 w-[280px] snap-center cursor-pointer"
            >
              <motion.div
                className="rounded-2xl p-6 h-[160px] flex flex-col justify-between transition-colors duration-300"
                animate={{
                  scale: index === activeIndex ? 1 : 0.92,
                  opacity: index === activeIndex ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  background:
                    index === activeIndex
                      ? "rgba(255, 255, 255, 0.9)"
                      : "rgba(255, 255, 255, 0.4)",
                  border:
                    index === activeIndex
                      ? "1px solid rgba(43, 58, 68, 0.2)"
                      : "1px solid rgba(43, 58, 68, 0.08)",
                }}
              >
                <div>
                  <p
                    className={`text-[10px] uppercase tracking-[0.2em] mb-2 font-medium ${
                      index === activeIndex
                        ? "text-[#2D5A3D]"
                        : "text-[#5A6570]/40"
                    }`}
                  >
                    {day.fullDay}
                  </p>
                  <h4
                    className={`text-xl font-bold italic ${
                      index === activeIndex
                        ? "text-[#222222]"
                        : "text-[#222222]/50"
                    }`}
                  >
                    {day.location}
                  </h4>
                </div>
                <p
                  className={`text-sm ${
                    index === activeIndex
                      ? "text-[#5A6570]"
                      : "text-[#5A6570]/40"
                  }`}
                >
                  {day.details}
                </p>
              </motion.div>
            </div>
          ))}

          <div className="shrink-0 w-[calc(50%-140px)]" />
        </div>

        {/* Day pills */}
        <div className="flex justify-center gap-2 mt-4">
          {scheduleData.map((day, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                index === activeIndex
                  ? "bg-white text-[#2D5A3D]"
                  : "bg-white/20 text-white/60 hover:bg-white/30"
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
