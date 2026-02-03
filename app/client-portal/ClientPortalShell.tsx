'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface ClientOption {
  id: string
  name: string
}

interface AccountManager {
  name: string
  email: string | null
}

export default function ClientPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubdomain, setIsSubdomain] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [invoiceCount, setInvoiceCount] = useState(0)
  const [accountManager, setAccountManager] = useState<AccountManager | null>(null)

  useEffect(() => {
    const sub = window.location.hostname.startsWith('my.') || window.location.hostname.startsWith('clients.')
    setIsSubdomain(sub)

    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let clientId = ''

      // Check if super admin (Owner in representatives)
      const { data: rep } = await supabase
        .from('representatives')
        .select('id, role')
        .eq('email', user.email)
        .eq('role', 'Owner')
        .single()

      if (rep) {
        setIsSuperAdmin(true)
        const { data: allClients } = await supabase
          .from('clients')
          .select('id, name')
          .order('name')
        setClients((allClients as ClientOption[]) || [])

        const urlClientId = searchParams.get('client')
        const storedClientId = localStorage.getItem('superadmin_client_id')
        clientId = urlClientId || storedClientId || allClients?.[0]?.id || ''
        setSelectedClientId(clientId)
        if (clientId) localStorage.setItem('superadmin_client_id', clientId)
      } else {
        // Regular client user
        const { data: portalUser } = await supabase
          .from('client_portal_users')
          .select('client_id')
          .eq('user_id', user.id)
          .single()
        if (portalUser) clientId = portalUser.client_id
      }

      if (!clientId) return

      // Fetch invoice count for badge
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .in('status', ['sent', 'overdue', 'partially_paid'])

      setInvoiceCount(count || 0)

      // Fetch account manager
      const { data: clientData } = await supabase
        .from('clients')
        .select('representative_id')
        .eq('id', clientId)
        .single()

      if (clientData?.representative_id) {
        const { data: repData } = await supabase
          .from('representatives')
          .select('name, email')
          .eq('id', clientData.representative_id)
          .single()

        if (repData) setAccountManager(repData as AccountManager)
      }
    }

    init()
  }, [searchParams])

  // Public pages — no sidebar
  if (pathname === '/client-portal/login' || pathname === '/login' ||
      pathname === '/client-portal/set-password' || pathname === '/set-password' ||
      pathname === '/client-portal/forgot-password' || pathname === '/forgot-password' ||
      pathname === '/client-portal/request-access' || pathname === '/request-access') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.removeItem('superadmin_client_id')
    router.push(isSubdomain ? '/login' : '/client-portal/login')
  }

  const handleClientSwitch = (clientId: string) => {
    setSelectedClientId(clientId)
    localStorage.setItem('superadmin_client_id', clientId)
    window.location.reload()
  }

  const nav = [
    { name: 'Services', href: isSubdomain ? '/services' : '/client-portal/services', path: 'services' },
    { name: 'Invoices', href: isSubdomain ? '/invoices' : '/client-portal/invoices', path: 'invoices', badge: invoiceCount },
    { name: 'Billing', href: isSubdomain ? '/billing' : '/client-portal/billing', path: 'billing' },
    { name: 'Settings', href: isSubdomain ? '/settings' : '/client-portal/settings', path: 'settings' },
    { name: 'How We Work', href: isSubdomain ? '/how-we-work' : '/client-portal/how-we-work', path: 'how-we-work' },
  ]

  return (
    <div className="min-h-screen bg-[#2a2a2a]">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#333333] border-r border-[#444444]">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#444444]">
            <Link href={isSubdomain ? '/services' : '/client-portal/services'} className="text-xl font-bold text-white">
              Client Portal
            </Link>
            {isSuperAdmin && (
              <span className="block text-xs text-yellow-400 mt-1">Super Admin</span>
            )}
          </div>

          {isSuperAdmin && clients.length > 0 && (
            <div className="p-4 border-b border-[#444444]">
              <label className="block text-xs text-gray-400 mb-1">Viewing as</label>
              <select
                value={selectedClientId}
                onChange={(e) => handleClientSwitch(e.target.value)}
                className="w-full px-3 py-2 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname.endsWith(item.path)
                    ? 'bg-[#2E8B57] text-white'
                    : 'text-gray-300 hover:bg-[#444444] hover:text-white'
                }`}
              >
                {item.name}
                {item.badge && item.badge > 0 ? (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#444444]">
            {accountManager && (
              <div className="p-4 border-b border-[#444444]">
                <p className="text-xs text-gray-500 mb-1">Account Managed By</p>
                <p className="text-sm font-medium text-white">{accountManager.name}</p>
                {accountManager.email && (
                  <a href={`mailto:${accountManager.email}`} className="text-xs text-[#2E8B57] hover:underline">
                    {accountManager.email}
                  </a>
                )}
              </div>
            )}

            <div className="p-4">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
