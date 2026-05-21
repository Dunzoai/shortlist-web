import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import RiverOaksOrderPage from '@/clients/riveroaks/pages/OrderPage';

export default async function OrderPage() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'riveroaks') {
    return <RiverOaksOrderPage dbContent={client.content} />;
  }

  // No other clients use /order yet
  return null;
}
