'use client';

import { useRef, useState } from 'react';

type Props = {
  images: string[];
  onChange: (v: string[]) => void;
  slug: string;
};

export default function GalleryEditor({ images, onChange, slug }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...images];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };

  const moveDown = (i: number) => {
    if (i >= images.length - 1) return;
    const next = [...images];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('slug', slug);
      const res = await fetch('/api/edit/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) {
        onChange([...images, data.url]);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-400">Images ({images.length})</span>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
          >
            {uploading ? 'Uploading...' : '+ Upload Image'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative group rounded overflow-hidden bg-gray-800 border border-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => moveUp(i)} className="text-white text-xs px-1.5 py-1 bg-gray-700 rounded" title="Move up">&#8593;</button>
              <button onClick={() => moveDown(i)} className="text-white text-xs px-1.5 py-1 bg-gray-700 rounded" title="Move down">&#8595;</button>
              <button onClick={() => remove(i)} className="text-white text-xs px-1.5 py-1 bg-red-700 rounded">X</button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-gray-300 px-1 py-0.5 truncate">{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
