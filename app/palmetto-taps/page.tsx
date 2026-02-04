import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import HomePage from '@/clients/palmetto_taps/pages/HomePage';
import Layout from '@/clients/palmetto_taps/components/Layout';

export default async function PalmettoTapsHomePage() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  // Only render for palmetto_taps domains
  if (client?.slug !== 'palmetto_taps') {
    return <div>Not Found</div>;
  }

  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}
