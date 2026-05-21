'use client';

import TextFieldEditor from './TextFieldEditor';
import TextAreaEditor from './TextAreaEditor';
import ImageFieldEditor from './ImageFieldEditor';

type MenuItem = { name: string; description: string };
type PizzaStyle = {
  key: string;
  image: string;
  label: string;
  teaser: string;
  items: MenuItem[];
};

type Props = {
  styles: PizzaStyle[];
  onChange: (v: PizzaStyle[]) => void;
  slug: string;
};

export default function MenuEditor({ styles, onChange, slug }: Props) {
  const updateStyle = (si: number, field: keyof PizzaStyle, value: any) => {
    const next = [...styles];
    next[si] = { ...next[si], [field]: value };
    onChange(next);
  };

  const updateItem = (si: number, ii: number, field: keyof MenuItem, value: string) => {
    const next = [...styles];
    const items = [...next[si].items];
    items[ii] = { ...items[ii], [field]: value };
    next[si] = { ...next[si], items };
    onChange(next);
  };

  const addItem = (si: number) => {
    const next = [...styles];
    next[si] = { ...next[si], items: [...next[si].items, { name: '', description: '' }] };
    onChange(next);
  };

  const removeItem = (si: number, ii: number) => {
    const next = [...styles];
    next[si] = { ...next[si], items: next[si].items.filter((_, idx) => idx !== ii) };
    onChange(next);
  };

  const moveItem = (si: number, ii: number, direction: -1 | 1) => {
    const target = ii + direction;
    if (target < 0 || target >= styles[si].items.length) return;
    const next = [...styles];
    const items = [...next[si].items];
    [items[ii], items[target]] = [items[target], items[ii]];
    next[si] = { ...next[si], items };
    onChange(next);
  };

  const addStyle = () => {
    onChange([...styles, { key: `style-${Date.now()}`, image: '', label: '', teaser: '', items: [] }]);
  };

  const removeStyle = (si: number) => {
    onChange(styles.filter((_, idx) => idx !== si));
  };

  return (
    <div className="mt-4 space-y-6">
      {styles.map((style, si) => (
        <div key={style.key} className="p-4 bg-gray-800/50 rounded border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-300">{style.label || `Style ${si + 1}`}</span>
            <button onClick={() => removeStyle(si)} className="text-red-400 hover:text-red-300 text-xs">Remove Style</button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TextFieldEditor label="Key" value={style.key} onChange={(v) => updateStyle(si, 'key', v)} />
              <TextFieldEditor label="Label" value={style.label} onChange={(v) => updateStyle(si, 'label', v)} />
            </div>
            <TextFieldEditor label="Teaser" value={style.teaser} onChange={(v) => updateStyle(si, 'teaser', v)} />
            <ImageFieldEditor label="Style Image" value={style.image} onChange={(v) => updateStyle(si, 'image', v)} slug={slug} />

            {/* Menu items */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">Items ({style.items.length})</span>
                <button onClick={() => addItem(si)} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded">+ Add Item</button>
              </div>
              {style.items.map((item, ii) => (
                <div key={ii} className="mb-3 p-3 bg-gray-900/50 rounded border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.name || `Item ${ii + 1}`}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveItem(si, ii, -1)} className="text-gray-400 text-xs px-1" title="Move up">&#8593;</button>
                      <button onClick={() => moveItem(si, ii, 1)} className="text-gray-400 text-xs px-1" title="Move down">&#8595;</button>
                      <button onClick={() => removeItem(si, ii)} className="text-red-400 hover:text-red-300 text-xs px-1">Remove</button>
                    </div>
                  </div>
                  <TextFieldEditor label="Name" value={item.name} onChange={(v) => updateItem(si, ii, 'name', v)} />
                  <TextAreaEditor label="Description" value={item.description} onChange={(v) => updateItem(si, ii, 'description', v)} rows={2} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <button onClick={addStyle} className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded">+ Add Style</button>
    </div>
  );
}
