'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Image from 'next/image';
import {
  Calculator,
  FlaskConical,
  Pen,
  Globe2,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Quote,
  ChevronDown,
  Languages,
  Send,
  GripVertical,
  X,
  Heart,
  Users,
  GraduationCap,
  Sun,
  BookOpen,
  Telescope,
  ShieldCheck,
  Baby,
  Clock,
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
  const petalOffset = circleR + petalRy - 40; // slight overlap at base

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: BG_CREAM }}>

      {/* Text — centered, inside the circle, on top */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <AnimatePresence>
          {showText && (
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight select-none" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
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
                className="text-sm sm:text-base md:text-lg mt-0.5 tracking-wide text-slate-500"
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
          {/* Petals — drawn first (behind circle) */}
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

          {/* Center circle — cream, on top of petal bases */}
          <circle
            cx={cx}
            cy={cy}
            r={circleR}
            fill={BG_CREAM}
          />
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

// ─── DECORATIVE VINE SVG ───

function DecoVine() {
  // Positioned in <main>. Top at 50vh (center of hero where white circle is).
  // SVG spans from there down through about + form sections.
  // Stem starts at top-center (behind flower petals) and wanders to bottom-right.
  // z-[5] puts it behind the flower's z-10 petals layer.
  return (
    <svg
      className="absolute pointer-events-none z-[5]"
      width="55%"
      height="2200px"
      viewBox="0 0 550 2200"
      fill="none"
      preserveAspectRatio="none"
      style={{ opacity: 0.18, top: '50vh', right: 0 }}
    >
      {/* Stem: top-center (~x:50) winding down to bottom-right (~x:520) */}
      <path
        d={[
          'M50 0',
          'C60 80 120 140 100 240',
          'C80 340 160 400 180 500',
          'C200 600 140 660 190 760',
          'C240 860 310 920 290 1020',
          'C270 1120 350 1180 370 1280',
          'C390 1380 330 1440 380 1540',
          'C430 1640 480 1700 500 1800',
          'C520 1900 560 1960 600 2060',
          'C640 2130 700 2170 750 2200',
        ].join(' ')}
        stroke="#86efac"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaf 1 — right (~y:180) */}
      <g transform="translate(110, 180) rotate(30)">
        <path d="M0 0 C7 -12 20 -16 26 -9 C32 -2 19 7 0 0Z" fill="#86efac" />
      </g>
      {/* Leaf 2 — left (~y:400) */}
      <g transform="translate(155, 420) rotate(-35)">
        <path d="M0 0 C-8 -14 -24 -18 -30 -10 C-36 -2 -22 8 0 0Z" fill="#86efac" />
      </g>
      {/* Leaf 3 — right (~y:640) */}
      <g transform="translate(195, 660) rotate(32)">
        <path d="M0 0 C8 -14 24 -18 30 -10 C36 -2 22 8 0 0Z" fill="#86efac" />
      </g>
      {/* Leaf 4 — left (~y:880) */}
      <g transform="translate(280, 880) rotate(-30)">
        <path d="M0 0 C-7 -12 -20 -16 -25 -9 C-30 -2 -18 7 0 0Z" fill="#86efac" />
      </g>
      {/* Leaf 5 — right (~y:1120) */}
      <g transform="translate(365, 1140) rotate(35)">
        <path d="M0 0 C7 -12 20 -16 26 -9 C32 -2 19 7 0 0Z" fill="#86efac" />
      </g>
      {/* Leaf 6 — left (~y:1380) */}
      <g transform="translate(350, 1360) rotate(-38)">
        <path d="M0 0 C-8 -13 -22 -17 -28 -10 C-34 -3 -20 8 0 0Z" fill="#86efac" />
      </g>
      {/* Leaf 7 — right (~y:1620) */}
      <g transform="translate(445, 1640) rotate(28)">
        <path d="M0 0 C6 -11 18 -14 22 -8 C26 -2 16 6 0 0Z" fill="#86efac" />
      </g>
      {/* Leaf 8 — left (~y:1860) */}
      <g transform="translate(450, 1860) rotate(-30)">
        <path d="M0 0 C-6 -10 -16 -13 -20 -7 C-24 -1 -14 5 0 0Z" fill="#86efac" />
      </g>
    </svg>
  );
}

// ─── INTAKE DATA ───

interface SubjectCard {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
}

const ALL_SUBJECTS: SubjectCard[] = [
  { id: 'math', icon: Calculator, label: 'Math', color: '#F2A1B3' },
  { id: 'reading', icon: BookOpen, label: 'Reading', color: '#E8A0BF' },
  { id: 'writing', icon: Pen, label: 'Writing', color: '#C6B4E2' },
  { id: 'science', icon: FlaskConical, label: 'Science', color: '#F0D264' },
  { id: 'social-studies', icon: Globe2, label: 'Social Studies', color: '#7BC8A4' },
  { id: 'test-prep', icon: Star, label: 'Test Preparation', color: '#F4976C' },
  { id: 'sel', icon: Heart, label: 'Social Emotional Learning', color: '#8DD3D6' },
];

const GRADES = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th'];

// ─── MAIN PAGE ───

export function HomePage() {
  const [childName, setChildName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selected, setSelected] = useState<SubjectCard[]>([]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ogModalOpen, setOgModalOpen] = useState(false);

  const available = ALL_SUBJECTS.filter(s => !selected.find(sel => sel.id === s.id));
  const trimmed = childName.trim();
  const displayName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  const displayGrade = selectedGrade === 'K' ? 'Kindergarten' : selectedGrade;

  const addSubject = useCallback((subject: SubjectCard) => {
    setSelected(prev => {
      if (prev.find(s => s.id === subject.id)) return prev;
      return [...prev, subject];
    });
  }, []);

  const removeSubject = useCallback((id: string) => {
    setSelected(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleSubmit = () => {
    if (!childName.trim() || selected.length === 0) return;
    console.log('Intake:', { childName, grade: displayGrade, subjects: selected.map(s => s.id), notes });
    setSubmitted(true);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: BG_CREAM }}>
      <DecoVine />
      <Nav />
      <PetalSplashHero />

      {/* ─── HI, I'M GIA ─── */}
      <section id="about" className="relative py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              className="relative z-10 mx-auto md:mx-0"
            >
              <div className="w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden relative">
                <Image
                  src="/clients/Gia/gia_about.jpeg"
                  alt="Gia — your tutor"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -z-10 -bottom-4 -right-4 w-72 h-80 sm:w-80 sm:h-96 rounded-3xl" style={{ backgroundColor: `${PETAL_COLORS.lavender}30` }} />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Georgia', serif", color: PETAL_COLORS.pink }}>
                Hi, I&apos;m Gia
                <Sparkles className="w-7 h-7 inline ml-2" style={{ color: PETAL_COLORS.yellow }} />
              </h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-4" style={{ fontFamily: "'Georgia', serif" }}>
                I&apos;m the kind of tutor who thinks learning should feel like a superpower, not a punishment.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-4">
                Whether your kid is blanking on fractions at 9pm or needs someone to finally make essay writing click — that&apos;s where I come in. I build every lesson around <em>them</em>.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-6">
                I&apos;m here to make your kid say <span className="font-semibold" style={{ color: PETAL_COLORS.teal }}>&ldquo;oh wait, I actually get it.&rdquo;</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {['Creative', 'Patient', 'Kind', 'Science Nerd', 'Writing Coach', 'Math Support', 'Testing Practice'].map((tag, i) => {
                  const tagColors = ['#F2A1B3', '#8DD3D6', '#7BC8A4', '#F0D264', '#C6B4E2', '#E8A0BF', '#F4976C'];
                  return (
                    <span key={i} className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: `${tagColors[i]}20`, color: tagColors[i] }}>
                      {tag}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: NAME + GRADE (sneaky intake start) ─── */}
      <section className="relative py-20 md:py-28 px-6">
        <div className="relative z-10 max-w-3xl mx-auto text-center rounded-3xl p-8 md:p-12" style={{ backgroundColor: `${PETAL_COLORS.teal}12`, border: `1px solid ${PETAL_COLORS.teal}20` }}>
          {/* Accent rectangle behind — like the lavender box behind Gia's photo */}
          <div className="absolute -z-10 -bottom-3 -right-3 inset-0 rounded-3xl" style={{ backgroundColor: `${PETAL_COLORS.teal}18` }} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={fadeIn}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Georgia', serif" }}>
              {["Let's", 'get'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 12,
                    delay: i * 0.15,
                  }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 12,
                  delay: 0.3,
                }}
                className="inline-block"
                style={{ color: PETAL_COLORS.pink }}
              >
                started
              </motion.span>
            </h2>
            <motion.p
              className="text-slate-500 text-lg mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              It only takes a minute
            </motion.p>

            <label className="block text-lg font-semibold text-slate-700 mb-3" style={{ fontFamily: "'Georgia', serif" }}>
              What&apos;s your child&apos;s first name?
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full max-w-sm mx-auto block px-5 py-4 rounded-2xl border-2 text-lg text-center focus:outline-none transition-colors"
              style={{ borderColor: childName ? PETAL_COLORS.teal : '#e2e8f0', backgroundColor: 'white' }}
            />

            {/* Grade picker carousel */}
            <AnimatePresence>
              {childName.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-10"
                >
                  <label className="block text-lg font-semibold text-slate-700 mb-4" style={{ fontFamily: "'Georgia', serif" }}>
                    What grade is {childName.trim()} in?
                  </label>
                  <div className="flex gap-3 overflow-x-auto pb-2 justify-center snap-x snap-mandatory">
                    {GRADES.map((grade, i) => {
                      const gradeColors = ['#F2A1B3', '#8DD3D6', '#C6B4E2', '#F0D264', '#7BC8A4', '#F4976C', '#89B4E8'];
                      const gradeIcons = [Sparkles, Star, Sun, Pen, BookOpen, Telescope, FlaskConical];
                      const GradeIcon = gradeIcons[i];
                      const isSelected = selectedGrade === grade;
                      return (
                        <motion.button
                          key={grade}
                          onClick={() => setSelectedGrade(grade)}
                          className="snap-center shrink-0 w-24 h-28 rounded-2xl flex flex-col items-center justify-center font-bold text-xl transition-all shadow-md"
                          style={{
                            backgroundColor: isSelected ? gradeColors[i] : 'white',
                            color: isSelected ? 'white' : gradeColors[i],
                            border: `2px solid ${gradeColors[i]}`,
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <GradeIcon className="w-8 h-8 mb-1" style={{ opacity: 0.35 }} />
                          {grade}
                          <span className="font-normal mt-0.5" style={{ opacity: 0.8, fontSize: grade === 'K' ? '10px' : '12px' }}>{grade === 'K' ? 'Kindergarten' : 'grade'}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 2: SUBJECT PICKER (auto-populates with name) ─── */}
      {childName.trim() && (
        <section id="subjects" className="py-20 md:py-28 px-6">
          <div className="max-w-4xl mx-auto">
            {!submitted ? (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg md:text-xl leading-relaxed mb-10 text-center"
                  style={{ fontFamily: "'Georgia', serif", color: '#6B7280' }}
                >
                  I&apos;m so excited to help{' '}
                  <span className="font-bold" style={{ color: PETAL_COLORS.teal }}>{displayName}</span>{' '}
                  discover what they&apos;re truly capable of. Every kid has a moment where it all clicks — let&apos;s find {displayName}&apos;s.
                </motion.p>

                <label className="block text-lg font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                  What areas does {displayName} need help with?
                </label>
                <p className="text-slate-400 text-sm mb-6">Tap to add</p>

                {/* Colorful subject cards — tap to add */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {available.map((subject) => (
                    <motion.button
                      key={subject.id}
                      layout
                      onClick={() => addSubject(subject)}
                      className="flex flex-col items-center gap-2 p-5 rounded-2xl shadow-md active:shadow-lg transition-shadow"
                      style={{ backgroundColor: subject.color }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <subject.icon className="w-7 h-7 text-white" />
                      <span className="font-semibold text-white text-sm">{subject.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Drop zone */}
                <div
                  className="min-h-[100px] rounded-2xl border-2 border-dashed p-5 transition-all"
                  style={{
                    borderColor: selected.length > 0 ? PETAL_COLORS.lavender : '#d1d5db',
                    backgroundColor: selected.length > 0 ? `${PETAL_COLORS.lavender}08` : '#fafafa',
                  }}
                >
                  {selected.length === 0 ? (
                    <div className="text-center py-6">
                      <GripVertical className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">{displayName}&apos;s subjects will appear here</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <AnimatePresence>
                        {selected.map((subject) => (
                          <motion.div
                            key={subject.id}
                            layout
                            initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-md"
                            style={{ backgroundColor: subject.color }}
                          >
                            <subject.icon className="w-4 h-4 text-white" />
                            <span className="font-semibold text-white text-sm">{subject.label}</span>
                            <button onClick={() => removeSubject(subject.id)} className="ml-1 p-0.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors">
                              <X className="w-3.5 h-3.5 text-white" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Notes input */}
                <AnimatePresence>
                  {selected.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
                      <label className="block text-sm font-medium text-slate-500 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                        Anything else you&apos;d like to share about {displayName}?
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={`e.g. ${displayName} loves art but struggles with word problems...`}
                        rows={3}
                        className="w-full px-5 py-4 rounded-2xl border-2 text-base focus:outline-none transition-colors resize-none"
                        style={{ borderColor: notes ? PETAL_COLORS.lavender : '#e2e8f0', backgroundColor: 'white' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <AnimatePresence>
                  {selected.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 text-center">
                      <button
                        onClick={handleSubmit}
                        className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg"
                        style={{ backgroundColor: PETAL_COLORS.lavender }}
                      >
                        <Send className="w-5 h-5" />
                        Let&apos;s grow, {displayName}!
                      </button>
                      <p className="text-slate-400 text-xs mt-3">Free intro call — no commitment</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${PETAL_COLORS.teal}20` }}>
                  <CheckCircle2 className="w-10 h-10" style={{ color: PETAL_COLORS.teal }} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                  Can&apos;t wait to meet {displayName}!
                </h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto">
                  I&apos;ll reach out soon to schedule a free intro call. This is going to be great.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ─── TUTORING ─── */}
      <section className="py-24 px-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
              More than a tutor.<br />
              <span style={{ color: PETAL_COLORS.lavender }}>A method.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
              Gia works with students in grades K&ndash;6 across Math, Reading, Writing, Science, Social Studies, and Test Preparation. Every new student starts with a 40&ndash;45 minute assessment — so sessions are never guesswork. For reading, she uses the{' '}
              <button
                onClick={() => setOgModalOpen(true)}
                className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
                style={{ color: PETAL_COLORS.lavender }}
              >
                Orton-Gillingham method
              </button>
              {' '}to pinpoint exactly where to begin. She brings her own materials, uses IXL resources, and builds every plan around your child. Sessions run 50&ndash;60 minutes. Pricing depends on subjects and how often you meet — reach out and she&apos;ll build a plan that works.
            </p>
          </motion.div>

          {/* Stats bar */}
          <div className="py-10 px-6 rounded-3xl" style={{ backgroundColor: PETAL_COLORS.teal }}>
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center text-white">
              {[
                { value: '25+', label: 'Students Tutored' },
                { value: '6+', label: 'Subjects Offered' },
                { value: '95%', label: 'See Grade Improvement' },
              ].map((s, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.1 }}>
                  <p className="text-3xl md:text-4xl font-bold">{s.value}</p>
                  <p className="text-white/80 text-sm mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-6" style={{ backgroundColor: '#f5f3ff' }}>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
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

      {/* ─── BABYSITTING / CHILDCARE ─── */}
      <section id="childcare" className="relative py-28 md:py-36 px-6 overflow-hidden" style={{ backgroundColor: '#f0fdfa' }}>
        {/* Animated growing plant — faded nurturing accent */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ bottom: '5%', left: '6%', opacity: 0.12 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.12 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <svg width="180" height="320" viewBox="0 0 180 320" fill="none">
            {/* Pot */}
            <motion.path
              d="M50 280 L55 310 L125 310 L130 280 Z"
              fill={PETAL_COLORS.teal}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            />
            <motion.rect
              x="42" y="270" width="96" height="14" rx="4"
              fill={PETAL_COLORS.teal}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            />
            {/* Stem growing upward */}
            <motion.path
              d="M90 270 C90 230 88 190 90 140 C92 100 90 70 90 40"
              stroke="#6dbb8a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.4, ease: 'easeOut' }}
            />
            {/* Leaf left */}
            <motion.path
              d="M90 180 C70 165 45 170 40 185 C35 200 55 200 90 180Z"
              fill="#6dbb8a"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{ transformOrigin: '90px 180px' }}
            />
            {/* Leaf right */}
            <motion.path
              d="M90 140 C110 125 135 130 140 145 C145 160 125 160 90 140Z"
              fill="#6dbb8a"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.6 }}
              style={{ transformOrigin: '90px 140px' }}
            />
            {/* Small leaf left */}
            <motion.path
              d="M90 100 C75 90 58 95 55 105 C52 115 68 112 90 100Z"
              fill="#6dbb8a"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.0 }}
              style={{ transformOrigin: '90px 100px' }}
            />
            {/* Bloom / bud at top */}
            <motion.circle
              cx="90" cy="38" r="12"
              fill={PETAL_COLORS.pink}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 2.3 }}
              style={{ transformOrigin: '90px 38px' }}
            />
            {/* Water droplets */}
            <motion.circle
              cx="70" cy="260" r="4"
              fill={PETAL_COLORS.teal}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: [0, 0.8, 0], y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.circle
              cx="110" cy="255" r="3"
              fill={PETAL_COLORS.teal}
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: [0, 0.8, 0], y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* Mirrored plant on right side */}
        <motion.div
          className="absolute pointer-events-none hidden md:block"
          style={{ bottom: '5%', right: '6%', opacity: 0.08, transform: 'scaleX(-1)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.08 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <svg width="140" height="260" viewBox="0 0 180 320" fill="none">
            <path d="M50 280 L55 310 L125 310 L130 280 Z" fill={PETAL_COLORS.teal} />
            <rect x="42" y="270" width="96" height="14" rx="4" fill={PETAL_COLORS.teal} />
            <motion.path
              d="M90 270 C90 230 88 200 90 160 C92 130 90 100 90 70"
              stroke="#6dbb8a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.8, ease: 'easeOut' }}
            />
            <motion.path
              d="M90 200 C70 185 45 190 40 205 C35 220 55 220 90 200Z"
              fill="#6dbb8a"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.8 }}
              style={{ transformOrigin: '90px 200px' }}
            />
            <motion.path
              d="M90 150 C110 135 135 140 140 155 C145 170 125 170 90 150Z"
              fill="#6dbb8a"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.2 }}
              style={{ transformOrigin: '90px 150px' }}
            />
            <motion.circle
              cx="90" cy="68" r="10"
              fill={PETAL_COLORS.pink}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 2.6 }}
              style={{ transformOrigin: '90px 68px' }}
            />
          </svg>
        </motion.div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center">
            {/* Floating heart — rises upward as section scrolls in */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex justify-center mb-4"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="w-8 h-8" style={{ color: PETAL_COLORS.pink, fill: `${PETAL_COLORS.pink}40` }} />
              </motion.div>
            </motion.div>
            <p className="uppercase mb-6 whitespace-nowrap" style={{ fontSize: 'clamp(13px, 3.8vw, 18px)', fontWeight: 800, letterSpacing: '0.14em', color: PETAL_COLORS.teal }}>
              ✦ Childcare &amp; Babysitting ✦
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-8" style={{ fontFamily: "'Georgia', serif" }}>
              Need someone you can{' '}
              <span style={{ color: PETAL_COLORS.teal }}>actually trust?</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto mb-12">
              Gia has worked with kids from newborn through teens — including 3 years in a daycare setting with infants and pre-K. She&apos;s CPR certified, flexible to your family&apos;s routine, and can handle light household duties if needed. She&apos;s a K&ndash;12 certified educator who genuinely loves kids. Not just a warm body. The real deal.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
              {[
                { icon: ShieldCheck, title: 'CPR Certified', desc: 'Trained and ready for any situation', color: PETAL_COLORS.pink },
                { icon: Baby, title: 'Infant to Teen', desc: 'Newborns through high schoolers', color: PETAL_COLORS.teal },
                { icon: Clock, title: '3 Yrs Daycare', desc: 'Infants and pre-K classroom experience', color: PETAL_COLORS.yellow },
                { icon: GraduationCap, title: 'K–12 Certified', desc: 'Licensed educator, not just a sitter', color: PETAL_COLORS.lavender },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border text-left"
                  style={{ borderColor: `${card.color}30` }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}20` }}>
                    <card.icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{card.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-24 px-6" style={{ backgroundColor: '#fffbeb' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
              What does it{' '}
              <span style={{ color: PETAL_COLORS.pink }}>cost?</span>
            </h2>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
              Pricing depends on subjects and how many days a week. No packages, no guessing — reach out and Gia will put together a plan that fits your family.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: PETAL_COLORS.lavender }}
            >
              Get a Custom Plan
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
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

      {/* ─── ORTON-GILLINGHAM MODAL ─── */}
      <AnimatePresence>
        {ogModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOgModalOpen(false)} />

            {/* Card */}
            <motion.div
              className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: BG_CREAM }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center" style={{ backgroundColor: PETAL_COLORS.lavender }}>
                <p className="uppercase text-white/70 text-xs font-semibold tracking-widest mb-2">Teaching Method</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                  Orton-Gillingham
                </h3>
                <p className="text-white/90 text-sm">The gold standard for reading support.</p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setOgModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Body */}
              <div className="px-8 py-8">
                <p className="text-slate-600 leading-relaxed mb-4">
                  Orton-Gillingham (OG) is a structured, research-backed approach to teaching reading and writing. Instead of hoping things click, it breaks language down into small, manageable pieces — sounds, letters, patterns — and builds from there.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  It&apos;s especially powerful for kids who struggle with reading, including those with dyslexia. Gia uses an OG assessment at the start to figure out exactly where your child is, then builds from that point.
                </p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  No guessing. No busy work. Just real progress.
                </p>
                <p className="text-sm font-medium text-center" style={{ color: PETAL_COLORS.lavender }}>
                  Used by Gia for all K–6 reading support
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
