'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Pen,
  Globe2,
  Star,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Target,
  Sparkles,
  GraduationCap,
  Quote,
  ChevronDown,
} from 'lucide-react';
import Nav from '@/clients/growwithgia/components/Nav';
import Footer from '@/clients/growwithgia/components/Footer';

// ─── PALETTE (from the screenshot) ───
const PETAL_COLORS = {
  pink: '#F2A1B3',
  teal: '#8DD3D6',
  yellow: '#F0D264',
  lavender: '#C6B4E2',
};
const BG_CREAM = '#FAF5EF';
// Text colors match petal order: pink, teal, yellow, lavender — cycling
const TEXT_COLORS = ['#E88BA0', '#6BBFC4', '#D4A843', '#A08EC8', '#E88BA0', '#6BBFC4', '#D4A843', '#A08EC8', '#E88BA0', '#6BBFC4', '#D4A843', '#A08EC8'];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ─── PETAL SPLASH HERO ───

function PetalSplashHero() {
  const [showText, setShowText] = useState(false);
  const [petalsReady, setPetalsReady] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const title = 'Grow with Gia';

  useEffect(() => {
    const petalTimer = setTimeout(() => {
      setPetalsReady(true);
      setShowText(true);
    }, 1800);

    const scrollTimer = setTimeout(() => {
      setShowScrollHint(true);
    }, 4500);

    return () => {
      clearTimeout(petalTimer);
      clearTimeout(scrollTimer);
    };
  }, []);

  // SVG flower: 8 petals radiating from center. Sized so the flower
  // fills the viewport with petal tips just bleeding off the edges.
  const petalCount = 6;
  const petalColors = [
    PETAL_COLORS.pink,
    PETAL_COLORS.teal,
    PETAL_COLORS.yellow,
    PETAL_COLORS.lavender,
    PETAL_COLORS.pink,
    PETAL_COLORS.teal,
  ];
  // SVG viewBox 1000x1000, center 500,500
  const cx = 500, cy = 500;
  const circleR = 155;  // center circle — big enough for text
  const petalRx = 175;  // petal half-width — wider, rounder petals
  const petalRy = 320;  // petal length
  const petalOffset = circleR + petalRy - 70; // more overlap — petals curl over circle edge

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: BG_CREAM }}>

      {/* Text — centered, inside the circle, on top */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <AnimatePresence>
          {showText && (
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight select-none" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                {title.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.1,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    style={{
                      color: char === ' ' ? 'transparent' : TEXT_COLORS[i % TEXT_COLORS.length],
                      display: 'inline-block',
                      whiteSpace: 'pre',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                className="text-sm sm:text-base md:text-lg mt-2 tracking-wide text-slate-500"
                style={{ fontFamily: "'Georgia', serif" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                Personalized Tutoring
              </motion.p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* SVG flower — petals + cream center circle */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.svg
          viewBox="0 0 1000 1000"
          className="w-[145vmin] h-[145vmin] md:w-[125vmin] md:h-[125vmin]"
          style={{ overflow: 'visible' }}
          animate={petalsReady ? { rotate: 360 } : { rotate: 0 }}
          transition={petalsReady ? {
            duration: 120,
            repeat: Infinity,
            ease: 'linear',
          } : {}}
        >
          {/* Center circle — cream, drawn first (behind petals) */}
          <circle
            cx={cx}
            cy={cy}
            r={circleR}
            fill={BG_CREAM}
          />

          {/* Petals — drawn on top, bases overlap the circle edge */}
          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = (360 / petalCount) * i;
            return (
              <motion.ellipse
                key={i}
                cx={cx}
                cy={cy - petalOffset}
                rx={petalRx}
                ry={petalRy}
                fill={petalColors[i]}
                transform={`rotate(${angle}, ${cx}, ${cy})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.88 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.15,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </motion.svg>
      </div>

      {/* Scroll hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-sm font-medium" style={{ color: '#A08EC8' }}>Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5" style={{ color: '#A08EC8' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── MAIN PAGE ───

export function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: BG_CREAM }}>
      <PetalSplashHero />
      <Nav />

      {/* ─── INTRO / TAGLINE ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: PETAL_COLORS.lavender }}>
              <Sparkles className="w-4 h-4" />
              Private Tutoring
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 leading-tight mb-6" style={{ fontFamily: "'Georgia', serif" }}>
              Every student can{' '}
              <span style={{ color: PETAL_COLORS.yellow }}>grow.</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
              Personalized, one-on-one tutoring tailored to your child&apos;s learning style. From math to writing, we meet students where they are and help them build confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-12 px-6 mx-6 md:mx-12 rounded-3xl" style={{ backgroundColor: PETAL_COLORS.teal }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: '150+', label: 'Students Tutored' },
            { value: '4.9', label: 'Average Rating' },
            { value: '8+', label: 'Subjects Offered' },
            { value: '95%', label: 'See Grade Improvement' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl md:text-4xl font-bold">{s.value}</p>
              <p className="text-white/80 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-3xl p-8 relative" style={{ backgroundColor: `${PETAL_COLORS.pink}20` }}>
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: PETAL_COLORS.yellow }}>
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Georgia', serif" }}>Meet Gia</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                With over 5 years of experience in education, Gia specializes in making complex subjects feel simple. Whether your child is struggling with algebra or wants to get ahead in science, Gia creates a personalized plan that works.
              </p>
              <p className="text-slate-600 leading-relaxed italic">
                &ldquo;I believe every student has the ability to succeed &mdash; they just need someone who believes in them and knows how to unlock their potential.&rdquo;
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
              Why parents choose{' '}
              <span style={{ color: PETAL_COLORS.lavender }}>Grow With Gia</span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: Target, text: 'Customized lesson plans for each student', color: PETAL_COLORS.pink },
                { icon: Clock, text: 'Flexible scheduling — in-person or virtual', color: PETAL_COLORS.teal },
                { icon: Users, text: 'Regular progress updates for parents', color: PETAL_COLORS.yellow },
                { icon: CheckCircle2, text: 'Proven results — most students improve within weeks', color: PETAL_COLORS.lavender },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${item.color}25` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <p className="text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SUBJECTS ─── */}
      <section id="subjects" className="py-24 px-6" style={{ backgroundColor: `${PETAL_COLORS.teal}10` }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Georgia', serif" }}>Subjects We Cover</h2>
            <p className="text-slate-500 text-lg">From elementary through high school</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Calculator, name: 'Math', desc: 'Algebra, Geometry, Pre-Calc, and more', color: PETAL_COLORS.pink },
              { icon: FlaskConical, name: 'Science', desc: 'Biology, Chemistry, Earth Science', color: PETAL_COLORS.yellow },
              { icon: Pen, name: 'Writing & ELA', desc: 'Essays, reading comprehension, grammar', color: PETAL_COLORS.teal },
              { icon: Globe2, name: 'Social Studies', desc: 'History, geography, civics', color: PETAL_COLORS.lavender },
              { icon: BookOpen, name: 'Reading', desc: 'Phonics, fluency, and comprehension', color: PETAL_COLORS.pink },
              { icon: Star, name: 'Test Prep', desc: 'SAT, ACT, state assessments', color: PETAL_COLORS.yellow },
            ].map((subject, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all"
                style={{ borderColor: `${subject.color}20` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${subject.color}20` }}>
                  <subject.icon className="w-6 h-6" style={{ color: subject.color }} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">{subject.name}</h3>
                <p className="text-slate-500 text-sm">{subject.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Georgia', serif" }}>How It Works</h2>
            <p className="text-slate-500 text-lg">Getting started is easy</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Free Intro Call', desc: 'We chat about your student\'s goals, challenges, and learning style.', color: PETAL_COLORS.pink },
              { step: '2', title: 'Custom Plan', desc: 'Gia builds a personalized lesson plan tailored to your child.', color: PETAL_COLORS.teal },
              { step: '3', title: 'Watch Them Grow', desc: 'Regular sessions, progress tracking, and parent updates.', color: PETAL_COLORS.yellow },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full text-white text-xl font-bold flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: item.color }}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 px-6" style={{ backgroundColor: `${PETAL_COLORS.lavender}12` }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Georgia', serif" }}>What Parents Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'My daughter went from a C to an A in math within two months. Gia made her actually enjoy studying.',
                name: 'Sarah M.',
                detail: 'Parent of 7th grader',
                color: PETAL_COLORS.pink,
              },
              {
                quote: 'Gia is patient, creative, and always prepared. My son looks forward to his tutoring sessions now.',
                name: 'David T.',
                detail: 'Parent of 4th grader',
                color: PETAL_COLORS.teal,
              },
              {
                quote: 'We tried three other tutors before Gia. She was the first one who truly connected with our kid.',
                name: 'Maria L.',
                detail: 'Parent of 10th grader',
                color: PETAL_COLORS.lavender,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border shadow-sm"
                style={{ borderColor: `${t.color}30` }}
              >
                <Quote className="w-8 h-8 mb-3" style={{ color: `${t.color}50` }} />
                <p className="text-slate-700 leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT / CTA ─── */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Georgia', serif" }}>
              Ready to get started?
            </h2>
            <p className="text-lg text-slate-500 mb-8">
              Book a free intro session and see how Gia can help your student thrive.
            </p>
            <div className="rounded-3xl p-8 text-left" style={{ backgroundColor: `${PETAL_COLORS.pink}12` }}>
              <div className="space-y-4">
                {[
                  'Free 15-minute intro call — no commitment',
                  'In-person (Myrtle Beach area) or virtual',
                  'Flexible scheduling — evenings and weekends available',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: PETAL_COLORS.yellow }} />
                    <span className="text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:hello@growwithgia.com"
                  className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: PETAL_COLORS.lavender }}
                >
                  Email Gia
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="tel:8432221234"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  Call (843) 222-1234
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
