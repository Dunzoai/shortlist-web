import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import { HomePage as DaniDiazHomePage } from '@/clients/danidiaz/pages/HomePage';
import SuspendedPage from '@/clients/danidiaz/pages/SuspendedPage';
import { HomePage as NitosHomePage } from '@/clients/nitos/pages/HomePage';
import HomePage from '@/clients/palmetto_taps/pages/HomePage';
import Layout from '@/clients/palmetto_taps/components/Layout';

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

  if (client?.slug === 'palmetto_taps') {
    return <Layout><HomePage /></Layout>;
  }

  // Default to danidiaz - SUSPENDED (non-payment)
  // To restore: change SuspendedPage back to DaniDiazHomePage
  return <SuspendedPage />;
}
