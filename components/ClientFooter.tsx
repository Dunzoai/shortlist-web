'use client';

import { useClient } from '@/lib/ClientContext';
import DanidiazFooter from '@/clients/danidiaz/components/Footer';
import KaterinaFooter from '@/clients/katerina/components/Footer';

export default function ClientFooter() {
  const { client } = useClient();

  if (client?.slug === 'katerina') {
    return <KaterinaFooter />;
  }

  return <DanidiazFooter />;
}
