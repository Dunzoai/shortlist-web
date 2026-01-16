import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dani Díaz | Digital Business Card",
  description: "Connect with Dani Díaz, your bilingual real estate expert on the Grand Strand. Save my contact or reach out directly.",
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    alternateLocale: 'es_ES',
    url: 'https://demo-danidiaz.shortlistpass.com/card',
    siteName: 'Dani Díaz Real Estate',
    title: 'Dani Díaz | Bilingual Realtor®',
    description: 'Your bilingual real estate expert on the Grand Strand. Tap to save my contact!',
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
    title: 'Dani Díaz | Bilingual Realtor®',
    description: 'Your bilingual real estate expert on the Grand Strand. Tap to save my contact!',
    images: ['/dani-diaz-home-about.JPG'],
  },
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
