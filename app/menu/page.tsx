import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import RiverOaksMenuPage from '@/clients/riveroaks/pages/MenuPage';

export default async function MenuPage() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'riveroaks') {
    return <RiverOaksMenuPage dbContent={client.content} />;
  }

  // No other clients use /menu yet — redirect or show nothing
  return null;
}
