import { headers } from 'next/headers';
import { Metadata } from 'next';
import { getClient } from '@/lib/getClient';
import { HomePage as DaniDiazHomePage } from '@/clients/danidiaz/pages/HomePage';
import { HomePage as NitosHomePage } from '@/clients/nitos/pages/HomePage';

// Dynamic metadata based on client
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'nitos') {
    return {
      title: "Nito's Empanadas | Handcrafted Empanadas in Myrtle Beach",
      description: "Authentic handcrafted empanadas made fresh daily. Find our food truck around Myrtle Beach, SC. Savory and sweet flavors available!",
      keywords: ["empanadas", "food truck", "Myrtle Beach", "handcrafted", "authentic", "savory", "sweet"],
      authors: [{ name: "Nito's Empanadas" }],
      creator: "Nito's Empanadas",
      metadataBase: new URL('https://demo-nitos.shortlistpass.com'),
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: "Nito's Empanadas",
        title: "Nito's Empanadas | Handcrafted Empanadas in Myrtle Beach",
        description: "Authentic handcrafted empanadas made fresh daily. Find our food truck around Myrtle Beach, SC.",
        images: [
          {
            url: '/nitos-name-behind-truck.png',
            width: 1200,
            height: 630,
            alt: "Nito's Empanadas - Handcrafted Empanadas",
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: "Nito's Empanadas | Handcrafted Empanadas in Myrtle Beach",
        description: "Authentic handcrafted empanadas made fresh daily. Find our food truck around Myrtle Beach, SC.",
        images: ['/nitos-name-behind-truck.png'],
      },
    };
  }

  // Default metadata for Dani Diaz (defined in layout.tsx)
  return {};
}

// Coming Soon placeholder for clients without a HomePage yet
function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-xl text-slate-300">We're building something amazing.</p>
      </div>
    </div>
  );
}

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  // Route to client-specific HomePage based on slug
  if (client?.slug === 'nitos') {
    return <NitosHomePage />;
  }

  // Default to danidiaz
  return <DaniDiazHomePage />;
}
