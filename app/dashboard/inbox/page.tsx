'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { formatDistanceToNow } from 'date-fns';
import {
  Inbox,
  Globe,
  Instagram,
  Sparkles,
  PenLine,
  Search,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  BookOpen,
  ChevronLeft,
  Circle,
  MoreHorizontal,
  StickyNote,
  Send,
  X,
} from 'lucide-react';

type Lead = {
  id: string;
  source: string;
  status: string;
  child_name: string | null;
  child_grade: string | null;
  subjects: string[];
  parent_name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  notes: string | null;
  location: string | null;
  preferred_schedule: string | null;
  unread: boolean;
  received_at: string;
};

const SOURCE_ICONS: Record<string, typeof Globe> = {
  website_form: Globe,
  instagram_dm: Instagram,
  shortlistpass: Sparkles,
  manual: PenLine,
};

const SOURCE_COLORS: Record<string, string> = {
  website_form: '#A5C4D4',
  instagram_dm: '#EEC4C4',
  shortlistpass: '#C9DBC0',
  manual: '#F3DFA2',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: '#A5C4D4', text: '#fff' },
  contacted: { bg: '#F3DFA2', text: '#2b2722' },
  booked: { bg: '#C9DBC0', text: '#2b2722' },
  done: { bg: '#8a8078', text: '#fff' },
  archived: { bg: '#d9cfbf', text: '#5b544c' },
};

