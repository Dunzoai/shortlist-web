'use client';

import { useState } from 'react';
import { useEditMode } from '../EditModeContext';
import PopupEditor from '../components/PopupEditor';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

/**
 * Nav section in edit mode.
 * Uses popup editing for all fields (nav is fixed/small, inline would be cramped).
 * Shows an "Edit Nav" panel below the nav when in edit mode.
 */
export default function NavEdit() {
  const { content, setField, isEditing } = useEditMode();
  const nav = content.nav ?? { links: [], orderButtonText: '' };
  const brand = content.brandLabel ?? '';
  const [editingField, setEditingField] = useState<{ path: string; label: string } | null>(null);

  const addLink = () => {
    const links = [...nav.links, { label: 'New Link', path: '/', anchor: null }];
    setField('nav.links', links);
  };

  const removeLink = (i: number) => {
    setField('nav.links', nav.links.filter((_: any, idx: number) => idx !== i));
  };

  return (
    <>
      {/* The visual nav bar */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: `${BG}ee`, backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <span
            className="uppercase tracking-[0.2em] text-sm font-semibold cursor-pointer"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
            onClick={() => isEditing && setEditingField({ path: 'brandLabel', label: 'Brand Label' })}
          >
            {brand}
            {isEditing && <span className="ml-1 text-[10px] text-blue-400">✎</span>}
          </span>

          <div className="hidden md:flex items-center gap-8">
            {(nav.links || []).map((link: any, i: number) => (
              <span
                key={i}
                className="text-sm uppercase tracking-[0.15em] cursor-pointer"
                style={{ color: 'rgba(245,237,224,0.6)', fontFamily: 'var(--font-lora)' }}
                onClick={() => isEditing && setEditingField({ path: `nav.links.${i}.label`, label: `Link ${i + 1} Label` })}
              >
                {link.label}
                {isEditing && <span className="ml-1 text-[10px] text-blue-400">✎</span>}
              </span>
            ))}
            <span
              className="px-5 py-2 rounded-sm text-xs uppercase tracking-[0.18em] cursor-pointer"
              style={{ fontFamily: 'var(--font-lora)', color: GOLD, border: `1px solid ${GOLD}` }}
              onClick={() => isEditing && setEditingField({ path: 'nav.orderButtonText', label: 'Order Button Text' })}
            >
              {nav.orderButtonText || 'Order Now'}
              {isEditing && <span className="ml-1 text-[10px] text-blue-400">✎</span>}
            </span>
          </div>
        </div>
      </nav>

      {/* Edit panel below nav — only in edit mode */}
      {isEditing && (
        <div className="bg-gray-900/95 border-b border-gray-800 px-6 py-4">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400">Nav Links</span>
              <button onClick={addLink} className="text-xs px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400">+ Add Link</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(nav.links || []).map((link: any, i: number) => (
                <div key={i} className="flex items-center gap-1 bg-gray-800 rounded px-3 py-1.5 text-sm text-gray-300">
                  <span
                    className="cursor-pointer hover:text-white"
                    onClick={() => setEditingField({ path: `nav.links.${i}.label`, label: `Link ${i + 1} Label` })}
                  >
                    {link.label}
                  </span>
                  <span className="text-gray-600 mx-1">→</span>
                  <span
                    className="text-gray-500 cursor-pointer hover:text-gray-300 text-xs"
                    onClick={() => setEditingField({ path: `nav.links.${i}.${link.anchor ? 'anchor' : 'path'}`, label: `Link ${i + 1} ${link.anchor ? 'Anchor' : 'Path'}` })}
                  >
                    {link.anchor || link.path || '/'}
                  </span>
                  <button onClick={() => removeLink(i)} className="ml-2 text-red-400 hover:text-red-300 text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popup editor for whichever field was clicked */}
      {editingField && (
        <PopupEditor
          value={String(editingField.path.split('.').reduce((o: any, k: string) => o?.[/^\d+$/.test(k) ? Number(k) : k], content) ?? '')}
          label={editingField.label}
          onSave={(v) => { setField(editingField.path, v); setEditingField(null); }}
          onClose={() => setEditingField(null)}
        />
      )}
    </>
  );
}
