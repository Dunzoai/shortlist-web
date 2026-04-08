'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Mail,
  MessageCircleWarning,
  Globe,
  AlertTriangle,
  Bot,
  BellRing,
  LayoutList,
  CalendarCheck,
  Store,
  ShieldCheck,
  Star,
  Truck,
  Zap,
  Map,
  Tag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Phone,
  AtSign,
  Youtube,
  Coffee,
  Home,
  Users,
  Building2,
  Send,
  CheckCircle2,
  DollarSign,
  Heart,
  ArrowRight,
} from 'lucide-react';

const TOTAL_SLIDES = 9;

export default function HoaPitchPage() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  return (
    <div className="fixed inset-0 bg-[#0B1018] text-white overflow-hidden select-none" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Slide counter */}
      <div className="absolute top-6 right-6 z-50 text-sm font-mono text-white/40 tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(TOTAL_SLIDES).padStart(2, '0')}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full transition-all duration-200 ${current === 0 ? 'opacity-0 pointer-events-none' : 'opacity-40 hover:opacity-100 hover:bg-white/10'}`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full transition-all duration-200 ${current === TOTAL_SLIDES - 1 ? 'opacity-0 pointer-events-none' : 'opacity-40 hover:opacity-100 hover:bg-white/10'}`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-50 h-1 bg-white/5">
        <motion.div
          className="h-full bg-[#34D399]"
          animate={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {current === 0 && <SlideHero onNext={next} />}
          {current === 1 && <SlideProblem />}
          {current === 2 && <SlideSolution />}
          {current === 3 && <SlideSmartAssistant />}
          {current === 4 && <SlideLocalBusiness />}
          {current === 5 && <SlideLiveProof />}
          {current === 6 && <SlideNetwork />}
          {current === 7 && <SlidePricing />}
          {current === 8 && <SlideClose />}
        </motion.div>
      </AnimatePresence>

      {/* Dot navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-[#34D399] w-6' : 'bg-white/20 hover:bg-white/40'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Shared Components ─── */

function SlideWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-full w-full flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 ${className}`}>
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#34D399] text-xs font-semibold uppercase tracking-[0.2em] mb-6 px-3 py-1.5 rounded-full border border-[#34D399]/20 bg-[#34D399]/5">
      {children}
    </span>
  );
}

/* ─── SLIDE 1: HERO ─── */

function SlideHero({ onNext }: { onNext: () => void }) {
  return (
    <SlideWrapper>
      <div className="max-w-4xl text-center">
        <Badge>
          <Home className="w-3.5 h-3.5" />
          SmartPages for HOA Communities
        </Badge>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
          Your community deserves better than a{' '}
          <span className="text-[#34D399]">burn ban sign</span>{' '}
          stuck in the ground.
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          SmartPages is the always-on community platform built for HOA communities.{' '}
          <span className="text-white font-medium">Free for Waterbridge. Forever.</span>
        </p>

        <button
          onClick={onNext}
          className="group inline-flex items-center gap-2 bg-[#34D399] text-[#0B1018] font-semibold px-8 py-4 rounded-full text-lg hover:bg-[#6EE7B7] transition-colors duration-200"
        >
          See how it works
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-16 flex flex-col items-center gap-2 text-white/40 text-sm">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-[#34D399]" />
          </div>
          <p className="font-medium text-white/60">Marc Matlioski</p>
          <p>Waterbridge Resident</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-1">
            <span className="flex items-center gap-1.5"><AtSign className="w-3.5 h-3.5" /> hello@shortlistpass.com</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> 862-228-8339</span>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}

/* ─── SLIDE 2: THE PROBLEM ─── */

function SlideProblem() {
  const pains = [
    { icon: Mail, title: 'Email open rate under 10%', desc: 'Your updates go straight to spam — or get buried under promotions.' },
    { icon: MessageCircleWarning, title: 'Facebook is noise and drama', desc: 'Gossip, complaints, and off-topic posts drown out real announcements.' },
    { icon: Globe, title: 'Website nobody visits', desc: 'Static pages that haven\'t been updated in months. Zero engagement.' },
    { icon: AlertTriangle, title: 'A burn ban sign... in 2026', desc: 'Physical signs are the last resort when digital channels have all failed.' },
  ];

  return (
    <SlideWrapper>
      <div className="max-w-5xl w-full">
        <Badge>
          <AlertTriangle className="w-3.5 h-3.5" />
          The Problem
        </Badge>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          You work hard to communicate.
        </h2>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/40 mb-12">
          Residents still miss everything.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8 hover:border-red-500/20 transition-colors group"
            >
              <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

/* ─── SLIDE 3: THE SOLUTION ─── */

function SlideSolution() {
  const features = [
    { icon: Bot, label: 'SmartAssistant AI', desc: 'Residents get instant answers 24/7' },
    { icon: BellRing, label: 'Push Notifications', desc: 'Updates that actually get seen' },
    { icon: LayoutList, label: 'Instagram-Style Feed', desc: 'Beautiful community updates' },
    { icon: CalendarCheck, label: 'Event RSVPs', desc: 'One-tap signups with reminders' },
    { icon: Store, label: 'Business Directory', desc: 'Support local resident businesses' },
  ];

  return (
    <SlideWrapper>
      <div className="max-w-5xl w-full">
        <Badge>
          <Sparkles className="w-3.5 h-3.5" />
          The Solution
        </Badge>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
          One app. Everything.{' '}
          <span className="text-[#34D399]">Always on.</span>
        </h2>
        <p className="text-lg text-white/50 mb-12 max-w-xl">
          A branded SmartPage for your community — no downloads, works on any device.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-[#34D399]/20 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#34D399]/10 flex items-center justify-center mb-4 group-hover:bg-[#34D399]/20 transition-colors">
                <f.icon className="w-5 h-5 text-[#34D399]" />
              </div>
              <h3 className="font-semibold mb-1">{f.label}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

/* ─── SLIDE 4: SMART ASSISTANT ─── */

function SlideSmartAssistant() {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowAnswer(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <SlideWrapper>
      <div className="max-w-4xl w-full">
        <Badge>
          <Bot className="w-3.5 h-3.5" />
          SmartAssistant AI
        </Badge>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 text-center">
          Your 24/7 board member{' '}
          <span className="text-[#34D399]">who never sleeps.</span>
        </h2>
        <p className="text-white/50 text-center mb-10">
          Trained on your community docs. Answers instantly. No board email required.
        </p>

        {/* Mock chat UI */}
        <div className="max-w-lg mx-auto bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <div className="w-9 h-9 rounded-full bg-[#34D399]/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#34D399]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Waterbridge SmartAssistant</p>
              <p className="text-xs text-[#34D399]">Online</p>
            </div>
            <span className="ml-auto text-xs text-white/30 font-mono">2:14 AM</span>
          </div>

          {/* Messages */}
          <div className="p-5 space-y-4 min-h-[240px]">
            {/* User message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex justify-end"
            >
              <div className="bg-[#34D399]/15 border border-[#34D399]/20 rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                <p className="text-sm">What color can I paint my front door?</p>
              </div>
            </motion.div>

            {/* Bot response */}
            <AnimatePresence>
              {showAnswer ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed">
                      Per the Waterbridge ARB Guidelines (Section 4.2), front doors may be painted in any of the{' '}
                      <span className="text-[#34D399] font-medium">12 pre-approved accent colors</span>{' '}
                      listed in Appendix B. Most popular choices are Charleston Green, Heron Blue, and Classic Burgundy. You&apos;ll need ARB approval before painting — I can walk you through the request form if you&apos;d like!
                    </p>
                    <p className="text-xs text-white/30 mt-2">Source: ARB Guidelines v2024, Section 4.2</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5 py-1">
                      <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="px-5 pb-4">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-2.5">
              <span className="text-sm text-white/30 flex-1">Ask anything about your community...</span>
              <Send className="w-4 h-4 text-[#34D399]/50" />
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-6 max-w-md mx-auto">
          No board email. No waiting. Instant answers from your own community documents.
        </p>
      </div>
    </SlideWrapper>
  );
}

/* ─── SLIDE 5: LOCAL BUSINESS ─── */

function SlideLocalBusiness() {
  const features = [
    { icon: ShieldCheck, title: 'Verified resident businesses only', desc: 'Every listing is tied to a real resident in your community.' },
    { icon: Star, title: 'Real transaction-verified reviews', desc: 'Only people who actually purchased can leave a review.' },
    { icon: Truck, title: 'Food truck pre-ordering', desc: 'Residents order ahead — trucks show up ready to serve.' },
    { icon: Zap, title: 'Orders, bookings, questions — one tap', desc: 'Everything happens inside the app. No phone tag.' },
  ];

  return (
    <SlideWrapper>
      <div className="max-w-5xl w-full">
        <Badge>
          <Heart className="w-3.5 h-3.5" />
          Local Business Directory
        </Badge>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
          Neighbors supporting neighbors —{' '}
          <span className="text-[#34D399]">built into the app.</span>
        </h2>
        <p className="text-lg text-white/50 mb-12 max-w-xl">
          A resident-only marketplace that keeps dollars in the community.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i, duration: 0.5 }}
              className="flex gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-[#34D399]/20 transition-colors"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl bg-[#34D399]/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-[#34D399]" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

/* ─── SLIDE 6: LIVE PROOF ─── */

function SlideLiveProof() {
  const stats = [
    { value: '400+', label: 'Homes at Clear Pond', sub: 'Live today' },
    { value: '5+', label: 'Communities onboarding', sub: 'And growing' },
    { value: '$0', label: 'Cost to Waterbridge', sub: 'Ever' },
  ];

  const communities = [
    'Clear Pond HOA',
    'The Bluffs on the Waterway',
    'Berkshire HOA',
    'Covington Lake East',
    'Carolina Waterway Plantation',
  ];

  return (
    <SlideWrapper>
      <div className="max-w-5xl w-full">
        <Badge>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Live Proof
        </Badge>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-12 text-center">
          Already running{' '}
          <span className="text-[#34D399]">in your backyard.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8 text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-[#34D399] mb-2">{s.value}</p>
              <p className="font-semibold text-lg">{s.label}</p>
              <p className="text-white/40 text-sm mt-1">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-white/40 uppercase tracking-widest mb-4">Communities in the network</p>
          <div className="flex flex-wrap justify-center gap-3">
            {communities.map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + 0.1 * i }}
                className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-white/70"
              >
                <Building2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-[#34D399]/60" />
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}

/* ─── SLIDE 7: THE NETWORK ─── */

function SlideNetwork() {
  const features = [
    { icon: Map, title: 'City-wide events assistant', desc: 'Residents discover what\'s happening across Myrtle Beach — concerts, markets, festivals — all surfaced by AI.' },
    { icon: Tag, title: 'Exclusive resident deals', desc: 'Local businesses offer special pricing only to verified community members. Real perks, not spam.' },
    { icon: Sparkles, title: 'Personal AI concierge (coming soon)', desc: '"Plan a date night this Friday" — your AI knows your neighborhood, your preferences, and what\'s available.' },
  ];

  return (
    <SlideWrapper>
      <div className="max-w-5xl w-full">
        <Badge>
          <Globe className="w-3.5 h-3.5" />
          The Network Effect
        </Badge>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 text-center">
          Waterbridge connects to{' '}
          <span className="text-[#34D399]">all of Myrtle Beach.</span>
        </h2>
        <p className="text-lg text-white/50 mb-12 text-center max-w-2xl mx-auto">
          Every community in the network makes your residents&apos; experience richer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8 text-center hover:border-[#34D399]/20 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#34D399]/10 flex items-center justify-center mx-auto mb-5">
                <f.icon className="w-6 h-6 text-[#34D399]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

/* ─── SLIDE 8: PRICING ─── */

function SlidePricing() {
  return (
    <SlideWrapper>
      <div className="max-w-4xl w-full">
        <Badge>
          <DollarSign className="w-3.5 h-3.5" />
          Pricing
        </Badge>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-12 text-center">
          Free for Waterbridge.{' '}
          <span className="text-[#34D399]">Forever.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Left - Pricing */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#34D399]/5 border border-[#34D399]/20 rounded-2xl p-8"
          >
            <p className="text-6xl md:text-7xl font-bold text-[#34D399] mb-2">$0</p>
            <p className="text-xl text-white/70 mb-6">per month</p>
            <div className="space-y-3">
              {['No contract', 'No setup fee', 'No hidden costs', 'No catch'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - How it's funded */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8"
          >
            <p className="text-sm text-white/40 uppercase tracking-widest mb-4">How it&apos;s funded</p>
            <h3 className="text-2xl font-bold mb-4">Local businesses pay to be featured.</h3>
            <p className="text-white/50 leading-relaxed mb-6">
              Restaurants, contractors, and service providers pay a small fee to reach verified residents. Your community gets a free platform. Local businesses get real customers. Everyone wins.
            </p>
            <div className="flex items-center gap-2 text-[#34D399] text-sm font-medium">
              <Store className="w-4 h-4" />
              <span>Businesses fund it. Residents benefit.</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center bg-white/[0.02] border border-white/[0.04] rounded-xl px-6 py-4"
        >
          <p className="text-white/60">
            <span className="text-[#34D399] font-semibold">Setup done for you.</span>{' '}
            Live in days, not months. We handle everything.
          </p>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}

/* ─── SLIDE 9: CLOSE ─── */

function SlideClose() {
  return (
    <SlideWrapper>
      <div className="max-w-3xl w-full text-center">
        <Badge>
          <Coffee className="w-3.5 h-3.5" />
          Let&apos;s Talk
        </Badge>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
          Let&apos;s get Waterbridge{' '}
          <span className="text-[#34D399]">on the map.</span>
        </h2>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 mb-10 relative"
        >
          <div className="text-[#34D399]/20 text-6xl font-serif absolute top-4 left-6">&ldquo;</div>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed italic relative z-10 pt-4">
            I built this for my own community. I live here. I want Waterbridge to have what Clear Pond already has.
          </p>
          <p className="text-white/40 mt-4 text-sm">— Marc Matlioski, Waterbridge Resident</p>
        </motion.div>

        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="inline-block bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm">
            <a href="mailto:hello@shortlistpass.com" className="flex items-center gap-3 hover:text-[#34D399] transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-[#34D399]/10 flex items-center justify-center group-hover:bg-[#34D399]/20 transition-colors">
                <AtSign className="w-4 h-4 text-[#34D399]" />
              </div>
              <span>hello@shortlistpass.com</span>
            </a>
            <a href="tel:8622288339" className="flex items-center gap-3 hover:text-[#34D399] transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-[#34D399]/10 flex items-center justify-center group-hover:bg-[#34D399]/20 transition-colors">
                <Phone className="w-4 h-4 text-[#34D399]" />
              </div>
              <span>862-228-8339</span>
            </a>
            <a href="https://youtu.be/yJtm6-IwmX8" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#34D399] transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-[#34D399]/10 flex items-center justify-center group-hover:bg-[#34D399]/20 transition-colors">
                <Youtube className="w-4 h-4 text-[#34D399]" />
              </div>
              <span>Watch the demo</span>
            </a>
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-9 h-9 rounded-lg bg-[#34D399]/10 flex items-center justify-center">
                <Coffee className="w-4 h-4 text-[#34D399]" />
              </div>
              <span>Coffee demo anytime — I live down the street</span>
            </div>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  );
}