export default function InboxPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [noteText, setNoteText] = useState('');
  const [myNotes, setMyNotes] = useState<{ id: string; body: string; created_at: string }[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const supabase = createBrowserSupabase();

  useEffect(() => {
    fetchLeads();

    // Realtime subscription for new leads
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        setLeads(prev => [payload.new as Lead, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
        setLeads(prev => prev.map(l => l.id === (payload.new as Lead).id ? payload.new as Lead : l));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchLeads() {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('received_at', { ascending: false });
    setLeads(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('leads').update({ status, unread: false, updated_at: new Date().toISOString() }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, unread: false } : l));
  }

  async function markRead(id: string) {
    if (leads.find(l => l.id === id)?.unread) {
      await supabase.from('leads').update({ unread: false }).eq('id', id);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, unread: false } : l));
    }
    // Fetch Gia's notes for this lead
    const { data } = await supabase
      .from('lead_notes')
      .select('id, body, created_at')
      .eq('lead_id', id)
      .order('created_at', { ascending: true });
    setMyNotes(data || []);
  }

  async function addNote(leadId: string) {
    if (!noteText.trim()) return;
    const { data } = await supabase
      .from('lead_notes')
      .insert({ lead_id: leadId, owner_id: '00000000-0000-0000-0000-000000000000', body: noteText.trim() })
      .select('id, body, created_at')
      .single();
    if (data) setMyNotes(prev => [...prev, data]);
    setNoteText('');
  }

  async function deleteNote(noteId: string) {
    await supabase.from('lead_notes').delete().eq('id', noteId);
    setMyNotes(prev => prev.filter(n => n.id !== noteId));
  }

  const filtered = leads.filter(l => {
    // Status filter
    if (statusFilter === 'active' && l.status !== 'new' && l.status !== 'contacted') return false;
    if (statusFilter === 'booked' && l.status !== 'booked') return false;
    if (statusFilter === 'done' && l.status !== 'done') return false;
    if (statusFilter === 'archived' && l.status !== 'archived') return false;
    // Source filter
    if (filter !== 'all' && l.source !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (l.parent_name?.toLowerCase().includes(q) || l.child_name?.toLowerCase().includes(q) || l.message?.toLowerCase().includes(q));
    }
    return true;
  });

  const selected = leads.find(l => l.id === selectedId);

  return (
    <div className="h-[calc(100vh-56px)] md:h-screen flex flex-col md:flex-row">
      {/* Lead list */}
      <div className={`${selectedId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 border-r`} style={{ borderColor: '#d9cfbf' }}>
        {/* Search + filter */}
        <div className="p-4 border-b space-y-3" style={{ borderColor: '#d9cfbf' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8a8078' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: '#d9cfbf', background: '#FFF9F0', fontFamily: 'var(--font-shippori), serif' }}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[
              { key: 'active', label: 'Active' },
              { key: 'booked', label: 'Booked' },
              { key: 'done', label: 'Done' },
              { key: 'archived', label: 'Archived' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  fontFamily: 'var(--font-kalam), cursive',
                  background: statusFilter === t.key ? '#2b2722' : '#FFF9F0',
                  color: statusFilter === t.key ? '#FFF9F0' : '#5b544c',
                  border: `1.5px solid ${statusFilter === t.key ? '#2b2722' : '#d9cfbf'}`,
                  boxShadow: statusFilter === t.key ? '2px 2px 0 #8a8078' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'website_form', label: 'Website' },
              { key: 'shortlistpass', label: 'ShortlistPass' },
              { key: 'manual', label: 'Manual' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  fontFamily: 'var(--font-kalam), cursive',
                  background: filter === f.key ? '#F5C6A0' : '#FFF9F0',
                  color: filter === f.key ? '#fff' : '#5b544c',
                  border: `1.5px solid ${filter === f.key ? '#F5C6A0' : '#d9cfbf'}`,
                  boxShadow: filter === f.key ? '2px 2px 0 #2b2722' : 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center" style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>Loading leads...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center" style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No leads yet
            </div>
          ) : (
            filtered.map((lead) => {
              const SourceIcon = SOURCE_ICONS[lead.source] || Globe;
              const isSelected = lead.id === selectedId;
              return (
                <button
                  key={lead.id}
                  onClick={() => { setSelectedId(lead.id); markRead(lead.id); }}
                  className="w-full text-left px-4 py-3.5 border-b transition-colors"
                  style={{
                    borderColor: '#d9cfbf20',
                    background: isSelected ? '#F5C6A010' : 'transparent',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread dot */}
                    <div className="mt-1.5 shrink-0">
                      {lead.unread ? (
                        <Circle className="w-2.5 h-2.5 fill-current" style={{ color: '#A5C4D4' }} />
                      ) : (
                        <div className="w-2.5 h-2.5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm truncate" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
                          {lead.parent_name || 'Unknown'}
                        </span>
                        <span className="text-[10px] shrink-0" style={{ color: '#8a8078', fontFamily: 'monospace' }}>
                          {formatDistanceToNow(new Date(lead.received_at), { addSuffix: true })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <SourceIcon className="w-3 h-3 shrink-0" style={{ color: SOURCE_COLORS[lead.source] }} />
                        <span className="text-xs" style={{ color: '#5b544c' }}>
                          {lead.child_name && `${lead.child_name}`}
                          {lead.child_grade && ` · ${lead.child_grade}`}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto shrink-0"
                          style={{
                            background: STATUS_COLORS[lead.status]?.bg || '#d9cfbf',
                            color: STATUS_COLORS[lead.status]?.text || '#2b2722',
                          }}
                        >
                          {lead.status}
                        </span>
                      </div>

                      <p className="text-xs mt-1 line-clamp-2" style={{ color: '#8a8078' }}>
                        {lead.message}
                      </p>

                      {lead.subjects?.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {lead.subjects.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: '#F5C6A020', color: '#5b544c' }}>
                              {s}
                            </span>
                          ))}
                          {lead.subjects.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5" style={{ color: '#8a8078' }}>+{lead.subjects.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Detail pane */}
      <div className={`${selectedId ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
        {selected ? (
          <div className="flex-1 overflow-y-auto">
            {/* Mobile back button */}
            <button
              onClick={() => setSelectedId(null)}
              className="md:hidden flex items-center gap-1 px-4 py-3 text-sm border-b"
              style={{ color: '#5b544c', borderColor: '#d9cfbf', fontFamily: 'var(--font-kalam), cursive' }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {/* Hero */}
            <div className="p-6 border-b" style={{ borderColor: '#d9cfbf' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                    {selected.parent_name || 'Unknown'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {selected.child_name && (
                      <span className="text-sm" style={{ color: '#5b544c' }}>
                        Child: <strong>{selected.child_name}</strong>
                        {selected.child_grade && ` (${selected.child_grade})`}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className="text-xs px-3 py-1.5 rounded-full font-medium shrink-0"
                  style={{
                    background: STATUS_COLORS[selected.status]?.bg || '#d9cfbf',
                    color: STATUS_COLORS[selected.status]?.text || '#2b2722',
                    fontFamily: 'var(--font-kalam), cursive',
                  }}
                >
                  {selected.status}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
                    style={{
                      background: '#C9DBC0',
                      color: '#2b2722',
                      border: '1.5px solid #2b2722',
                      boxShadow: '2px 2px 0 #2b2722',
                      fontFamily: 'var(--font-kalam), cursive',
                    }}
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                )}
                {selected.phone && (
                  <a
                    href={`sms:${selected.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
                    style={{
                      background: '#A5C4D4',
                      color: '#2b2722',
                      border: '1.5px solid #2b2722',
                      boxShadow: '2px 2px 0 #2b2722',
                      fontFamily: 'var(--font-kalam), cursive',
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Text
                  </a>
                )}
                {selected.email && (
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(`Grow With Gia - ${selected.child_name || 'Tutoring'}`)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
                    style={{
                      background: '#EEC4C4',
                      color: '#2b2722',
                      border: '1.5px solid #2b2722',
                      boxShadow: '2px 2px 0 #2b2722',
                      fontFamily: 'var(--font-kalam), cursive',
                    }}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                )}
              </div>

              {/* Status actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {selected.status === 'new' && (
                  <>
                    <button
                      onClick={() => updateStatus(selected.id, 'contacted')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: '#d9cfbf', color: '#5b544c', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, 'booked')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ background: '#C9DBC0', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Add to Clients
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, 'archived')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: '#d9cfbf', color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Not a Fit
                    </button>
                  </>
                )}
                {selected.status === 'contacted' && (
                  <>
                    <button
                      onClick={() => updateStatus(selected.id, 'booked')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ background: '#C9DBC0', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Add to Clients
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, 'archived')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: '#d9cfbf', color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Not a Fit
                    </button>
                  </>
                )}
                {selected.status === 'booked' && (
                  <>
                    <button
                      onClick={() => updateStatus(selected.id, 'done')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: '#d9cfbf', color: '#5b544c', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Mark Done
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, 'contacted')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: '#d9cfbf', color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Remove from Clients
                    </button>
                  </>
                )}
                {selected.status === 'done' && (
                  <>
                    <button
                      onClick={() => updateStatus(selected.id, 'contacted')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: '#d9cfbf', color: '#5b544c', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Re-open
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, 'archived')}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: '#d9cfbf', color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
                    >
                      Archive
                    </button>
                  </>
                )}
                {selected.status === 'archived' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'new')}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium transition-transform hover:-translate-y-0.5"
                    style={{ borderColor: '#d9cfbf', color: '#5b544c', fontFamily: 'var(--font-kalam), cursive' }}
                  >
                    Re-open
                  </button>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selected.email && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5b544c' }}>
                  <Mail className="w-4 h-4 shrink-0" style={{ color: '#8a8078' }} />
                  {selected.email}
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5b544c' }}>
                  <Phone className="w-4 h-4 shrink-0" style={{ color: '#8a8078' }} />
                  {selected.phone}
                </div>
              )}
              {selected.location && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5b544c' }}>
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: '#8a8078' }} />
                  {selected.location === 'in_person' ? 'In Person' : selected.location === 'virtual' ? 'Virtual' : 'Either'}
                </div>
              )}
              {selected.preferred_schedule && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5b544c' }}>
                  <Calendar className="w-4 h-4 shrink-0" style={{ color: '#8a8078' }} />
                  {selected.preferred_schedule} days/week
                </div>
              )}
              {selected.subjects?.length > 0 && (
                <div className="flex items-start gap-2 text-sm sm:col-span-2" style={{ color: '#5b544c' }}>
                  <BookOpen className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#8a8078' }} />
                  <div className="flex flex-wrap gap-1.5">
                    {selected.subjects.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5C6A020', color: '#5b544c' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Original message */}
            {selected.message && (
              <div className="mx-6 p-4 rounded-lg border mb-4" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
                <p className="text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Message</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
                  {selected.message}
                </p>
              </div>
            )}

            {/* Parent Notes — from intake form, read-only */}
            {selected.notes && (
              <div className="mx-6 p-4 rounded-lg mb-4" style={{ background: '#A5C4D420', border: '1px solid #A5C4D440' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <StickyNote className="w-3.5 h-3.5" style={{ color: '#A5C4D4' }} />
                  <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Parent Notes</p>
                </div>
                <p className="text-sm italic" style={{ color: '#5b544c' }}>{selected.notes}</p>
              </div>
            )}

            {/* My Notes — Gia's own notes, editable */}
            <div className="mx-6 p-4 rounded-lg mb-4" style={{ background: '#F3DFA230', border: '1px dashed #F3DFA2' }}>
              <div className="flex items-center gap-1.5 mb-3">
                <StickyNote className="w-3.5 h-3.5" style={{ color: '#F3DFA2' }} />
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#8a8078', fontFamily: 'monospace' }}>My Notes</p>
              </div>

              {myNotes.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {myNotes.map((note) => (
                    <div key={note.id} className="flex items-start gap-2 group">
                      <p className="text-sm flex-1" style={{ color: '#5b544c', fontFamily: 'var(--font-shippori), serif' }}>{note.body}</p>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                        title="Delete note"
                      >
                        <X className="w-3 h-3" style={{ color: '#D4A5A5' }} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs mb-3" style={{ color: '#b8ad9f' }}>No notes yet</p>
              )}

              {/* Add note input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: '#d9cfbf', background: 'white', fontFamily: 'var(--font-shippori), serif' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') addNote(selected.id); }}
                />
                <button
                  onClick={() => addNote(selected.id)}
                  className="px-3 py-2 rounded-lg text-xs"
                  style={{ background: '#F5C6A0', color: '#2b2722', fontFamily: 'var(--font-kalam), cursive', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722' }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Source + timestamp */}
            <div className="px-6 pb-6">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>
                via {selected.source.replace('_', ' ')} · {new Date(selected.received_at).toLocaleDateString()} at {new Date(selected.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ color: '#8a8078' }}>
            <div className="text-center">
              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '24px' }}>Select a lead</p>
              <p className="text-sm mt-1">Pick one from the list to see details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
