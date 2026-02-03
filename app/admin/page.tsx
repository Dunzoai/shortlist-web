'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Globe, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    async function fetchNewLeadsCount() {
      const { count, error } = await supabase
        .from('real_estate_leads')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
        .eq('status', 'new');

      if (!error && count !== null) {
        setNewLeadsCount(count);
      }
    }

    fetchNewLeadsCount();
  }, []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          href="/admin/blog"
          className="bg-white p-6 rounded-lg shadow-md border-2 border-[#D6BFAE] hover:border-[#C4A25A] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
          className="bg-white p-6 rounded-lg shadow-md border-2 border-[#D6BFAE] hover:border-[#C4A25A] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-2">
            Properties
          </h2>
          <p className="text-[#3D3D3D]">
            Create and manage featured properties
          </p>
        </Link>

        <Link
          href="/admin/leads"
          className="relative bg-white p-6 rounded-lg shadow-md border-2 border-[#D6BFAE] hover:border-[#C4A25A] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          {newLeadsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {newLeadsCount}
            </span>
          )}
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-[#C4A25A]" size={24} />
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D]">
              Leads
            </h2>
          </div>
          <p className="text-[#3D3D3D]">
            View and manage incoming leads
          </p>
        </Link>

        <Link
          href="/admin/international"
          className="bg-white p-6 rounded-lg shadow-md border-2 border-[#D6BFAE] hover:border-[#C4A25A] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <Globe className="text-[#C4A25A]" size={24} />
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D]">
              International
            </h2>
          </div>
          <p className="text-[#3D3D3D]">
            Manage international destinations
          </p>
        </Link>

        <a
          href="/api/admin/billing-redirect"
          className="bg-white p-6 rounded-lg shadow-md border-2 border-[#D6BFAE] hover:border-[#C4A25A] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="text-[#C4A25A]" size={24} />
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D]">
              Billing
            </h2>
          </div>
          <p className="text-[#3D3D3D]">
            View invoices & manage subscription
          </p>
        </a>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#D6BFAE]">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1B365D] mb-4">
          Image Guidelines
        </h2>
        <div className="space-y-4 text-[#3D3D3D]">
          <div className="border-l-4 border-[#C4A25A] pl-4">
            <h3 className="font-semibold text-[#1B365D] mb-1">Blog Featured Images</h3>
            <p className="text-sm">Recommended: 1200 x 630 pixels (landscape orientation)</p>
          </div>
          <div className="border-l-4 border-[#C4A25A] pl-4">
            <h3 className="font-semibold text-[#1B365D] mb-1">Property Images</h3>
            <p className="text-sm">Recommended: 1920 x 1080 pixels (landscape orientation)</p>
            <p className="text-sm text-[#C4A25A] mt-1">Maximum 5 images per property</p>
          </div>
        </div>
      </div>
    </div>
  );
}
