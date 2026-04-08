'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Briefcase, FileText, CreditCard, Settings, BookOpen, Menu, X, LogOut } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Public pages — no shell
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
    { name: 'Services', href: isSubdomain ? '/services' : '/client-portal/services', path: 'services', icon: Briefcase },
    { name: 'Invoices', href: isSubdomain ? '/invoices' : '/client-portal/invoices', path: 'invoices', badge: invoiceCount, icon: FileText },
    { name: 'Billing', href: isSubdomain ? '/billing' : '/client-portal/billing', path: 'billing', icon: CreditCard },
    { name: 'Settings', href: isSubdomain ? '/settings' : '/client-portal/settings', path: 'settings', icon: Settings },
    { name: 'How We Work', href: isSubdomain ? '/how-we-work' : '/client-portal/how-we-work', path: 'how-we-work', icon: BookOpen },
  ]

  // Bottom tab items (subset for quick access)
  const bottomTabs = nav.slice(0, 4) // Services, Invoices, Billing, Settings

  const isActive = (path: string) => pathname.endsWith(path)

  return (
    <div className="min-h-screen bg-[#2a2a2a]">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-[#333333] border-r border-[#444444]">
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
                  isActive(item.path)
                    ? 'bg-[#2E8B57] text-white'
                    : 'text-gray-300 hover:bg-[#444444] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </span>
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#333333] border-r border-[#444444] overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-[#444444] flex items-center justify-between">
                <span className="text-lg font-bold text-white">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isSuperAdmin && clients.length > 0 && (
                <div className="p-4 border-b border-[#444444]">
                  <label className="block text-xs text-gray-400 mb-1">Viewing as</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => handleClientSwitch(e.target.value)}
                    className="w-full px-3 py-2 bg-[#444444] border border-[#555555] rounded text-white text-sm"
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
                      isActive(item.path)
                        ? 'bg-[#2E8B57] text-white'
                        : 'text-gray-300 hover:bg-[#444444] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </span>
                    {item.badge && item.badge > 0 ? (
                      <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </nav>

              {accountManager && (
                <div className="p-4 border-t border-[#444444]">
                  <p className="text-xs text-gray-500 mb-1">Account Managed By</p>
                  <p className="text-sm font-medium text-white">{accountManager.name}</p>
                  {accountManager.email && (
                    <a href={`mailto:${accountManager.email}`} className="text-xs text-[#2E8B57] hover:underline">
                      {accountManager.email}
                    </a>
                  )}
                </div>
              )}

              <div className="p-4 border-t border-[#444444]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#333333] border-t border-[#444444] safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {bottomTabs.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                isActive(item.path) ? 'text-[#2E8B57]' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.name}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-2 right-1/4 flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-400"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-1">More</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
