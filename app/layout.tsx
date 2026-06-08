import type { Metadata } from "next";
import { Playfair_Display, Lora, Permanent_Marker, Caveat } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/clients/danidiaz/components/LanguageContext";
import { StyleProvider } from "@/clients/danidiaz/components/StyleContext";
import { ClientProvider } from "@/lib/ClientContext";
import { getClient } from "@/lib/getClient";
import ChatLanguageControls from "@/clients/danidiaz/components/ChatLanguageControls";
import ShortlistChatWidget from "@/components/ShortlistChatWidget";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'palmetto_taps') {
    return {
      title: "Palmetto Taps | Horry County's First Self-Serve Taproom",
      description: "Conway & Myrtle Beach's premier self-serve taproom. 40+ beers on tap, craft cocktails, and local favorites. Pour your own pint in historic downtown Conway, SC.",
      keywords: ["self-serve taproom", "Conway SC", "Myrtle Beach beer", "Horry County taproom", "craft beer", "beers on tap", "pour your own beer", "downtown Conway", "self pour bar", "draft beer"],
      authors: [{ name: "Palmetto Taps" }],
      creator: "Palmetto Taps",
      metadataBase: new URL('https://palmettotaps.com'),
      icons: { icon: '/palmetto-taps-favicon.png', apple: '/palmetto-taps-favicon.png' },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: "Palmetto Taps",
        title: "Palmetto Taps | Horry County's First Self-Serve Taproom",
        description: "Conway & Myrtle Beach's premier self-serve taproom. 40+ beers on tap. Pour your own pint in historic downtown Conway, SC.",
        images: [{ url: '/palmetto-taps/palmetto-tap-wall.png', width: 1200, height: 630, alt: "Palmetto Taps - Self Serve Taproom" }],
      },
      twitter: {
        card: 'summary_large_image',
        title: "Palmetto Taps | Horry County's First Self-Serve Taproom",
        description: "Conway & Myrtle Beach's premier self-serve taproom. 40+ beers on tap. Pour your own pint!",
        images: ['/palmetto-taps/palmetto-tap-wall.png'],
      },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
    };
  }

  if (client?.slug === 'growwithgia') {
    return {
      title: "Growing With Gia | Personalized Tutoring & Childcare in Myrtle Beach",
      description: "Personalized tutoring and childcare in the Myrtle Beach area. Math, reading, writing, science, test prep, and babysitting for kids K–6. Every student can grow.",
      keywords: ["tutoring", "personalized tutoring", "Myrtle Beach tutor", "math tutor", "reading tutor", "writing tutor", "science tutor", "babysitter Myrtle Beach", "childcare Myrtle Beach", "elementary tutor", "test prep", "K-6 tutor", "growing with gia", "growingwithgia"],
      authors: [{ name: "Growing With Gia" }],
      creator: "Growing With Gia",
      metadataBase: new URL('https://growingwithgia.com'),
      icons: { icon: '/clients/Gia/favicon.svg', apple: '/clients/Gia/gia_about.jpeg' },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://growingwithgia.com',
        siteName: "Growing With Gia",
        title: "Growing With Gia | Personalized Tutoring & Childcare in Myrtle Beach",
        description: "Personalized tutoring and childcare in the Myrtle Beach area. Math, reading, writing, science, and more for kids K–6.",
        images: [{ url: '/og', width: 1200, height: 630, alt: "Growing With Gia - Personalized Tutoring & Childcare" }],
      },
      twitter: {
        card: 'summary_large_image',
        title: "Growing With Gia | Tutoring & Childcare",
        description: "Personalized tutoring and childcare in the Myrtle Beach area. Every student can grow.",
        images: ['/og'],
      },
      robots: { index: true, follow: true },
      alternates: {
        canonical: 'https://growingwithgia.com',
      },
    };
  }

  if (client?.slug === 'riveroaks') {
    return {
      title: "River Oaks Pizzeria | Home of the Grandma Pizza | Myrtle Beach",
      description: "Family-owned Italian pizzeria in Myrtle Beach, SC. Famous for our Grandma Pizza. Two locations: Carolina Forest & Surfside. Pizza, pasta, wine & cocktails.",
      keywords: ["River Oaks Pizzeria", "Grandma Pizza", "Myrtle Beach pizza", "Italian restaurant Myrtle Beach", "Carolina Forest pizza", "Surfside pizza", "family-owned pizzeria"],
      authors: [{ name: "River Oaks Pizzeria" }],
      creator: "River Oaks Pizzeria",
      metadataBase: new URL('https://riveroaksdemo.shortlistpass.com'),
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: "River Oaks Pizzeria",
        title: "River Oaks Pizzeria | Home of the Grandma Pizza",
        description: "Family-owned Italian pizzeria in Myrtle Beach. Famous Grandma Pizza, full bar, two locations.",
        images: [{ url: '/clients/riveroaks/pizza.png', width: 1200, height: 630, alt: "River Oaks Pizzeria - Home of the Grandma Pizza" }],
      },
      twitter: {
        card: 'summary_large_image',
        title: "River Oaks Pizzeria | Home of the Grandma Pizza",
        description: "Family-owned Italian pizzeria in Myrtle Beach. Two locations: Carolina Forest & Surfside.",
        images: ['/clients/riveroaks/pizza.png'],
      },
      robots: { index: false, follow: false },
    };
  }

  if (client?.slug === 'nitos') {
    return {
      title: "Nito's Empanadas | The Best Empanadas in Town",
      description: "Authentic handcrafted empanadas made fresh daily. Find our food truck around Myrtle Beach, SC. Savory and sweet flavors available!",
      keywords: ["empanadas", "food truck", "Myrtle Beach", "handcrafted", "authentic", "savory", "sweet", "catering"],
      authors: [{ name: "Nito's Empanadas" }],
      creator: "Nito's Empanadas",
      metadataBase: new URL('https://nitosempanadas.com'),
      icons: { icon: '/nitos-favicon.png', apple: '/nitos-favicon.png' },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: "Nito's Empanadas",
        title: "Nito's Empanadas | The Best Empanadas in Town",
        description: "Authentic handcrafted empanadas made fresh daily. Savory & sweet flavors. Order online or book our truck for your next event!",
        images: [{ url: '/nitos-name-behind-truck.png', width: 1200, height: 630, alt: "Nito's Empanadas Food Truck" }],
      },
      twitter: {
        card: 'summary_large_image',
        title: "Nito's Empanadas | The Best Empanadas in Town",
        description: "Authentic handcrafted empanadas made fresh daily. Savory & sweet flavors. Order online or book our truck!",
        images: ['/nitos-name-behind-truck.png'],
      },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
    };
  }

  if (client?.slug === 'katerina') {
    return {
      title: "Katerina Sells Florida | Lake Worth Real Estate",
      description: "Your trusted real estate partner in Lake Worth, Florida. Helping buyers and sellers find their perfect place in the Sunshine State.",
      keywords: ["Lake Worth realtor", "South Florida real estate", "Lake Worth homes", "Florida real estate agent"],
      authors: [{ name: "Katerina" }],
      creator: "Katerina Sells Florida",
      metadataBase: new URL('https://katerina-demo.shortlistpass.com'),
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: 'Katerina Sells Florida',
        title: 'Katerina Sells Florida | Lake Worth Real Estate',
        description: 'Your trusted real estate partner in Lake Worth, Florida.',
        images: [{ url: '/placeholder-og.svg', width: 1200, height: 630, alt: 'Katerina Sells Florida' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Katerina Sells Florida | Lake Worth Real Estate',
        description: 'Your trusted real estate partner in Lake Worth, Florida.',
        images: ['/placeholder-og.svg'],
      },
      robots: { index: false, follow: false },
    };
  }

  // Default: Dani Díaz
  return {
    title: "Dani Díaz | Bilingual Realtor Myrtle Beach",
    description: "Your bilingual real estate expert on the Grand Strand. Helping buyers and sellers in Myrtle Beach, SC.",
    keywords: ["Myrtle Beach realtor", "bilingual real estate agent", "Grand Strand homes", "Myrtle Beach real estate", "Spanish speaking realtor"],
    authors: [{ name: "Dani Díaz" }],
    creator: "Dani Díaz",
    publisher: "Faircloth Real Estate Group",
    metadataBase: new URL('https://daniglobalhomes.com'),
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      alternateLocale: 'es_ES',
      url: '/',
      siteName: 'Dani Díaz Real Estate',
      title: 'Dani Díaz | Bilingual Realtor Myrtle Beach',
      description: 'Your bilingual real estate expert on the Grand Strand. Helping buyers and sellers in Myrtle Beach, SC.',
      images: [{ url: '/dani-diaz-home-about.JPG', width: 1200, height: 630, alt: 'Dani Díaz - Bilingual Realtor' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dani Díaz | Bilingual Realtor Myrtle Beach',
      description: 'Your bilingual real estate expert on the Grand Strand. Helping buyers and sellers in Myrtle Beach, SC.',
      images: ['/dani-diaz-home-about.JPG'],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get hostname from request headers
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';

  // Detect portal subdomains — skip all client website stuff
  const isPortal = hostname.startsWith('portal.') || hostname.startsWith('my.') || hostname.startsWith('clients.');

  // Get client data based on hostname (only needed for client websites)
  const client = isPortal ? null : await getClient(hostname);

  // Portal routes get a clean layout with no client website components
  if (isPortal) {
    return (
      <html lang="en">
        <body className="antialiased bg-[#2a2a2a] text-white">
          {children}
        </body>
      </html>
    );
  }

  // Client website routes get the full branded experience
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data for Local Business SEO */}
        {client?.slug === 'palmetto_taps' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BarOrPub",
                "name": "Palmetto Taps",
                "description": "Horry County's First Self-Serve Taproom. 40+ beers on tap, pour your own pint in historic downtown Conway, SC.",
                "url": "https://palmettotaps.com",
                "telephone": "(843) 438-8277",
                "email": "info@palmettotaps.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "909 4th Avenue",
                  "addressLocality": "Conway",
                  "addressRegion": "SC",
                  "postalCode": "29526",
                  "addressCountry": "US"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "33.8360",
                  "longitude": "-79.0478"
                },
                "openingHoursSpecification": [
                  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "11:00", "closes": "20:00" },
                  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": "11:00", "closes": "21:30" },
                  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "11:00", "closes": "21:30" },
                  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "11:00", "closes": "21:30" },
                  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "11:00", "closes": "23:00" },
                  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "11:00", "closes": "23:00" }
                ],
                "servesCuisine": ["Beer", "Craft Beer", "Wine", "Cocktails"],
                "priceRange": "$$",
                "image": "https://palmettotaps.com/palmetto-taps/palmetto-tap-wall.png",
                "sameAs": [
                  "https://www.facebook.com/profile.php?id=100089634545976",
                  "https://www.instagram.com/palmettotaps/",
                  "https://untappd.com/v/palmetto-taps/12893204"
                ],
                "hasMenu": "https://untappd.com/v/palmetto-taps/12893204",
                "acceptsReservations": false,
                "amenityFeature": [
                  { "@type": "LocationFeatureSpecification", "name": "Self-Serve Beer Taps", "value": true },
                  { "@type": "LocationFeatureSpecification", "name": "Pet Friendly Patio", "value": false },
                  { "@type": "LocationFeatureSpecification", "name": "Family Friendly", "value": true },
                  { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
                  { "@type": "LocationFeatureSpecification", "name": "Outdoor Seating", "value": true }
                ]
              })
            }}
          />
        )}
      </head>
      <body
        className={`${playfair.variable} ${lora.variable} ${permanentMarker.variable} ${caveat.variable} antialiased bg-[#F7F7F7] text-[#3D3D3D]`}
      >
        <ClientProvider client={client}>
          <LanguageProvider>
            <StyleProvider>
              {children}
              {/* Floating Language Toggle - Show for Dani Diaz site only */}
              {(!client || client.slug === 'danidiaz') && <ChatLanguageControls />}
            </StyleProvider>
          </LanguageProvider>
        </ClientProvider>

        {/* SmartAssistant AI Widget - TEMPORARILY HIDDEN */}
        {/* TODO: Re-enable once positioning is figured out
        {(!client || client.slug !== 'nitos') && (
          <Script
            src="https://www.shortlistpass.com/widget.js"
            data-slp-subdomain="danidiaz"
            strategy="afterInteractive"
          />
        )}
        */}

        {/* Shortlist Chat Widget for Nitos — TEMPORARILY DISABLED to debug mobile scroll issues */}
        {/* {client?.slug === 'nitos' && (
          <ShortlistChatWidget
            business="nitos"
            messages="Order Empanadas|Book Our Truck|Find our Location"
          />
        )} */}

        {/* Shortlist Chat Widget for Dani Diaz — TEMPORARILY DISABLED to debug mobile scroll/swipe issues */}
        {/* {(!client || client.slug === 'danidiaz') && (
          <ShortlistChatWidget
            business="danidiaz"
            position="right"
            theme="dark"
            messages="Schedule an appointment|What areas do you service?|Ask me anything"
          />
        )} */}
      </body>
    </html>
  );
}
