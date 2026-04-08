import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import EventsPage from '@/clients/palmetto_taps/pages/EventsPage';
import Layout from '@/clients/palmetto_taps/components/Layout';

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'palmetto_taps') {
    return <Layout><EventsPage /></Layout>;
  }

  return <div>Not Found</div>;
}
