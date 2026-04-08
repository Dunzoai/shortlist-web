import type { Metadata } from 'next'
import PortalNav from './PortalNav'

export const metadata: Metadata = {
  title: {
    template: '%s | Shortlist Portal',
    default: 'Shortlist Portal',
  },
  description: 'Internal CRM dashboard for managing clients, revenue, and business operations.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalNav>{children}</PortalNav>
}
