import { Inter, Oswald, Caveat } from "next/font/google";
import Header from "./Header";
import AgeVerification from "./AgeVerification";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export default function PalmettoTapsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${oswald.variable} ${caveat.variable} font-sans bg-[#e2d6c7] text-neutral-900 min-h-screen`}>
      <AgeVerification />
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
