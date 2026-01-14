import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import { HomePage as DaniDiazHomePage } from '@/clients/danidiaz/pages/HomePage';
import { HomePage as NitosHomePage } from '@/clients/nitos/pages/HomePage';

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
