'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://my.shortlistpass.com/client-portal/set-password',
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  const isSubdomain = typeof window !== 'undefined' && (window.location.hostname.startsWith('my.') || window.location.hostname.startsWith('clients.'))
  const loginHref = isSubdomain ? '/login' : '/client-portal/login'

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#333333] rounded-lg border border-[#444444] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm mb-6">Enter your email and we'll send you a link to reset your password.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {sent ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-500/10 border border-green-500/50 rounded text-green-400 text-sm">
                Check your email for a password reset link.
              </div>
              <Link href={loginHref} className="block text-center text-sm text-[#2E8B57] hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#444444] rounded text-white focus:outline-none focus:border-[#2E8B57]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-[#2E8B57] text-white font-medium rounded hover:bg-[#267347] disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link href={loginHref} className="block text-center text-sm text-gray-400 hover:text-white">
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
