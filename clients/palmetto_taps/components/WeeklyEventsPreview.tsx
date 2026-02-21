"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
}

// Placeholder messages for days without events
const PLACEHOLDER_MESSAGES = [
  { title: "How does a flight sound?", description: "Stop in for a bite and a pint" },
  { title: "40 taps waiting", description: "Pour your own perfect beer" },
  { title: "Happy Hour", description: "Daily 5pm – 7pm" },
  { title: "Open today", description: "Self-serve beer & good vibes" },
  { title: "Something special", description: "Check out today's taps" },
  { title: "Thirsty?", description: "We've got 40 beers on tap" },
  { title: "Pour your own", description: "Try as many as you want" },
  { title: "Taproom vibes", description: "Games, patio, cold beer" },
];

// Get consistent placeholder for a date
function getPlaceholderForDate(dateStr: string) {
  const hash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % PLACEHOLDER_MESSAGES.length;
  return PLACEHOLDER_MESSAGES[index];
}

// Get day name from date string
function getDayName(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
}

export function WeeklyEventsPreview() {
  const [weekEvents, setWeekEvents] = useState<{ day: string; title: string; description: string; isPlaceholder: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://app.shortlistpass.com/api/smartpage/palmettotaps/events");
        const data = await response.json();
        const events: Event[] = data.events || [];

        // Get next 7 days
        const today = new Date();
        const week = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          week.push(date.toISOString().split("T")[0]);
        }

        // Map events to days
        const eventsByDate: Record<string, Event> = {};
        events.forEach((event) => {
          if (!eventsByDate[event.event_date]) {
            eventsByDate[event.event_date] = event;
          }
        });

        // Build week with events or placeholders
        const weekData = week.map((dateStr) => {
          const event = eventsByDate[dateStr];
          const day = getDayName(dateStr);

          if (event) {
            return {
              day,
              title: event.title,
              description: event.description || "See you there!",
              isPlaceholder: false,
            };
          } else {
            const placeholder = getPlaceholderForDate(dateStr);
            return {
              day,
              title: placeholder.title,
              description: placeholder.description,
              isPlaceholder: true,
            };
          }
        });

        setWeekEvents(weekData);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Show placeholders on error
        const today = new Date();
        const week = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateStr = date.toISOString().split("T")[0];
          const day = getDayName(dateStr);
          const placeholder = getPlaceholderForDate(dateStr);
          week.push({
            day,
            title: placeholder.title,
            description: placeholder.description,
            isPlaceholder: true,
          });
        }
        setWeekEvents(week);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/70 rounded-lg p-6 shadow-md animate-pulse">
            <div className="h-6 bg-neutral-300 rounded mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Show first 4 days for homepage preview
  const previewEvents = weekEvents.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {previewEvents.map((event, index) => (
        <div
          key={index}
          className={`rounded-lg p-6 shadow-md transition-all hover:shadow-xl ${
            event.isPlaceholder
              ? "bg-white/70 border border-neutral-200"
              : "bg-white border-2 border-[#8B6A4F]"
          }`}
        >
          <div className="text-sm font-semibold text-neutral-500 mb-2">{event.day}</div>
          <h3 className={`text-xl font-bold mb-2 ${event.isPlaceholder ? "italic" : ""}`}>
            {event.title}
          </h3>
          <p className="text-neutral-600 text-sm">{event.description}</p>
        </div>
      ))}
    </div>
  );
}
