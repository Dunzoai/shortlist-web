'use client';

import { useState } from 'react';
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
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { label: 'Today', href: '/dashboard/today', icon: Sun },
  { label: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { label: 'Clients', href: '/dashboard/clients', icon: Users },
  { label: 'Plans', href: '/dashboard/plans', icon: FileText },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Login and auth pages render without the shell
  if (pathname === '/dashboard/login' || pathname.startsWith('/dashboard/auth')) {
    return <>{children}</>;
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

        <div className="px-3 pb-4">
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
    </div>
  );
}
