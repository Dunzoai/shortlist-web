'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import Link from 'next/link';
import { Sun, Calendar, Clock, CheckCircle2, MapPin, Inbox } from 'lucide-react';

const SERVICE_COLORS: Record<string, string> = {
  tutoring: '#A5C4D4',
  babysitting: '#EEC4C4',
  test_prep: '#C9DBC0',
  homework_help: '#F3DFA2',
  other: '#d9cfbf',
};

const SERVICE_LABELS: Record<string, string> = {
  tutoring: 'Tutoring',
  babysitting: 'Babysitting',
  test_prep: 'Virtual Tutoring',
  homework_help: 'Pet Sitting',
  other: 'Other',
};

type SessionWithLead = {
  id: string;
  service: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  notes: string | null;
  completed: boolean;
  lead: {
    parent_name: string | null;
    child_name: string | null;
  } | null;
};

type NewLead = {
  id: string;
  parent_name: string | null;
  child_name: string | null;
  subjects: string[];
  received_at: string;
};

export default function TodayPage() {
  const [todaySessions, setTodaySessions] = useState<SessionWithLead[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<SessionWithLead[]>([]);
  const [newLeads, setNewLeads] = useState<NewLead[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabase();

  useEffect(() => {
    async function fetchAll() {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

      // Today's sessions
      const { data: todayData } = await supabase
        .from('sessions')
        .select('*, lead:leads(parent_name, child_name)')
        .gte('starts_at', todayStart)
        .lte('starts_at', todayEnd)
        .order('starts_at', { ascending: true });

      setTodaySessions((todayData as SessionWithLead[]) || []);

      // Upcoming sessions (next 3 after today)
      const { data: upcomingData } = await supabase
        .from('sessions')
        .select('*, lead:leads(parent_name, child_name)')
        .gt('starts_at', todayEnd)
        .order('starts_at', { ascending: true })
        .limit(3);

      setUpcomingSessions((upcomingData as SessionWithLead[]) || []);

      // New leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select('id, parent_name, child_name, subjects, received_at')
        .eq('status', 'new')
        .order('received_at', { ascending: false });

      setNewLeads(leadsData || []);
      setLoading(false);
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function SessionCard({ session }: { session: SessionWithLead }) {
    const start = new Date(session.starts_at);
    const end = new Date(session.ends_at);
    const color = SERVICE_COLORS[session.service] || '#d9cfbf';
    const clientName = session.lead?.parent_name || 'Unknown';
    const childName = session.lead?.child_name;

    return (
      <div
        className="rounded-lg border p-4 flex items-start gap-4"
        style={{ borderColor: '#d9cfbf', borderLeft: `4px solid ${color}`, background: 'white' }}
      >
        {/* Time column */}
        <div className="shrink-0 text-center" style={{ minWidth: 60 }}>
          <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
            {start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
          <p className="text-[10px]" style={{ color: '#8a8078' }}>
            to {end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
            {clientName}
          </p>
          {childName && (
            <p className="text-xs" style={{ color: '#5b544c' }}>{childName}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: color + '40', color: '#2b2722' }}>
              {SERVICE_LABELS[session.service] || session.service}
            </span>
            {session.location && (
              <span className="text-[10px] flex items-center gap-0.5" style={{ color: '#8a8078' }}>
                <MapPin className="w-2.5 h-2.5" /> {session.location}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722', transform: 'rotate(-1deg)', display: 'inline-block' }}>
        Today
      </h1>
      <p className="text-sm mb-8" style={{ color: '#8a8078', fontFamily: 'var(--font-shippori), serif' }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      {loading ? (
        <p style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>Loading...</p>
      ) : (
        <div className="space-y-6">
          {/* Today's sessions */}
          <div className="rounded-lg border p-5" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4" style={{ color: '#A5C4D4' }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>
                Today&apos;s Sessions ({todaySessions.length})
              </h2>
            </div>
            {todaySessions.length === 0 ? (
              <div className="text-center py-8" style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No sessions scheduled today</p>
                <p className="text-xs mt-1" style={{ color: '#b8ad9f' }}>Enjoy your free day!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div className="rounded-lg border p-5" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-4 h-4" style={{ color: '#F3DFA2' }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Upcoming</h2>
            </div>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8" style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No upcoming sessions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map(session => {
                  const start = new Date(session.starts_at);
                  const color = SERVICE_COLORS[session.service] || '#d9cfbf';
                  return (
                    <div key={session.id} className="flex items-center gap-3 rounded-lg border px-4 py-3" style={{ borderColor: '#d9cfbf', borderLeft: `4px solid ${color}`, background: 'white' }}>
                      <div className="shrink-0">
                        <p className="text-xs font-medium" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
                          {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[10px]" style={{ color: '#8a8078' }}>
                          {start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
                          {session.lead?.parent_name || 'Unknown'}
                        </p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0" style={{ background: color + '40', color: '#2b2722' }}>
                        {SERVICE_LABELS[session.service] || session.service}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* New Leads */}
          <div className="rounded-lg border p-5" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
            <div className="flex items-center gap-2 mb-4">
              <Inbox className="w-4 h-4" style={{ color: '#D4A5A5' }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>
                New Leads
                {newLeads.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold" style={{ background: '#D4A5A5', color: 'white' }}>
                    {newLeads.length}
                  </span>
                )}
              </h2>
            </div>
            {newLeads.length === 0 ? (
              <div className="text-center py-8" style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>All caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {newLeads.map(lead => (
                  <Link key={lead.id} href="/dashboard/inbox" className="block">
                    <div className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-gray-50" style={{ borderColor: '#d9cfbf', background: 'white' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
                          {lead.parent_name || 'Unnamed'}
                        </p>
                        {lead.child_name && (
                          <p className="text-xs" style={{ color: '#5b544c' }}>{lead.child_name}</p>
                        )}
                        {lead.subjects?.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {lead.subjects.map((s, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#C9DBC030', color: '#5b544c' }}>{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] shrink-0" style={{ color: '#b8ad9f', fontFamily: 'monospace' }}>
                        {new Date(lead.received_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
