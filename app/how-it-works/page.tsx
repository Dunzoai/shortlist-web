import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import HowItWorksPage from '@/clients/palmetto_taps/pages/HowItWorksPage';
import Layout from '@/clients/palmetto_taps/components/Layout';

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'palmetto_taps') {
    return <Layout><HowItWorksPage /></Layout>;
  }

  return <div>Not Found</div>;
}
