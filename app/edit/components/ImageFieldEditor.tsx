'use client';

import { useRef, useState } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  slug: string;
};

export default function ImageFieldEditor({ label, value, onChange, slug }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('slug', slug);
      const res = await fetch('/api/edit/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        onChange(data.url);
      }
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="text-sm font-medium text-gray-400">{label}</span>
      <div className="mt-1 flex items-start gap-3">
        {/* Thumbnail */}
        {value && (
          <div className="w-20 h-20 flex-shrink-0 rounded bg-gray-800 border border-gray-700 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or upload"
            className="block w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
