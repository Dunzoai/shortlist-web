'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useMemo } from 'react'

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  )
}

function ClientsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  )
}

function AffiliatesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  )
}

function RevenueIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Check if we're on the portal subdomain for cleaner URLs
  const isPortalSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('portal.')

  const navigation = useMemo(() => [
    { name: 'Dashboard', href: isPortalSubdomain ? '/' : '/portal', icon: DashboardIcon },
    { name: 'Revenue', href: isPortalSubdomain ? '/revenue' : '/portal/revenue', icon: RevenueIcon },
    { name: 'Clients', href: isPortalSubdomain ? '/clients' : '/portal/clients', icon: ClientsIcon },
    { name: 'Affiliates', href: isPortalSubdomain ? '/affiliates' : '/portal/affiliates', icon: AffiliatesIcon },
  ], [isPortalSubdomain])

  if (pathname === '/portal/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(isPortalSubdomain ? '/login' : '/portal/login')
  }

  return (
    <div className="min-h-screen bg-[#2a2a2a]">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#333333] border-r border-[#444444]">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#444444]">
            <Link href={isPortalSubdomain ? '/' : '/portal'} className="text-xl font-bold text-white">
              Shortlist Portal
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              // Normalize pathname to work with both /portal/* and /* (subdomain) URLs
              const normalizedPath = pathname.replace('/portal', '') || '/'
              const normalizedHref = item.href.replace('/portal', '') || '/'
              const isActive = normalizedPath === normalizedHref ||
                (normalizedHref !== '/' && normalizedPath.startsWith(normalizedHref))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2E8B57] text-white'
                      : 'text-gray-300 hover:bg-[#444444] hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-[#444444]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#444444] hover:text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
