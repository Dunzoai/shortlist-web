import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { StyleProvider } from "@/components/StyleContext";

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
  metadataBase: new URL('https://danidiaz.com'),
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
        url: '/dani-og-image.jpg',
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
    images: ['/dani-og-image.jpg'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lora.variable} antialiased bg-[#F7F7F7] text-[#3D3D3D]`}
      >
        <LanguageProvider>
          <StyleProvider>
            {children}
          </StyleProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
