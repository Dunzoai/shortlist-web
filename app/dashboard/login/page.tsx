'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { GraduationCap, Mail, KeyRound, ArrowRight, Loader2 } from 'lucide-react';

const ALLOWED_EMAILS = ['grow.withgia26@gmail.com', 'hello@shortlistpass.com'];

export default function DashboardLoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createBrowserSupabase();

  async function sendOtp() {
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
      options: { shouldCreateUser: true },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    setStep('otp');
  }

  async function verifyOtp() {
    setError('');
    if (!otp.trim()) return;

    setLoading(true);
    const { error: authError } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: 'email',
    });
    setLoading(false);

    if (authError) {
      setError('Invalid code. Please try again.');
      return;
    }

    window.location.href = '/dashboard/inbox';
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
          {step === 'email' ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5" style={{ color: '#C6B4E2' }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Georgia', serif", color: '#2b2722' }}>
                  Enter your email
                </h2>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="grow.withgia26@gmail.com"
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none mb-4"
                style={{ borderColor: '#d9cfbf', background: 'white', fontFamily: "'Georgia', serif" }}
                onKeyDown={(e) => { if (e.key === 'Enter') sendOtp(); }}
                autoFocus
              />
              <button
                onClick={sendOtp}
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                style={{ background: '#C6B4E2', color: 'white', border: '1.5px solid #2b2722', boxShadow: '3px 3px 0 #2b2722' }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Send Code
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-5 h-5" style={{ color: '#8DD3D6' }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Georgia', serif", color: '#2b2722' }}>
                  Enter your code
                </h2>
              </div>
              <p className="text-xs mb-6" style={{ color: '#8a8078' }}>
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 rounded-xl border text-center text-2xl tracking-[0.5em] font-bold focus:outline-none mb-4"
                style={{ borderColor: '#d9cfbf', background: 'white', fontFamily: "monospace", color: '#2b2722' }}
                onKeyDown={(e) => { if (e.key === 'Enter') verifyOtp(); }}
                autoFocus
                maxLength={6}
              />
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                style={{ background: '#8DD3D6', color: 'white', border: '1.5px solid #2b2722', boxShadow: '3px 3px 0 #2b2722' }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Log In
              </button>
              <button
                onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                className="w-full text-center text-xs mt-3 py-2"
                style={{ color: '#8a8078' }}
              >
                Use a different email
              </button>
            </>
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
