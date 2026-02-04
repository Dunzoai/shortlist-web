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
    <div className="space-y-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-[#8B7355]"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                  {event.title}
                </h3>
                <div className="space-y-1 text-neutral-600">
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[#8B7355]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-semibold">{formatDate(event.event_date)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[#8B7355]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </span>
                  </p>
                  {event.location_notes && (
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#8B7355]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{event.location_notes}</span>
                    </p>
                  )}
                </div>
                {event.description && (
                  <p className="mt-4 text-neutral-700">{event.description}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
