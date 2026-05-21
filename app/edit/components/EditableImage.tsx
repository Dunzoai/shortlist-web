'use client';

import { useRef, useState } from 'react';
import { useEditMode } from '../EditModeContext';

type Props = {
  path: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  /** Render as next/image or plain img */
  children?: React.ReactNode;
};

export default function EditableImage({ path, className = '', style, alt = '', children }: Props) {
  const { getField, setField, isEditing, slug } = useEditMode();
  const value = (getField(path) as string) ?? '';
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('slug', slug);
      const res = await fetch('/api/edit/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) setField(path, data.url);
    } finally {
      setUploading(false);
    }
  };

  // In preview mode, just render the image
  if (!isEditing) {
    if (children) return <>{children}</>;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={value} alt={alt} className={className} style={style} />;
  }

  return (
    <div className={`relative group ${className}`} style={style}>
      {/* The image */}
      {children || (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt={alt} className="w-full h-full object-cover" />
      )}

      {/* Edit overlay */}
      <div
        className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <div className="opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
          <span className="text-2xl">{uploading ? '...' : '\uD83D\uDCF7'}</span>
          <span className="text-xs text-white font-medium">
            {uploading ? 'Uploading' : 'Change Image'}
          </span>
        </div>
        {/* Mobile: always show a small badge */}
        <span className="absolute top-2 right-2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm shadow md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          📷
        </span>
      </div>

      {/* Hidden file input — accept image/*, capture for mobile camera */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          // Reset so the same file can be re-selected
          e.target.value = '';
        }}
      />

      {/* Dashed border in edit mode */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400/30 group-hover:border-blue-400/60 rounded pointer-events-none transition-colors" />
    </div>
  );
}
