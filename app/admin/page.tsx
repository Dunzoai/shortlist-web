'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

        <Link
          href="/admin/properties"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-2">
            Properties
          </h2>
          <p className="text-[#3D3D3D]">
            Create and manage featured properties
          </p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
          Image Guidelines
        </h2>
        <div className="space-y-4 text-[#3D3D3D]">
          <div>
            <h3 className="font-semibold text-[#1B365D] mb-1">Blog Featured Images</h3>
            <p className="text-sm">Recommended: 1200 x 630 pixels (landscape orientation)</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1B365D] mb-1">Property Images</h3>
            <p className="text-sm">Recommended: 1920 x 1080 pixels (landscape orientation)</p>
            <p className="text-sm text-[#C4A25A] mt-1">Maximum 5 images per property</p>
          </div>
        </div>
      </div>
    </div>
  );
}
