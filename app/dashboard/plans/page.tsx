'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { FileText, Plus, Trash2, Save, X, Pencil, Users } from 'lucide-react';

type LeadRef = {
  parent_name: string | null;
  child_name: string | null;
};

type Plan = {
  id: string;
  lead_id: string | null;
  title: string;
  subject: string | null;
  grade_level: string | null;
  body_markdown: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  lead: LeadRef | null;
};

type BookedLead = {
  id: string;
  parent_name: string | null;
  child_name: string | null;
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [leads, setLeads] = useState<BookedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [body, setBody] = useState('');
  const [leadId, setLeadId] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const supabase = createBrowserSupabase();

  const fetchPlans = useCallback(async () => {
    const { data } = await supabase
      .from('lesson_plans')
      .select('*, lead:leads(parent_name, child_name)')
      .order('updated_at', { ascending: false });
    setPlans(data || []);
    setLoading(false);
  }, [supabase]);

  const fetchLeads = useCallback(async () => {
    const { data } = await supabase
      .from('leads')
      .select('id, parent_name, child_name')
      .eq('status', 'booked')
      .order('parent_name', { ascending: true });
    setLeads(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchPlans();
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startNew() {
    setEditingId(null);
    setTitle('');
    setSubject('');
    setGrade('');
    setBody('');
    setLeadId('');
    setShowEditor(true);
  }

  function editPlan(plan: Plan) {
    setEditingId(plan.id);
    setTitle(plan.title);
    setSubject(plan.subject || '');
    setGrade(plan.grade_level || '');
    setBody(plan.body_markdown || '');
    setLeadId(plan.lead_id || '');
    setShowEditor(true);
  }

  async function savePlan() {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      subject: subject.trim() || null,
      grade_level: grade.trim() || null,
      body_markdown: body.trim() || null,
      lead_id: leadId || null,
      owner_id: '00000000-0000-0000-0000-000000000000',
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from('lesson_plans').update(payload).eq('id', editingId);
    } else {
      await supabase.from('lesson_plans').insert(payload);
    }
    await fetchPlans();
    cancelEditor();
  }

  function cancelEditor() {
    setEditingId(null);
    setTitle('');
    setSubject('');
    setGrade('');
    setBody('');
    setLeadId('');
    setShowEditor(false);
  }

  async function deletePlan(id: string) {
    await supabase.from('lesson_plans').delete().eq('id', id);
    setDeleteConfirmId(null);
    setPlans(prev => prev.filter(p => p.id !== id));
  }

  function clientLabel(lead: LeadRef | null): string {
    if (!lead) return '';
    const parts = [lead.parent_name, lead.child_name].filter(Boolean);
    return parts.join(' / ') || 'Unnamed';
  }

  // Group plans by lead_id
  const grouped: Record<string, Plan[]> = {};
  const unlinked: Plan[] = [];
  for (const plan of plans) {
    if (plan.lead_id) {
      if (!grouped[plan.lead_id]) grouped[plan.lead_id] = [];
      grouped[plan.lead_id].push(plan);
    } else {
      unlinked.push(plan);
    }
  }

  // Build ordered group keys based on client name
  const groupKeys = Object.keys(grouped).sort((a, b) => {
    const la = grouped[a][0]?.lead;
    const lb = grouped[b][0]?.lead;
    return clientLabel(la).localeCompare(clientLabel(lb));
  });

  const inputStyle = {
    borderColor: '#d9cfbf',
    fontFamily: 'var(--font-shippori), serif',
    color: '#2b2722',
    background: 'white',
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto overflow-x-hidden pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722', transform: 'rotate(-1deg)', display: 'inline-block' }}>
          Lesson Plans
        </h1>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-transform hover:-translate-y-0.5"
          style={{
            background: '#C9DBC0',
            color: '#2b2722',
            border: '1.5px solid #2b2722',
            boxShadow: '2px 2px 0 #2b2722',
            fontFamily: 'var(--font-kalam), cursive',
          }}
        >
          <Plus className="w-3.5 h-3.5" /> New Plan
        </button>
      </div>

      {/* Editor */}
      {showEditor && (
        <div className="rounded-lg border p-5 mb-6 space-y-4" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
              {editingId ? 'Edit Plan' : 'New Plan'}
            </h3>
            <button onClick={cancelEditor} className="p-1"><X className="w-4 h-4" style={{ color: '#8a8078' }} /></button>
          </div>

          {/* Client selector */}
          <div>
            <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: '#8a8078', fontFamily: 'monospace' }}>Client (optional)</label>
            <select
              value={leadId}
              onChange={e => setLeadId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={inputStyle}
            >
              <option value="">Unlinked</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>
                  {[l.parent_name, l.child_name].filter(Boolean).join(' / ') || 'Unnamed'}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Plan title..."
            className="w-full text-xl font-bold px-0 py-1 bg-transparent border-b focus:outline-none"
            style={{ borderColor: '#d9cfbf', fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={inputStyle}
            />
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Grade level"
              className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={inputStyle}
            />
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your lesson plan..."
            rows={10}
            className="w-full px-3 py-3 rounded-lg border text-sm focus:outline-none resize-none"
            style={{ borderColor: '#d9cfbf', fontFamily: 'var(--font-shippori), serif', lineHeight: 1.8 }}
          />
          <div className="flex gap-2">
            <button
              onClick={savePlan}
              disabled={!title.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#A5C4D4', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button
              onClick={cancelEditor}
              className="px-4 py-2 rounded-full text-xs"
              style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Plans grouped by client */}
      {loading ? (
        <p style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>Loading...</p>
      ) : plans.length === 0 && !showEditor ? (
        <div className="text-center py-16 rounded-lg border" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#8a8078' }} />
          <p className="text-lg" style={{ color: '#8a8078', fontFamily: 'var(--font-caveat), cursive' }}>No lesson plans yet</p>
          <p className="text-sm mt-1" style={{ color: '#b8ad9f' }}>Create your first plan to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupKeys.map(gId => {
            const groupPlans = grouped[gId];
            const lead = groupPlans[0]?.lead;
            return (
              <div key={gId}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-3.5 h-3.5" style={{ color: '#8a8078' }} />
                  <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                    {clientLabel(lead)}
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#A5C4D440', color: '#5b544c' }}>
                    {groupPlans.length} {groupPlans.length === 1 ? 'plan' : 'plans'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupPlans.map(plan => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onEdit={() => editPlan(plan)}
                      deleteConfirmId={deleteConfirmId}
                      onDeleteConfirm={() => setDeleteConfirmId(plan.id)}
                      onDeleteCancel={() => setDeleteConfirmId(null)}
                      onDelete={() => deletePlan(plan.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {unlinked.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-3.5 h-3.5" style={{ color: '#8a8078' }} />
                <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                  Unlinked
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#d9cfbf40', color: '#5b544c' }}>
                  {unlinked.length} {unlinked.length === 1 ? 'plan' : 'plans'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlinked.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={() => editPlan(plan)}
                    deleteConfirmId={deleteConfirmId}
                    onDeleteConfirm={() => setDeleteConfirmId(plan.id)}
                    onDeleteCancel={() => setDeleteConfirmId(null)}
                    onDelete={() => deletePlan(plan.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan, onEdit, deleteConfirmId, onDeleteConfirm, onDeleteCancel, onDelete }: {
  plan: Plan;
  onEdit: () => void;
  deleteConfirmId: string | null;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="rounded-lg border p-5 transition-transform hover:-translate-y-0.5"
      style={{ borderColor: '#d9cfbf', background: '#FFF9F0', boxShadow: '3px 3px 0 #2b272210' }}
    >
      <div className="flex items-start justify-between">
        <button onClick={onEdit} className="text-left flex-1 min-w-0">
          <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
            {plan.title}
          </h3>
        </button>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-yellow-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" style={{ color: '#F3DFA2' }} />
          </button>
          {deleteConfirmId === plan.id ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onDelete}
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: '#D4A5A5', color: '#2b2722', fontFamily: 'var(--font-kalam), cursive' }}
              >
                Yes
              </button>
              <button
                onClick={onDeleteCancel}
                className="text-[10px] px-1.5 py-0.5"
                style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={onDeleteConfirm}
              className="p-1 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" style={{ color: '#D4A5A5' }} />
            </button>
          )}
        </div>
      </div>
      {(plan.subject || plan.grade_level) && (
        <p className="text-xs mt-1" style={{ color: '#8a8078' }}>
          {[plan.subject, plan.grade_level].filter(Boolean).join(' \u00B7 ')}
        </p>
      )}
      {plan.body_markdown && (
        <p className="text-xs mt-2 line-clamp-3" style={{ color: '#5b544c', fontFamily: 'var(--font-shippori), serif' }}>
          {plan.body_markdown}
        </p>
      )}
      <p className="text-[10px] mt-3" style={{ color: '#b8ad9f', fontFamily: 'monospace' }}>
        {new Date(plan.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
}
