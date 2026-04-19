'use client';

import { useState } from 'react';
import { GraduationCap, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function DashboardLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    if (!password.trim()) return;

    setLoading(true);
    const res = await fetch('/api/dashboard/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.trim(), keepLoggedIn }),
    });
    setLoading(false);

    if (res.ok) {
      window.location.href = '/dashboard/inbox';
    } else {
      setError('Incorrect password. Try again.');
      setPassword('');
    }
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
          <p className="text-sm mt-1" style={{ color: '#8a8078' }}>Dashboard</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8" style={{ background: '#FFF9F0', borderColor: '#d9cfbf', boxShadow: '4px 4px 0 #2b272215' }}>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 pr-10 rounded-xl border text-sm focus:outline-none"
              style={{ borderColor: '#d9cfbf', background: 'white', fontFamily: "'Georgia', serif" }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
              autoFocus
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              style={{ color: '#8a8078' }}
              type="button"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <label className="flex items-center gap-2 mb-5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="rounded"
              style={{ accentColor: '#C6B4E2' }}
            />
            <span className="text-xs" style={{ color: '#5b544c' }}>Keep me logged in</span>
          </label>

          <button
            onClick={handleLogin}
            disabled={loading || !password.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
            style={{ background: '#C6B4E2', color: 'white', border: '1.5px solid #2b2722', boxShadow: '3px 3px 0 #2b2722' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Log In
          </button>

          {error && (
            <p className="text-xs mt-4 text-center" style={{ color: '#D4A5A5' }}>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
