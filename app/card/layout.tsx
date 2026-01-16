import type { Metadata } from "next";

const baseUrl = 'https://demo-danidiaz.shortlistpass.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Dani Díaz | Digital Business Card",
  description: "Connect with Dani Díaz, your bilingual real estate expert on the Grand Strand. Save my contact or reach out directly.",
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    alternateLocale: 'es_ES',
    url: `${baseUrl}/card`,
    siteName: 'Dani Díaz Real Estate',
    title: 'Dani Díaz | Bilingual Realtor®',
    description: 'Your bilingual real estate expert on the Grand Strand. Tap to save my contact!',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dani Díaz | Bilingual Realtor®',
    description: 'Your bilingual real estate expert on the Grand Strand. Tap to save my contact!',
  },
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
