import { headers } from 'next/headers';
import { Metadata } from 'next';
import { getClient } from '@/lib/getClient';
import { GamePage as NitosGamePage } from '@/clients/nitos/pages/GamePage';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'nitos') {
    return {
      title: "Empanada Rush | Nito's Empanadas Game",
      description: "Play Empanada Rush! Serve hungry customers, catch plates, and earn rewards at Nito's Empanadas food truck.",
      openGraph: {
        title: "Empanada Rush | Nito's Empanadas Game",
        description: "Play Empanada Rush! Serve hungry customers and earn rewards!",
        images: ['/nitos-logo.avif'],
      },
    };
  }

  return {
    title: 'Game',
  };
}

// Coming Soon placeholder for clients without a game
function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="text-xl text-slate-300">Game not available for this client.</p>
      </div>
    </div>
  );
}

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  // Route to client-specific game based on slug
  if (client?.slug === 'nitos') {
    return <NitosGamePage />;
  }

  // Default - no game available
  return <ComingSoonPage />;
}
