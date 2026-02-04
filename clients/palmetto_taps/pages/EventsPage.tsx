"use client";

import { weeklyEvents, business } from "@/clients/palmetto_taps/content/business";
import { EventsCalendar } from "@/clients/palmetto_taps/components/EventsCalendar";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#E4DED4]">
      {/* Hero Section - Match homepage branding */}
      <section className="py-16 px-6 bg-[#1F1F1E] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What's Happening</h1>
          <p className="text-xl text-white/80">
            Live music, special deals, and good times every week
          </p>
        </div>
      </section>

      {/* Special Events from SmartPage */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F1F1E] mb-8 text-center">
            Upcoming Special Events
          </h2>
          <EventsCalendar />
        </div>
      </section>

      {/* Weekly Recurring Events */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F1F1E] mb-4 text-center">
            Weekly Schedule
          </h2>
          <p className="text-center text-neutral-600 mb-10">
            Something special every day of the week!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyEvents.map((event, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#E4DED4] to-[#D4CFC5] rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border border-[#8B6A4F]/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#1F1F1E] text-white flex items-center justify-center font-bold text-sm border-2 border-[#8B6A4F]">
                    {event.day.slice(0, 3)}
                  </div>
                  <h3 className="text-xl font-bold text-[#1F1F1E]">
                    {event.name}
                  </h3>
                </div>
                <p className="text-neutral-700">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-[#1F1F1E] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Follow us on social media for last-minute announcements, event updates, and more!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={business.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-[#1F1F1E] rounded-lg font-semibold hover:bg-[#E4DED4] transition-colors"
            >
              Follow on Facebook
            </a>
            <a
              href={business.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-[#1F1F1E] rounded-lg font-semibold hover:bg-[#E4DED4] transition-colors"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
