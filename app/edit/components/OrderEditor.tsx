'use client';

import TextFieldEditor from './TextFieldEditor';
import TextAreaEditor from './TextAreaEditor';

type Feature = { heading: string; description: string };
type OrderData = Record<string, any>;

type Props = {
  order: OrderData;
  onChange: (v: OrderData) => void;
};

export default function OrderEditor({ order, onChange }: Props) {
  const set = (field: string, value: any) => onChange({ ...order, [field]: value });

  const updateFeature = (i: number, field: keyof Feature, value: string) => {
    const features = [...(order.features || [])];
    features[i] = { ...features[i], [field]: value };
    set('features', features);
  };

  const addFeature = () => set('features', [...(order.features || []), { heading: '', description: '' }]);
  const removeFeature = (i: number) => set('features', (order.features || []).filter((_: any, idx: number) => idx !== i));

  return (
    <div className="space-y-5">
      <TextFieldEditor label="Section Label" value={order.sectionLabel ?? ''} onChange={(v) => set('sectionLabel', v)} />
      <TextFieldEditor label="Heading" value={order.heading ?? ''} onChange={(v) => set('heading', v)} />
      <TextAreaEditor label="Description" value={order.description ?? ''} onChange={(v) => set('description', v)} />

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">Features</span>
          <button onClick={addFeature} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">+ Add Feature</button>
        </div>
        {(order.features || []).map((f: Feature, i: number) => (
          <div key={i} className="mb-3 p-3 bg-gray-800/50 rounded border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Feature {i + 1}</span>
              <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
            </div>
            <TextFieldEditor label="Heading" value={f.heading} onChange={(v) => updateFeature(i, 'heading', v)} />
            <TextFieldEditor label="Description" value={f.description} onChange={(v) => updateFeature(i, 'description', v)} />
          </div>
        ))}
      </div>

      <TextFieldEditor label="Demo Label" value={order.demoLabel ?? ''} onChange={(v) => set('demoLabel', v)} />
      <TextFieldEditor label="Demo Heading" value={order.demoHeading ?? ''} onChange={(v) => set('demoHeading', v)} />
      <TextAreaEditor label="Demo Description" value={order.demoDescription ?? ''} onChange={(v) => set('demoDescription', v)} />
      <TextFieldEditor label="Demo Button Text" value={order.demoButtonText ?? ''} onChange={(v) => set('demoButtonText', v)} />
      <TextFieldEditor label="Demo URL" value={order.demoUrl ?? ''} onChange={(v) => set('demoUrl', v)} />
      <TextFieldEditor label="Back Button Text" value={order.backButtonText ?? ''} onChange={(v) => set('backButtonText', v)} />
      <TextFieldEditor label="Soft Pitch" value={order.softPitch ?? ''} onChange={(v) => set('softPitch', v)} />
    </div>
  );
}
