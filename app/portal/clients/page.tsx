'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Client, Affiliate } from '@/lib/portal-types'

interface ClientWithAffiliate extends Client {
  affiliates: Affiliate | null
}

export default function ClientsPage() {
  const router = useRouter()
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
        <Link href="/portal/clients/new" className="px-4 py-2 bg-[#2E8B57] hover:bg-[#25724a] text-white font-medium rounded-lg transition-colors">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444444]">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => router.push(`/portal/clients/${client.id}`)}
                  className="hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4"><span className="font-medium text-white">{client.name}</span></td>
                  <td className="px-6 py-4 text-gray-300">{client.email || '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{client.phone || '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{client.affiliates?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{new Date(client.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
