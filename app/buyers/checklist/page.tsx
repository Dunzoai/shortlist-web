import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import { DaniDiazBuyerChecklistPage } from './DaniDiazBuyerChecklistPage';
import { BuyerChecklistPage as KaterinaBuyerChecklistPage } from '@/clients/katerina/pages/BuyerChecklistPage';

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'katerina') {
    return <KaterinaBuyerChecklistPage />;
  }

  return <DaniDiazBuyerChecklistPage />;
}
