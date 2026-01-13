'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for admin cookie
    const adminCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_access='));

    if (adminCookie) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === 'avaelena2019!') {
      // Set cookie for 7 days
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `admin_access=true; expires=${expires.toUTCString()}; path=/`;

      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsAuthenticated(false);
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f1ed]">
        <div className="text-[#1B365D]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f1ed]">
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#D6BFAE] max-w-md w-full">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-6 text-center">
            Admin Access
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-[#3D3D3D] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#D6BFAE] rounded focus:outline-none focus:border-[#C4A25A] focus:ring-2 focus:ring-[#C4A25A]/20 transition-all"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#C4A25A] text-white py-2 rounded hover:bg-[#1B365D] transition-colors font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Admin Header */}
      <header className="bg-[#1B365D] text-white py-4 shadow-lg border-b-2 border-[#C4A25A]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl">
            Dani Díaz Admin
          </h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/admin/blog"
              className={`hover:text-[#C4A25A] transition-colors ${pathname.startsWith('/admin/blog') ? 'text-[#C4A25A]' : ''}`}
            >
              Blog
            </Link>
            <Link
              href="/admin/properties"
              className={`hover:text-[#C4A25A] transition-colors ${pathname.startsWith('/admin/properties') ? 'text-[#C4A25A]' : ''}`}
            >
              Properties
            </Link>
            <Link
              href="/"
              className="hover:text-[#C4A25A] transition-colors"
              target="_blank"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-[#C4A25A] text-white px-4 py-1 rounded hover:bg-[#1B365D] hover:ring-2 hover:ring-[#C4A25A] transition-all"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
