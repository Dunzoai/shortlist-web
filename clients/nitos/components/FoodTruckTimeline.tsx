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
  date: string;
  location: string;
  details: string;
  isPlaceholder: boolean;
}

// Fun placeholder messages for days without events
const PLACEHOLDER_MESSAGES = [
  { location: "Prepping empanadas 🥟", details: "Getting ready for the next stop" },
  { location: "Restocking the truck", details: "Fresh ingredients incoming" },
  { location: "Secret recipe testing", details: "Something delicious brewing" },
  { location: "Family day", details: "Back on the road soon!" },
  { location: "Catering prep", details: "Working on a private event" },
  { location: "Scouting new spots", details: "Finding the best locations for you" },
  { location: "Truck TLC day", details: "Keeping the wheels rolling" },
  { location: "Creating new flavors", details: "Expanding the menu..." },
  { location: "Behind the scenes", details: "Making the magic happen" },
  { location: "Recharging", details: "Even empanada trucks need rest" },
];

// Format time from "14:30:00" to "2:30pm"
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes}${ampm}`;
}

// Get day abbreviation from date
function getDayAbbrev(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

// Get full day name from date
function getFullDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
}

// Get date string in YYYY-MM-DD format
function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Get the current week (Monday to Sunday)
function getCurrentWeek(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Adjust so Monday is 0, Sunday is 6
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }
  return week;
}

// Get a consistent "random" placeholder based on the date
function getPlaceholderForDate(dateStr: string): { location: string; details: string } {
  // Use the date string to generate a consistent index
  const hash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % PLACEHOLDER_MESSAGES.length;
  return PLACEHOLDER_MESSAGES[index];
}

// Build the week schedule, merging real events with placeholders
function buildWeekSchedule(events: EventData[]): DayData[] {
  const week = getCurrentWeek();

  // Create a map of events by date
  const eventsByDate: Record<string, EventData> = {};
  events.forEach((event) => {
    eventsByDate[event.event_date] = event;
  });

  return week.map((date) => {
    const dateStr = getDateString(date);
    const event = eventsByDate[dateStr];

    if (event) {
      // Real event
      return {
        day: getDayAbbrev(date),
        fullDay: getFullDay(date),
        date: dateStr,
        location: event.title,
        details: `${formatTime(event.start_time)} - ${formatTime(event.end_time)} in ${event.city}, ${event.state}`,
        isPlaceholder: false,
      };
    } else {
      // Placeholder
      const placeholder = getPlaceholderForDate(dateStr);
      return {
        day: getDayAbbrev(date),
        fullDay: getFullDay(date),
        date: dateStr,
        location: placeholder.location,
        details: placeholder.details,
        isPlaceholder: true,
      };
    }
  });
}

export function FoodTruckTimeline() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [truckX, setTruckX] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [scheduleData, setScheduleData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const weekSchedule = buildWeekSchedule(data.events || []);
        setScheduleData(weekSchedule);

        // Set initial active index to today
        const today = getDateString(new Date());
        const todayIndex = weekSchedule.findIndex((day) => day.date === today);
        if (todayIndex !== -1) {
          setActiveIndex(todayIndex);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        // Even on error, show the week with all placeholders
        const weekSchedule = buildWeekSchedule([]);
        setScheduleData(weekSchedule);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Scroll handling for truck animation
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

  // Auto-scroll to today on load
  useEffect(() => {
    if (scheduleData.length > 0 && !isLoading) {
      setTimeout(() => {
        scrollToCard(activeIndex);
      }, 200);
    }
  }, [isLoading, scheduleData.length]);

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
              key={day.date}
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
                      ? day.isPlaceholder
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(255, 255, 255, 0.95)"
                      : "rgba(255, 255, 255, 0.4)",
                  border:
                    index === activeIndex
                      ? day.isPlaceholder
                        ? "1px dashed rgba(43, 58, 68, 0.3)"
                        : "1px solid rgba(43, 58, 68, 0.2)"
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
                    className={`text-xl font-bold ${
                      day.isPlaceholder ? "" : "italic"
                    } ${
                      index === activeIndex
                        ? day.isPlaceholder
                          ? "text-[#222222]/70"
                          : "text-[#222222]"
                        : "text-[#222222]/50"
                    }`}
                  >
                    {day.location}
                  </h4>
                </div>
                <p
                  className={`text-sm ${
                    index === activeIndex
                      ? day.isPlaceholder
                        ? "text-[#5A6570]/60 italic"
                        : "text-[#5A6570]"
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
              key={day.date}
              onClick={() => scrollToCard(index)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                index === activeIndex
                  ? day.isPlaceholder
                    ? "bg-white/80 text-[#2D5A3D]/70"
                    : "bg-white text-[#2D5A3D]"
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
