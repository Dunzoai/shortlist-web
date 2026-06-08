import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import { DaniDiazFaqsPage } from './DaniDiazFaqsPage';
import { SellerFaqsPage as KaterinaSellerFaqsPage } from '@/clients/katerina/pages/SellerFaqsPage';

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'katerina') {
    return <KaterinaSellerFaqsPage />;
  }

  return <DaniDiazFaqsPage />;
}
