'use client';

import { useEditMode } from '../EditModeContext';
import EditableText from '../components/EditableText';
import PopupEditor from '../components/PopupEditor';
import { useState } from 'react';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

/** Locations section with inline-editable fields and FAQ editing. */
export default function LocationsEdit() {
  const { content, setField, isEditing } = useEditMode();
  const loc = content.locations ?? { items: [], faqs: [], sectionLabel: '', heading: '', buttonText: '', faqLabel: '' };
  const [editingUrl, setEditingUrl] = useState<{ path: string; label: string } | null>(null);

  const addLocation = () => {
    const items = [...(loc.items || []), { name: 'New Location', street: '', city: '', region: '', hours: '', phone: '', tel: '', directionsUrl: '' }];
    setField('locations.items', items);
  };

  const removeLocation = (i: number) => {
    setField('locations.items', loc.items.filter((_: any, idx: number) => idx !== i));
  };

  const addFaq = () => {
    setField('locations.faqs', [...(loc.faqs || []), { q: 'New question?', a: 'Answer here.' }]);
  };

  const removeFaq = (i: number) => {
    setField('locations.faqs', loc.faqs.filter((_: any, idx: number) => idx !== i));
  };

  return (
    <section id="locations" className="py-24 md:py-32 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <EditableText path="locations.sectionLabel" as="p" className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }} />
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>
        <EditableText path="locations.heading" as="h2" className="italic font-bold text-center mb-16" style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: 'clamp(32px, 5vw, 48px)' }} />

        {/* Location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(loc.items || []).map((_item: any, i: number) => (
            <article key={i} className="p-10 rounded-sm relative" style={{ border: '1px solid rgba(201,169,110,0.3)', backgroundColor: 'rgba(245,237,224,0.04)' }}>
              {isEditing && (
                <button onClick={() => removeLocation(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-300 text-xs bg-red-900/30 px-2 py-1 rounded">Remove</button>
              )}
              <EditableText path={`locations.items.${i}.name`} as="h3" className="italic font-bold" style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: '36px' }} />
              <EditableText path={`locations.items.${i}.region`} as="p" className="mt-1 text-xs uppercase tracking-[0.25em]" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }} />
              <EditableText path={`locations.items.${i}.street`} as="p" className="mt-8 text-base" style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }} />
              <EditableText path={`locations.items.${i}.city`} as="p" className="text-base" style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }} />
              <EditableText path={`locations.items.${i}.hours`} as="p" className="mt-6 text-base" style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }} />
              <EditableText path={`locations.items.${i}.phone`} as="p" className="mt-6 text-lg" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }} />

              {/* Non-visible fields: tap to edit via popup */}
              {isEditing && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => setEditingUrl({ path: `locations.items.${i}.tel`, label: 'Phone (tel:)' })} className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-400 hover:text-gray-200">Edit tel:</button>
                  <button onClick={() => setEditingUrl({ path: `locations.items.${i}.directionsUrl`, label: 'Directions URL' })} className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-400 hover:text-gray-200">Edit Directions URL</button>
                </div>
              )}
            </article>
          ))}
        </div>

        {isEditing && (
          <div className="mt-6 text-center">
            <button onClick={addLocation} className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-sm hover:bg-blue-600/30">+ Add Location</button>
          </div>
        )}

        {/* FAQs */}
        <div className="mt-16">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
            <EditableText path="locations.faqLabel" as="p" className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }} />
            <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          </div>

          <dl className="max-w-[700px] mx-auto">
            {(loc.faqs || []).map((_faq: any, i: number) => (
              <div key={i} className={`relative ${i > 0 ? 'mt-8' : ''}`}>
                {isEditing && (
                  <button onClick={() => removeFaq(i)} className="absolute -top-1 right-0 text-red-400 hover:text-red-300 text-xs">Remove</button>
                )}
                <EditableText path={`locations.faqs.${i}.q`} as="dt" className="text-lg font-bold" style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }} />
                <EditableText path={`locations.faqs.${i}.a`} as="dd" mode="popup" multiline label="FAQ Answer" className="mt-2 text-base" style={{ color: 'rgba(245,237,224,0.8)', fontFamily: 'var(--font-lora)' }} />
              </div>
            ))}
          </dl>
          {isEditing && (
            <div className="mt-6 text-center">
              <button onClick={addFaq} className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-sm hover:bg-blue-600/30">+ Add FAQ</button>
            </div>
          )}
        </div>
      </div>

      {/* Popup for URL fields */}
      {editingUrl && (
        <PopupEditor
          value={(content.locations && editingUrl.path.split('.').reduce((o: any, k: string) => o?.[/^\d+$/.test(k) ? Number(k) : k], content)) ?? ''}
          label={editingUrl.label}
          onSave={(v) => { setField(editingUrl.path, v); setEditingUrl(null); }}
          onClose={() => setEditingUrl(null)}
        />
      )}
    </section>
  );
}
