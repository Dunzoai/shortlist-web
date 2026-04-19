'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { addDays, startOfWeek, format, isSameDay, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Clock, Search } from 'lucide-react';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM - 7 PM

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
  test_prep: 'Test Prep',
  homework_help: 'Homework Help',
  other: 'Other',
};

type SessionWithLead = {
  id: string;
  lead_id: string;
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

type BookedLead = {
  id: string;
  parent_name: string | null;
  child_name: string | null;
};

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [sessions, setSessions] = useState<SessionWithLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [detailSession, setDetailSession] = useState<SessionWithLead | null>(null);
  const [bookedLeads, setBookedLeads] = useState<BookedLead[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [form, setForm] = useState({ lead_id: '', date: '', time: '15:00', duration: 60, service: 'tutoring', notes: '' });
  const supabase = createBrowserSupabase();

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = addDays(weekStart, 6);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('sessions')
      .select('*, lead:leads(parent_name, child_name)')
      .gte('starts_at', startOfDay(weekStart).toISOString())
      .lte('starts_at', endOfDay(weekEnd).toISOString())
      .order('starts_at', { ascending: true });
    setSessions((data as SessionWithLead[]) || []);
    setLoading(false);
  }, [supabase, weekStart, weekEnd]);

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  async function fetchBookedLeads() {
    const { data } = await supabase
      .from('leads')
      .select('id, parent_name, child_name')
      .eq('status', 'booked')
      .order('parent_name', { ascending: true });
    setBookedLeads(data || []);
  }

  function openNewModal(day?: Date, hour?: number) {
    fetchBookedLeads();
    setForm({
      lead_id: '',
      date: day ? format(day, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      time: hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : '15:00',
      duration: 60,
      service: 'tutoring',
      notes: '',
    });
    setLeadSearch('');
    setShowModal(true);
    setDetailSession(null);
  }

  function openDetail(session: SessionWithLead) {
    setDetailSession(session);
    setShowModal(false);
  }

  async function saveSession() {
    if (!form.lead_id || !form.date || !form.time) return;
    const startsAt = new Date(`${form.date}T${form.time}`);
    const endsAt = new Date(startsAt.getTime() + form.duration * 60000);
    await supabase.from('sessions').insert({
      lead_id: form.lead_id,
      owner_id: '00000000-0000-0000-0000-000000000000',
      service: form.service,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      notes: form.notes.trim() || null,
    });
    setShowModal(false);
    await fetchSessions();
  }

  async function deleteSession(id: string) {
    await supabase.from('sessions').delete().eq('id', id);
    setDetailSession(null);
    await fetchSessions();
  }

  function getSessionsForSlot(day: Date, hour: number) {
    return sessions.filter(s => {
      const start = parseISO(s.starts_at);
      return isSameDay(start, day) && start.getHours() === hour;
    });
  }

  const filteredLeads = bookedLeads.filter(l => {
    if (!leadSearch) return true;
    const q = leadSearch.toLowerCase();
    return (l.parent_name || '').toLowerCase().includes(q) || (l.child_name || '').toLowerCase().includes(q);
  });

  const inputStyle: React.CSSProperties = {
    borderColor: '#d9cfbf',
    fontFamily: 'var(--font-shippori), serif',
    color: '#2b2722',
    background: 'white',
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722', transform: 'rotate(-1deg)', display: 'inline-block' }}>
          Schedule
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openNewModal()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
            style={{ background: '#A5C4D4', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
          >
            <Plus className="w-3 h-3" /> Add Session
          </button>
          <button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="p-2 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: '#d9cfbf' }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: '#5b544c' }} />
          </button>
          <span className="text-sm px-3" style={{ color: '#5b544c', fontFamily: 'var(--font-kalam), cursive' }}>
            {format(weekStart, 'MMM d')} &ndash; {format(weekEnd, 'MMM d, yyyy')}
          </span>
          <button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="p-2 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: '#d9cfbf' }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: '#5b544c' }} />
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="rounded-lg border overflow-x-auto" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b min-w-[700px]" style={{ borderColor: '#d9cfbf' }}>
          <div className="p-2 text-[10px] uppercase" style={{ color: '#8a8078', fontFamily: 'monospace' }} />
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="p-2 text-center border-l"
              style={{ borderColor: '#d9cfbf', background: isSameDay(day, new Date()) ? '#F5C6A015' : 'transparent' }}
            >
              <p className="text-[10px] uppercase" style={{ color: '#8a8078', fontFamily: 'monospace' }}>{format(day, 'EEE')}</p>
              <p className="text-lg font-bold" style={{ color: isSameDay(day, new Date()) ? '#F5C6A0' : '#2b2722', fontFamily: 'var(--font-caveat), cursive' }}>
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>

        {/* Hour rows */}
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b last:border-0 min-w-[700px]" style={{ borderColor: '#d9cfbf20' }}>
            <div className="p-2 text-[10px] text-right pr-3" style={{ color: '#b8ad9f', fontFamily: 'monospace' }}>
              {hour > 12 ? `${hour - 12}p` : hour === 12 ? '12p' : `${hour}a`}
            </div>
            {days.map((day) => {
              const slotSessions = getSessionsForSlot(day, hour);
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="border-l min-h-[48px] p-0.5 cursor-pointer hover:bg-white/50 transition-colors relative"
                  style={{ borderColor: '#d9cfbf20' }}
                  onClick={() => openNewModal(day, hour)}
                >
                  {slotSessions.map(session => {
                    const start = parseISO(session.starts_at);
                    const color = SERVICE_COLORS[session.service] || '#d9cfbf';
                    const leadName = session.lead?.parent_name || session.lead?.child_name || 'Unknown';
                    return (
                      <div
                        key={session.id}
                        onClick={(e) => { e.stopPropagation(); openDetail(session); }}
                        className="rounded px-1.5 py-1 mb-0.5 cursor-pointer text-[10px] leading-tight truncate"
                        style={{ background: color + '60', borderLeft: `3px solid ${color}`, color: '#2b2722' }}
                      >
                        <span className="font-medium">{format(start, 'h:mm a')}</span>
                        <br />
                        <span style={{ fontFamily: 'var(--font-kalam), cursive' }}>{leadName}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {loading && (
        <p className="text-xs text-center mt-4" style={{ color: '#b8ad9f', fontFamily: 'var(--font-kalam), cursive' }}>Loading sessions...</p>
      )}

      {/* New Session Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowModal(false)}>
          <div className="rounded-lg border p-6 max-w-md w-full mx-4 space-y-4" style={{ background: '#FFF9F0', borderColor: '#d9cfbf' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>New Session</h3>
              <button onClick={() => setShowModal(false)} className="p-1"><X className="w-4 h-4" style={{ color: '#8a8078' }} /></button>
            </div>

            {/* Client search */}
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Client</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8a8078' }} />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border text-sm focus:outline-none"
                  style={inputStyle}
                />
              </div>
              {(leadSearch || !form.lead_id) && (
                <div className="max-h-32 overflow-y-auto mt-1 rounded-lg border" style={{ borderColor: '#d9cfbf', background: 'white' }}>
                  {filteredLeads.length === 0 ? (
                    <p className="text-xs p-2" style={{ color: '#b8ad9f' }}>No clients found</p>
                  ) : filteredLeads.map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => { setForm(f => ({ ...f, lead_id: lead.id })); setLeadSearch(lead.parent_name || lead.child_name || ''); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-0"
                      style={{ borderColor: '#d9cfbf20', fontFamily: 'var(--font-shippori), serif', color: '#2b2722', background: form.lead_id === lead.id ? '#A5C4D420' : 'transparent' }}
                    >
                      {lead.parent_name}{lead.child_name ? ` (${lead.child_name})` : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Start Time</label>
                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Duration (min)</label>
                <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 60 }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Service</label>
                <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle}>
                  <option value="tutoring">Tutoring</option>
                  <option value="babysitting">Babysitting</option>
                  <option value="test_prep">Test Prep</option>
                  <option value="homework_help">Homework Help</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Notes (optional)</label>
              <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Session notes..." className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
            </div>

            <button
              onClick={saveSession}
              disabled={!form.lead_id}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#A5C4D4', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
            >
              Save Session
            </button>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {detailSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setDetailSession(null)}>
          <div className="rounded-lg border p-6 max-w-sm w-full mx-4" style={{ background: '#FFF9F0', borderColor: '#d9cfbf' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>Session Details</h3>
              <button onClick={() => setDetailSession(null)} className="p-1"><X className="w-4 h-4" style={{ color: '#8a8078' }} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Client</p>
                <p className="text-sm font-medium" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
                  {detailSession.lead?.parent_name || 'Unknown'}
                  {detailSession.lead?.child_name ? ` (${detailSession.lead.child_name})` : ''}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>When</p>
                <p className="text-sm" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  {new Date(detailSession.starts_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
                  {new Date(detailSession.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  {' - '}
                  {new Date(detailSession.ends_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Service</p>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1" style={{ background: (SERVICE_COLORS[detailSession.service] || '#d9cfbf') + '60', color: '#2b2722' }}>
                  {SERVICE_LABELS[detailSession.service] || detailSession.service}
                </span>
              </div>
              {detailSession.notes && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Notes</p>
                  <p className="text-sm" style={{ color: '#5b544c', fontFamily: 'var(--font-shippori), serif' }}>{detailSession.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-5">
              <button
                onClick={() => deleteSession(detailSession.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
                style={{ background: '#D4A5A5', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
              >
                <Trash2 className="w-3 h-3" /> Delete Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
