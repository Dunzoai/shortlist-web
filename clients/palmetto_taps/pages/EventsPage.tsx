"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { weeklyEvents, business } from "@/clients/palmetto_taps/content/business";

// Event type icons (simple SVG placeholders)
const eventIcons: Record<string, React.ReactNode> = {
  music: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  trivia: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  food: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  special: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  community: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
};

// Event data model
interface Event {
  id: string;
  title: string;
  type: "music" | "trivia" | "food" | "special" | "community";
  start_datetime: string;
  end_datetime?: string;
  short_description?: string;
  long_description?: string;
  image_url?: string;
  cta_label?: string;
  cta_url?: string;
  status: "active" | "cancelled" | "postponed";
  location_note?: string;
  food_info?: string;
}

// Example mock data for 6 upcoming events
const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Trivia Night",
    type: "trivia",
    start_datetime: "2025-01-07T19:00:00",
    end_datetime: "2025-01-07T21:00:00",
    short_description: "Grab a team and test your knowledge.",
    long_description: "Our weekly trivia night is back. Teams of up to 6, prizes for the top 3. No sign-up needed — just show up and grab a table.",
    status: "active",
    food_info: "Project Smashburger available until 9pm",
  },
  {
    id: "2",
    title: "Live Music: The Coastal Drifters",
    type: "music",
    start_datetime: "2025-01-10T19:00:00",
    end_datetime: "2025-01-10T22:00:00",
    short_description: "Local acoustic duo on the patio.",
    long_description: "The Coastal Drifters bring their easy-going acoustic sound to the patio. Grab a seat, grab a pour, and enjoy the evening.",
    image_url: "/clients/palmetto_taps/events/coastal-drifters.jpg",
    status: "active",
    cta_label: "View on Instagram",
    cta_url: "https://www.instagram.com/palmettotaps/",
  },
  {
    id: "3",
    title: "Food Truck: Smoke & Soul BBQ",
    type: "food",
    start_datetime: "2025-01-11T12:00:00",
    end_datetime: "2025-01-11T20:00:00",
    short_description: "Slow-smoked goodness all day.",
    long_description: "Smoke & Soul is pulling up with brisket, pulled pork, and all the fixings. Available until they sell out.",
    status: "active",
    location_note: "Parked out front on 4th Ave",
  },
  {
    id: "4",
    title: "Sunday Kitchen Takeover",
    type: "food",
    start_datetime: "2025-01-12T13:00:00",
    end_datetime: "2025-01-12T18:00:00",
    short_description: "Guest chef TBA — check back soon.",
    long_description: "Every Sunday we hand the kitchen over to a rotating guest chef or pop-up. This week's lineup is still coming together. Check our Instagram for updates.",
    status: "active",
    cta_label: "Follow for Updates",
    cta_url: "https://www.instagram.com/palmettotaps/",
  },
  {
    id: "5",
    title: "Beer Release: New South Collab",
    type: "special",
    start_datetime: "2025-01-17T17:00:00",
    short_description: "First pour of a new local collab.",
    long_description: "We're tapping something special — a collaboration brew with New South Brewing. Limited quantity, first come first served. More details dropping soon.",
    status: "active",
    food_info: "Food truck on site (TBA)",
  },
  {
    id: "6",
    title: "Community Night: Conway Locals",
    type: "community",
    start_datetime: "2025-01-20T18:00:00",
    end_datetime: "2025-01-20T21:00:00",
    short_description: "Discounts for Conway residents.",
    long_description: "Show your Conway ID or just tell us you're local. Enjoy discounted pours and good company. This is our way of saying thanks to the neighborhood.",
    status: "active",
  },
];

// Helper to format date/time
function formatEventDate(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatEventTime(start: string, end?: string): string {
  const startDate = new Date(start);
  const startTime = startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (end) {
    const endDate = new Date(end);
    const endTime = endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${startTime} – ${endTime}`;
  }
  return startTime;
}

// Event Strip Component
function EventStrip({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="w-full bg-[#2A2A28] hover:bg-[#353533] rounded-lg p-4 md:p-5 flex items-center gap-4 md:gap-6 text-left transition-colors duration-200 group"
    >
      {/* Image Tile */}
      <div className="flex-shrink-0 w-[80px] h-[80px] md:w-[120px] md:h-[100px] rounded-lg overflow-hidden bg-[#1F1F1E] flex items-center justify-center">
        {event.image_url ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image_url})` }}
          />
        ) : (
          <div className="text-[#8B6A4F]">
            {eventIcons[event.type] || eventIcons.special}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {event.status === "cancelled" && (
            <span className="text-xs uppercase tracking-wide bg-red-900/50 text-red-300 px-2 py-0.5 rounded">Cancelled</span>
          )}
          {event.status === "postponed" && (
            <span className="text-xs uppercase tracking-wide bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded">Postponed</span>
          )}
        </div>
        <h3
          className="text-lg md:text-xl font-bold text-white truncate group-hover:text-[#D4C4A8] transition-colors"
          style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
        >
          {event.title}
        </h3>
        {event.short_description && (
          <p className="text-white/60 text-sm truncate hidden sm:block">{event.short_description}</p>
        )}
      </div>

      {/* Date/Time */}
      <div className="flex-shrink-0 text-right hidden sm:block">
        <p className="text-[#8B6A4F] text-sm font-medium">{formatEventDate(event.start_datetime)}</p>
        <p className="text-white/50 text-sm">{formatEventTime(event.start_datetime, event.end_datetime)}</p>
      </div>

      {/* Mobile Date */}
      <div className="flex-shrink-0 text-right sm:hidden">
        <p className="text-[#8B6A4F] text-xs font-medium">{formatEventDate(event.start_datetime)}</p>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 text-white/30 group-hover:text-white/60 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
}

