'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/blog"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-2">
            Blog Posts
          </h2>
          <p className="text-[#3D3D3D]">
            Create and manage blog posts
          </p>
        </Link>
      </div>
    </div>
  );
}
