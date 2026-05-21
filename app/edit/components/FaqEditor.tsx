'use client';

import TextFieldEditor from './TextFieldEditor';
import TextAreaEditor from './TextAreaEditor';

type Faq = { q: string; a: string };
type Props = { faqs: Faq[]; onChange: (v: Faq[]) => void };

export default function FaqEditor({ faqs, onChange }: Props) {
  const update = (i: number, field: 'q' | 'a', value: string) => {
    const next = [...faqs];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  const add = () => onChange([...faqs, { q: '', a: '' }]);
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">FAQs</span>
        <button onClick={add} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">+ Add FAQ</button>
      </div>
      {faqs.map((faq, i) => (
        <div key={i} className="p-3 bg-gray-800/50 rounded border border-gray-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">FAQ {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
          </div>
          <TextFieldEditor label="Question" value={faq.q} onChange={(v) => update(i, 'q', v)} />
          <TextAreaEditor label="Answer" value={faq.a} onChange={(v) => update(i, 'a', v)} rows={2} />
        </div>
      ))}
    </div>
  );
}
