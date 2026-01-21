# Admin Dashboard - Complete Code

## Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr react-hook-form @hookform/resolvers zod
```

---

## File Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── types.ts
├── middleware.ts
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── affiliates/
│   │       ├── page.tsx
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   └── auth/
│       └── callback/
│           └── route.ts
```

---

## .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_EMAILS=your-email@example.com,another-admin@example.com
```

---

## src/lib/supabase/client.ts

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## src/lib/supabase/server.ts

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
```

---

## src/lib/types.ts

```ts
export interface Service {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Affiliate {
  id: string
  name: string
  email: string | null
  phone: string | null
  payment_type: 'percentage' | 'flat' | null
  payment_amount: number | null
  payment_frequency: 'one_time' | 'monthly' | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  affiliate_id: string | null
  created_at: string
  updated_at: string
}

export interface ClientService {
  id: string
  client_id: string
  service_id: string
  monthly_cost: number
  one_time_cost: number
  status: 'active' | 'paused' | 'cancelled'
  start_date: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ClientWithRelations extends Client {
  affiliate?: Affiliate | null
  client_services?: (ClientService & { service: Service })[]
}

export interface AffiliateWithClients extends Affiliate {
  clients?: Client[]
}
```

---

## src/middleware.ts

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!isAdminRoute || isLoginPage) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim().toLowerCase()) ?? []

  if (!adminEmails.includes(user.email?.toLowerCase() ?? '')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('error', 'not_authorized')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

## src/app/auth/callback/route.ts

```ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`)
}
```

---

## src/app/admin/login/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link!' })
      setEmail('')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#333333] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Enter your email to receive a magic link</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#444444] border border-[#555555] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-900/50 text-green-300 border border-green-800'
                : 'bg-red-900/50 text-red-300 border border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            &larr; Back to website
          </a>
        </div>
      </div>
    </div>
  )
}
```

---

## src/app/admin/layout.tsx

```tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: DashboardIcon },
  { name: 'Clients', href: '/admin/clients', icon: ClientsIcon },
  { name: 'Affiliates', href: '/admin/affiliates', icon: AffiliatesIcon },
]

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#2a2a2a]">
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#333333] border-r border-[#444444]">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#444444]">
            <Link href="/admin" className="text-xl font-bold text-white">
              Shortlist Admin
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))
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
```

---

## src/app/admin/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Client, ClientService } from '@/lib/types'

interface DashboardStats {
  totalClients: number
  activeClients: number
  monthlyRevenue: number
  recentClients: Client[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    recentClients: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: clientServices } = await supabase
        .from('client_services')
        .select('*')
        .eq('status', 'active')

      const totalClients = clients?.length ?? 0
      const recentClients = clients?.slice(0, 5) ?? []

      const monthlyRevenue = (clientServices as ClientService[] | null)?.reduce(
        (sum, cs) => sum + (Number(cs.monthly_cost) || 0),
        0
      ) ?? 0

      const activeClientIds = new Set(
        (clientServices as ClientService[] | null)?.map((cs) => cs.client_id) ?? []
      )
      const activeClients = activeClientIds.size

