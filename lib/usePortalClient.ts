import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface PortalClientResult {
  clientId: string | null
  isSuperAdmin: boolean
  loading: boolean
}

export function usePortalClient(): PortalClientResult {
  const router = useRouter()
  const [clientId, setClientId] = useState<string | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function resolve() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/client-portal/login')
        return
      }

      // Check if super admin (Owner in representatives)
      const { data: rep } = await supabase
        .from('representatives')
        .select('id, role')
        .eq('email', user.email)
        .eq('role', 'Owner')
        .single()

      if (rep) {
        setIsSuperAdmin(true)
        const storedClientId = localStorage.getItem('superadmin_client_id')
        if (storedClientId) {
          setClientId(storedClientId)
        } else {
          // Default to first client
          const { data: firstClient } = await supabase
            .from('clients')
            .select('id')
            .order('name')
            .limit(1)
            .single()
          if (firstClient) {
            setClientId(firstClient.id)
            localStorage.setItem('superadmin_client_id', firstClient.id)
          }
        }
        setLoading(false)
        return
      }

      // Regular client user
      const { data: portalUser } = await supabase
        .from('client_portal_users')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (!portalUser) {
        router.push('/client-portal/login')
        return
      }

      setClientId(portalUser.client_id)
      setLoading(false)
    }

    resolve()
  }, [router])

  return { clientId, isSuperAdmin, loading }
}
