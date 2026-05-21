'use client';

import TextFieldEditor from './TextFieldEditor';

type Location = {
  name: string;
  street: string;
  city: string;
  region: string;
  hours: string;
  phone: string;
  tel: string;
  directionsUrl: string;
};

type Props = {
  items: Location[];
  onChange: (v: Location[]) => void;
};

const EMPTY_LOC: Location = {
  name: '',
  street: '',
  city: '',
  region: '',
  hours: '',
  phone: '',
  tel: '',
  directionsUrl: '',
};

/**
 * HOURS NOTE: Each location has its own `hours` display string (e.g. "Open 7 Days · 12pm – 9pm").
 * The SEO section separately has `seo.opens` and `seo.closes` for JSON-LD structured data.
 * These are intentionally separate: the display string is freeform, while the SEO fields
 * must be machine-readable 24h format. If you change hours here, also update SEO opens/closes.
 */
export default function LocationsEditor({ items, onChange }: Props) {
  const update = (i: number, field: keyof Location, value: string) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  const add = () => onChange([...items, { ...EMPTY_LOC }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">Locations</span>
        <button onClick={add} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">+ Add Location</button>
      </div>
      <p className="text-xs text-yellow-500/80">
        Note: If you change a location&apos;s hours, also update SEO opens/closes in the SEO section to keep structured data in sync.
      </p>
      {items.map((loc, i) => (
        <div key={i} className="p-4 bg-gray-800/50 rounded border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300">Location {i + 1}: {loc.name || '(unnamed)'}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextFieldEditor label="Name" value={loc.name} onChange={(v) => update(i, 'name', v)} />
            <TextFieldEditor label="Region" value={loc.region} onChange={(v) => update(i, 'region', v)} />
            <TextFieldEditor label="Street" value={loc.street} onChange={(v) => update(i, 'street', v)} />
            <TextFieldEditor label="City / Zip" value={loc.city} onChange={(v) => update(i, 'city', v)} />
            <TextFieldEditor label="Hours" value={loc.hours} onChange={(v) => update(i, 'hours', v)} />
            <TextFieldEditor label="Phone (display)" value={loc.phone} onChange={(v) => update(i, 'phone', v)} />
            <TextFieldEditor label="Phone (tel:)" value={loc.tel} onChange={(v) => update(i, 'tel', v)} />
            <TextFieldEditor label="Directions URL" value={loc.directionsUrl} onChange={(v) => update(i, 'directionsUrl', v)} />
          </div>
        </div>
      ))}
    </div>
  );
}
