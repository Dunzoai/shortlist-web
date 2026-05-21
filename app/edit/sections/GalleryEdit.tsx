'use client';

import { useRef, useState } from 'react';
import { useEditMode } from '../EditModeContext';
import EditableText from '../components/EditableText';

const BG = '#0a0807';
const GOLD = '#c9a96e';

/** Gallery section — grid of images with add/remove/reorder in edit mode. */
export default function GalleryEdit() {
  const { content, setField, isEditing, slug } = useEditMode();
  const images: string[] = content.gallery?.images ?? [];
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const remove = (i: number) => setField('gallery.images', images.filter((_, idx) => idx !== i));
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...images];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setField('gallery.images', next);
  };
  const moveDown = (i: number) => {
    if (i >= images.length - 1) return;
    const next = [...images];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setField('gallery.images', next);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('slug', slug);
      const res = await fetch('/api/edit/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) setField('gallery.images', [...images, data.url]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: BG }}>
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        <EditableText path="gallery.sectionLabel" as="p" className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: 'var(--font-lora)' }} />
        <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative group aspect-square rounded-md overflow-hidden bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={content.gallery?.imageAlt || ''} className="w-full h-full object-cover" />
            {isEditing && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-2">
                <div className="opacity-0 group-hover:opacity-100 flex gap-1.5 transition-opacity">
                  <button onClick={() => moveUp(i)} className="w-8 h-8 bg-gray-700 rounded text-white text-sm">↑</button>
                  <button onClick={() => moveDown(i)} className="w-8 h-8 bg-gray-700 rounded text-white text-sm">↓</button>
                  <button onClick={() => remove(i)} className="w-8 h-8 bg-red-700 rounded text-white text-sm">✕</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add button */}
        {isEditing && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-md border-2 border-dashed border-blue-400/30 hover:border-blue-400/60 flex flex-col items-center justify-center gap-2 transition-colors"
          >
            <span className="text-2xl text-blue-400">{uploading ? '...' : '+'}</span>
            <span className="text-xs text-blue-400">{uploading ? 'Uploading' : 'Add Image'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
          e.target.value = '';
        }}
      />
    </section>
  );
}
