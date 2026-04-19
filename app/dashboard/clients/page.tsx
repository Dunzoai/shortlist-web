'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { Users, Phone, Mail, BookOpen, Trash2, Plus, X, ChevronDown, ChevronUp, Pencil, Calendar, Clock } from 'lucide-react';

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

type Lead = {
  id: string;
  parent_name: string | null;
  child_name: string | null;
  child_grade: string | null;
  email: string | null;
  phone: string | null;
  subjects: string[];
  notes: string | null;
  received_at: string;
};

type Session = {
  id: string;
  lead_id: string;
  service: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  notes: string | null;
  completed: boolean;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sessionFormId, setSessionFormId] = useState<string | null>(null);
  const [sessionForm, setSessionForm] = useState({ date: '', time: '15:00', duration: 60, service: 'tutoring', notes: '' });
  const [clientSessions, setClientSessions] = useState<Record<string, Session[]>>({});
  const supabase = createBrowserSupabase();

  const fetchClients = useCallback(async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'booked')
      .order('parent_name', { ascending: true });
    setClients(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSessions(leadId: string) {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('lead_id', leadId)
      .order('starts_at', { ascending: true });
    setClientSessions(prev => ({ ...prev, [leadId]: data || [] }));
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setEditingId(null);
      setSessionFormId(null);
    } else {
      setExpandedId(id);
      setEditingId(null);
      setSessionFormId(null);
      fetchSessions(id);
    }
  }

  function startEdit(client: Lead) {
    setEditingId(client.id);
    setEditForm({
      parent_name: client.parent_name,
      child_name: client.child_name,
      child_grade: client.child_grade,
      email: client.email,
      phone: client.phone,
      subjects: client.subjects,
      notes: client.notes,
    });
  }

  async function saveEdit(id: string) {
    await supabase.from('leads').update({
      parent_name: editForm.parent_name || null,
      child_name: editForm.child_name || null,
      child_grade: editForm.child_grade || null,
      email: editForm.email || null,
      phone: editForm.phone || null,
      subjects: editForm.subjects || [],
      notes: editForm.notes || null,
    }).eq('id', id);
    setEditingId(null);
    await fetchClients();
  }

  async function deleteClient(id: string) {
    await supabase.from('leads').delete().eq('id', id);
    setDeleteConfirmId(null);
    setExpandedId(null);
    setClients(prev => prev.filter(c => c.id !== id));
  }

  function openSessionForm(clientId: string) {
    const today = new Date().toISOString().split('T')[0];
    setSessionFormId(clientId);
    setSessionForm({ date: today, time: '15:00', duration: 60, service: 'tutoring', notes: '' });
  }

  async function saveSession(leadId: string) {
    if (!sessionForm.date || !sessionForm.time) return;
    const startsAt = new Date(`${sessionForm.date}T${sessionForm.time}`);
    const endsAt = new Date(startsAt.getTime() + sessionForm.duration * 60000);
    await supabase.from('sessions').insert({
      lead_id: leadId,
      owner_id: '00000000-0000-0000-0000-000000000000',
      service: sessionForm.service,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      notes: sessionForm.notes.trim() || null,
    });
    setSessionFormId(null);
    await fetchSessions(leadId);
  }

  async function deleteSession(sessionId: string, leadId: string) {
    await supabase.from('sessions').delete().eq('id', sessionId);
    await fetchSessions(leadId);
  }

  const inputStyle = {
    borderColor: '#d9cfbf',
    fontFamily: 'var(--font-shippori), serif',
    color: '#2b2722',
    background: 'white',
  };

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
          <p className="text-sm mt-1" style={{ color: '#b8ad9f' }}>Mark leads as &ldquo;booked&rdquo; to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => {
            const isExpanded = expandedId === client.id;
            const isEditing = editingId === client.id;
            const sessions = clientSessions[client.id] || [];

            return (
              <div
                key={client.id}
                className="rounded-lg border overflow-hidden"
                style={{ borderColor: '#d9cfbf', background: '#FFF9F0', boxShadow: '3px 3px 0 #2b272210' }}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => toggleExpand(client.id)}
                  className="w-full text-left p-5 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                      {client.parent_name || 'Unnamed'}
                    </h3>
                    {client.child_name && (
                      <p className="text-sm mt-0.5" style={{ color: '#5b544c', fontFamily: 'var(--font-shippori), serif' }}>
                        {client.child_name}{client.child_grade && ` \u00B7 ${client.child_grade}`}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {client.email && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#5b544c' }}>
                          <Mail className="w-3 h-3" /> {client.email}
                        </span>
                      )}
                      {client.phone && (
                        <a href={`sms:${client.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-xs underline" style={{ color: '#5b544c' }}>
                          <Phone className="w-3 h-3" /> {client.phone}
                        </a>
                      )}
                    </div>
                    {client.subjects?.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <BookOpen className="w-3 h-3 shrink-0" style={{ color: '#8a8078' }} />
                        {client.subjects.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#C9DBC030', color: '#5b544c' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: '#8a8078' }} /> : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#8a8078' }} />}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t px-5 pb-5" style={{ borderColor: '#d9cfbf' }}>
                    {/* Action buttons */}
                    <div className="flex gap-2 pt-4 mb-4">
                      <button
                        onClick={() => isEditing ? setEditingId(null) : startEdit(client)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
                        style={{ background: '#F3DFA2', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                      >
                        <Pencil className="w-3 h-3" /> {isEditing ? 'Cancel Edit' : 'Edit'}
                      </button>
                      <button
                        onClick={() => openSessionForm(client.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
                        style={{ background: '#A5C4D4', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                      >
                        <Plus className="w-3 h-3" /> Add Session
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(client.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
                        style={{ background: '#D4A5A5', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>

                    {/* Delete confirmation modal */}
                    {deleteConfirmId === client.id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="rounded-lg border p-6 max-w-sm w-full mx-4" style={{ background: '#FFF9F0', borderColor: '#d9cfbf' }}>
                          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                            Are you sure?
                          </h3>
                          <p className="text-sm mb-4" style={{ color: '#5b544c', fontFamily: 'var(--font-shippori), serif' }}>
                            This will permanently delete {client.parent_name || 'this client'} and cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => deleteClient(client.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium"
                              style={{ background: '#D4A5A5', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                            >
                              Yes, delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-4 py-2 rounded-full text-xs"
                              style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Edit form */}
                    {isEditing && (
                      <div className="rounded-lg border p-4 mb-4 space-y-3" style={{ borderColor: '#d9cfbf', background: 'white' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Parent Name</label>
                            <input type="text" value={editForm.parent_name || ''} onChange={e => setEditForm(f => ({ ...f, parent_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Child Name</label>
                            <input type="text" value={editForm.child_name || ''} onChange={e => setEditForm(f => ({ ...f, child_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Grade</label>
                            <input type="text" value={editForm.child_grade || ''} onChange={e => setEditForm(f => ({ ...f, child_grade: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Email</label>
                            <input type="email" value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Phone</label>
                            <input type="tel" value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Subjects (comma-separated)</label>
                            <input type="text" value={(editForm.subjects || []).join(', ')} onChange={e => setEditForm(f => ({ ...f, subjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Notes</label>
                          <textarea value={editForm.notes || ''} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none resize-none" style={inputStyle} />
                        </div>
                        <button
                          onClick={() => saveEdit(client.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium"
                          style={{ background: '#C9DBC0', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                        >
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* Notes (when not editing) */}
                    {!isEditing && client.notes && (
                      <div className="mb-4">
                        <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Notes</p>
                        <p className="text-sm" style={{ color: '#5b544c', fontFamily: 'var(--font-shippori), serif' }}>{client.notes}</p>
                      </div>
                    )}

                    {/* Add Session Form */}
                    {sessionFormId === client.id && (
                      <div className="rounded-lg border p-4 mb-4 space-y-3" style={{ borderColor: '#d9cfbf', background: 'white' }}>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>New Session</h4>
                          <button onClick={() => setSessionFormId(null)} className="p-1"><X className="w-3.5 h-3.5" style={{ color: '#8a8078' }} /></button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Date</label>
                            <input type="date" value={sessionForm.date} onChange={e => setSessionForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Start Time</label>
                            <input type="time" value={sessionForm.time} onChange={e => setSessionForm(f => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Duration (min)</label>
                            <input type="number" value={sessionForm.duration} onChange={e => setSessionForm(f => ({ ...f, duration: parseInt(e.target.value) || 60 }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Service</label>
                            <select value={sessionForm.service} onChange={e => setSessionForm(f => ({ ...f, service: e.target.value }))} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle}>
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
                          <input type="text" value={sessionForm.notes} onChange={e => setSessionForm(f => ({ ...f, notes: e.target.value }))} placeholder="Session notes..." className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                        </div>
                        <button
                          onClick={() => saveSession(client.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium"
                          style={{ background: '#A5C4D4', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                        >
                          Save Session
                        </button>
                      </div>
                    )}

                    {/* Existing Sessions */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8a8078', fontFamily: 'monospace' }}>
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Sessions ({sessions.length})
                      </p>
                      {sessions.length === 0 ? (
                        <p className="text-xs" style={{ color: '#b8ad9f', fontFamily: 'var(--font-kalam), cursive' }}>No sessions yet</p>
                      ) : (
                        <div className="space-y-2">
                          {sessions.map(session => {
                            const start = new Date(session.starts_at);
                            const color = SERVICE_COLORS[session.service] || '#d9cfbf';
                            return (
                              <div key={session.id} className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: '#d9cfbf', borderLeft: `4px solid ${color}`, background: 'white' }}>
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="text-xs font-medium" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>
                                      {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-[10px]" style={{ color: '#8a8078' }}>
                                      <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                                      {start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                    </p>
                                  </div>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: color + '40', color: '#2b2722' }}>
                                    {SERVICE_LABELS[session.service] || session.service}
                                  </span>
                                </div>
                                <button
                                  onClick={() => deleteSession(session.id, client.id)}
                                  className="p-1 rounded hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" style={{ color: '#D4A5A5' }} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
