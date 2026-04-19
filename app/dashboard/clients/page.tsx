'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { Users, Phone, Mail, BookOpen, Trash2, Plus, X, ChevronDown, ChevronUp, Pencil, Calendar, Clock, FileText, Search, StickyNote, Send } from 'lucide-react';

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

type Plan = {
  id: string;
  lead_id: string | null;
  title: string;
  subject: string | null;
  body_markdown: string | null;
  created_at: string;
  updated_at: string;
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
  const [clientPlans, setClientPlans] = useState<Record<string, Plan[]>>({});
  const [planFormId, setPlanFormId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({ title: '', subject: '', body_markdown: '' });
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [deletePlanConfirmId, setDeletePlanConfirmId] = useState<string | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [addClientForm, setAddClientForm] = useState({ parent_name: '', child_name: '', child_grade: '', email: '', phone: '', subjects: '' });
  const [addingClient, setAddingClient] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientNotes, setClientNotes] = useState<Record<string, { id: string; body: string; created_at: string }[]>>({});
  const [noteText, setNoteText] = useState('');
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

  async function fetchPlans(leadId: string) {
    const { data } = await supabase
      .from('lesson_plans')
      .select('*')
      .eq('lead_id', leadId)
      .order('updated_at', { ascending: false });
    setClientPlans(prev => ({ ...prev, [leadId]: data || [] }));
  }

  async function fetchNotes(leadId: string) {
    const { data } = await supabase
      .from('lead_notes')
      .select('id, body, created_at')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });
    setClientNotes(prev => ({ ...prev, [leadId]: data || [] }));
  }

  async function addClientNote(leadId: string) {
    if (!noteText.trim()) return;
    const { data } = await supabase
      .from('lead_notes')
      .insert({ lead_id: leadId, owner_id: '00000000-0000-0000-0000-000000000000', body: noteText.trim() })
      .select('id, body, created_at')
      .single();
    if (data) setClientNotes(prev => ({ ...prev, [leadId]: [...(prev[leadId] || []), data] }));
    setNoteText('');
  }

  async function deleteClientNote(noteId: string, leadId: string) {
    await supabase.from('lead_notes').delete().eq('id', noteId);
    setClientNotes(prev => ({ ...prev, [leadId]: (prev[leadId] || []).filter(n => n.id !== noteId) }));
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
      setPlanFormId(null);
      setEditingPlanId(null);
      setNoteText('');
      fetchSessions(id);
      fetchPlans(id);
      fetchNotes(id);
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

  function openPlanForm(clientId: string) {
    setPlanFormId(clientId);
    setEditingPlanId(null);
    setPlanForm({ title: '', subject: '', body_markdown: '' });
  }

  function startEditPlan(plan: Plan) {
    setEditingPlanId(plan.id);
    setPlanFormId(plan.lead_id);
    setPlanForm({ title: plan.title, subject: plan.subject || '', body_markdown: plan.body_markdown || '' });
  }

  async function savePlan(leadId: string) {
    if (!planForm.title.trim()) return;
    const payload = {
      title: planForm.title.trim(),
      subject: planForm.subject.trim() || null,
      body_markdown: planForm.body_markdown.trim() || null,
      lead_id: leadId,
      owner_id: '00000000-0000-0000-0000-000000000000',
      updated_at: new Date().toISOString(),
    };
    if (editingPlanId) {
      await supabase.from('lesson_plans').update(payload).eq('id', editingPlanId);
    } else {
      await supabase.from('lesson_plans').insert(payload);
    }
    setPlanFormId(null);
    setEditingPlanId(null);
    await fetchPlans(leadId);
  }

  async function deletePlan(planId: string, leadId: string) {
    await supabase.from('lesson_plans').delete().eq('id', planId);
    setDeletePlanConfirmId(null);
    await fetchPlans(leadId);
  }

  async function saveNewClient() {
    if (!addClientForm.parent_name.trim()) return;
    setAddingClient(true);
    await supabase.from('leads').insert({
      parent_name: addClientForm.parent_name.trim(),
      child_name: addClientForm.child_name.trim() || null,
      child_grade: addClientForm.child_grade.trim() || null,
      email: addClientForm.email.trim() || null,
      phone: addClientForm.phone.trim() || null,
      subjects: addClientForm.subjects ? addClientForm.subjects.split(',').map(s => s.trim()).filter(Boolean) : [],
      status: 'booked',
      source: 'manual',
      client_slug: 'growwithgia',
      unread: false,
    });
    setShowAddClient(false);
    setAddClientForm({ parent_name: '', child_name: '', child_grade: '', email: '', phone: '', subjects: '' });
    setAddingClient(false);
    await fetchClients();
  }

  const inputStyle = {
    borderColor: '#d9cfbf',
    fontFamily: 'var(--font-shippori), serif',
    color: '#2b2722',
    background: 'white',
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto overflow-x-hidden pb-20">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722', transform: 'rotate(-1deg)', display: 'inline-block' }}>
          Clients
        </h1>
        <button
          onClick={() => setShowAddClient(!showAddClient)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
          style={{ background: '#C9DBC0', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
        >
          <Plus className="w-3 h-3" /> Add Client
        </button>
      </div>

      {/* Add Client Form */}
      {showAddClient && (
        <div className="rounded-lg border p-4 mb-6 space-y-3" style={{ borderColor: '#d9cfbf', background: 'white' }}>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>New Client</h4>
            <button onClick={() => setShowAddClient(false)} className="p-1"><X className="w-3.5 h-3.5" style={{ color: '#8a8078' }} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Parent Name *</label>
              <input type="text" value={addClientForm.parent_name} onChange={e => setAddClientForm(f => ({ ...f, parent_name: e.target.value }))} placeholder="Parent name" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Child Name</label>
              <input type="text" value={addClientForm.child_name} onChange={e => setAddClientForm(f => ({ ...f, child_name: e.target.value }))} placeholder="Child name" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Child Grade</label>
              <input type="text" value={addClientForm.child_grade} onChange={e => setAddClientForm(f => ({ ...f, child_grade: e.target.value }))} placeholder="e.g. 3rd" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Email</label>
              <input type="email" value={addClientForm.email} onChange={e => setAddClientForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Phone</label>
              <input type="tel" value={addClientForm.phone} onChange={e => setAddClientForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Subjects (comma-separated)</label>
              <input type="text" value={addClientForm.subjects} onChange={e => setAddClientForm(f => ({ ...f, subjects: e.target.value }))} placeholder="Math, Reading" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
            </div>
          </div>
          <button
            onClick={saveNewClient}
            disabled={!addClientForm.parent_name.trim() || addingClient}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#C9DBC0', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
          >
            {addingClient ? 'Saving...' : 'Save Client'}
          </button>
        </div>
      )}

      {/* Search bar */}
      {clients.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8a8078' }} />
          <input
            type="text"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={{ borderColor: '#d9cfbf', background: '#FFF9F0', fontFamily: 'var(--font-shippori), serif' }}
          />
        </div>
      )}

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
          {clients.filter(c => {
            if (!clientSearch) return true;
            const q = clientSearch.toLowerCase();
            return (c.parent_name || '').toLowerCase().includes(q) || (c.child_name || '').toLowerCase().includes(q);
          }).map((client) => {
            const isExpanded = expandedId === client.id;
            const isEditing = editingId === client.id;
            const sessions = clientSessions[client.id] || [];
            const plans = clientPlans[client.id] || [];

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
                              <option value="test_prep">Virtual Tutoring</option>
                              <option value="homework_help">Pet Sitting</option>
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

                    {/* Lesson Plans */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8a8078', fontFamily: 'monospace' }}>
                          <FileText className="w-3 h-3 inline mr-1" />
                          Lesson Plans ({plans.length})
                        </p>
                        <button
                          onClick={() => openPlanForm(client.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-transform hover:-translate-y-0.5"
                          style={{ background: '#C9DBC0', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                        >
                          <Plus className="w-2.5 h-2.5" /> Add Plan
                        </button>
                      </div>

                      {/* Add/Edit Plan Form */}
                      {planFormId === client.id && (
                        <div className="rounded-lg border p-4 mb-3 space-y-3" style={{ borderColor: '#d9cfbf', background: 'white' }}>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                              {editingPlanId ? 'Edit Plan' : 'New Plan'}
                            </h4>
                            <button onClick={() => { setPlanFormId(null); setEditingPlanId(null); }} className="p-1"><X className="w-3.5 h-3.5" style={{ color: '#8a8078' }} /></button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Title *</label>
                              <input type="text" value={planForm.title} onChange={e => setPlanForm(f => ({ ...f, title: e.target.value }))} placeholder="Plan title" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Subject</label>
                              <input type="text" value={planForm.subject} onChange={e => setPlanForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Math" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={inputStyle} />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Content</label>
                            <textarea value={planForm.body_markdown} onChange={e => setPlanForm(f => ({ ...f, body_markdown: e.target.value }))} rows={4} placeholder="Lesson plan content..." className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none resize-none" style={inputStyle} />
                          </div>
                          <button
                            onClick={() => savePlan(client.id)}
                            disabled={!planForm.title.trim()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: '#A5C4D4', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                          >
                            {editingPlanId ? 'Update Plan' : 'Save Plan'}
                          </button>
                        </div>
                      )}

                      {plans.length === 0 ? (
                        <p className="text-xs" style={{ color: '#b8ad9f', fontFamily: 'var(--font-kalam), cursive' }}>No lesson plans yet</p>
                      ) : (
                        <div className="space-y-2">
                          {plans.map(plan => (
                            <div key={plan.id} className="rounded-lg border px-3 py-2" style={{ borderColor: '#d9cfbf', borderLeft: '4px solid #A5C4D4', background: 'white' }}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium" style={{ color: '#2b2722', fontFamily: 'var(--font-shippori), serif' }}>{plan.title}</p>
                                  {plan.subject && (
                                    <p className="text-[10px] mt-0.5" style={{ color: '#8a8078' }}>{plan.subject}</p>
                                  )}
                                  {plan.body_markdown && (
                                    <p className="text-[10px] mt-1 line-clamp-2" style={{ color: '#5b544c', fontFamily: 'var(--font-shippori), serif' }}>{plan.body_markdown}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  <button
                                    onClick={() => startEditPlan(plan)}
                                    className="p-1 rounded hover:bg-yellow-50 transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" style={{ color: '#F3DFA2' }} />
                                  </button>
                                  {deletePlanConfirmId === plan.id ? (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => deletePlan(plan.id, client.id)}
                                        className="text-[10px] px-1.5 py-0.5 rounded"
                                        style={{ background: '#D4A5A5', color: '#2b2722', fontFamily: 'var(--font-kalam), cursive' }}
                                      >
                                        Yes
                                      </button>
                                      <button
                                        onClick={() => setDeletePlanConfirmId(null)}
                                        className="text-[10px] px-1.5 py-0.5"
                                        style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setDeletePlanConfirmId(plan.id)}
                                      className="p-1 rounded hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" style={{ color: '#D4A5A5' }} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Parent Notes — read-only from intake */}
                    {client.notes && (
                      <div className="mt-4 p-4 rounded-lg" style={{ background: '#A5C4D420', border: '1px solid #A5C4D440' }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <StickyNote className="w-3.5 h-3.5" style={{ color: '#A5C4D4' }} />
                          <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Parent Notes</p>
                        </div>
                        <p className="text-sm italic" style={{ color: '#5b544c' }}>{client.notes}</p>
                      </div>
                    )}

                    {/* My Notes — Gia's notes, add/delete */}
                    <div className="mt-4 p-4 rounded-lg" style={{ background: '#F3DFA230', border: '1px dashed #F3DFA2' }}>
                      <div className="flex items-center gap-1.5 mb-3">
                        <StickyNote className="w-3.5 h-3.5" style={{ color: '#F3DFA2' }} />
                        <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#8a8078', fontFamily: 'monospace' }}>My Notes</p>
                      </div>
                      {(clientNotes[client.id] || []).length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {(clientNotes[client.id] || []).map((note) => (
                            <div key={note.id} className="flex items-start gap-2 group">
                              <p className="text-sm flex-1" style={{ color: '#5b544c', fontFamily: 'var(--font-shippori), serif' }}>{note.body}</p>
                              <button
                                onClick={() => deleteClientNote(note.id, client.id)}
                                className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                              >
                                <X className="w-3 h-3" style={{ color: '#D4A5A5' }} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs mb-3" style={{ color: '#b8ad9f' }}>No notes yet</p>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={expandedId === client.id ? noteText : ''}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
                          style={{ borderColor: '#d9cfbf', background: 'white', fontFamily: 'var(--font-shippori), serif' }}
                          onKeyDown={(e) => { if (e.key === 'Enter') addClientNote(client.id); }}
                        />
                        <button
                          onClick={() => addClientNote(client.id)}
                          className="px-3 py-2 rounded-lg text-xs"
                          style={{ background: '#F5C6A0', color: '#2b2722', fontFamily: 'var(--font-kalam), cursive', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722' }}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
