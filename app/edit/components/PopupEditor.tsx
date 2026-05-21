'use client';

import { useState, useEffect, useRef } from 'react';

type Props = {
  value: string;
  label?: string;
  multiline?: boolean;
  onSave: (value: string) => void;
  onClose: () => void;
};

export default function PopupEditor({ value, label, multiline, onSave, onClose }: Props) {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus and select on open
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        onSave(text);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [text, multiline, onSave, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={onClose} />

      {/* Bottom sheet (mobile) / centered panel (desktop) */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full z-[9999] animate-slide-up">
        <div className="bg-gray-900 border-t md:border border-gray-700 md:rounded-xl p-5 pb-8 md:pb-5 shadow-2xl">
          {label && <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>}

          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onSave(text)}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
            >
              Done
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
