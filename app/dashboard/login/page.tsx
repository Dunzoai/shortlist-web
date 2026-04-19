'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { GraduationCap, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const ALLOWED_EMAILS = ['grow.withgia26@gmail.com', 'hello@shortlistpass.com'];

export default function DashboardLoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createBrowserSupabase();

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && ALLOWED_EMAILS.includes(user.email?.toLowerCase() ?? '')) {
        window.location.href = '/dashboard/inbox';
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMagicLink() {
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    if (!ALLOWED_EMAILS.includes(trimmed)) {
      setError('This email is not authorized to access the dashboard.');
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/dashboard/auth/callback`,
      },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FAF5EF' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <GraduationCap className="w-8 h-8" style={{ color: '#C6B4E2' }} />
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Georgia', serif", color: '#2b2722' }}>
            <span style={{ color: '#E88BA0' }}>G</span>
            <span style={{ color: '#6BBFC4' }}>r</span>
            <span style={{ color: '#D4A843' }}>o</span>
            <span style={{ color: '#A08EC8' }}>w</span>
            {' '}
            <span style={{ color: '#E88BA0' }}>W</span>
            <span style={{ color: '#6BBFC4' }}>i</span>
            <span style={{ color: '#D4A843' }}>t</span>
            <span style={{ color: '#A08EC8' }}>h</span>
            {' '}
            <span style={{ color: '#E88BA0' }}>G</span>
            <span style={{ color: '#6BBFC4' }}>i</span>
            <span style={{ color: '#D4A843' }}>a</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8a8078' }}>Dashboard Login</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8" style={{ background: '#FFF9F0', borderColor: '#d9cfbf', boxShadow: '4px 4px 0 #2b272215' }}>
          {!sent ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5" style={{ color: '#C6B4E2' }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Georgia', serif", color: '#2b2722' }}>
                  Enter your email
                </h2>
              </div>
              <p className="text-xs mb-4" style={{ color: '#8a8078' }}>
                We&apos;ll send you a magic link to sign in.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="grow.withgia26@gmail.com"
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none mb-4"
                style={{ borderColor: '#d9cfbf', background: 'white', fontFamily: "'Georgia', serif" }}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMagicLink(); }}
                autoFocus
              />
              <button
                onClick={sendMagicLink}
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                style={{ background: '#C6B4E2', color: 'white', border: '1.5px solid #2b2722', boxShadow: '3px 3px 0 #2b2722' }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Send Magic Link
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-4" style={{ color: '#8DD3D6' }} />
              <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Georgia', serif", color: '#2b2722' }}>
                Check your email
              </h2>
              <p className="text-sm mb-4" style={{ color: '#5b544c' }}>
                We sent a login link to <strong>{email}</strong>
              </p>
              <p className="text-xs mb-6" style={{ color: '#8a8078' }}>
                Click the link in the email to sign in. You can close this tab.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-xs py-2 px-4 rounded-lg"
                style={{ color: '#8a8078', border: '1px solid #d9cfbf' }}
              >
                Use a different email
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs mt-4 text-center" style={{ color: '#D4A5A5' }}>{error}</p>
          )}
        </div>

        <p className="text-center text-[10px] mt-6" style={{ color: '#b8ad9f' }}>
          Only authorized emails can access this dashboard.
        </p>
      </div>
    </div>
  );
}
