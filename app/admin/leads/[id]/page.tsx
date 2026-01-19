'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail, Phone, MapPin, Home, Calendar, Tag, MessageSquare, Send } from 'lucide-react';

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

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'archived'];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchLead(params.id as string);
    }
  }, [params.id]);

  const fetchLead = async (id: string) => {
    const { data, error } = await supabase
      .from('real_estate_leads')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setLead(data);

      // Auto-mark as 'contacted' if it was 'new'
      if (data.status === 'new') {
        await updateStatus(id, 'contacted');
        setLead({ ...data, status: 'contacted' });
      }
    }
    if (error) {
      console.error('Error fetching lead:', error);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('real_estate_leads')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
    setSaving(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return;
    await updateStatus(lead.id, newStatus);
    setLead({ ...lead, status: newStatus });
  };

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
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getLeadTypeLabel = (leadType: string | null) => {
    if (!leadType) return 'General Inquiry';
    return leadType.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-[#1B365D] text-lg">Loading lead...</div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 text-[#3D3D3D] hover:text-[#C4A25A] transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Leads</span>
          </Link>
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <p className="text-[#3D3D3D] text-lg">Lead not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-[#3D3D3D] hover:text-[#C4A25A] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Leads</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-2">
                {lead.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#3D3D3D]">
                <Calendar size={14} className="text-[#C4A25A]" />
                {formatDate(lead.created_at)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Status Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#3D3D3D]">Status:</span>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-0 cursor-pointer ${getStatusColor(lead.status)}`}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status} className="bg-white text-[#3D3D3D]">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Send Email Button */}
              <a
                href={`mailto:${lead.email}?subject=Re: Your Real Estate Inquiry`}
                className="inline-flex items-center gap-2 bg-[#C4A25A] text-white px-6 py-2 rounded-full hover:bg-[#1B365D] transition-colors"
              >
                <Send size={16} />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="text-[#C4A25A] mt-1" size={18} />
                <div>
                  <p className="text-xs text-[#3D3D3D]/60 uppercase tracking-wide">Email</p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-[#1B365D] hover:text-[#C4A25A] transition-colors"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>

              {lead.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="text-[#C4A25A] mt-1" size={18} />
                  <div>
                    <p className="text-xs text-[#3D3D3D]/60 uppercase tracking-wide">Phone</p>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-[#1B365D] hover:text-[#C4A25A] transition-colors"
                    >
                      {lead.phone}
                    </a>
                  </div>
                </div>
              )}

              {lead.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#C4A25A] mt-1" size={18} />
                  <div>
                    <p className="text-xs text-[#3D3D3D]/60 uppercase tracking-wide">Address</p>
                    <p className="text-[#3D3D3D]">{lead.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-4">
              Lead Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="text-[#C4A25A] mt-1" size={18} />
                <div>
                  <p className="text-xs text-[#3D3D3D]/60 uppercase tracking-wide">Lead Type</p>
                  <p className="text-[#3D3D3D]">{getLeadTypeLabel(lead.lead_type)}</p>
                </div>
              </div>

              {lead.source && (
                <div className="flex items-start gap-3">
                  <Tag className="text-[#C4A25A] mt-1" size={18} />
                  <div>
                    <p className="text-xs text-[#3D3D3D]/60 uppercase tracking-wide">Source</p>
                    <p className="text-[#3D3D3D]">{lead.source}</p>
                  </div>
                </div>
              )}

              {lead.property_type && (
                <div className="flex items-start gap-3">
                  <Home className="text-[#C4A25A] mt-1" size={18} />
                  <div>
                    <p className="text-xs text-[#3D3D3D]/60 uppercase tracking-wide">Property Type</p>
                    <p className="text-[#3D3D3D]">{lead.property_type}</p>
                  </div>
                </div>
              )}

              {lead.year_built && (
                <div className="flex items-start gap-3">
                  <Calendar className="text-[#C4A25A] mt-1" size={18} />
                  <div>
                    <p className="text-xs text-[#3D3D3D]/60 uppercase tracking-wide">Year Built</p>
                    <p className="text-[#3D3D3D]">{lead.year_built}</p>
                  </div>
                </div>
              )}

              {lead.square_footage && (
                <div className="flex items-start gap-3">
                  <Home className="text-[#C4A25A] mt-1" size={18} />
                  <div>
                    <p className="text-xs text-[#3D3D3D]/60 uppercase tracking-wide">Square Footage</p>
                    <p className="text-[#3D3D3D]">{lead.square_footage} sq ft</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        {lead.message && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="text-[#C4A25A]" size={20} />
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D]">
                Message
              </h2>
            </div>
            <div className="bg-[#FAF9F7] rounded-lg p-4">
              <p className="text-[#3D3D3D] whitespace-pre-wrap">{lead.message}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#1B365D] mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${lead.email}?subject=Re: Your Real Estate Inquiry`}
              className="inline-flex items-center gap-2 bg-[#1B365D] text-white px-4 py-2 rounded-lg hover:bg-[#C4A25A] transition-colors"
            >
              <Mail size={16} />
              <span>Email</span>
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-2 bg-[#1B365D] text-white px-4 py-2 rounded-lg hover:bg-[#C4A25A] transition-colors"
              >
                <Phone size={16} />
                <span>Call</span>
              </a>
            )}
            {lead.phone && (
              <a
                href={`sms:${lead.phone}`}
                className="inline-flex items-center gap-2 bg-[#1B365D] text-white px-4 py-2 rounded-lg hover:bg-[#C4A25A] transition-colors"
              >
                <MessageSquare size={16} />
                <span>Text</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
