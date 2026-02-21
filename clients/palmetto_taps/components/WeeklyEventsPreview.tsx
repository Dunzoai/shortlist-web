"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
}

interface DayData {
  day: string;
  fullDay: string;
  date: string;
  title: string;
  details: string;
  isPlaceholder: boolean;
}

// Placeholder messages for days without events
const PLACEHOLDER_MESSAGES = [
  { title: "How does a flight sound?", details: "Stop in for a bite and a pint" },
  { title: "40 taps waiting", details: "Pour your own perfect beer" },
  { title: "Happy Hour", details: "Daily 4pm – 7pm" },
  { title: "Open today", details: "Self-serve beer & good vibes" },
  { title: "Something special", details: "Check out today's taps" },
  { title: "Thirsty?", details: "We've got 40 beers on tap" },
  { title: "Pour your own", details: "Try as many as you want" },
  { title: "Taproom vibes", details: "Games, patio, cold beer" },
];

// Get consistent placeholder for a date
function getPlaceholderForDate(dateStr: string) {
  const hash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % PLACEHOLDER_MESSAGES.length;
  return PLACEHOLDER_MESSAGES[index];
}

// Get day abbreviation (Sat, Sun, Mon, etc.)
function getDayAbbrev(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}

// Get full day name
function getFullDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

// Get date string YYYY-MM-DD in local timezone
function getDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get current week (7 days starting from today)
function getCurrentWeek(): Date[] {
  const today = new Date();
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    week.push(date);
  }
  return week;
}

// Build the week schedule, merging real events with placeholders
function buildWeekSchedule(events: Event[]): DayData[] {
  const week = getCurrentWeek();

  // Create a map of events by date
  const eventsByDate: Record<string, Event> = {};
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
        title: event.title,
        details: event.description || "See you there!",
        isPlaceholder: false,
      };
    } else {
      // Placeholder
      const placeholder = getPlaceholderForDate(dateStr);
      return {
        day: getDayAbbrev(date),
        fullDay: getFullDay(date),
        date: dateStr,
        title: placeholder.title,
        details: placeholder.details,
        isPlaceholder: true,
      };
    }
  });
}

export function WeeklyEventsPreview() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tapX, setTapX] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [scheduleData, setScheduleData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from SmartPage API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://app.shortlistpass.com/api/smartpage/palmettotaps/events");
        const data = await response.json();
        const events: Event[] = data.events || [];

        const weekSchedule = buildWeekSchedule(events);
        setScheduleData(weekSchedule);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Even on error, show the week with all placeholders
        const weekSchedule = buildWeekSchedule([]);
        setScheduleData(weekSchedule);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Scroll handling for tap/glass animation
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
          const distance = Math.abs(cardCenter - containerCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);

      // Position the tap/glass icon
      const activeCard = cardRefs.current[closestIndex];
      if (activeCard) {
        const cardRect = activeCard.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        setTapX(cardCenter - containerRect.left);
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial position

    return () => container.removeEventListener("scroll", handleScroll);
  }, [scheduleData]);

  const scrollToCard = (index: number) => {
    const card = cardRefs.current[index];
    if (card && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft +
        cardRect.left -
        containerRect.left -
        containerRect.width / 2 +
        cardRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-[#1F1F1E]">Loading weekly schedule...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Beer tap icon that follows scroll (like Nito's truck) */}
      <div className="relative h-24 flex justify-center mb-4">
        <motion.div
          className="absolute -top-2"
          style={{ left: 0 }}
          animate={{ x: tapX - 30 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 0.8,
          }}
        >
          {/* Simple beer tap SVG */}
          <svg width="60" height="80" viewBox="0 0 60 80" className="drop-shadow-2xl">
            <rect x="20" y="10" width="20" height="50" fill="#8B6A4F" rx="2" />
            <ellipse cx="30" cy="10" rx="10" ry="5" fill="#6F5536" />
            <rect x="15" y="55" width="30" height="5" fill="#D4A574" />
            <path d="M 25 60 Q 30 75, 35 60" fill="none" stroke="#FFD700" strokeWidth="3" opacity="0.6" />
          </svg>
        </motion.div>
      </div>

      {/* Horizontal scrolling calendar */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Left padding for centering first card */}
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
              className="rounded-xl p-6 h-[160px] flex flex-col justify-between transition-colors duration-300"
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
                      ? "1px dashed rgba(139, 106, 79, 0.4)"
                      : "2px solid rgba(139, 106, 79, 0.6)"
                    : "1px solid rgba(139, 106, 79, 0.2)",
              }}
            >
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                  {day.day}
                </div>
                <div className={`text-xl font-bold mb-2 ${day.isPlaceholder ? "italic" : ""}`}>
                  {day.title}
                </div>
              </div>
              <div className={`text-sm ${day.isPlaceholder ? "italic text-neutral-500" : "text-neutral-700"}`}>
                {day.details}
              </div>
            </motion.div>
          </div>
        ))}

        {/* Right padding for centering last card */}
        <div className="shrink-0 w-[calc(50%-140px)]" />
      </div>

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
