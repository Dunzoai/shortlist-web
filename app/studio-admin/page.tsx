import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import { AdminPage as BrandyDemoAdminPage } from '@/clients/brandydemo/pages/AdminPage';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-slate-300">Page not found.</p>
      </div>
    </div>
  );
}

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'brandydemo') {
    return <BrandyDemoAdminPage />;
  }

  return <NotFoundPage />;
}
