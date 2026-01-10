import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dani Díaz - Bilingual Realtor® | Myrtle Beach Real Estate",
  description: "From Global Roots to Local Roofs. Bilingual Realtor® at Faircloth Real Estate Group serving Myrtle Beach and the Grand Strand.",
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
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