      setStats({
        totalClients,
        activeClients,
        monthlyRevenue,
        recentClients,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-[#444444] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Clients" value={stats.totalClients} href="/admin/clients" />
        <StatCard title="Active Clients" value={stats.activeClients} subtitle="With active services" />
        <StatCard title="Monthly Revenue" value={`$${stats.monthlyRevenue.toLocaleString()}`} subtitle="From active services" />
      </div>

      <div className="bg-[#333333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Clients</h2>
          <Link href="/admin/clients/new" className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white text-sm font-medium rounded-lg transition-colors">
            Add Client
          </Link>
        </div>

        {stats.recentClients.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No clients yet. <Link href="/admin/clients/new" className="text-[#2E8B57] hover:underline">Add your first client</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {stats.recentClients.map((client) => (
              <Link key={client.id} href={`/admin/clients/${client.id}`} className="flex items-center justify-between p-4 bg-[#3a3a3a] hover:bg-[#444444] rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-white">{client.name}</p>
                  <p className="text-sm text-gray-400">{client.email || 'No email'}</p>
                </div>
                <span className="text-gray-400 text-sm">{new Date(client.created_at).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, href }: { title: string; value: string | number; subtitle?: string; href?: string }) {
  const content = (
    <div className="bg-[#333333] rounded-lg p-6">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )

  if (href) {
    return <Link href={href} className="block hover:ring-2 hover:ring-[#2E8B57] rounded-lg transition-all">{content}</Link>
  }
  return content
}
```

---

## src/app/admin/clients/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Client, Affiliate } from '@/lib/types'

interface ClientWithAffiliate extends Client {
  affiliates: Affiliate | null
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientWithAffiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchClients() {
      const supabase = createClient()
      const { data } = await supabase
        .from('clients')
        .select('*, affiliates(*)')
        .order('created_at', { ascending: false })

      setClients((data as ClientWithAffiliate[]) ?? [])
      setLoading(false)
    }

    fetchClients()
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <Link href="/admin/clients/new" className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white font-medium rounded-lg transition-colors">
          Add Client
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
        />
      </div>

      <div className="bg-[#333333] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {search ? 'No clients match your search.' : 'No clients yet.'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#3a3a3a]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Affiliate</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Added</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444444]">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-[#3a3a3a] transition-colors">
                  <td className="px-6 py-4"><span className="font-medium text-white">{client.name}</span></td>
                  <td className="px-6 py-4 text-gray-300">{client.email || '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{client.phone || '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{client.affiliates?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{new Date(client.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/clients/${client.id}`} className="text-[#2E8B57] hover:text-[#3ba868] font-medium text-sm">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
```

---

## src/app/admin/clients/new/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Affiliate } from '@/lib/types'

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  affiliate_id: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

export default function NewClientPage() {
  const router = useRouter()
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  })

  useEffect(() => {
    async function fetchAffiliates() {
      const supabase = createClient()
      const { data } = await supabase.from('affiliates').select('*').order('name')
      setAffiliates((data as Affiliate[]) ?? [])
    }
    fetchAffiliates()
  }, [])

  const onSubmit = async (data: ClientFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase.from('clients').insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      notes: data.notes || null,
      affiliate_id: data.affiliate_id || null,
    })

    if (error) {
      alert('Error creating client: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/admin/clients')
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <Link href="/admin/clients" className="text-gray-400 hover:text-white text-sm">&larr; Back to Clients</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Add New Client</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-[#333333] rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
              <input type="text" {...register('name')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" {...register('email')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input type="tel" {...register('phone')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Referred by Affiliate</label>
              <select {...register('affiliate_id')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                <option value="">No affiliate</option>
                {affiliates.map((affiliate) => (
                  <option key={affiliate.id} value={affiliate.id}>{affiliate.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <textarea {...register('notes')} rows={4} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
              {saving ? 'Saving...' : 'Create Client'}
            </button>
            <Link href="/admin/clients" className="px-6 py-2 text-gray-300 hover:text-white transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
```

---

## src/app/admin/clients/[id]/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Client, Affiliate, Service, ClientService } from '@/lib/types'

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  affiliate_id: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientServiceWithService extends ClientService {
  services: Service
}

export default function EditClientPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [clientServices, setClientServices] = useState<ClientServiceWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: clientData } = await supabase.from('clients').select('*').eq('id', clientId).single()

      if (clientData) {
        setClient(clientData as Client)
        reset({
          name: clientData.name,
          email: clientData.email || '',
          phone: clientData.phone || '',
          notes: clientData.notes || '',
          affiliate_id: clientData.affiliate_id || '',
        })
      }

      const { data: affiliatesData } = await supabase.from('affiliates').select('*').order('name')
      setAffiliates((affiliatesData as Affiliate[]) ?? [])

      const { data: servicesData } = await supabase.from('services').select('*').order('name')
      setServices((servicesData as Service[]) ?? [])

      const { data: clientServicesData } = await supabase
        .from('client_services')
        .select('*, services(*)')
        .eq('client_id', clientId)
        .order('created_at')

      setClientServices((clientServicesData as ClientServiceWithService[]) ?? [])
      setLoading(false)
    }

    fetchData()
  }, [clientId, reset])

  const onSubmit = async (data: ClientFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('clients')
      .update({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
        affiliate_id: data.affiliate_id || null,
      })
      .eq('id', clientId)

    if (error) {
      alert('Error updating client: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/admin/clients')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client? This will also delete all their services.')) return

    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('clients').delete().eq('id', clientId)

    if (error) {
      alert('Error deleting client: ' + error.message)
      setDeleting(false)
      return
    }

    router.push('/admin/clients')
  }

  const handleAddService = async (serviceId: string) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('client_services')
      .insert({ client_id: clientId, service_id: serviceId, monthly_cost: 0, one_time_cost: 0, status: 'active' })
      .select('*, services(*)')
      .single()

    if (error) {
      alert('Error adding service: ' + error.message)
      return
    }

    setClientServices([...clientServices, data as ClientServiceWithService])
  }

  const handleUpdateService = async (csId: string, field: 'monthly_cost' | 'one_time_cost' | 'status', value: string | number) => {
    const supabase = createClient()

    const updateData: Record<string, string | number> = {}
    if (field === 'monthly_cost' || field === 'one_time_cost') {
      updateData[field] = Number(value) || 0
    } else {
      updateData[field] = value
    }

    const { error } = await supabase.from('client_services').update(updateData).eq('id', csId)

    if (error) {
      alert('Error updating service: ' + error.message)
      return
    }

    setClientServices(clientServices.map((cs) => cs.id === csId ? { ...cs, ...updateData } : cs))
  }

  const handleRemoveService = async (csId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('client_services').delete().eq('id', csId)

    if (error) {
      alert('Error removing service: ' + error.message)
      return
    }

    setClientServices(clientServices.filter((cs) => cs.id !== csId))
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="h-64 bg-[#444444] rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Client not found.</p>
        <Link href="/admin/clients" className="text-[#2E8B57] hover:underline">Back to Clients</Link>
      </div>
    )
  }

