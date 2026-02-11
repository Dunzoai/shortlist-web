import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palmetto Taps | Horry County's First Self-Serve Taproom",
  description: "Conway & Myrtle Beach's premier self-serve taproom. 40+ beers on tap, craft cocktails, and local favorites. Pour your own pint in historic downtown Conway, SC.",
  icons: {
    icon: '/palmetto-taps/palmetto-taps-logo.png',
    apple: '/palmetto-taps/palmetto-taps-logo.png',
  },
};

export default function PalmettoTapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
