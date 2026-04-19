'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabase } from '@/lib/dashboard/supabase-browser';
import { FileText, Plus, Upload, Trash2, Save } from 'lucide-react';

type Plan = {
  id: string;
  title: string;
  subject: string | null;
  grade_level: string | null;
  body_markdown: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [body, setBody] = useState('');
  const supabase = createBrowserSupabase();

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPlans() {
    const { data } = await supabase
      .from('lesson_plans')
      .select('*')
      .order('updated_at', { ascending: false });
    setPlans(data || []);
    setLoading(false);
  }

  function startNew() {
    setEditing(null);
    setTitle('');
    setSubject('');
    setGrade('');
    setBody('');
  }

  function editPlan(plan: Plan) {
    setEditing(plan);
    setTitle(plan.title);
    setSubject(plan.subject || '');
    setGrade(plan.grade_level || '');
    setBody(plan.body_markdown || '');
  }

  async function savePlan() {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      subject: subject.trim() || null,
      grade_level: grade.trim() || null,
      body_markdown: body.trim() || null,
      owner_id: '00000000-0000-0000-0000-000000000000',
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      await supabase.from('lesson_plans').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('lesson_plans').insert(payload);
    }
    await fetchPlans();
    setEditing(null);
    setTitle('');
    setSubject('');
    setGrade('');
    setBody('');
  }

  async function deletePlan(id: string) {
    await supabase.from('lesson_plans').delete().eq('id', id);
    setPlans(prev => prev.filter(p => p.id !== id));
  }

  const isEditorOpen = title || editing;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
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
      {isEditorOpen && (
        <div className="rounded-lg border p-5 mb-6 space-y-4" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
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
              style={{ borderColor: '#d9cfbf', fontFamily: 'var(--font-shippori), serif' }}
            />
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Grade level"
              className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: '#d9cfbf', fontFamily: 'var(--font-shippori), serif' }}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium"
              style={{ background: '#A5C4D4', color: '#2b2722', border: '1.5px solid #2b2722', boxShadow: '2px 2px 0 #2b2722', fontFamily: 'var(--font-kalam), cursive' }}
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button
              onClick={() => { setEditing(null); setTitle(''); setBody(''); }}
              className="px-4 py-2 rounded-full text-xs"
              style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Plans grid */}
      {loading ? (
        <p style={{ color: '#8a8078', fontFamily: 'var(--font-kalam), cursive' }}>Loading...</p>
      ) : plans.length === 0 && !isEditorOpen ? (
        <div className="text-center py-16 rounded-lg border" style={{ borderColor: '#d9cfbf', background: '#FFF9F0' }}>
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#8a8078' }} />
          <p className="text-lg" style={{ color: '#8a8078', fontFamily: 'var(--font-caveat), cursive' }}>No lesson plans yet</p>
          <p className="text-sm mt-1" style={{ color: '#b8ad9f' }}>Create your first plan to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => editPlan(plan)}
              className="text-left rounded-lg border p-5 transition-transform hover:-translate-y-0.5"
              style={{ borderColor: '#d9cfbf', background: '#FFF9F0', boxShadow: '3px 3px 0 #2b272210' }}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-caveat), cursive', color: '#2b2722' }}>
                  {plan.title}
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); }}
                  className="p-1 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: '#D4A5A5' }} />
                </button>
              </div>
              {(plan.subject || plan.grade_level) && (
                <p className="text-xs mt-1" style={{ color: '#8a8078' }}>
                  {[plan.subject, plan.grade_level].filter(Boolean).join(' · ')}
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
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
