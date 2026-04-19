'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  Sun,
  Calendar,
  Users,
  FileText,
  Menu,
  X,
  GraduationCap,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { label: 'Today', href: '/dashboard/today', icon: Sun },
  { label: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { label: 'Clients', href: '/dashboard/clients', icon: Users },
  { label: 'Plans', href: '/dashboard/plans', icon: FileText },
];

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function getDashboardUser(): { id: string; email: string; name: string } | null {
  try {
    const raw = getCookie('dashboard_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  // Invite modal state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // User info
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const user = getDashboardUser();
    if (user?.name) setUserName(user.name);
  }, []);

  // Login and auth pages render without the shell
  if (pathname === '/dashboard/login' || pathname.startsWith('/dashboard/auth')) {
    return <>{children}</>;
  }

  async function handleChangePassword() {
    setPwError('');
    if (!currentPw || !newPw) return;
    if (newPw !== confirmPw) { setPwError('New passwords do not match.'); return; }
    if (newPw.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    setPwLoading(true);
    const res = await fetch('/api/dashboard/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    setPwLoading(false);
    if (res.ok) {
      setPwSuccess(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } else {
      const data = await res.json();
      setPwError(data.error || 'Failed to change password.');
    }
  }

  function closePasswordModal() {
    setShowPasswordModal(false);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setPwError(''); setPwSuccess(false);
  }

  async function handleInvite() {
    setInviteError('');
    if (!inviteEmail || !invitePassword) return;
    if (invitePassword.length < 6) { setInviteError('Password must be at least 6 characters.'); return; }
    setInviteLoading(true);
    const res = await fetch('/api/dashboard/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, name: inviteName, password: invitePassword }),
    });
    setInviteLoading(false);
    if (res.ok) {
      setInviteSuccess(true);
      setInviteEmail(''); setInviteName(''); setInvitePassword('');
    } else {
      const data = await res.json();
      setInviteError(data.error || 'Failed to invite user.');
    }
  }

  function closeInviteModal() {
    setShowInviteModal(false);
    setInviteEmail(''); setInviteName(''); setInvitePassword('');
    setInviteError(''); setInviteSuccess(false);
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF9F0' }}>
      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-56 hidden md:flex flex-col border-r z-40" style={{ background: '#FFF9F0', borderColor: '#d9cfbf' }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: '#d9cfbf' }}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" style={{ color: '#C6B4E2' }} />
            <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722', transform: 'rotate(-1deg)', display: 'inline-block' }}>
              Grow With Gia
            </span>
          </Link>
          <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Dashboard</p>
          {userName && (
            <p className="text-xs mt-2 truncate" style={{ color: '#5b544c', fontFamily: 'var(--font-kalam), cursive' }}>
              Logged in as <span className="font-semibold">{userName}</span>
            </p>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  fontFamily: 'var(--font-kalam), cursive',
                  background: active ? '#F5C6A020' : 'transparent',
                  color: active ? '#2b2722' : '#5b544c',
                  border: active ? '1.5px solid #F5C6A0' : '1.5px solid transparent',
                }}
              >
                <item.icon className="w-4 h-4" style={{ color: active ? '#F5C6A0' : '#8a8078' }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors hover:bg-purple-50"
            style={{ fontFamily: 'var(--font-kalam), cursive', color: '#8a8078' }}
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors hover:bg-purple-50"
            style={{ fontFamily: 'var(--font-kalam), cursive', color: '#8a8078' }}
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
          <button
            onClick={async () => {
              await fetch('/api/dashboard/logout', { method: 'POST' });
              window.location.href = '/dashboard/login';
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors hover:bg-red-50"
            style={{ fontFamily: 'var(--font-kalam), cursive', color: '#8a8078' }}
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b" style={{ background: 'rgba(255,249,240,0.92)', backdropFilter: 'blur(8px)', borderColor: '#d9cfbf' }}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" style={{ color: '#C6B4E2' }} />
          <span className="font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>Gia</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" style={{ color: '#5b544c' }}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/20" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-14 left-0 right-0 border-b shadow-lg p-4 space-y-1" style={{ background: '#FFF9F0', borderColor: '#d9cfbf' }} onClick={(e) => e.stopPropagation()}>
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium"
                  style={{
                    fontFamily: 'var(--font-kalam), cursive',
                    background: active ? '#F5C6A020' : 'transparent',
                    color: active ? '#2b2722' : '#5b544c',
                  }}
                >
                  <item.icon className="w-4 h-4" style={{ color: active ? '#F5C6A0' : '#8a8078' }} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t" style={{ background: '#FFF9F0', borderColor: '#d9cfbf' }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
              style={{
                color: active ? '#F5C6A0' : '#8a8078',
                fontFamily: 'var(--font-kalam), cursive',
              }}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="md:ml-56 min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="rounded-2xl border p-6 w-full max-w-sm" style={{ background: '#FFF9F0', borderColor: '#d9cfbf' }}>
            {!pwSuccess ? (
              <>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                  Change Password
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5b544c' }}>Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        className="w-full px-3 py-2.5 pr-9 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: '#d9cfbf', background: 'white' }}
                      />
                      <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8a8078' }}>
                        {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5b544c' }}>New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        className="w-full px-3 py-2.5 pr-9 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: '#d9cfbf', background: 'white' }}
                      />
                      <button onClick={() => setShowNew(!showNew)} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8a8078' }}>
                        {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5b544c' }}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: newPw && confirmPw && newPw !== confirmPw ? '#D4A5A5' : '#d9cfbf', background: 'white' }}
                    />
                    {newPw && confirmPw && newPw !== confirmPw && (
                      <p className="text-[10px] mt-1" style={{ color: '#D4A5A5' }}>Passwords do not match</p>
                    )}
                    {newPw && confirmPw && newPw === confirmPw && (
                      <p className="text-[10px] mt-1" style={{ color: '#C9DBC0' }}>Passwords match</p>
                    )}
                  </div>
                </div>

                {pwError && <p className="text-xs mt-3" style={{ color: '#D4A5A5' }}>{pwError}</p>}

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={handleChangePassword}
                    disabled={pwLoading || !currentPw || !newPw || newPw !== confirmPw}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ background: '#C6B4E2', color: 'white', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                  >
                    {pwLoading ? 'Saving...' : 'Update Password'}
                  </button>
                  <button
                    onClick={closePasswordModal}
                    className="px-4 py-2.5 rounded-lg text-sm"
                    style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <KeyRound className="w-8 h-8 mx-auto mb-3" style={{ color: '#C9DBC0' }} />
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>Password Updated</h3>
                <p className="text-xs mb-4" style={{ color: '#8a8078' }}>Your new password is active now.</p>
                <button onClick={closePasswordModal} className="text-sm px-4 py-2 rounded-lg" style={{ color: '#5b544c', border: '1px solid #d9cfbf' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="rounded-2xl border p-6 w-full max-w-sm" style={{ background: '#FFF9F0', borderColor: '#d9cfbf' }}>
            {!inviteSuccess ? (
              <>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                  Invite User
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5b544c' }}>Email</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: '#d9cfbf', background: 'white' }}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5b544c' }}>Name (optional)</label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: '#d9cfbf', background: 'white' }}
                      placeholder="Display name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5b544c' }}>Password</label>
                    <input
                      type="text"
                      value={invitePassword}
                      onChange={(e) => setInvitePassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: '#d9cfbf', background: 'white' }}
                      placeholder="Initial password (min 6 chars)"
                    />
                  </div>
                </div>

                {inviteError && <p className="text-xs mt-3" style={{ color: '#D4A5A5' }}>{inviteError}</p>}

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={handleInvite}
                    disabled={inviteLoading || !inviteEmail || !invitePassword}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{ background: '#C6B4E2', color: 'white', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                  >
                    {inviteLoading ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    onClick={closeInviteModal}
                    className="px-4 py-2.5 rounded-lg text-sm"
                    style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <UserPlus className="w-8 h-8 mx-auto mb-3" style={{ color: '#C9DBC0' }} />
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>User Invited</h3>
                <p className="text-xs mb-4" style={{ color: '#8a8078' }}>They can now log in with their email and password.</p>
                <button onClick={closeInviteModal} className="text-sm px-4 py-2 rounded-lg" style={{ color: '#5b544c', border: '1px solid #d9cfbf' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
