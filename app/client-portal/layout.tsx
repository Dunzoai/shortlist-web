import type { Metadata } from 'next'
import ClientPortalShell from './ClientPortalShell'

export const metadata: Metadata = {
  title: {
    template: '%s | Shortlist Client Portal',
    default: 'Shortlist Client Portal',
  },
  description: 'Manage your services, invoices, and billing with The Shortlist Co.',
  metadataBase: new URL('https://my.shortlistpass.com'),
  openGraph: {
    type: 'website',
    siteName: 'Shortlist Client Portal',
    title: 'Shortlist Client Portal',
    description: 'Manage your services, invoices, and billing with The Shortlist Co.',
  },
  twitter: {
    card: 'summary',
    title: 'Shortlist Client Portal',
    description: 'Manage your services, invoices, and billing with The Shortlist Co.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return <ClientPortalShell>{children}</ClientPortalShell>
}
