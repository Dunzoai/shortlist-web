"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  city: string;
  state: string;
  location_notes?: string;
}

// Event type templates with images/colors
const eventTemplates = {
  liveMusic: {
    keywords: ["music", "band", "live", "concert", "performer", "acoustic"],
    icon: "🎸",
    gradient: "from-purple-500 to-pink-500",
    image: "/clients/palmetto_taps/tap-party.jpg", // band/crowd
  },
  thirstyThursday: {
    keywords: ["thirsty thursday", "thursday", "$3"],
    icon: "🍺",
    gradient: "from-amber-500 to-yellow-500",
    image: "/clients/palmetto_taps/kona_big_wave.png", // beer bottle
  },
  wineWednesday: {
    keywords: ["wine wednesday", "wine", "wednesday"],
    icon: "🍷",
    gradient: "from-rose-500 to-red-500",
    image: "/clients/palmetto_taps/prosecco_pint.png",
  },
  tealTuesday: {
    keywords: ["teal tuesday", "tuesday", "coastal carolina"],
    icon: "🏈",
    gradient: "from-teal-500 to-cyan-500",
    image: "/clients/palmetto_taps/keeping_it_teal.png",
  },
  food: {
    keywords: ["burger", "food", "smash", "eat", "kitchen", "meal"],
    icon: "🍔",
    gradient: "from-orange-500 to-red-500",
    image: "/clients/palmetto_taps/Burger.png",
  },
  trivia: {
    keywords: ["trivia", "quiz", "game night"],
    icon: "🧠",
    gradient: "from-blue-500 to-indigo-500",
    image: "/clients/palmetto_taps/tap-wall.jpg",
  },
  cigars: {
    keywords: ["cigar", "humidor", "hookup", "smoke"],
    icon: "🚬",
    gradient: "from-gray-600 to-gray-800",
    image: "/clients/palmetto_taps/bar-scene.png",
  },
  tasting: {
    keywords: ["tasting", "flight", "sample", "brewery", "craft"],
    icon: "🍻",
    gradient: "from-green-500 to-emerald-500",
    image: "/clients/palmetto_taps/tap-wall.webp",
  },
  default: {
    keywords: [],
    icon: "🎉",
    gradient: "from-[#8B7355] to-[#6F5C45]",
    image: "/clients/palmetto_taps/palmetto-taps-opening.jpg",
  },
};

// Detect event type from title/description
function detectEventType(title: string, description?: string | null): typeof eventTemplates.default {
  const searchText = `${title} ${description || ""}`.toLowerCase();

  for (const [key, template] of Object.entries(eventTemplates)) {
    if (key === "default") continue;
    
    if (template.keywords.some(keyword => searchText.includes(keyword))) {
      return template;
    }
  }

  return eventTemplates.default;
}

// Format time from "14:30:00" to "2:30 PM"
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Format date to readable format
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function EventsCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(
          "https://app.shortlistpass.com/api/smartpage/palmettotaps/events"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Unable to load events. Please check back later!");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-lg text-neutral-600">
          Loading upcoming events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-neutral-500">
          Check our{" "}
          <a
            href="https://www.facebook.com/profile.php?id=100089634545976"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B7355] hover:underline"
          >
            Facebook
          </a>{" "}
          or{" "}
          <a
            href="https://www.instagram.com/palmettotaps/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B7355] hover:underline"
          >
            Instagram
          </a>{" "}
          for the latest updates!
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-neutral-800 mb-4">
          No Special Events Scheduled
        </h3>
        <p className="text-neutral-600 mb-6">
          Check back soon for live music, special tastings, and community events!
        </p>
        <p className="text-sm text-neutral-500">
          Follow us on social media for the latest announcements:
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://www.facebook.com/profile.php?id=100089634545976"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6F5C45] transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/palmettotaps/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6F5C45] transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event, index) => {
        const template = detectEventType(event.title, event.description);
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
          >
            {/* Event Image/Icon Header */}
            <div className={`relative h-48 bg-gradient-to-br ${template.gradient} overflow-hidden`}>
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url('${template.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl drop-shadow-2xl">{template.icon}</span>
              </div>
              {/* Date Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg px-4 py-2 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-800">
                    {new Date(event.event_date + "T00:00:00").getDate()}
                  </div>
                  <div className="text-xs uppercase font-semibold text-neutral-600">
                    {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-neutral-800 mb-3">
                {event.title}
              </h3>
              
              <div className="space-y-2 mb-4">
                <p className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-5 h-5 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">{formatDate(event.event_date)}</span>
                </p>
                <p className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-5 h-5 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                </p>
              </div>

              {event.description && (
                <p className="text-neutral-700 leading-relaxed">{event.description}</p>
              )}

              {event.location_notes && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="flex items-start gap-2 text-sm text-neutral-600">
                    <svg className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location_notes}</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
