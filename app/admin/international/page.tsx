'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit, ArrowUp, ArrowDown, Eye, EyeOff, Plus, Globe, HelpCircle, X as XIcon, ArrowLeft } from 'lucide-react';

interface Destination {
  id: string;
  slug: string;
  city: string;
  country: string;
  country_es: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const CLIENT_ID = '3c125122-f3d9-4f75-91d9-69cf84d6d20e';

export default function AdminInternationalList() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    const { data } = await supabase
      .from('international_destinations')
      .select('*')
      .eq('client_id', CLIENT_ID)
      .order('display_order', { ascending: true });
    setDestinations((data as Destination[]) || []);
    setLoading(false);
  };

  const handleDelete = async (id: string, city: string) => {
    if (!confirm(`Delete ${city}? This cannot be undone.`)) return;
    await supabase.from('international_destinations').delete().eq('id', id);
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    await supabase
      .from('international_destinations')
      .update({ is_active: !currentActive })
      .eq('id', id);
    setDestinations(destinations.map(d =>
      d.id === id ? { ...d, is_active: !currentActive } : d
    ));
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = destinations.findIndex(d => d.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === destinations.length - 1)) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...destinations];
    const tempOrder = updated[idx].display_order;
    updated[idx].display_order = updated[swapIdx].display_order;
    updated[swapIdx].display_order = tempOrder;
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];

    setDestinations(updated);

    await Promise.all([
      supabase.from('international_destinations').update({ display_order: updated[idx].display_order }).eq('id', updated[idx].id),
      supabase.from('international_destinations').update({ display_order: updated[swapIdx].display_order }).eq('id', updated[swapIdx].id),
    ]);
  };

  if (loading) return <div className="text-[#3D3D3D]">Loading...</div>;

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-[#3D3D3D] hover:text-[#C4A25A] transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D]">
            International Destinations
          </h1>
          <p className="text-[#3D3D3D] mt-1">{destinations.length} destination{destinations.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 text-[#1B365D] hover:text-[#C4A25A] transition-colors text-sm"
          >
            <HelpCircle className="w-5 h-5" />
            How it works
          </button>
          <Link
            href="/admin/international/new"
            className="flex items-center gap-2 bg-[#C4A25A] text-white px-4 py-2 rounded hover:bg-[#1B365D] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Destination
          </Link>
        </div>
      </div>

      {showGuide && (
        <div className="bg-[#1B365D]/5 border-2 border-[#1B365D]/20 rounded-lg p-6 mb-8 relative">
          <button onClick={() => setShowGuide(false)} className="absolute top-3 right-3 text-[#3D3D3D] hover:text-[#1B365D]">
            <XIcon className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-[#1B365D] text-lg mb-4">How This Page Works</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-[#3D3D3D]">
            <div className="bg-white rounded-lg p-4 border border-[#D6BFAE]">
              <p className="font-semibold text-[#1B365D] mb-1">1. Add a destination</p>
              <p>Click &quot;Add Destination&quot; to create a new country/city with descriptions, images, and investment highlights.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-[#D6BFAE]">
              <p className="font-semibold text-[#1B365D] mb-1">2. Reorder</p>
              <p>Use the up/down arrows to change the order destinations appear on your International page.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-[#D6BFAE]">
              <p className="font-semibold text-[#1B365D] mb-1">3. Show / Hide</p>
              <p>Click the eye icon to hide a destination from your site without deleting it. Click again to show it.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-[#D6BFAE]">
              <p className="font-semibold text-[#1B365D] mb-1">4. Edit or Delete</p>
              <p>Click the pencil to edit details, or the trash icon to permanently remove a destination.</p>
            </div>
          </div>
          <p className="text-xs text-[#3D3D3D]/60 mt-4">Changes appear on your live site immediately. Click &quot;View Site&quot; in the top nav, then go to the International page to see your updates.</p>
        </div>
      )}

      {destinations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-[#D6BFAE]">
          <Globe className="w-12 h-12 text-[#D6BFAE] mx-auto mb-4" />
          <p className="text-[#3D3D3D] text-lg mb-4">No destinations yet</p>
          <Link href="/admin/international/new" className="text-[#C4A25A] hover:underline">
            Add your first destination
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {destinations.map((dest, idx) => (
            <div
              key={dest.id}
              className={`bg-white rounded-lg border-2 ${dest.is_active ? 'border-[#D6BFAE]' : 'border-gray-200 opacity-60'} p-4 flex items-center gap-4`}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleReorder(dest.id, 'up')}
                  disabled={idx === 0}
                  className="text-[#3D3D3D] hover:text-[#C4A25A] disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleReorder(dest.id, 'down')}
                  disabled={idx === destinations.length - 1}
                  className="text-[#3D3D3D] hover:text-[#C4A25A] disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Image */}
              <div className="relative w-20 h-14 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {dest.image_url ? (
                  <Image src={dest.image_url} alt={dest.city} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Globe className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1B365D]">{dest.city}, {dest.country}</p>
                <p className="text-sm text-[#3D3D3D]">Order: {dest.display_order}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(dest.id, dest.is_active)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title={dest.is_active ? 'Hide' : 'Show'}
                >
                  {dest.is_active ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </button>
                <Link
                  href={`/admin/international/${dest.id}`}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit className="w-4 h-4 text-[#1B365D]" />
                </Link>
                <button
                  onClick={() => handleDelete(dest.id, dest.city)}
                  className="p-2 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
