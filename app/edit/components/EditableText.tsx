'use client';

import React, { useRef, useState, memo } from 'react';
import { useEditMode } from '../EditModeContext';
import PopupEditor from './PopupEditor';

type Props = {
  /** Dot-delimited path into content, e.g. "hero.headline" */
  path: string;
  /** HTML tag to render */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  /** 'inline' = contentEditable on page; 'popup' = tap opens bottom sheet */
  mode?: 'inline' | 'popup';
  /** For popup textarea vs input */
  multiline?: boolean;
  /** Label shown in popup */
  label?: string;
};

/**
 * Renders editable text.
 * - In preview mode: plain text with the given tag/styling.
 * - In edit mode, inline: contentEditable with a dashed outline.
 * - In edit mode, popup: tap opens a bottom-sheet editor (for animated/complex text).
 */
export default function EditableText({ path, as: Tag = 'span', className = '', style, mode = 'inline', multiline = false, label }: Props) {
  const { getField, setField, isEditing } = useEditMode();
  const value = (getField(path) as string) ?? '';

  if (!isEditing) {
    const El = Tag;
    return <El className={className} style={style}>{value}</El>;
  }

  if (mode === 'popup') {
    return <PopupTrigger path={path} className={className} style={style} value={value} setField={setField} multiline={multiline} label={label} />;
  }

  return <InlineEditable path={path} Tag={String(Tag)} className={className} style={style} value={value} setField={setField} />;
}

/* ── Inline (contentEditable) ─────────────────────── */

const InlineEditable = memo(function InlineEditable({
  path, Tag, className, style, value, setField,
}: {
  path: string;
  Tag: string;
  className: string;
  style?: React.CSSProperties;
  value: string;
  setField: (p: string, v: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      className={`${className} outline outline-1 outline-dashed outline-blue-400/30 hover:outline-blue-400/70 focus:outline-blue-500 focus:outline-2 rounded-sm cursor-text transition-colors`}
      style={style}
      data-tag={Tag}
      onBlur={() => {
        if (ref.current) setField(path, ref.current.textContent || '');
      }}
    >
      {value}
    </div>
  );
},
  // Only re-render when path changes, NOT value — the DOM manages its own content
  (prev, next) => prev.path === next.path && prev.className === next.className
);

/* ── Popup trigger ────────────────────────────────── */

function PopupTrigger({
  path, className, style, value, setField, multiline, label,
}: {
  path: string;
  className: string;
  style?: React.CSSProperties;
  value: string;
  setField: (p: string, v: string) => void;
  multiline: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`${className} cursor-pointer relative group`}
        style={style}
        onClick={() => setOpen(true)}
      >
        {value}
        {/* Pencil badge */}
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 pointer-events-none transition-opacity shadow"
          style={{ opacity: undefined }} // Let CSS handle on desktop, always show on mobile via below
        >
          ✎
        </span>
        {/* Mobile: subtle border instead of hover */}
        <span className="absolute inset-0 rounded-sm border border-dashed border-blue-400/30 pointer-events-none md:border-transparent md:group-hover:border-blue-400/50 transition-colors" />
      </div>
      {open && (
        <PopupEditor
          value={value}
          label={label || path.split('.').pop()}
          multiline={multiline}
          onSave={(v) => { setField(path, v); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
