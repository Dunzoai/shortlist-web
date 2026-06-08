import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import { DaniDiazChecklistPage } from './DaniDiazChecklistPage';
import { SellerChecklistPage as KaterinaSellerChecklistPage } from '@/clients/katerina/pages/SellerChecklistPage';

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'katerina') {
    return <KaterinaSellerChecklistPage />;
  }

  return <DaniDiazChecklistPage />;
}
