import { headers } from 'next/headers';
import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get('host') || 'www.sundaynailpress.com';
  const base = `https://${host}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio-admin', '/api/', '/dashboard', '/portal', '/client-portal'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
