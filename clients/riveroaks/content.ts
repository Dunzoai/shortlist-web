// ──────────────────────────────────────────────────────────
// River Oaks Pizzeria — Single source of truth for all
// editable content. See /TEMPLATE_RULES.md for the why.
// ──────────────────────────────────────────────────────────

export type MenuItem = {
  name: string;
  description: string;
};

export type Location = {
  name: string;
  street: string;
  city: string;
  region: string;
  hours: string;
  phone: string;
  tel: string;
  directionsUrl: string;
};

export type FAQ = {
  q: string;
  a: string;
};

export type PizzaStyle = {
  key: string;
  image: string;
  label: string;
  teaser: string;
  items: MenuItem[];
};

export type OrderFeature = {
  heading: string;
  description: string;
};

// ── Content ─────────────────────────────────────────────

const content = {
  // ── Business-wide ──
  businessName: 'River Oaks Pizzeria',
  brandLabel: 'River Oaks',

  // ── Nav ──
  nav: {
    links: [
      { label: 'Home', path: '/', anchor: null },
      { label: 'Menu', path: '/menu', anchor: null },
      { label: 'Our Story', path: null, anchor: '/#our-story' },
      { label: 'Locations', path: null, anchor: '/#locations' },
    ],
    orderButtonText: 'Order Now',
  },

  // ── Hero ──
  hero: {
    backdropImage: '/clients/riveroaks/riveroaks_bar.jpg',
    pizzaImage: '/clients/riveroaks/pizza.png',
    pizzaAlt: 'Wood-fired grandma pizza',
    subtitle: 'Family-owned since 1998',
    headline: 'REAL PIZZA',
    categories: 'Pizza \u00B7 Pasta \u00B7 Wine \u00B7 Cocktails',
    ctaText: 'Start Your Order',
    ctaHref: '/order',
  },

  // ── Parallax Bar ──
  parallaxBar: {
    image: '/clients/riveroaks/riveroaks_bar.jpg',
  },

  // ── Our Story ──
  story: {
    sectionLabel: 'Our Story',
    body: "We at River Oaks Pizzeria are proud to be family-owned and operated. In the 1980\u2019s our father, Kole, started as a baker in the Little Italy section of the Bronx, NY. His passion for the art of dough and bread baking was what sparked his interest in the pizza business. In 1998 he bought his first pizzeria in Bronx, NY; and since then we have expanded to the NY metro area and beautiful Myrtle Beach as a family.",
    pullQuote:
      "We don\u2019t do things the easy way \u2014 we do things the right way.",
    closingLine:
      'We put a lot of love into everything we do, and hope to bring you joy in every bite.',
    signature: '\u2014 Andrew, Albert, George & Frank',
    attribution: 'The Next Generation',
  },

  // ── Parallax Grandma ──
  parallaxGrandma: {
    image: '/clients/riveroaks/grandma-pizza.jpg',
    headline: 'Home of the Grandma Pizza',
  },

  // ── Locations ──
  locations: {
    sectionLabel: 'Visit Us',
    heading: 'Two locations.',
    buttonText: 'Get Directions',
    items: [
      {
        name: 'Carolina Forest',
        street: '154 Sapwood Rd, Unit 107',
        city: 'Myrtle Beach, SC 29579',
        region: 'Myrtle Beach, SC',
        hours: 'Open 7 Days \u00B7 12pm \u2013 9pm',
        phone: '843-796-1350',
        tel: '+18437961350',
        directionsUrl:
          'https://www.google.com/maps/search/?api=1&query=154+Sapwood+Rd+Unit+107+Myrtle+Beach+SC+29579',
      },
      {
        name: 'Surfside',
        street: '1399 S. Commons Dr, Unit A5',
        city: 'Myrtle Beach, SC 29588',
        region: 'Myrtle Beach, SC',
        hours: 'Open 7 Days \u00B7 12pm \u2013 9pm',
        phone: '843-750-0056',
        tel: '+18437500056',
        directionsUrl:
          'https://www.google.com/maps/search/?api=1&query=1399+S+Commons+Dr+Unit+A5+Myrtle+Beach+SC+29588',
      },
    ] as Location[],
    faqLabel: 'Frequently Asked',
    faqs: [
      {
        q: 'Where is River Oaks Pizzeria located?',
        a: 'River Oaks Pizzeria has two locations in the Myrtle Beach, SC area: 154 Sapwood Rd, Unit 107 in Carolina Forest (Myrtle Beach, SC 29579) and 1399 S. Commons Dr, Unit A5 in Surfside (Myrtle Beach, SC 29588).',
      },
      {
        q: "What are River Oaks Pizzeria's hours?",
        a: 'Both River Oaks Pizzeria locations are open 7 days a week from 12pm to 9pm.',
      },
      {
        q: 'Does River Oaks Pizzeria have a full bar?',
        a: 'Yes. River Oaks Pizzeria offers a full bar with cocktails, wine, and a rotating draft beer list at both Myrtle Beach locations.',
      },
    ] as FAQ[],
  },

  // ── Structured data (SEO / JSON-LD) ──
  seo: {
    logoUrl:
      'https://riveroakspizzeria.com/wp-content/uploads/2023/02/main_logo-1.png',
    cuisine: ['Italian', 'Pizza'],
    priceRange: '$$',
    openDays: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '12:00',
    closes: '21:00',
  },

  // ── Gallery ──
  gallery: {
    sectionLabel: 'Gallery',
    imageAlt: 'River Oaks Pizzeria',
    images: Array.from(
      { length: 12 },
      (_, i) => `/clients/riveroaks/${i + 1}.png`
    ),
  },

  // ── Menu (Pizza) ──
  menu: {
    sectionLabel: 'Menu',
    heading: 'The Pizza.',
    subtitle: 'Two styles. One family recipe.',
    styles: [
      {
        key: 'squares',
        image: '/clients/riveroaks/square_pie.png',
        label: 'The Squares',
        teaser: 'Sheet-pan style. Bronx-born. Built to share.',
        items: [
          {
            name: 'Grandma',
            description:
              'Crisp yet airy crust topped with fresh mozzarella, juicy plum tomatoes, and our unique blend of spices. Finished with fresh basil, freshly grated Parmigiana and extra virgin olive oil drizzle.',
          },
          {
            name: 'Vodkarita',
            description:
              'Crisp yet airy crust topped with chicken breast tossed in our homemade vodka sauce. Finished with fresh mozzarella, basil, and fresh grated parmigiana.',
          },
          {
            name: 'Fresca',
            description:
              'Crisp yet airy crust topped with our house-made tomato sauce, sauteed zucchini, mushrooms, broccoli, tomatoes and garlic.',
          },
          {
            name: 'Sicilian',
            description:
              'Thick and fluffy crust, topped with our house-made tomato sauce and mozzarella cheese. Finished with a drizzle of extra virgin olive oil and a touch of oregano.',
          },
          {
            name: 'Brooklyn',
            description:
              'Crispy yet airy crust topped with mozzarella, slow-cooked & robust marinara, Pecorino Romano and extra virgin olive oil.',
          },
          {
            name: "Cup 'n Char",
            description:
              'Cup and Char mini pepperoni cups placed over fresh mozzarella and our tomato sauce, on a crisp, and airy crust.',
          },
          {
            name: 'Grilled Chicken Caesar',
            description:
              'Thin crust topped with chopped Romaine lettuce, juicy grilled chicken breast, and grated Parmigiana tossed in Caesar dressing.',
          },
        ] as MenuItem[],
      },
      {
        key: 'rounds',
        image: '/clients/riveroaks/pizza.png',
        label: 'The Rounds',
        teaser: 'Personal or large. Bold combinations.',
        items: [
          {
            name: 'Fig and Goat Cheese',
            description:
              'Topped with Prosciutto, creamy goat cheese, dried Black Mission figs, pesto, and mozzarella. Drizzled with truffle-infused olive oil and wildflower honey.',
          },
          {
            name: 'Eggplant Margherita',
            description:
              'Topped with crispy Panko-breaded eggplant, juicy plum tomatoes, fresh mozzarella and basil. Drizzled with extra virgin olive oil and freshly grated Parmigiana.',
          },
          {
            name: 'Vodka Margherita',
            description:
              'Our homemade vodka sauce topped with fresh mozzarella, fresh basil, and finished with grated Parmigiana.',
          },
          {
            name: 'Chicken, Bacon, Ranch',
            description:
              'Chopped crispy chicken breast and smoky bacon topped with mozzarella and house-made ranch.',
          },
          {
            name: 'Buffalo Chicken',
            description:
              "Chopped crispy chicken breast tossed in Frank's Red Hot buffalo sauce, topped with mozzarella.",
          },
          {
            name: 'BBQ Chicken',
            description:
              "Chopped crispy chicken breast tossed in Sweet Baby Ray's barbeque sauce, topped with mozzarella.",
          },
          {
            name: 'Truffle Mushroom',
            description:
              'Topped with sauteed Cremini mushrooms and whipped ricotta cheese. Drizzled with truffle-infused olive oil and finished with fresh grated Parmigiana.',
          },
          {
            name: 'White',
            description:
              'Seasoned whipped ricotta cheese and mozzarella. Finish with fresh garlic, extra virgin olive oil, parsley and grated Parmigiana.',
          },
        ] as MenuItem[],
      },
    ] as PizzaStyle[],
  },

  // ── Order Page ──
  order: {
    sectionLabel: 'Demo Preview',
    heading: 'Online ordering, on the way.',
    description:
      'Online ordering is part of the Shortlist platform \u2014 one app, all your locations, no third-party fees eating into your margin.',
    features: [
      {
        heading: 'All your locations',
        description:
          'Customers pick which spot to order from at checkout.',
      },
      {
        heading: 'One unified app',
        description:
          "Replace whatever patchwork you're using now. Everything in one place.",
      },
      {
        heading: 'Keep your margin',
        description:
          'No third-party platform fees. The money stays yours.',
      },
    ] as OrderFeature[],
    demoLabel: 'See It In Action',
    demoHeading: "Here\u2019s a working demo.",
    demoDescription:
      "Yours would be tailored to your business. More than online ordering \u2014 you\u2019d get your own app on customers\u2019 phones, push notifications, and a direct channel to keep them coming back.",
    demoButtonText: 'View Live Demo \u2192',
    demoUrl: 'https://foodtruckdemo.shortlistpass.com/',
    backButtonText: 'Back to Home',
    softPitch:
      "Demo built by Shortlist. This page is a preview of what we\u2019ll build for you.",
  },
} as const;

export default content;
