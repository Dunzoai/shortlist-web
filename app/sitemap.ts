import { headers } from 'next/headers';
import type { MetadataRoute } from 'next';
import { getClient } from '@/lib/getClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get('host') || 'www.sundaynailpress.com';
  const base = `https://${host}`;
  const client = await getClient(host);

  // Sunday's public pages; other tenants just get the homepage for now.
  const brandyPaths = ['', '/shop', '/about', '/sizing', '/get-started', '/faq', '/gallery', '/terms'];
  const paths = client?.slug === 'brandydemo' ? brandyPaths : [''];

  return paths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }));
}
