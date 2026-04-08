'use client'

import { DollarSign, Calendar, Video, Globe, Bot, Lightbulb, UserCheck, BarChart3, MessageCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const services = [
  {
    icon: MessageCircle,
    title: 'Social Media Management',
    description: 'We handle your content calendar, posting, and engagement. You choose how many posts per month — we take care of the rest.',
  },
  {
    icon: Video,
    title: 'Video Editing',
    description: 'Raw footage in, polished content out. Reels, TikToks, promos. We agree on a number of edits per month based on your needs.',
  },
  {
    icon: Globe,
    title: 'Website Design & Maintenance',
    description: 'A custom-built website for your business plus ongoing updates, hosting, and support to keep everything running smoothly.',
  },
  {
    icon: Bot,
    title: 'AI SmartAssistant',
    description: 'A trained AI chatbot for your business that handles customer questions 24/7 — on your website, social pages, or via link.',
  },
  {
    icon: Lightbulb,
    title: 'Brand Strategy & Consulting',
    description: 'Planning, positioning, and creative direction. We help you figure out your voice, your look, and your growth plan.',
  },
]

const timeline = [
  { icon: UserCheck, title: 'Onboarding & Strategy Call', description: 'We learn your business, set goals, and agree on deliverables.' },
  { icon: Calendar, title: 'Content Creation Begins', description: 'We get to work building, designing, and creating for you.' },
  { icon: BarChart3, title: 'Monthly Reporting & Check-ins', description: 'Regular updates on progress, performance, and next steps.' },
]

const faqs = [
  {
    q: 'Why don\'t you charge per post or per edit?',
    a: 'Every piece of content requires different levels of planning, timing, and editing. If we billed hourly, our fees would be significantly higher. A flat monthly rate keeps things simple and affordable for you.',
  },
  {
    q: 'How is my monthly fee calculated?',
    a: 'We agree on your deliverables and charge a flat rate for the contract period. That total is divided evenly across the months so billing is predictable.',
  },
  {
    q: 'What if I want more than what\'s in my plan?',
    a: 'No problem — we can adjust your scope at any time. Additional deliverables just require a written agreement so everyone is aligned.',
  },
  {
    q: 'How do prorated credits or refunds work?',
    a: 'Credits are calculated based on the daily rate of your contract — not per individual post or deliverable. This keeps things fair and straightforward.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-[#333333] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-white">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && <p className="text-gray-400 text-sm mt-3 leading-relaxed">{a}</p>}
    </button>
  )
}

export default function HowWeWorkPage() {
  return (
    <div className="p-4 lg:p-8 max-w-4xl">
      {/* Hero */}
      <div className="mb-12">
        <Link href="/client-portal/services" className="text-gray-400 hover:text-white text-sm">&larr; Back to Services</Link>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mt-4">How We Work</h1>
        <p className="text-gray-400 mt-3 text-lg leading-relaxed max-w-2xl">
          We build, manage, and grow your digital presence — on your terms. Here&apos;s how our services and billing work so there are never any surprises.
        </p>
      </div>

      {/* Billing Model */}
      <div className="bg-[#2a3a2e] border border-[#2E8B57]/20 rounded-xl p-6 lg:p-8 mb-10">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-[#2E8B57]/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-[#2E8B57]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-3">Simple, Flat-Rate Billing</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We charge a flat monthly fee divided over your contract period. We don&apos;t bill per post, per edit, or per hour.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              Every piece of content requires different levels of planning, timing, and editing. If we billed by the hour, our fees would be significantly higher. Instead, we agree on deliverables — like a set number of posts or video edits per month — and charge a flat rate for the time period. Simple and predictable.
            </p>
          </div>
        </div>
      </div>

      {/* Our Services */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-6">Our Services</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="bg-[#333333] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                  <svc.icon className="w-5 h-5 text-[#2E8B57]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{svc.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{svc.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What to Expect */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-6">What to Expect</h2>
        <div className="space-y-4">
          {timeline.map((step, i) => (
            <div key={step.title} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#2E8B57] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                {i < timeline.length - 1 && <div className="w-px h-8 bg-[#2E8B57]/30 mt-1" />}
              </div>
              <div className="pb-4">
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policies */}
      <div className="bg-[#333333] border border-white/5 rounded-xl p-6 lg:p-8 mb-10">
        <h2 className="text-xl font-bold text-white mb-4">Our Policies</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-[#2E8B57] mt-1">&#10003;</span>
            <span className="text-gray-300 text-sm">Billing is time-based, not per-deliverable. Your rate covers the agreed scope for the contract period.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#2E8B57] mt-1">&#10003;</span>
            <span className="text-gray-300 text-sm">Prorated credits are calculated on the daily rate — not on a per-post or per-edit basis.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#2E8B57] mt-1">&#10003;</span>
            <span className="text-gray-300 text-sm">Scope changes (more posts, new services, etc.) require a written agreement so everyone stays aligned.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#2E8B57] mt-1">&#10003;</span>
            <span className="text-gray-300 text-sm">Cancellations require 30 days&apos; written notice.</span>
          </li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-white/5">
        <p className="text-gray-500 text-sm">
          Questions? Reach out to your account manager anytime.
        </p>
      </div>
    </div>
  )
}
