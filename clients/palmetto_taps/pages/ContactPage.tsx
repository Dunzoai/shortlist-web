"use client";

import { motion } from "framer-motion";
import { business } from "@/clients/palmetto_taps/content/business";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#1F1F1E]">
      {/* Header */}
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
            Contact Us
          </motion.h1>
          <div className="w-24 h-[2px] bg-white/30 mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg"
          >
            We'd love to hear from you
          </motion.p>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#2A2A28] rounded-lg p-8"
            >
              <h2 className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-4">Location</h2>
              <p className="text-white text-xl font-semibold mb-2">{business.name}</p>
              <p className="text-white/70 mb-4">
                {business.address.street}<br />
                {business.address.city}, {business.address.state} {business.address.zip}
              </p>
              <p className="text-white/50 text-sm mb-6">{business.locationNote}</p>
              <a
                href={business.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#8B6A4F] hover:bg-[#A07D5C] text-white font-semibold px-6 py-3 rounded transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Get Directions
              </a>
            </motion.div>

            {/* Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#2A2A28] rounded-lg p-8"
            >
              <h2 className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-4">Hours</h2>
              <div className="text-white/70 space-y-2">
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>{business.hours.sunday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monday</span>
                  <span>{business.hours.monday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday</span>
                  <span>{business.hours.tuesday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span>{business.hours.wednesday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday</span>
                  <span>{business.hours.thursday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span>{business.hours.friday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>{business.hours.saturday}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-[#8B6A4F] font-semibold">Happy Hour: {business.happyHour}</p>
              </div>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#2A2A28] rounded-lg p-8"
            >
              <h2 className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-4">Get In Touch</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-white/50 text-sm mb-1">Phone</p>
                  <a href={`tel:${business.phone}`} className="text-white text-xl font-semibold hover:text-[#D4C4A8] transition-colors">
                    {business.phone}
                  </a>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-1">Email</p>
                  <a href={`mailto:${business.email}`} className="text-white text-xl font-semibold hover:text-[#D4C4A8] transition-colors">
                    {business.email}
                  </a>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-white/50 text-sm mb-3">Follow Us</p>
                <div className="flex gap-4">
                  <a
                    href={business.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#D4C4A8] transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href={business.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#D4C4A8] transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href={business.untappd.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#D4C4A8] transition-colors"
                  >
                    Untappd
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Private Events Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#2A2A28] rounded-lg p-8"
            >
              <h2 className="text-[#8B6A4F] text-sm uppercase tracking-widest mb-4">Private Events</h2>
              <p className="text-white/70 mb-4">
                Whether it's a birthday party, baby shower, office function, or any special event, please call us and we'll do our best to accommodate your desired date and any requests you may have to make your party/celebration memorable.
              </p>
              <p className="text-white/70 mb-6">
                Private events are available. Please call for pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${business.phone}`}
                  className="inline-block bg-[#8B6A4F] hover:bg-[#A07D5C] text-white font-semibold px-6 py-3 rounded transition-all duration-300 uppercase tracking-wide text-sm text-center"
                >
                  Call Us
                </a>
                <a
                  href={`mailto:${business.email}?subject=Private Event Inquiry`}
                  className="inline-block border border-[#8B6A4F] hover:bg-[#8B6A4F] text-white font-semibold px-6 py-3 rounded transition-all duration-300 uppercase tracking-wide text-sm text-center"
                >
                  Email Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
