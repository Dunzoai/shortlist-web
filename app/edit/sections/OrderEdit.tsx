'use client';

import { useEditMode } from '../EditModeContext';
import EditableText from '../components/EditableText';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

/** Order page content — editable inline. */
export default function OrderEdit() {
  const { content, setField, isEditing } = useEditMode();
  const order = content.order ?? {};

  const addFeature = () => {
    const features = [...(order.features || []), { heading: 'New Feature', description: 'Description here.' }];
    setField('order.features', features);
  };

  const removeFeature = (i: number) => {
    setField('order.features', (order.features || []).filter((_: any, idx: number) => idx !== i));
  };

  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-[700px] mx-auto text-center">
        {/* Section divider label */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}>Order Page</p>
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <EditableText path="order.sectionLabel" as="p" className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }} />
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>

        <EditableText path="order.heading" as="h1" className="italic font-bold leading-tight" style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: 'clamp(36px, 7vw, 56px)' }} />
        <EditableText path="order.description" as="p" mode="popup" multiline label="Order Description" className="mt-6 leading-relaxed max-w-[600px] mx-auto" style={{ fontFamily: 'var(--font-lora)', color: 'rgba(245,237,224,0.8)', fontSize: '18px' }} />

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {(order.features || []).map((f: any, i: number) => (
            <div key={i} className="text-center relative">
              {isEditing && (
                <button onClick={() => removeFeature(i)} className="absolute -top-1 right-0 text-red-400 text-xs hover:text-red-300">✕</button>
              )}
              <EditableText path={`order.features.${i}.heading`} as="p" className="font-bold text-base mb-1" style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }} />
              <EditableText path={`order.features.${i}.description`} as="p" className="text-sm" style={{ color: 'rgba(245,237,224,0.65)', fontFamily: 'var(--font-lora)' }} />
            </div>
          ))}
        </div>
        {isEditing && (
          <button onClick={addFeature} className="mt-4 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-sm">+ Add Feature</button>
        )}

        {/* Demo section */}
        <div className="mt-20">
          <EditableText path="order.demoLabel" as="p" className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }} />
          <EditableText path="order.demoHeading" as="h2" className="mt-4 italic font-bold" style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: 'clamp(26px, 5vw, 36px)' }} />
          <EditableText path="order.demoDescription" as="p" mode="popup" multiline label="Demo Description" className="mt-4 max-w-[600px] mx-auto" style={{ fontFamily: 'var(--font-lora)', color: 'rgba(245,237,224,0.75)', fontSize: '16px' }} />
          <EditableText path="order.demoButtonText" as="p" mode="popup" label="Demo Button Text" className="mt-8 inline-block px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.18em]" style={{ fontFamily: 'var(--font-lora)', color: GOLD, border: `1px solid ${GOLD}` }} />
        </div>

        {/* Back + soft pitch */}
        <EditableText path="order.backButtonText" as="p" mode="popup" label="Back Button Text" className="mt-16 inline-block px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.18em]" style={{ fontFamily: 'var(--font-lora)', color: GOLD, border: `1px solid ${GOLD}` }} />
        <EditableText path="order.softPitch" as="p" className="mt-20 italic text-center" style={{ fontFamily: 'var(--font-lora)', color: 'rgba(245,237,224,0.4)', fontSize: '13px' }} />
      </div>
    </section>
  );
}
