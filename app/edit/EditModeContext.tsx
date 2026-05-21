'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

type EditModeCtx = {
  content: Record<string, any>;
  isEditing: boolean;
  setEditing: (v: boolean) => void;
  getField: (path: string) => any;
  setField: (path: string, value: any) => void;
  setSection: (key: string, value: any) => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  slug: string;
};

const Ctx = createContext<EditModeCtx>(null!);
export const useEditMode = () => useContext(Ctx);

export function EditModeProvider({
  slug,
  initialContent,
  children,
}: {
  slug: string;
  initialContent: Record<string, any>;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<Record<string, any>>(initialContent ?? {});
  const [isEditing, setEditing] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  const save = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/edit/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content: contentRef.current }),
      });
      if (!res.ok) {
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus((s) => (s === 'saved' ? 'idle' : s)), 2500);
      }
    } catch {
      setSaveStatus('error');
    }
  }, [slug]);

  const scheduleSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 1500);
  }, [save]);

  // Clean up timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const getField = useCallback((path: string) => {
    const keys = path.split('.');
    let obj: any = content;
    for (const k of keys) {
      if (obj == null) return undefined;
      obj = /^\d+$/.test(k) ? obj[Number(k)] : obj[k];
    }
    return obj;
  }, [content]);

  const setField = useCallback((path: string, value: any) => {
    setContent((prev) => {
      const keys = path.split('.');
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = /^\d+$/.test(keys[i]) ? Number(keys[i]) : keys[i];
        obj = obj[k];
      }
      const last = /^\d+$/.test(keys[keys.length - 1]) ? Number(keys[keys.length - 1]) : keys[keys.length - 1];
      obj[last] = value;
      return next;
    });
    scheduleSave();
  }, [scheduleSave]);

  const setSection = useCallback((key: string, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    scheduleSave();
  }, [scheduleSave]);

  return (
    <Ctx.Provider value={{ content, isEditing, setEditing, getField, setField, setSection, saveStatus, slug }}>
      {children}
    </Ctx.Provider>
  );
}
