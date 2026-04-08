'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Users, Mail, Phone, Calendar, ArrowLeft, Eye } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  property_type: string | null;
  year_built: string | null;
  square_footage: string | null;
  message: string | null;
  lead_type: string | null;
  source: string | null;
  status: string;
  created_at: string;
}

type StatusFilter = 'all' | 'new' | 'contacted' | 'converted' | 'archived';

export default function AdminLeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('real_estate_leads')
      .select('*')
      .eq('client_id', '3c125122-f3d9-4f75-91d9-69cf84d6d20e')
      .order('created_at', { ascending: false });

    if (data) {
      setLeads(data);
    }
    if (error) {
      console.error('Error fetching leads:', error);
    }
    setLoading(false);
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const contacted = leads.filter(l => l.status === 'contacted').length;
    const converted = leads.filter(l => l.status === 'converted').length;
    const archived = leads.filter(l => l.status === 'archived').length;

    return { total, newLeads, contacted, converted, archived };
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    if (statusFilter === 'all') return leads;
    return leads.filter(lead => lead.status === statusFilter);
  }, [leads, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-500 text-white';
      case 'contacted':
        return 'bg-blue-500 text-white';
      case 'converted':
        return 'bg-green-500 text-white';
      case 'archived':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-[#D6BFAE] text-[#3D3D3D]';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getLeadTypeLabel = (leadType: string | null) => {
    if (!leadType) return 'General';
    return leadType.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-[#1B365D] text-lg">Loading leads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
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
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1B365D] mb-2 flex items-center gap-3">
              Leads
              <Users className="text-[#C4A25A]" size={36} />
            </h1>
            <p className="text-[#3D3D3D] text-lg">Manage your incoming leads</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1B365D]/10 rounded-lg">
                <Users className="text-[#1B365D]" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C4A25A]">{stats.total}</div>
                <div className="text-[#3D3D3D] text-xs">Total</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="text-red-500" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C4A25A]">{stats.newLeads}</div>
                <div className="text-[#3D3D3D] text-xs">New</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="text-blue-500" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C4A25A]">{stats.contacted}</div>
                <div className="text-[#3D3D3D] text-xs">Contacted</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="text-green-500" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C4A25A]">{stats.converted}</div>
                <div className="text-[#3D3D3D] text-xs">Converted</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="text-gray-500" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C4A25A]">{stats.archived}</div>
                <div className="text-[#3D3D3D] text-xs">Archived</div>
              </div>
            </div>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <p className="text-[#3D3D3D] text-lg">No leads yet.</p>
          </div>
        ) : (
          <>
            {/* Status Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {(['all', 'new', 'contacted', 'converted', 'archived'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-[#C4A25A] text-white shadow-md'
                        : 'bg-white text-[#3D3D3D] hover:bg-[#D6BFAE]/30 shadow-sm'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {status === 'new' && stats.newLeads > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {stats.newLeads}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <p className="text-[#3D3D3D] text-lg">No leads found with status: {statusFilter}</p>
                <button
                  onClick={() => setStatusFilter('all')}
                  className="mt-4 text-[#C4A25A] hover:text-[#1B365D] font-medium transition-colors"
                >
                  Show all
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/admin/leads/${lead.id}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] font-semibold group-hover:text-[#C4A25A] transition-colors">
                              {lead.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-[#3D3D3D]">
                            <span className="flex items-center gap-1">
                              <Mail size={14} className="text-[#C4A25A]" />
                              {lead.email}
                            </span>
                            {lead.phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={14} className="text-[#C4A25A]" />
                                {lead.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar size={14} className="text-[#C4A25A]" />
                              {formatDate(lead.created_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {lead.lead_type && (
                            <span className="px-3 py-1 bg-[#D6BFAE]/30 text-[#3D3D3D] rounded-full text-sm">
                              {getLeadTypeLabel(lead.lead_type)}
                            </span>
                          )}
                          <Eye size={20} className="text-[#C4A25A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
