'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit, Home, DollarSign, TrendingUp, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  property_type: string;
  status: string;
  images: string[];
  display_order: number;
  created_at: string;
}

type StatusFilter = 'all' | 'active' | 'pending' | 'sold';

export default function AdminPropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('featured_properties')
      .select('*')
      .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
      .order('display_order', { ascending: true });

    if (data) {
      console.log('Fetched properties:', data);
      setProperties(data);
    }
    if (error) {
      console.error('Error fetching properties:', error);
    }
    setLoading(false);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = properties.length;
    const active = properties.filter(p => p.status === 'active').length;
    const pending = properties.filter(p => p.status === 'pending').length;
    const sold = properties.filter(p => p.status === 'sold').length;

    return { total, active, pending, sold };
  }, [properties]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    if (statusFilter === 'all') return properties;
    return properties.filter(prop => prop.status === statusFilter);
  }, [properties, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('featured_properties')
      .delete()
      .eq('id', id);

    if (!error) {
      setProperties(properties.filter(prop => prop.id !== id));
    } else {
      alert('Failed to delete property');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = properties.findIndex(p => p.id === id);
    if (currentIndex === -1) return;

    const newProperties = [...properties];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newProperties.length) return;

    // Swap the properties
    [newProperties[currentIndex], newProperties[targetIndex]] =
    [newProperties[targetIndex], newProperties[currentIndex]];

    // Update display_order values
    newProperties.forEach((prop, index) => {
      prop.display_order = index;
    });

    // Update in database
    const updates = [
      { id: newProperties[currentIndex].id, display_order: currentIndex },
      { id: newProperties[targetIndex].id, display_order: targetIndex }
    ];

    for (const update of updates) {
      await supabase
        .from('featured_properties')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }

    setProperties(newProperties);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-[#C4A25A] text-white';
      case 'sold':
        return 'bg-[#1B365D] text-white';
      default:
        return 'bg-[#D6BFAE] text-[#3D3D3D]';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-[#1B365D] text-lg">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      {/* Welcome Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-[#3D3D3D] hover:text-[#C4A25A] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-2">
              Featured Properties 🏡
            </h1>
            <p className="text-[#3D3D3D] text-lg">Manage your property listings</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="bg-[#1B365D] text-white px-6 py-3 rounded-full hover:bg-[#C4A25A] transition-all hover:shadow-lg flex items-center gap-2"
          >
            <span>➕</span>
            <span>Add Property</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1B365D]/10 rounded-lg">
                <Home className="text-[#1B365D]" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#C4A25A]">{stats.total}</div>
                <div className="text-[#3D3D3D] text-sm">Total</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#C4A25A]">{stats.active}</div>
                <div className="text-[#3D3D3D] text-sm">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C4A25A]/10 rounded-lg">
                <DollarSign className="text-[#C4A25A]" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#C4A25A]">{stats.pending}</div>
                <div className="text-[#3D3D3D] text-sm">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1B365D]/10 rounded-lg">
                <Home className="text-[#1B365D]" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#C4A25A]">{stats.sold}</div>
                <div className="text-[#3D3D3D] text-sm">Sold</div>
              </div>
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <p className="text-[#3D3D3D] text-lg mb-4">No properties yet.</p>
            <Link
              href="/admin/properties/new"
              className="text-[#C4A25A] hover:text-[#1B365D] font-medium transition-colors"
            >
              Add your first property
            </Link>
          </div>
        ) : (
          <>
            {/* Status Filters */}
            <div className="mb-6">
              <div className="flex gap-2">
                {(['all', 'active', 'pending', 'sold'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-[#C4A25A] text-white shadow-md'
                        : 'bg-white text-[#3D3D3D] hover:bg-[#D6BFAE]/30 shadow-sm'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <p className="text-[#3D3D3D] text-lg">No properties found with status: {statusFilter}</p>
                <button
                  onClick={() => setStatusFilter('all')}
                  className="mt-4 text-[#C4A25A] hover:text-[#1B365D] font-medium transition-colors"
                >
                  Show all
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Property Image */}
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                        {property.images && property.images.length > 0 ? (
                          <Image
                            src={property.images[0]}
                            alt={property.address}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#D6BFAE] to-[#F7F7F7] flex items-center justify-center">
                            <Home size={48} className="text-[#3D3D3D] opacity-30" />
                          </div>
                        )}

                        {/* Status badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getStatusColor(property.status)}`}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] font-semibold mb-2">
                            {property.address}
                          </h3>
                          <p className="text-[#3D3D3D] text-sm mb-3">
                            {property.city}, {property.state}
                          </p>

                          <div className="text-2xl font-bold text-[#C4A25A] mb-3">
                            {formatPrice(property.price)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-[#3D3D3D] mb-4">
                            {property.beds && <span>{property.beds} beds</span>}
                            {property.baths && <span>{property.baths} baths</span>}
                            {property.sqft && <span>{property.sqft.toLocaleString()} sqft</span>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#D6BFAE]/20">
                          {/* Reorder buttons */}
                          <button
                            onClick={() => handleReorder(property.id, 'up')}
                            disabled={index === 0}
                            className="text-[#3D3D3D] hover:text-[#C4A25A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => handleReorder(property.id, 'down')}
                            disabled={index === filteredProperties.length - 1}
                            className="text-[#3D3D3D] hover:text-[#C4A25A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ArrowDown size={16} />
                          </button>

                          <Link
                            href={`/admin/properties/${property.id}`}
                            className="flex items-center gap-1.5 text-[#C4A25A] hover:text-[#1B365D] transition-colors font-medium text-sm"
                            onClick={() => console.log('Editing property with ID:', property.id)}
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="flex items-center gap-1.5 text-red-600 hover:text-red-700 transition-colors text-sm ml-auto"
                            title="Delete property"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
