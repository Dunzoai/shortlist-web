'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { Users, Phone, Mail, BookOpen } from 'lucide-react';

type Lead = {
  id: string;
  parent_name: string | null;
  child_name: string | null;
  child_grade: string | null;
  email: string | null;
  phone: string | null;
  subjects: string[];
  received_at: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabase();

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'booked')
        .order('received_at', { ascending: false });
      setClients(data || []);
      setLoading(false);
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722', transform: 'rotate(-1deg)', display: 'inline-block' }}>
        Clients
      </h1>

      {loading ? (
        <p style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>Loading...</p>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 rounded-lg border" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#8a8078' }} />
          <p className="text-lg" style={{ color: '#8a8078', fontFamily: 'var(--font-caveat), cursive' }}>No clients yet</p>
          <p className="text-sm mt-1" style={{ color: '#b8ad9f' }}>Mark leads as "booked" to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-lg border p-5"
              style={{ borderColor: '#d9cfbf', background: '#FFF9F0', boxShadow: '3px 3px 0 #2b272210' }}
            >
              <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                {client.parent_name}
              </h3>
              {client.child_name && (
                <p className="text-sm mt-0.5" style={{ color: '#5b544c' }}>
                  {client.child_name}{client.child_grade && ` · ${client.child_grade}`}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-3">
                {client.email && (
                  <a href={`mailto:${client.email}`} className="flex items-center gap-1 text-xs" style={{ color: '#5b544c' }}>
                    <Mail className="w-3 h-3" /> {client.email}
                  </a>
                )}
                {client.phone && (
                  <a href={`tel:${client.phone}`} className="flex items-center gap-1 text-xs" style={{ color: '#5b544c' }}>
                    <Phone className="w-3 h-3" /> {client.phone}
                  </a>
                )}
              </div>
              {client.subjects?.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  <BookOpen className="w-3 h-3 shrink-0" style={{ color: '#8a8078' }} />
                  {client.subjects.map((s, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#C9DBC030', color: '#5b544c' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
