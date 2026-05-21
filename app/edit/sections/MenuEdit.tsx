'use client';

import { useEditMode } from '../EditModeContext';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

/** Menu section — styles with their items, inline editable. */
export default function MenuEdit() {
  const { content, setField, isEditing } = useEditMode();
  const menu = content.menu ?? { styles: [], sectionLabel: '', heading: '', subtitle: '' };

  const addItem = (si: number) => {
    const styles = structuredClone(menu.styles);
    styles[si].items.push({ name: 'New Item', description: 'Description here.' });
    setField('menu.styles', styles);
  };

  const removeItem = (si: number, ii: number) => {
    const styles = structuredClone(menu.styles);
    styles[si].items.splice(ii, 1);
    setField('menu.styles', styles);
  };

  const moveItem = (si: number, ii: number, dir: -1 | 1) => {
    const target = ii + dir;
    const styles = structuredClone(menu.styles);
    const items = styles[si].items;
    if (target < 0 || target >= items.length) return;
    [items[ii], items[target]] = [items[target], items[ii]];
    setField('menu.styles', styles);
  };

  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <EditableText path="menu.sectionLabel" as="p" className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }} />
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>
        <EditableText path="menu.heading" as="h1" className="italic font-bold text-center mb-4" style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: 'clamp(40px, 7vw, 64px)' }} />
        <EditableText path="menu.subtitle" as="p" className="text-center italic mb-16" style={{ fontFamily: 'var(--font-lora)', color: 'rgba(245,237,224,0.7)', fontSize: '18px' }} />

        {/* Styles */}
        {(menu.styles || []).map((style: any, si: number) => (
          <div key={style.key} className="mb-16">
            {/* Style header with image */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <EditableImage path={`menu.styles.${si}.image`} className="w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden flex-shrink-0">
                {style.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={style.image} alt={style.label} className="w-full h-full object-cover" />
                )}
              </EditableImage>
              <div>
                <EditableText path={`menu.styles.${si}.label`} as="h2" className="italic font-bold leading-tight" style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: 'clamp(32px, 5vw, 48px)' }} />
                <EditableText path={`menu.styles.${si}.teaser`} as="p" className="mt-2 italic" style={{ fontFamily: 'var(--font-lora)', color: 'rgba(245,237,224,0.85)', fontSize: '16px' }} />
              </div>
            </div>

            {/* Items */}
            <div className="max-w-[720px] mx-auto">
              {(style.items || []).map((item: any, ii: number) => (
                <div key={ii} className={`relative ${ii < style.items.length - 1 ? 'pb-8 mb-8 border-b border-[#c9a96e]/15' : ''}`}>
                  {isEditing && (
                    <div className="absolute -top-1 right-0 flex gap-1">
                      <button onClick={() => moveItem(si, ii, -1)} className="text-gray-500 text-xs px-1 hover:text-gray-300">↑</button>
                      <button onClick={() => moveItem(si, ii, 1)} className="text-gray-500 text-xs px-1 hover:text-gray-300">↓</button>
                      <button onClick={() => removeItem(si, ii)} className="text-red-400 text-xs px-1 hover:text-red-300">✕</button>
                    </div>
                  )}
                  <EditableText path={`menu.styles.${si}.items.${ii}.name`} as="h3" className="italic font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: 'clamp(22px, 3vw, 28px)' }} />
                  <EditableText path={`menu.styles.${si}.items.${ii}.description`} as="p" mode="popup" multiline label={`${item.name || 'Item'} Description`} className="leading-relaxed" style={{ fontFamily: 'var(--font-lora)', color: 'rgba(245,237,224,0.75)', fontSize: '16px' }} />
                </div>
              ))}
              {isEditing && (
                <button onClick={() => addItem(si)} className="mt-4 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-sm hover:bg-blue-600/30">+ Add Item</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
