import type { Metadata } from "next";
import { Playfair_Display, Lora, Permanent_Marker } from "next/font/google";
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

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'nitos') {
    return {
      title: "Nito's Empanadas | Myrtle Beach Food Truck",
      description: "Authentic handcrafted empanadas made fresh daily. Find our food truck around Myrtle Beach, SC. Savory and sweet flavors available!",
      keywords: ["empanadas", "food truck", "Myrtle Beach", "handcrafted", "authentic", "savory", "sweet", "catering"],
      authors: [{ name: "Nito's Empanadas" }],
      creator: "Nito's Empanadas",
      metadataBase: new URL('https://demo-nitos.shortlistpass.com'),
      icons: { icon: '/nitos-logo.avif' },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: "Nito's Empanadas",
        title: "Nito's Empanadas | Myrtle Beach Food Truck",
        description: "Authentic handcrafted empanadas made fresh daily. Savory & sweet flavors. Order online or book our truck for your next event!",
        images: [{ url: '/nitos-name-behind-truck.png', width: 1200, height: 630, alt: "Nito's Empanadas Food Truck" }],
      },
      twitter: {
        card: 'summary_large_image',
        title: "Nito's Empanadas | Myrtle Beach Food Truck",
        description: "Authentic handcrafted empanadas made fresh daily. Savory & sweet flavors. Order online or book our truck!",
        images: ['/nitos-name-behind-truck.png'],
      },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
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
      <body
        className={`${playfair.variable} ${lora.variable} ${permanentMarker.variable} antialiased bg-[#F7F7F7] text-[#3D3D3D]`}
      >
        <ClientProvider client={client}>
          <LanguageProvider>
            <StyleProvider>
              {children}
              {/* Floating Language Toggle - Show for Dani Diaz site */}
              {(!client || client.slug !== 'nitos') && <ChatLanguageControls />}
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
