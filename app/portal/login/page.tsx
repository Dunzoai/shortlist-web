'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PortalLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Redirect to dashboard
    const isPortalSubdomain = window.location.hostname.startsWith('portal.')
    router.push(isPortalSubdomain ? '/' : '/portal')
  }

  return (
    <div className="min-h-screen bg-[#333333] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shortlist Portal</h1>
          <p className="text-gray-400">Sign in to access the dashboard</p>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#444444] border border-[#555555] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#2E8B57] hover:bg-[#25724a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-lg text-sm bg-red-900/50 text-red-300 border border-red-800">
            {error}
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
