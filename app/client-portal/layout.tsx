'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/portal/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  const nav = [
    { name: 'Dashboard', href: '/portal/dashboard' },
    { name: 'Services', href: '/portal/services' },
    { name: 'Invoices', href: '/portal/invoices' },
    { name: 'Billing', href: '/portal/billing' },
    { name: 'Settings', href: '/portal/settings' },
  ]

  return (
    <div className="min-h-screen bg-[#2a2a2a]">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#333333] border-r border-[#444444]">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#444444]">
            <Link href="/portal/dashboard" className="text-xl font-bold text-white">
              Client Portal
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-[#2E8B57] text-white'
                    : 'text-gray-300 hover:bg-[#444444] hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-[#444444]">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
