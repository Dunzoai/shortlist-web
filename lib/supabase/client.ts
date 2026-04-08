import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use environment variables - these are replaced at build time by Next.js
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
