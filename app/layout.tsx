import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/clients/danidiaz/components/LanguageContext";
import { StyleProvider } from "@/clients/danidiaz/components/StyleContext";
import { ClientProvider } from "@/lib/ClientContext";
import { getClient } from "@/lib/getClient";
import ChatLanguageControls from "@/clients/danidiaz/components/ChatLanguageControls";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dani Díaz | Bilingual Realtor Myrtle Beach",
  description: "Your bilingual real estate expert on the Grand Strand. Helping buyers and sellers in Myrtle Beach, SC.",
  keywords: ["Myrtle Beach realtor", "bilingual real estate agent", "Grand Strand homes", "Myrtle Beach real estate", "Spanish speaking realtor"],
  authors: [{ name: "Dani Díaz" }],
  creator: "Dani Díaz",
  publisher: "Faircloth Real Estate Group",
  metadataBase: new URL('https://demo-danidiaz.shortlistpass.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_ES',
    url: '/',
    siteName: 'Dani Díaz Real Estate',
    title: 'Dani Díaz | Bilingual Realtor Myrtle Beach',
    description: 'Your bilingual real estate expert on the Grand Strand. Helping buyers and sellers in Myrtle Beach, SC.',
    images: [
      {
        url: '/dani-diaz-home-about.JPG',
        width: 1200,
        height: 630,
        alt: 'Dani Díaz - Bilingual Realtor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dani Díaz | Bilingual Realtor Myrtle Beach',
    description: 'Your bilingual real estate expert on the Grand Strand. Helping buyers and sellers in Myrtle Beach, SC.',
    images: ['/dani-diaz-home-about.JPG'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get hostname from request headers
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';

  // Get client data based on hostname
  const client = await getClient(hostname);

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lora.variable} antialiased bg-[#F7F7F7] text-[#3D3D3D]`}
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

        {/* SmartPage AI Assistant Widget - TEMPORARILY HIDDEN */}
        {/* TODO: Re-enable once positioning is figured out
        {(!client || client.slug !== 'nitos') && (
          <Script
            src="https://www.shortlistpass.com/widget.js"
            data-slp-subdomain="danidiaz"
            strategy="afterInteractive"
          />
        )}
        */}
      </body>
    </html>
  );
}
