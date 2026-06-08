import { headers } from 'next/headers';
import { getClient } from '@/lib/getClient';
import { DaniDiazNetProceedsPage } from './DaniDiazNetProceedsPage';
import { NetProceedsPage as KaterinaNetProceedsPage } from '@/clients/katerina/pages/NetProceedsPage';

export default async function Page() {
  const headersList = await headers();
  const hostname = headersList.get('host') || 'localhost:3000';
  const client = await getClient(hostname);

  if (client?.slug === 'katerina') {
    return <KaterinaNetProceedsPage />;
  }

  return <DaniDiazNetProceedsPage />;
}
