// ──────────────────────────────────────────────────────────
// Sunday Press-On Nails by Brandy — Single source of truth
// for all editable content.
// ──────────────────────────────────────────────────────────

export type NavLink = {
  label: string;
  path: string | null;
  anchor: string | null;
};

export type PromiseItem = {
  num: string;
  color: string;
  title: string;
  text: string;
};

export type WhyCard = {
  bg: string;
  labelColor: string;
  textColor: string;
  label: string;
  text: string;
};

export type FAQItem = {
  q: string;
  a: string;
};

export type Product = {
  id: string;
  name: string;
  desc: string;
  level: string;
  category: string;
};

const content = {
  // ── Business-wide ──
  businessName: 'Sunday Press-On Nails',
  brandLabel: 'Sunday',
  tagline: 'Salon nails, on your schedule.',
  logoUrl: '/clients/brandydemo/sunday-logo.jpg',

  // ── Colors ──
  colors: {
    cream: '#FBF4EA',
    blue: '#8EB6D9',
    blueDark: '#5E86AD',
    peach: '#FFC6A1',
    yellow: '#FFF2B6',
    dark: '#33414D',
    body: '#55606B',
    muted: '#A99E92',
    infoBg: '#E7F0FA',
    warmBg: '#FDEBDA',
  },

  // ── Nav ──
  nav: {
    links: [
      { label: 'Get Started', path: '/get-started', anchor: null },
      { label: 'Shop', path: '/shop', anchor: null },
      { label: 'Sizing', path: '/sizing', anchor: null },
      { label: 'About', path: '/about', anchor: null },
      { label: 'FAQ', path: '/faq', anchor: null },
      { label: 'Gallery', path: '/gallery', anchor: null },
    ] as NavLink[],
    ctaText: 'Get Started',
  },

  // ── Hero ──
  hero: {
    eyebrow: 'Handmade press-on nails by Brandy',
    headlineTop: 'Salon nails,',
    headlineCursive: 'on your schedule.',
    description:
      'Custom and pre-designed press-on sets, handmade to order by a licensed nail tech — and shipped straight to your door.',
    ctaText: 'Get Started',
    ctaHref: '/get-started',
    secondaryText: 'Browse the shop →',
    secondaryHref: '/shop',
    heroImage: '/clients/brandydemo/hero-nails.jpg',
  },

  // ── Promises (The Sunday Difference) ──
  promisesHeading: 'the sunday difference',
  promises: [
    {
      num: '01',
      color: '#5E86AD',
      title: 'Handmade to order',
      text: 'Every set is painted after you order it — never pulled off a shelf.',
    },
    {
      num: '02',
      color: '#D68A4E',
      title: 'Custom-sized for you',
      text: 'A sizing kit makes sure all ten nails fit like they were made for you. Because they were.',
    },
    {
      num: '03',
      color: '#C7A52E',
      title: 'Ships to your door',
      text: 'No appointment, no salon chair, no babysitter required.',
    },
  ] as PromiseItem[],

  // ── Why You'll Love Them cards ──
  whyHeading: "why you'll love them",
  whyCards: [
    {
      bg: '#8EB6D9',
      labelColor: '#FFFFFF',
      textColor: '#1F2E3A',
      label: 'Wear time',
      text: 'Up to 2–3 weeks per wear with the liquid glue included in every kit.',
    },
    {
      bg: '#FFC6A1',
      labelColor: '#8A4E28',
      textColor: '#3D2413',
      label: 'Quick change',
      text: 'Weekend plans? Adhesive tabs give you 1–2 days of wear, no commitment.',
    },
    {
      bg: '#FFF2B6',
      labelColor: '#8A7620',
      textColor: '#3D3510',
      label: 'Nail-friendly',
      text: 'Soak them off — never rip! — and your natural nails stay happy.',
    },
  ] as WhyCard[],

  // ── About Strip (homepage) ──
  aboutStrip: {
    quote:
      '\u201CI have an unhealthy relationship with tiny paint brushes and all things glitter.\u201D',
    attribution: '\u2014 Brandy',
    credential: 'licensed nail tech',
    linkText: 'Meet Brandy \u2192',
    linkHref: '/about',
  },

  // ── CTA Band ──
  ctaBand: {
    headlineStart: 'Ready when ',
    headlineAccent: 'you',
    headlineEnd: ' are.',
    description:
      'New here? The intro kit gets you sized, shaped, and wearing your first handmade set.',
    ctaText: 'Start with the Intro Kit',
    ctaHref: '/get-started',
  },

  // ── About Page ──
  about: {
    eyebrow: 'About',
    headlineStart: "Hi, I\u2019m ",
    headlineAccent: 'Brandy.',
    heroQuote:
      'I have an unhealthy relationship with tiny paint brushes and all things glitter.',
    paragraphs: [
      "I\u2019m a licensed nail technician who believes everyone deserves awesome nails \u2014 even if your schedule is packed and your budget has limits. Every press-on set is handmade with the same care I give every client sitting at my nail table.",
      "When I\u2019m not doing nails, I\u2019m probably thinking about nails. Aside from that, life at my house is loud, busy, and a lot chaotic. That\u2019s exactly why I love press-on nails. Sometimes there just isn\u2019t enough time for a salon appointment, but there\u2019s always time for pretty nails.",
      'The goal is simple: create quality nails that fit into real life. Whether you\u2019re running errands, heading to church, chasing little ones, or going on a date \u2014 you deserve to treat yourself.',
    ],
    ctaText: 'Get Started',
    ctaHref: '/get-started',
    image: '/clients/brandydemo/brandy-about.JPEG',
  },

  // ── Get Started Page ──
  getStarted: {
    eyebrow: 'New clients start here',
    headlineStart: 'Get ',
    headlineAccent: 'Started',
    intro:
      "To become a new client, you\u2019ll begin with the intro kit. This gives you everything you need to get properly sized, choose your perfect shape, and receive your first press-on set with confidence.",
    kitHeading: 'The Sunday Intro Kit includes',
    kitItems: [
      'A sizing kit so you can measure your nails at home',
      'A shape sample kit with all available shapes for future reference',
      'Your first custom or pre-designed set at any level',
      'A full application kit with everything needed to apply your nails properly',
      'Shipping included for both deliveries \u2014 your sizing kit and your custom set',
    ],
    kitColors: ['#5E86AD', '#5E86AD', '#D6A93A', '#5E86AD', '#5E86AD'],
    howItWorksHeading: 'How it ',
    howItWorksAccent: 'works',
    steps: [
      "Once your order is placed, I\u2019ll immediately ship your sizing and shape kits to you.",
      'After you receive it, size your nails and decide on your preferred shape, then contact me to discuss your desired set.',
      "I\u2019ll create your custom set and ship it to you along with your application kit.",
      "After completing your intro order, you\u2019ll officially be added as a returning client and can place future orders through the regular ordering process.",
    ],
    thingsToKnowHeading: 'A few important things to know',
    thingsToKnow: [
      'The intro kit is a one-time purchase per client.',
      'Your set will not be started until details are discussed.',
      'Intro orders are non-refundable and will not be converted into shop credit.',
      'Typical response time is 5\u201310 hours.',
    ],
    ctaText: 'Start with the Intro Kit',
    ctaHref: '/shop',
  },

  // ── Sizing Page ──
  sizing: {
    eyebrow: 'The most important step',
    headlineStart: 'The Perfect ',
    headlineAccent: 'Size',
    intro:
      'Finding your perfect fit is the first step to your dream nails. Every set is custom sized just for you \u2014 this is the most important step.',
    introDetail:
      'Each sizing kit includes one nail in every size for your desired shape, so your kit may include ranges like 00\u20139, 0\u201314, 0\u201311, or 00\u201312. Every shape fits a little differently \u2014 that\u2019s why you\u2019ll size each finger individually.',
    steps: [
      {
        title: 'Start with bare nails.',
        text: 'When sizing your tips, make sure your natural nails are completely bare \u2014 NO polish, NO gel, and NO clear coat. Anything left on your nails can throw off the sizing and give you an inaccurate fit.',
      },
      {
        title: 'Size each finger.',
        text: "Not everyone\u2019s nails are the same on both hands, so measure all 10 nails. Hold the sample the correct way: the cuticle edge (the rounded end) should face your cuticle \u2014 on your sizing card, that\u2019s the side closest to the logo at the top. For a correct fit, the nail should sit snug from sidewall to sidewall with light pressure. Too tight and it feels uncomfortable or painful; too loose and it \u201Cfloats\u201D above your nail instead of hugging it.",
      },
      {
        title: 'When in doubt, size up.',
        text: "If you\u2019re between two sizes and not sure which to choose, always choose the larger size. Once your finished nails arrive, you can file the sides or cuticle area for a perfected, custom fit.",
      },
      {
        title: 'Write down your sizes.',
        text: "Note your size for each finger (example: Left Thumb = 0, Right Index = 4). This ensures your fully custom set fits perfectly. Once you place your first order, I\u2019ll record all your sizes in your profile for safekeeping \u2014 unless you change shapes, which can change your sizing.",
      },
    ],
    stepColors: ['#8EB6D9', '#5E86AD', '#D6A93A', '#8EB6D9'],
    ctaCursive: 'Ready to find your fit?',
    ctaText: 'Get Started',
    ctaHref: '/get-started',
  },

  // ── FAQ Page ──
  faq: {
    eyebrow: 'Good questions',
    items: [
      {
        q: "What\u2019s included in my order of nails?",
        a: 'I include an application kit with every set. It contains a nail file, cuticle pusher, buffing block, alcohol wipes, nail glue, and adhesive tabs for a more temporary application.',
      },
      {
        q: 'How long does it take to complete an order?',
        a: "Each set is custom made once ordered \u2014 I hand-paint every order after it\u2019s placed, using your sizing and details. For a pre-designed or solid-color set from the shop, please allow 1 week from the order date for me to complete and ship it. I ship via USPS, so delivery times vary by location. For a custom set, please allow 1\u20133 weeks; this can vary based on how quickly we communicate the details you\u2019d like and my current order load. Please note: shipping time does not include processing time \u2014 all orders require a production period before they ship.",
      },
      {
        q: 'How long do press-ons last per wear?',
        a: 'With proper nail prep, application, and care, press-ons can last up to 2\u20133 weeks per application with liquid glue (included with your purchase). For short-term wear \u2014 like a weekend or a single event \u2014 they can last 1\u20132 days with the adhesive tabs (also included).',
      },
      {
        q: 'How do I figure out my sizes?',
        a: 'The best way to get that perfect fit is to order a sizing kit. I offer bare sizing kits as well as solid-color sizing kit sets that act as both a sizing kit and a solid-color nail set. (See the Sizing page for the full how-to.)',
      },
      {
        q: 'Will press-ons damage my natural nails?',
        a: "No \u2014 this is one more reason I love press-ons. As long as you remove them by soaking them off (don\u2019t rip them off!), your natural nails won\u2019t be damaged.",
      },
    ] as FAQItem[],
    bottomNote:
      'Still curious? See the full sizing how-to or get started with the intro kit.',
  },

  // ── Shop Page ──
  shop: {
    eyebrow: 'Handmade, to order',
    introKit: {
      eyebrow: 'First time here? Start with this',
      headlineStart: 'The Sunday ',
      headlineAccent: 'Intro Kit',
      description:
        'Sizing kit, shape samples, your first set at any level, and a full application kit \u2014 shipping included, both ways.',
      ctaText: 'Get Started',
      ctaHref: '/get-started',
    },
    categories: ['All', 'Custom', 'Pre-designed', 'Solid color', 'Sizing kits'],
    categoryColors: {
      Custom: '#FFE6CB',
      'Pre-designed': '#FFF2B6',
      'Solid color': '#E7F0FA',
      'Sizing kits': '#FFE6CB',
    } as Record<string, string>,
    seedProducts: [
      { id: 'p1', name: 'Your Dream Set', desc: 'Fully custom \u2014 we design it together, then I hand-paint every nail.', level: 'Any level', category: 'Custom' },
      { id: 'p2', name: 'The Classic French', desc: 'A clean, timeless French tip on your shape and size.', level: 'Level 1', category: 'Pre-designed' },
      { id: 'p3', name: 'Gilded Espresso', desc: 'Warm espresso brown with delicate hand-placed accents.', level: 'Level 2', category: 'Pre-designed' },
      { id: 'p4', name: 'Milk Bath', desc: 'A soft, sheer milky finish that goes with everything.', level: 'Level 1', category: 'Solid color' },
      { id: 'p5', name: 'Bare Sizing Kit', desc: 'One nail in every size for your chosen shape.', level: 'Sizing', category: 'Sizing kits' },
      { id: 'p6', name: 'Solid-Color Sizing Set', desc: 'A sizing kit and a wearable solid-color set in one.', level: 'Level 1', category: 'Sizing kits' },
    ] as Product[],
    emptyMessage: 'Nothing in this category yet \u2014 check back soon!',
  },

  // ── Admin Page ──
  admin: {
    headerBrand: 'SUNDAY',
    headerSub: 'studio admin',
    backText: '\u2190 Back to the shop',
    backHref: '/shop',
    infoBanner:
      'Edit your shop here, Brandy. Changes save automatically and show up on the Shop page.',
    addButtonText: '+ Add product',
    resetButtonText: 'Reset to examples',
    resetConfirm: 'Replace all products with the starter examples? This cannot be undone.',
    logoutText: 'Log out',
    priceLabel: 'Price',
    addCategoryOption: '+ Add new category…',
    newCategoryPlaceholder: 'New category name',
    dragHint: 'Drag to reorder',
  },

  // ── Studio Admin Login ──
  studioLogin: {
    brand: 'SUNDAY',
    sub: 'studio admin',
    heading: 'Welcome back',
    prompt: 'Enter the studio password to manage your shop.',
    placeholder: 'Password',
    button: 'Enter studio',
    error: 'Incorrect password. Try again.',
  },

  // ── Footer ──
  footer: {
    brand: 'Sunday',
    tagline: 'Handmade press-on nails that fit into real life.',
    motto: 'Slow mornings, pretty nails, good vibes.',
    links: [
      { label: 'Get Started', href: '/get-started' },
      { label: 'Shop', href: '/shop' },
      { label: 'Sizing', href: '/sizing' },
      { label: 'About', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
    sayHiLabel: 'Say Hi',
    instagram: '@honeyb_polished',
    instagramUrl: 'https://instagram.com/honeyb_polished',
    copyright: `\u00A9 Sunday ${new Date().getFullYear()}`,
    adminText: 'Studio admin',
    adminHref: '/studio-admin',
  },
};

export default content;
