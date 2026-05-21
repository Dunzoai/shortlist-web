'use client';

import TextFieldEditor from './TextFieldEditor';
import ImageFieldEditor from './ImageFieldEditor';

type SeoData = Record<string, any>;
type Props = {
  seo: SeoData;
  onChange: (v: SeoData) => void;
  slug: string;
};

/**
 * SEO HOURS NOTE: `opens` and `closes` are for JSON-LD structured data (machine-readable, 24h format).
 * Location display hours are edited separately in the Locations section.
 * If a partner changes their operating hours, BOTH should be updated.
 */
export default function SeoEditor({ seo, onChange, slug }: Props) {
  const set = (field: string, value: any) => onChange({ ...seo, [field]: value });

  const updateCuisine = (i: number, value: string) => {
    const next = [...(seo.cuisine || [])];
    next[i] = value;
    set('cuisine', next);
  };

  const addCuisine = () => set('cuisine', [...(seo.cuisine || []), '']);
  const removeCuisine = (i: number) => set('cuisine', (seo.cuisine || []).filter((_: any, idx: number) => idx !== i));

  const updateDay = (i: number, value: string) => {
    const next = [...(seo.openDays || [])];
    next[i] = value;
    set('openDays', next);
  };

  const addDay = () => set('openDays', [...(seo.openDays || []), '']);
  const removeDay = (i: number) => set('openDays', (seo.openDays || []).filter((_: any, idx: number) => idx !== i));

  return (
    <div className="space-y-5">
      <ImageFieldEditor label="Logo URL" value={seo.logoUrl ?? ''} onChange={(v) => set('logoUrl', v)} slug={slug} />
      <TextFieldEditor label="Price Range" value={seo.priceRange ?? ''} onChange={(v) => set('priceRange', v)} />

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">Cuisine Types</span>
          <button onClick={addCuisine} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">+ Add</button>
        </div>
        {(seo.cuisine || []).map((c: string, i: number) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={c}
              onChange={(e) => updateCuisine(i, e.target.value)}
              className="flex-1 rounded bg-gray-800 border border-gray-700 px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => removeCuisine(i)} className="text-red-400 text-xs px-2">X</button>
          </div>
        ))}
      </div>

      <p className="text-xs text-yellow-500/80">
        These hours are for structured data (JSON-LD). Location display hours are in the Locations section.
        Keep both in sync when hours change.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <TextFieldEditor label="Opens (24h)" value={seo.opens ?? ''} onChange={(v) => set('opens', v)} placeholder="12:00" />
        <TextFieldEditor label="Closes (24h)" value={seo.closes ?? ''} onChange={(v) => set('closes', v)} placeholder="21:00" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">Open Days</span>
          <button onClick={addDay} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">+ Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(seo.openDays || []).map((d: string, i: number) => (
            <div key={i} className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded px-2 py-1">
              <input
                value={d}
                onChange={(e) => updateDay(i, e.target.value)}
                className="bg-transparent text-sm text-gray-100 w-24 focus:outline-none"
              />
              <button onClick={() => removeDay(i)} className="text-red-400 text-xs">X</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
