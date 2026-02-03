'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RequestAccessPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'success_existing' | 'not_found' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    setErrorMessage('')

    const supabase = createClient()

    // Check if this email exists as a client (case-insensitive)
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, name, email')
      .ilike('email', email.trim())
      .single()

    if (clientError || !client) {
      setStatus('not_found')
      setLoading(false)
      return
    }

    // Client exists — trigger invite
    try {
      const res = await fetch('/api/portal/invite-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          email: client.email, // Use email from DB to preserve original case
          name: client.name,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong')
        setStatus('error')
      } else if (data.alreadyExisted) {
        setStatus('success_existing')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMessage('Failed to send invite. Please try again.')
      setStatus('error')
    }

    setLoading(false)
  }

  const isSubdomain = typeof window !== 'undefined' && (window.location.hostname.startsWith('my.') || window.location.hostname.startsWith('clients.'))
  const loginHref = isSubdomain ? '/login' : '/client-portal/login'

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#333333] rounded-lg border border-[#444444] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Request Access</h1>
          <p className="text-gray-400 text-sm mb-6">
            Enter the email address associated with your account. If you're already a client, we'll send you a link to set up your password.
          </p>

          {status === 'success' ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                <p className="text-green-400 font-medium mb-1">Check your email!</p>
                <p className="text-green-400/80 text-sm">
                  We've sent a link to <span className="font-medium">{email}</span> to set up your password.
                </p>
              </div>
              <Link href={loginHref} className="block text-center text-sm text-[#2E8B57] hover:underline">
                Back to login
              </Link>
            </div>
          ) : status === 'success_existing' ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                <p className="text-green-400 font-medium mb-1">You're all set!</p>
                <p className="text-green-400/80 text-sm">
                  You already have an account. Log in with your existing password to access the client portal.
                </p>
              </div>
              <Link href={loginHref} className="block w-full px-4 py-3 bg-[#2E8B57] text-white font-medium rounded hover:bg-[#267347] text-center">
                Go to Login
              </Link>
              <Link href={isSubdomain ? '/forgot-password' : '/client-portal/forgot-password'} className="block text-center text-sm text-gray-400 hover:text-white">
                Forgot your password?
              </Link>
            </div>
          ) : status === 'not_found' ? (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-400 font-medium mb-1">Email not found</p>
                <p className="text-yellow-400/80 text-sm">
                  We couldn't find an account with that email. If you're a Shortlist client, please contact your account manager to get set up.
                </p>
              </div>
              <button
                onClick={() => { setStatus('idle'); setEmail('') }}
                className="w-full px-4 py-3 bg-[#444444] text-white font-medium rounded hover:bg-[#555555]"
              >
                Try a different email
              </button>
              <Link href={loginHref} className="block text-center text-sm text-gray-400 hover:text-white">
                Back to login
              </Link>
            </div>
          ) : status === 'error' ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                {errorMessage}
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="w-full px-4 py-3 bg-[#444444] text-white font-medium rounded hover:bg-[#555555]"
              >
                Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#444444] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#2E8B57]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-[#2E8B57] text-white font-medium rounded hover:bg-[#267347] disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Request Access'}
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
