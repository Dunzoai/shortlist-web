'use client';

import TextFieldEditor from './TextFieldEditor';

type NavLink = { label: string; path: string | null; anchor: string | null };
type NavData = { links: NavLink[]; orderButtonText: string };

type Props = {
  nav: NavData;
  onChange: (v: NavData) => void;
};

export default function NavEditor({ nav, onChange }: Props) {
  const updateLink = (i: number, field: keyof NavLink, value: string | null) => {
    const links = [...nav.links];
    links[i] = { ...links[i], [field]: value };
    onChange({ ...nav, links });
  };

  const addLink = () => {
    onChange({ ...nav, links: [...nav.links, { label: '', path: '/', anchor: null }] });
  };

  const removeLink = (i: number) => {
    onChange({ ...nav, links: nav.links.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-4">
      <TextFieldEditor
        label="Order Button Text"
        value={nav.orderButtonText}
        onChange={(v) => onChange({ ...nav, orderButtonText: v })}
      />
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Nav Links</span>
          <button onClick={addLink} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">+ Add Link</button>
        </div>
        {nav.links.map((link, i) => (
          <div key={i} className="flex gap-2 items-end mb-3 p-3 bg-gray-800/50 rounded border border-gray-800">
            <div className="flex-1">
              <TextFieldEditor label="Label" value={link.label} onChange={(v) => updateLink(i, 'label', v)} />
            </div>
            <div className="flex-1">
              <TextFieldEditor label="Path" value={link.path ?? ''} onChange={(v) => updateLink(i, 'path', v || null)} placeholder="/page" />
            </div>
            <div className="flex-1">
              <TextFieldEditor label="Anchor" value={link.anchor ?? ''} onChange={(v) => updateLink(i, 'anchor', v || null)} placeholder="/#section" />
            </div>
            <button onClick={() => removeLink(i)} className="text-red-400 hover:text-red-300 text-xs px-2 py-2 mb-0.5">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