// Event Modal Component
function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const handleAddToCalendar = () => {
    const startDate = new Date(event.start_datetime);
    const endDate = event.end_datetime ? new Date(event.end_datetime) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatForCalendar = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}/g, "");

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatForCalendar(startDate)}/${formatForCalendar(endDate)}&details=${encodeURIComponent(event.long_description || event.short_description || "")}&location=${encodeURIComponent("Palmetto Taps, 909 4th Avenue, Conway, SC 29526")}`;

    window.open(calendarUrl, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `${event.title} at Palmetto Taps - ${formatEventDate(event.start_datetime)}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${event.title} at Palmetto Taps - ${formatEventDate(event.start_datetime)} - ${window.location.href}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#1F1F1E] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Header (if exists) */}
        {event.image_url && (
          <div
            className="w-full h-48 bg-cover bg-center rounded-t-xl"
            style={{ backgroundImage: `url(${event.image_url})` }}
          />
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Status Badge */}
          {event.status === "cancelled" && (
            <div className="mb-4 bg-red-900/30 border border-red-800 text-red-300 px-4 py-2 rounded-lg text-sm">
              This event has been cancelled.
            </div>
          )}
          {event.status === "postponed" && (
            <div className="mb-4 bg-yellow-900/30 border border-yellow-800 text-yellow-300 px-4 py-2 rounded-lg text-sm">
              This event has been postponed. Check back for updates.
            </div>
          )}

          {/* Title */}
          <h2
            className="text-2xl md:text-3xl font-black text-white uppercase mb-2"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            {event.title}
          </h2>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-[#8B6A4F] mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatEventDate(event.start_datetime)} · {formatEventTime(event.start_datetime, event.end_datetime)}</span>
          </div>

          {/* Description */}
          <p className="text-white/80 text-base leading-relaxed mb-6">
            {event.long_description || event.short_description}
          </p>

          {/* Food Info */}
          {event.food_info && (
            <div className="bg-[#2A2A28] rounded-lg p-4 mb-6">
              <p className="text-[#8B6A4F] text-xs uppercase tracking-wide mb-1">Food</p>
              <p className="text-white/70 text-sm">{event.food_info}</p>
            </div>
          )}

          {/* Location Note */}
          {event.location_note && (
            <p className="text-white/50 text-sm mb-6 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location_note}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddToCalendar}
              className="flex items-center gap-2 bg-[#8B6A4F] hover:bg-[#A07D5C] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-[#2A2A28] hover:bg-[#353533] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            {event.cta_url && (
              <a
                href={event.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#2A2A28] hover:bg-[#353533] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {event.cta_label || "Learn More"}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="min-h-screen bg-[#1F1F1E]">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-wide mb-6 text-white"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '0.08em',
              transform: 'scaleY(1.2)',
              transformOrigin: 'center',
            }}
          >
            Events at Palmetto Taps
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            There's usually something going on. Music, trivia, food trucks — or just a good excuse to hang out.
          </motion.p>
        </div>
      </section>

      {/* Weekly Events Slider */}
      <section className="py-10 px-6 bg-[#2A2A28]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-bold uppercase mb-6 text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Weekly at the Taps
          </motion.h2>

          {/* Horizontal Slider */}
          <div
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {weeklyEvents.map((event) => (
              <div
                key={event.day}
                className="flex-shrink-0 w-48 md:w-56 snap-center bg-[#1F1F1E] p-5 rounded-lg hover:bg-[#353533] transition-colors cursor-default"
              >
                <p className="text-[#8B6A4F] text-xs uppercase tracking-widest mb-2">{event.day}</p>
                <h3 className="text-white text-base font-semibold mb-1">{event.name}</h3>
                <p className="text-white/50 text-sm">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events List */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2
              className="text-2xl md:text-3xl font-black uppercase text-white"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Coming Up
            </h2>
            <p className="text-white/40 text-sm">Click for details</p>
          </motion.div>

          {/* Event Strips */}
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventStrip
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>

          {/* Empty State */}
          {upcomingEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/40 text-lg">No upcoming events scheduled yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stay Updated Section */}
      <section className="py-12 px-6 bg-[#2A2A28]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/60 mb-4">
            Events change week to week. Follow along for the latest.
          </p>
          <a
            href={business.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#8B6A4F] hover:text-[#D4C4A8] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow @palmettotaps
          </a>
        </div>
      </section>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
