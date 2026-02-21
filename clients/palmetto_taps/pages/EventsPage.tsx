"use client";

import { business } from "@/clients/palmetto_taps/content/business";
import { EventsCalendar } from "@/clients/palmetto_taps/components/EventsCalendar";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#E4DED4]">
      {/* Hero Section - Match homepage branding */}
      <section className="py-16 px-6 bg-[#1F1F1E] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What's Happening</h1>
          <p className="text-xl text-white/80">
            Live music, special tastings, and community events
          </p>
        </div>
      </section>

      {/* Events from SmartPage */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F1F1E] mb-8 text-center">
            Upcoming Events
          </h2>
          <EventsCalendar />
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
