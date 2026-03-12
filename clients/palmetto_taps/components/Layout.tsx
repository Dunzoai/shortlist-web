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
      {/* Built by footer */}
      <div className="bg-[#1F1F1E] py-4 border-t border-[#3A3A38]">
        <a
          href="https://www.shortlistpass.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-[#A8A59D] text-sm hover:text-white transition-colors"
        >
          <span>Built by the Shortlist Pass Company</span>
          <img
            src="/shortlist-logo-ivory-transparent.png"
            alt="Shortlist Pass"
            className="h-5 w-auto opacity-70 hover:opacity-100 transition-opacity"
          />
        </a>
      </div>
    </div>
  );
}
