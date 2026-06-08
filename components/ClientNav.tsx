'use client';

import { useClient } from '@/lib/ClientContext';
import DanidiazNav from '@/clients/danidiaz/components/Nav';
import KaterinaNav from '@/clients/katerina/components/Nav';

export default function ClientNav() {
  const { client } = useClient();

  if (client?.slug === 'katerina') {
    return <KaterinaNav />;
  }

  return <DanidiazNav />;
}