  const assignedServiceIds = clientServices.map((cs) => cs.service_id)
  const availableServices = services.filter((s) => !assignedServiceIds.includes(s.id))

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/clients" className="text-gray-400 hover:text-white text-sm">&larr; Back to Clients</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Edit Client</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-[#333333] rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Client Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
                  <input type="text" {...register('name')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" {...register('email')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input type="tel" {...register('phone')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Referred by Affiliate</label>
                  <select {...register('affiliate_id')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                    <option value="">No affiliate</option>
                    {affiliates.map((affiliate) => (
                      <option key={affiliate.id} value={affiliate.id}>{affiliate.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea {...register('notes')} rows={4} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors">
                  {deleting ? 'Deleting...' : 'Delete Client'}
                </button>
              </div>
            </form>
          </div>

          <div>
            <div className="bg-[#333333] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Services</h2>
                {availableServices.length > 0 && (
                  <select
                    onChange={(e) => { if (e.target.value) { handleAddService(e.target.value); e.target.value = '' } }}
                    className="px-3 py-1.5 bg-[#444444] border border-[#555555] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  >
                    <option value="">+ Add Service</option>
                    {availableServices.map((service) => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {clientServices.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No services assigned yet. Use the dropdown above to add services.</p>
              ) : (
                <div className="space-y-4">
                  {clientServices.map((cs) => (
                    <div key={cs.id} className="bg-[#3a3a3a] rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{cs.services.name}</span>
                        <button onClick={() => handleRemoveService(cs.id)} className="text-gray-400 hover:text-red-400 text-sm">Remove</button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Monthly Cost</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="number"
                              value={cs.monthly_cost}
                              onChange={(e) => handleUpdateService(cs.id, 'monthly_cost', e.target.value)}
                              className="w-full pl-7 pr-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">One-time Cost</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="number"
                              value={cs.one_time_cost}
                              onChange={(e) => handleUpdateService(cs.id, 'one_time_cost', e.target.value)}
                              className="w-full pl-7 pr-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Status</label>
                        <select
                          value={cs.status}
                          onChange={(e) => handleUpdateService(cs.id, 'status', e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#444444] border border-[#555555] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-[#444444]">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Monthly</span>
                      <span className="font-medium text-white">
                        ${clientServices.filter((cs) => cs.status === 'active').reduce((sum, cs) => sum + Number(cs.monthly_cost), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## src/app/admin/affiliates/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Affiliate, Client, ClientService } from '@/lib/types'

interface AffiliateWithStats extends Affiliate {
  clients: Client[]
  totalMonthlyRevenue: number
  totalEarnings: number
}

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<AffiliateWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAffiliates() {
      const supabase = createClient()

      const { data: affiliatesData } = await supabase.from('affiliates').select('*, clients(*)').order('name')

      const { data: clientServicesData } = await supabase.from('client_services').select('*').eq('status', 'active')

      const clientServices = (clientServicesData as ClientService[]) ?? []

      const affiliatesWithStats = ((affiliatesData as (Affiliate & { clients: Client[] })[]) ?? []).map((affiliate) => {
        const clientIds = affiliate.clients.map((c) => c.id)

        const totalMonthlyRevenue = clientServices
          .filter((cs) => clientIds.includes(cs.client_id))
          .reduce((sum, cs) => sum + Number(cs.monthly_cost), 0)

        let totalEarnings = 0
        if (affiliate.payment_type === 'percentage' && affiliate.payment_amount) {
          totalEarnings = totalMonthlyRevenue * (affiliate.payment_amount / 100)
        } else if (affiliate.payment_type === 'flat' && affiliate.payment_amount) {
          totalEarnings = affiliate.payment_amount * affiliate.clients.length
        }

        return { ...affiliate, totalMonthlyRevenue, totalEarnings }
      })

      setAffiliates(affiliatesWithStats)
      setLoading(false)
    }

    fetchAffiliates()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Affiliates</h1>
        <Link href="/admin/affiliates/new" className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white font-medium rounded-lg transition-colors">
          Add Affiliate
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>{[1, 2, 3].map((i) => <div key={i} className="h-48 bg-[#333333] rounded-lg animate-pulse"></div>)}</>
        ) : affiliates.length === 0 ? (
          <div className="col-span-full bg-[#333333] rounded-lg p-8 text-center text-gray-400">
            No affiliates yet. <Link href="/admin/affiliates/new" className="text-[#2E8B57] hover:underline">Add your first affiliate</Link>
          </div>
        ) : (
          affiliates.map((affiliate) => (
            <Link key={affiliate.id} href={`/admin/affiliates/${affiliate.id}`} className="bg-[#333333] rounded-lg p-6 hover:ring-2 hover:ring-[#2E8B57] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{affiliate.name}</h3>
                  <p className="text-gray-400 text-sm">{affiliate.email || 'No email'}</p>
                </div>
                <span className="px-2 py-1 bg-[#444444] rounded text-xs text-gray-300">
                  {affiliate.clients.length} client{affiliate.clients.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Terms</span>
                  <span className="text-gray-200">
                    {affiliate.payment_type === 'percentage' ? `${affiliate.payment_amount}%` : affiliate.payment_type === 'flat' ? `$${affiliate.payment_amount}` : '-'}
                    {affiliate.payment_frequency === 'monthly' && '/mo'}
                    {affiliate.payment_frequency === 'one_time' && ' (one-time)'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Client Revenue</span>
                  <span className="text-gray-200">${affiliate.totalMonthlyRevenue.toLocaleString()}/mo</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#444444]">
                  <span className="text-gray-400">Their Earnings</span>
                  <span className="font-medium text-[#2E8B57]">
                    ${affiliate.totalEarnings.toLocaleString()}{affiliate.payment_frequency === 'monthly' && '/mo'}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
```

---

## src/app/admin/affiliates/new/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const affiliateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  payment_type: z.enum(['percentage', 'flat']).optional(),
  payment_amount: z.string().optional(),
  payment_frequency: z.enum(['one_time', 'monthly']).optional(),
  notes: z.string().optional(),
})

type AffiliateFormData = z.infer<typeof affiliateSchema>

export default function NewAffiliatePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateSchema),
  })

  const paymentType = watch('payment_type')

  const onSubmit = async (data: AffiliateFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase.from('affiliates').insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      payment_type: data.payment_type || null,
      payment_amount: data.payment_amount ? Number(data.payment_amount) : null,
      payment_frequency: data.payment_frequency || null,
      notes: data.notes || null,
    })

    if (error) {
      alert('Error creating affiliate: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/admin/affiliates')
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <Link href="/admin/affiliates" className="text-gray-400 hover:text-white text-sm">&larr; Back to Affiliates</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Add New Affiliate</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-[#333333] rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
              <input type="text" {...register('name')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" placeholder="John Smith" />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" {...register('email')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input type="tel" {...register('phone')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
            </div>
          </div>

          <div className="bg-[#333333] rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Payment Terms</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Payment Type</label>
              <select {...register('payment_type')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                <option value="">Select payment type</option>
                <option value="percentage">Percentage of client revenue</option>
                <option value="flat">Flat fee per client</option>
              </select>
            </div>

            {paymentType && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {paymentType === 'percentage' ? 'Percentage (%)' : 'Flat Amount ($)'}
                  </label>
                  <input type="number" step={paymentType === 'percentage' ? '0.1' : '1'} {...register('payment_amount')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" placeholder={paymentType === 'percentage' ? '10' : '100'} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Frequency</label>
                  <select {...register('payment_frequency')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly (recurring)</option>
                    <option value="one_time">One-time per client</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="bg-[#333333] rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
            <textarea {...register('notes')} rows={4} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none" placeholder="Any additional notes about this affiliate..." />
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
              {saving ? 'Saving...' : 'Create Affiliate'}
            </button>
            <Link href="/admin/affiliates" className="px-6 py-2 text-gray-300 hover:text-white transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
```

---

## src/app/admin/affiliates/[id]/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Affiliate, Client, ClientService } from '@/lib/types'

const affiliateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  payment_type: z.enum(['percentage', 'flat', '']).optional(),
  payment_amount: z.string().optional(),
  payment_frequency: z.enum(['one_time', 'monthly', '']).optional(),
  notes: z.string().optional(),
})

type AffiliateFormData = z.infer<typeof affiliateSchema>

interface ClientWithRevenue extends Client {
  monthlyRevenue: number
}

export default function EditAffiliatePage() {
  const router = useRouter()
  const params = useParams()
  const affiliateId = params.id as string

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [clients, setClients] = useState<ClientWithRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateSchema),
  })

  const paymentType = watch('payment_type')

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: affiliateData } = await supabase.from('affiliates').select('*').eq('id', affiliateId).single()

      if (affiliateData) {
        const aff = affiliateData as Affiliate
        setAffiliate(aff)
        reset({
          name: aff.name,
          email: aff.email || '',
          phone: aff.phone || '',
          payment_type: aff.payment_type || '',
          payment_amount: aff.payment_amount?.toString() || '',
          payment_frequency: aff.payment_frequency || '',
          notes: aff.notes || '',
        })
      }

      const { data: clientsData } = await supabase.from('clients').select('*').eq('affiliate_id', affiliateId).order('created_at', { ascending: false })

      const clientIds = (clientsData as Client[])?.map((c) => c.id) ?? []

      if (clientIds.length > 0) {
        const { data: servicesData } = await supabase.from('client_services').select('*').in('client_id', clientIds).eq('status', 'active')

        const services = (servicesData as ClientService[]) ?? []

        const clientsWithRevenue = ((clientsData as Client[]) ?? []).map((client) => {
          const clientServices = services.filter((s) => s.client_id === client.id)
          const monthlyRevenue = clientServices.reduce((sum, s) => sum + Number(s.monthly_cost), 0)
          return { ...client, monthlyRevenue }
        })

        setClients(clientsWithRevenue)
      } else {
        setClients([])
      }

      setLoading(false)
    }

    fetchData()
  }, [affiliateId, reset])

  const onSubmit = async (data: AffiliateFormData) => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('affiliates')
      .update({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        payment_type: data.payment_type || null,
        payment_amount: data.payment_amount ? Number(data.payment_amount) : null,
        payment_frequency: data.payment_frequency || null,
        notes: data.notes || null,
      })
      .eq('id', affiliateId)

    if (error) {
      alert('Error updating affiliate: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/admin/affiliates')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this affiliate? Their referred clients will no longer be associated with them.')) return

    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('affiliates').delete().eq('id', affiliateId)

    if (error) {
      alert('Error deleting affiliate: ' + error.message)
      setDeleting(false)
      return
    }

    router.push('/admin/affiliates')
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#444444] rounded w-48"></div>
          <div className="h-64 bg-[#444444] rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!affiliate) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Affiliate not found.</p>
        <Link href="/admin/affiliates" className="text-[#2E8B57] hover:underline">Back to Affiliates</Link>
      </div>
    )
  }

  const totalMonthlyRevenue = clients.reduce((sum, c) => sum + c.monthlyRevenue, 0)
  let totalEarnings = 0
  if (affiliate.payment_type === 'percentage' && affiliate.payment_amount) {
    totalEarnings = totalMonthlyRevenue * (affiliate.payment_amount / 100)
  } else if (affiliate.payment_type === 'flat' && affiliate.payment_amount) {
    totalEarnings = affiliate.payment_amount * clients.length
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/affiliates" className="text-gray-400 hover:text-white text-sm">&larr; Back to Affiliates</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Edit Affiliate</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-[#333333] rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name <span className="text-red-400">*</span></label>
                  <input type="text" {...register('name')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" {...register('email')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input type="tel" {...register('phone')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                </div>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Payment Terms</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Type</label>
                  <select {...register('payment_type')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                    <option value="">No payment terms</option>
                    <option value="percentage">Percentage of client revenue</option>
                    <option value="flat">Flat fee per client</option>
                  </select>
                </div>

                {(paymentType === 'percentage' || paymentType === 'flat') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {paymentType === 'percentage' ? 'Percentage (%)' : 'Flat Amount ($)'}
                      </label>
                      <input type="number" step={paymentType === 'percentage' ? '0.1' : '1'} {...register('payment_amount')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Payment Frequency</label>
                      <select {...register('payment_frequency')} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                        <option value="">Select frequency</option>
                        <option value="monthly">Monthly (recurring)</option>
                        <option value="one_time">One-time per client</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-[#333333] rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea {...register('notes')} rows={4} className="w-full px-4 py-2 bg-[#444444] border border-[#555555] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2E8B57] resize-none" />
              </div>

              <div className="flex items-center justify-between">
                <button type="submit" disabled={saving} className="px-6 py-2 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors">
                  {deleting ? 'Deleting...' : 'Delete Affiliate'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-[#333333] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Earnings Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Clients</span>
                  <span className="text-white">{clients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Client Revenue</span>
                  <span className="text-white">${totalMonthlyRevenue.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#444444]">
                  <span className="text-gray-400">Their Earnings</span>
                  <span className="text-xl font-semibold text-[#2E8B57]">
                    ${totalEarnings.toLocaleString()}{affiliate.payment_frequency === 'monthly' && '/mo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#333333] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Referred Clients</h2>
              {clients.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No clients referred yet.</p>
              ) : (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <Link key={client.id} href={`/admin/clients/${client.id}`} className="flex items-center justify-between p-3 bg-[#3a3a3a] hover:bg-[#444444] rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-sm text-gray-400">{client.email || 'No email'}</p>
                      </div>
                      <span className="text-sm text-gray-300">${client.monthlyRevenue.toLocaleString()}/mo</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## SQL Schema (Run in Supabase SQL Editor)

```sql
-- Services (predefined list of your offerings)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default services
INSERT INTO services (name, description) VALUES
  ('Social Media Management', 'Monthly social media content and management'),
  ('SmartPages', 'AI-powered business assistant page'),
  ('Website Build', 'Custom website development'),
  ('PWA/App', 'Progressive web app or mobile app development');

-- Affiliates (referral partners)
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  payment_type TEXT CHECK (payment_type IN ('percentage', 'flat')),
  payment_amount DECIMAL(10,2),
  payment_frequency TEXT CHECK (payment_frequency IN ('one_time', 'monthly')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Client Services (what each client pays for)
CREATE TABLE client_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  monthly_cost DECIMAL(10,2) DEFAULT 0,
  one_time_cost DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'paused', 'cancelled')) DEFAULT 'active',
  start_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_services ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can read services" ON services FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read affiliates" ON affiliates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage affiliates" ON affiliates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read clients" ON clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage clients" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read client_services" ON client_services FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage client_services" ON client_services FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_services_updated_at BEFORE UPDATE ON client_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
