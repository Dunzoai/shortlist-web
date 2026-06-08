import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import { DaniDiazValuationPage } from './DaniDiazValuationPage';
import { ValuationPage as KaterinaValuationPage } from '@/clients/katerina/pages/ValuationPage';

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'katerina') {
    return <KaterinaValuationPage />;
  }

  return <DaniDiazValuationPage />;
}
