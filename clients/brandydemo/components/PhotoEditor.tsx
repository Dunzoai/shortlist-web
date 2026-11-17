'use client';

/**
 * PhotoEditor — non-destructive crop / zoom / straighten / light editor for the
 * Studio Admin.
 *
 * Interaction model is the modern "fixed frame, move the photo" one (Photos /
 * Instagram): drag to reposition, pinch / scroll / slider to zoom, straighten
 * dial, 90° rotate, flip, aspect presets matched to where the photo is shown,
 * and light adjustments (brightness, contrast, saturation, warmth).
 *
 * Non-destructive: the editor always works from the original photo. On save it
 * returns the rendered JPEG plus the edit settings; the upload route stores the
 * settings in a `.edit.json` sidecar next to the rendered image so the next
 * edit starts from the original again (see loadEditState).
 *
 * The on-screen preview (CSS transform + SVG colour matrix) and the export
 * (canvas + the same colour matrix applied per pixel) share one geometry and
 * one matrix, so what she sees is exactly what gets saved.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const CREAM = '#FBF4EA';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const BORDER = '#ECDECB';
const FONT = "var(--font-montserrat), 'Montserrat', sans-serif";

const MAX_ZOOM = 6;
const ORIGINAL_MAX_EDGE = 2400; // originals are normalised to this before upload
const OUTPUT_MAX_EDGE = 1800; // rendered photo long edge

export type PhotoEdit = {
  aspect: string; // key of an AspectOption
  rotation: number; // quarter turns 0..3
  flip: boolean;
  straighten: number; // degrees, -20..20
  zoom: number; // 1 = just covers the frame
  x: number; // photo-centre offset from frame centre, in frame widths
  y: number;
  brightness: number; // -100..100
  contrast: number;
  saturation: number;
  warmth: number;
};

export type AspectOption = { key: string; label: string; ratio: number | null }; // null = photo's own shape

export type PhotoSource = { kind: 'file'; file: File } | { kind: 'url'; url: string };

export type PhotoSaveResult = {
  edited: Blob;
  original?: Blob; // set when the photo is new (needs uploading)
  originalUrl?: string; // set when re-editing an already-uploaded original
  edit: PhotoEdit;
};

export const PRODUCT_ASPECTS: AspectOption[] = [
  { key: 'card', label: 'Shop card', ratio: 3 / 2 },
  { key: 'square', label: 'Square', ratio: 1 },
  { key: 'portrait', label: 'Portrait', ratio: 4 / 5 },
  { key: 'original', label: 'Original', ratio: null },
];

export const HERO_ASPECTS: AspectOption[] = [
  { key: 'hero', label: 'Shop banner', ratio: 5 / 3 },
  { key: 'card', label: 'Shop card', ratio: 3 / 2 },
  { key: 'square', label: 'Square', ratio: 1 },
  { key: 'original', label: 'Original', ratio: null },
];

export const GALLERY_ASPECTS: AspectOption[] = [
  { key: 'original', label: 'Original', ratio: null },
  { key: 'square', label: 'Square', ratio: 1 },
  { key: 'portrait', label: 'Portrait', ratio: 4 / 5 },
  { key: 'landscape', label: 'Landscape', ratio: 3 / 2 },
];

export function defaultEdit(aspect: string): PhotoEdit {
  return {
    aspect,
    rotation: 0,
    flip: false,
    straighten: 0,
    zoom: 1,
    x: 0,
    y: 0,
    brightness: 0,
    contrast: 0,
    saturation: 0,
    warmth: 0,
  };
}

/** Sidecar holding the original URL + settings for an edited photo. */
export function sidecarUrl(imageUrl: string): string | null {
  if (!/\/storage\/v1\/object\/public\//.test(imageUrl)) return null;
  return imageUrl.replace(/\.[a-z0-9]+(\?.*)?$/i, '.edit.json');
}

/** Where to start editing an existing photo: its original + last settings if we have them. */
export async function loadEditState(imageUrl: string): Promise<{ originalUrl: string; edit?: PhotoEdit }> {
  const url = sidecarUrl(imageUrl);
  if (url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.originalUrl) return { originalUrl: data.originalUrl, edit: data.edit };
      }
    } catch {
      // no sidecar — the current image is the original
    }
  }
  return { originalUrl: imageUrl };
}

// ───────────────────────── geometry ─────────────────────────

type Geo = { A: number; ew: number; eh: number; k: number; deg: number };

function geometry(edit: PhotoEdit, iw: number, ih: number, aspects: AspectOption[]): Geo {
  const quarter = ((edit.rotation % 4) + 4) % 4;
  const ew = quarter % 2 ? ih : iw;
  const eh = quarter % 2 ? iw : ih;
  const opt = aspects.find((a) => a.key === edit.aspect);
  const A = opt?.ratio ?? ew / eh;
  const t = (Math.abs(edit.straighten) * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  // Frame is 1 × 1/A (frame-width units). Scale so the rotated photo covers it.
  const base = Math.max((c + s / A) / ew, (s + c / A) / eh);
  return { A, ew, eh, k: base * edit.zoom, deg: quarter * 90 + edit.straighten };
}

/** Keep the photo covering the frame: clamp x/y (and zoom) in photo space. */
function clampEdit(edit: PhotoEdit, iw: number, ih: number, aspects: AspectOption[]): PhotoEdit {
  const zoom = Math.min(MAX_ZOOM, Math.max(1, edit.zoom));
  const e = { ...edit, zoom };
  const { A, ew, eh, k } = geometry(e, iw, ih, aspects);
  const th = (e.straighten * Math.PI) / 180;
  const c = Math.cos(th);
  const s = Math.sin(th);
  // Frame centre in the photo's local (straightened, unscaled) coordinates.
  const px = (c * -e.x + s * -e.y) / k;
  const py = (-s * -e.x + c * -e.y) / k;
  const ac = Math.abs(c);
  const as = Math.abs(s);
  const hx = (ac / 2 + as / (2 * A)) / k;
  const hy = (as / 2 + ac / (2 * A)) / k;
  const mx = Math.max(0, ew / 2 - hx);
  const my = Math.max(0, eh / 2 - hy);
  const cx = Math.min(mx, Math.max(-mx, px));
  const cy = Math.min(my, Math.max(-my, py));
  // Back to frame units: t = -R(θ)·p·k
  return { ...e, x: -(c * cx - s * cy) * k, y: -(s * cx + c * cy) * k };
}

// ───────────────────────── colour ─────────────────────────

/** 3×4 affine colour matrix (rows R,G,B; last column = offset in 0..1). */
type Mat = number[][];

function mul(a: Mat, b: Mat): Mat {
  // (a ∘ b)(v) = a_lin(b_lin v + b_off) + a_off
  return [0, 1, 2].map((i) => {
    const row = [0, 1, 2].map((j) => a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]);
    const off = a[i][0] * b[0][3] + a[i][1] * b[1][3] + a[i][2] * b[2][3] + a[i][3];
    return [...row, off];
  });
}

function colourMatrix(e: PhotoEdit): Mat | null {
  if (!e.brightness && !e.contrast && !e.saturation && !e.warmth) return null;
  const b = 1 + e.brightness / 250;
  const k = 1 + e.contrast / 200;
  const s = 1 + e.saturation / 100;
  const w = (e.warmth / 100) * 0.08;
  const B: Mat = [[b, 0, 0, 0], [0, b, 0, 0], [0, 0, b, 0]];
  const C: Mat = [[k, 0, 0, 0.5 * (1 - k)], [0, k, 0, 0.5 * (1 - k)], [0, 0, k, 0.5 * (1 - k)]];
  const lr = 0.2126, lg = 0.7152, lb = 0.0722;
  const S: Mat = [
    [lr + (1 - lr) * s, lg - lg * s, lb - lb * s, 0],
    [lr - lr * s, lg + (1 - lg) * s, lb - lb * s, 0],
    [lr - lr * s, lg - lg * s, lb + (1 - lb) * s, 0],
  ];
  const W: Mat = [[1, 0, 0, w], [0, 1, 0, w * 0.25], [0, 0, 1, -w]];
  return mul(W, mul(S, mul(C, B)));
}

function feValues(m: Mat): string {
  return [...m[0].slice(0, 3), 0, m[0][3], ...m[1].slice(0, 3), 0, m[1][3], ...m[2].slice(0, 3), 0, m[2][3], 0, 0, 0, 1, 0]
    .map((n) => +n.toFixed(5))
    .join(' ');
}

// ───────────────────────── image io ─────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load photo'));
    img.src = src;
  });
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/jpeg', quality)
  );
}

/** Decode a picked file (EXIF orientation applied), cap its size, re-encode as JPEG. */
async function normaliseFile(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, ORIGINAL_MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1 && file.type === 'image/jpeg' && file.size < 3_500_000) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await toBlob(canvas, 0.92);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function renderEdit(img: HTMLImageElement, edit: PhotoEdit, aspects: AspectOption[]): Promise<Blob> {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const { A, k, deg } = geometry(edit, iw, ih, aspects);
  // Never upscale beyond the photo's real resolution (frame width in photo px = 1/k).
  const targetW = A >= 1 ? OUTPUT_MAX_EDGE : OUTPUT_MAX_EDGE * A;
  const OW = Math.max(1, Math.round(Math.min(targetW, 1 / k)));
  const OH = Math.max(1, Math.round(OW / A));

  const canvas = document.createElement('canvas');
  canvas.width = OW;
  canvas.height = OH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, OW, OH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(OW / 2 + edit.x * OW, OH / 2 + edit.y * OW);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.scale(k * OW * (edit.flip ? -1 : 1), k * OW);
  ctx.drawImage(img, -iw / 2, -ih / 2);

  const m = colourMatrix(edit);
  if (m) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const data = ctx.getImageData(0, 0, OW, OH);
    const d = data.data;
    const o0 = m[0][3] * 255, o1 = m[1][3] * 255, o2 = m[2][3] * 255;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      d[i] = m[0][0] * r + m[0][1] * g + m[0][2] * b + o0;
      d[i + 1] = m[1][0] * r + m[1][1] * g + m[1][2] * b + o1;
      d[i + 2] = m[2][0] * r + m[2][1] * g + m[2][2] * b + o2;
    }
    ctx.putImageData(data, 0, 0);
  }
  return toBlob(canvas, 0.88);
}

// ───────────────────────── UI bits ─────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  format,
  onChange,
  onReset,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  onReset: () => void;
}) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 4 }}>
        {label}
        <button
          type="button"
          onClick={onReset}
          title="Reset"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: value ? BLUE_DARK : MUTED, fontFamily: FONT, fontSize: 12, fontVariantNumeric: 'tabular-nums' }}
        >
          {format ? format(value) : value > 0 ? `+${value}` : value}
        </button>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={onReset}
        style={{ width: '100%', accentColor: BLUE_DARK }}
      />
    </label>
  );
}

function Chip({ active, children, onClick, title }: { active?: boolean; children: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        cursor: 'pointer',
        border: `1px solid ${active ? DARK : '#D9CCBA'}`,
        background: active ? DARK : '#FFFFFF',
        color: active ? CREAM : DARK,
        borderRadius: 999,
        padding: '8px 14px',
        fontFamily: FONT,
        fontSize: 12,
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {children}
    </button>
  );
}

// ───────────────────────── editor ─────────────────────────

export function PhotoEditor({
  title,
  source,
  aspects,
  initialEdit,
  onCancel,
  onSave,
}: {
  title: string;
  source: PhotoSource;
  aspects: AspectOption[];
  initialEdit?: PhotoEdit;
  onCancel: () => void;
  onSave: (result: PhotoSaveResult) => Promise<void>;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [originalBlob, setOriginalBlob] = useState<Blob | null>(null);
  const [loadError, setLoadError] = useState('');
  const [edit, setEditRaw] = useState<PhotoEdit>(() => {
    const e = initialEdit && aspects.some((a) => a.key === initialEdit.aspect) ? initialEdit : null;
    return e ? { ...defaultEdit(aspects[0].key), ...e } : defaultEdit(aspects[0].key);
  });
  const [tab, setTab] = useState<'crop' | 'adjust'>('crop');
  const [interacting, setInteracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [compare, setCompare] = useState(false);
  const [stage, setStage] = useState({ w: 0, h: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; mid: { x: number; y: number } } | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const iw = img?.naturalWidth ?? 1;
  const ih = img?.naturalHeight ?? 1;

  const setEdit = useCallback(
    (fn: (e: PhotoEdit) => PhotoEdit) => setEditRaw((prev) => (img ? clampEdit(fn(prev), iw, ih, aspects) : fn(prev))),
    [img, iw, ih, aspects]
  );

  // Load the source photo.
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    const ready = (loaded: HTMLImageElement) => {
      setImg(loaded);
      // Clamp once the real dimensions are known.
      setEditRaw((e) => clampEdit(e, loaded.naturalWidth, loaded.naturalHeight, aspects));
    };
    (async () => {
      try {
        if (source.kind === 'file') {
          const blob = await normaliseFile(source.file);
          if (cancelled) return;
          setOriginalBlob(blob);
          objectUrl = URL.createObjectURL(blob);
          const loaded = await loadImage(objectUrl);
          if (!cancelled) ready(loaded);
        } else {
          const loaded = await loadImage(source.url);
          if (!cancelled) ready(loaded);
        }
      } catch {
        if (!cancelled) setLoadError("This photo couldn't be opened. Try a JPG or PNG.");
      }
    })();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [source, aspects]);

  // Track stage size.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setStage({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Lock page scroll behind the modal.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const geo = geometry(edit, iw, ih, aspects);
  const pad = 28;
  const availW = Math.max(40, stage.w - pad * 2);
  const availH = Math.max(40, stage.h - pad * 2);
  const FW = Math.min(availW, availH * geo.A);
  const FH = FW / geo.A;

  const pulse = useCallback(() => {
    setInteracting(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setInteracting(false), 700);
  }, []);

  /** Zoom by `factor` keeping the stage point (sx, sy) fixed. */
  const zoomAt = useCallback(
    (factor: number, sx: number, sy: number) => {
      setEdit((e) => {
        const z = Math.min(MAX_ZOOM, Math.max(1, e.zoom * factor));
        const r = z / e.zoom;
        const mx = (sx - stage.w / 2) / FW;
        const my = (sy - stage.h / 2) / FW;
        return { ...e, zoom: z, x: mx - (mx - e.x) * r, y: my - (my - e.y) * r };
      });
      pulse();
    },
    [setEdit, stage.w, stage.h, FW, pulse]
  );

  // Wheel / trackpad pinch (needs a non-passive listener to preventDefault).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const rect = el.getBoundingClientRect();
      const speed = ev.ctrlKey ? 0.012 : 0.0025;
      zoomAt(Math.exp(-ev.deltaY * speed), ev.clientX - rect.left, ev.clientY - rect.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const localPoint = (ev: React.PointerEvent) => {
    const rect = stageRef.current!.getBoundingClientRect();
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };

  const onPointerDown = (ev: React.PointerEvent) => {
    if (!img) return;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    pointers.current.set(ev.pointerId, localPoint(ev));
    gesture.current = null;
    setInteracting(true);
  };

  const onPointerMove = (ev: React.PointerEvent) => {
    const prev = pointers.current.get(ev.pointerId);
    if (!prev) return;
    const pt = localPoint(ev);
    pointers.current.set(ev.pointerId, pt);
    const pts = [...pointers.current.values()];
    if (pts.length === 1) {
      const dx = (pt.x - prev.x) / FW;
      const dy = (pt.y - prev.y) / FW;
      setEdit((e) => ({ ...e, x: e.x + dx, y: e.y + dy }));
    } else if (pts.length >= 2) {
      const [a, b] = pts;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const g = gesture.current;
      if (g && g.dist > 0) {
        const factor = dist / g.dist;
        const panX = (mid.x - g.mid.x) / FW;
        const panY = (mid.y - g.mid.y) / FW;
        setEdit((e) => {
          const z = Math.min(MAX_ZOOM, Math.max(1, e.zoom * factor));
          const r = z / e.zoom;
          const mx = (mid.x - stage.w / 2) / FW;
          const my = (mid.y - stage.h / 2) / FW;
          return { ...e, zoom: z, x: mx - (mx - e.x) * r + panX, y: my - (my - e.y) * r + panY };
        });
      }
      gesture.current = { dist, mid };
    }
  };

  const onPointerUp = (ev: React.PointerEvent) => {
    pointers.current.delete(ev.pointerId);
    gesture.current = null;
    if (pointers.current.size === 0) pulse();
  };

  const onDoubleClick = (ev: React.MouseEvent) => {
    const rect = stageRef.current!.getBoundingClientRect();
    const sx = ev.clientX - rect.left;
    const sy = ev.clientY - rect.top;
    zoomAt(edit.zoom > 1.05 ? 1 / edit.zoom : 2, sx, sy);
  };

  const resetAll = () => setEdit((e) => ({ ...defaultEdit(e.aspect) }));

  const save = useCallback(async () => {
    if (!img || saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const edited = await renderEdit(img, edit, aspects);
      await onSave({
        edited,
        edit,
        ...(source.kind === 'file' ? { original: originalBlob ?? undefined } : { originalUrl: source.url }),
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed — please try again.');
      setSaving(false);
    }
  }, [img, saving, edit, aspects, onSave, source, originalBlob]);

  // Keyboard: arrows nudge, +/- zoom, Esc cancel, Enter save.
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const tag = (ev.target as HTMLElement)?.tagName;
      if (ev.key === 'Escape') { onCancel(); return; }
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
      if (ev.key === 'Enter') { save(); return; }
      const step = (ev.shiftKey ? 20 : 4) / Math.max(1, FW);
      const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (moves[ev.key]) {
        ev.preventDefault();
        const [dx, dy] = moves[ev.key];
        setEdit((e) => ({ ...e, x: e.x + dx, y: e.y + dy }));
        pulse();
      } else if (ev.key === '+' || ev.key === '=') {
        zoomAt(1.15, stage.w / 2, stage.h / 2);
      } else if (ev.key === '-' || ev.key === '_') {
        zoomAt(1 / 1.15, stage.w / 2, stage.h / 2);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, save, setEdit, zoomAt, pulse, FW, stage.w, stage.h]);

  const matrix = useMemo(() => colourMatrix(edit), [edit]);
  const filterId = 'sunday-photo-adjust';
  const showGrid = interacting || edit.straighten !== 0;
  const edited = JSON.stringify({ ...edit, aspect: '' }) !== JSON.stringify({ ...defaultEdit(''), aspect: '' });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(51,65,77,0.45)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id={filterId} colorInterpolationFilters="sRGB">
          {matrix && <feColorMatrix type="matrix" values={feValues(matrix)} />}
        </filter>
      </svg>

      <div
        style={{
          width: 'min(980px, 100vw)',
          height: 'min(860px, 100dvh)',
          background: CREAM,
          borderRadius: 'clamp(0px, calc((100vw - 980px) * 100), 20px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(51,65,77,0.35)',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ cursor: 'pointer', background: 'none', border: 'none', color: BODY, fontFamily: FONT, fontSize: 14, padding: '8px 4px' }}
          >
            Cancel
          </button>
          <span style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
          <button
            type="button"
            onClick={save}
            disabled={!img || saving}
            style={{
              cursor: img && !saving ? 'pointer' : 'default',
              background: DARK,
              color: CREAM,
              border: 'none',
              borderRadius: 999,
              padding: '10px 22px',
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: img && !saving ? 1 : 0.5,
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
          style={{
            flex: 1,
            minHeight: 0,
            position: 'relative',
            overflow: 'hidden',
            touchAction: 'none',
            cursor: img ? (interacting ? 'grabbing' : 'grab') : 'default',
            background: '#EFE6D8',
            userSelect: 'none',
          }}
        >
          {!img && !loadError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BLUE_DARK, fontSize: 14 }}>
              Opening photo…
            </div>
          )}
          {loadError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: DARK, fontSize: 14, padding: 24, textAlign: 'center' }}>
              {loadError}
            </div>
          )}

          {img && stage.w > 0 && (
            <>
              <img
                src={img.src}
                alt=""
                draggable={false}
                style={{
                  position: 'absolute',
                  left: stage.w / 2 - iw / 2,
                  top: stage.h / 2 - ih / 2,
                  width: iw,
                  height: ih,
                  maxWidth: 'none',
                  transformOrigin: 'center',
                  transform: `translate(${edit.x * FW}px, ${edit.y * FW}px) rotate(${geo.deg}deg) scale(${geo.k * FW * (edit.flip ? -1 : 1)}, ${geo.k * FW})`,
                  filter: matrix && !compare ? `url(#${filterId})` : undefined,
                  transition: interacting ? 'none' : 'transform .18s ease',
                  pointerEvents: 'none',
                }}
              />

              {/* Frame: dims everything outside it, shows thirds while moving */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: (stage.w - FW) / 2,
                  top: (stage.h - FH) / 2,
                  width: FW,
                  height: FH,
                  borderRadius: 4,
                  boxShadow: `0 0 0 9999px rgba(239,230,216,${interacting ? 0.55 : 0.82})`,
                  outline: '1.5px solid rgba(255,255,255,0.95)',
                  transition: 'box-shadow .2s ease',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: showGrid ? 1 : 0,
                    transition: 'opacity .2s ease',
                    backgroundImage:
                      'linear-gradient(to right, transparent calc(33.333% - 0.5px), rgba(255,255,255,0.75) calc(33.333% - 0.5px), rgba(255,255,255,0.75) calc(33.333% + 0.5px), transparent calc(33.333% + 0.5px), transparent calc(66.666% - 0.5px), rgba(255,255,255,0.75) calc(66.666% - 0.5px), rgba(255,255,255,0.75) calc(66.666% + 0.5px), transparent calc(66.666% + 0.5px)),' +
                      'linear-gradient(to bottom, transparent calc(33.333% - 0.5px), rgba(255,255,255,0.75) calc(33.333% - 0.5px), rgba(255,255,255,0.75) calc(33.333% + 0.5px), transparent calc(33.333% + 0.5px), transparent calc(66.666% - 0.5px), rgba(255,255,255,0.75) calc(66.666% - 0.5px), rgba(255,255,255,0.75) calc(66.666% + 0.5px), transparent calc(66.666% + 0.5px))',
                  }}
                />
                {/* corner ticks */}
                {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
                  <span
                    key={c}
                    style={{
                      position: 'absolute',
                      width: 18,
                      height: 18,
                      [c[0] === 't' ? 'top' : 'bottom']: -3,
                      [c[1] === 'l' ? 'left' : 'right']: -3,
                      [`border${c[0] === 't' ? 'Top' : 'Bottom'}`]: '3px solid #FFFFFF',
                      [`border${c[1] === 'l' ? 'Left' : 'Right'}`]: '3px solid #FFFFFF',
                    }}
                  />
                ))}
              </div>

              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', fontSize: 12, color: BODY, pointerEvents: 'none', opacity: interacting ? 0 : 1, transition: 'opacity .2s' }}>
                Drag to move · pinch or scroll to zoom · double-tap to zoom in
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div style={{ borderTop: `1px solid ${BORDER}`, background: '#FFFFFF', padding: '12px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'inline-flex', background: '#F3ECE2', borderRadius: 999, padding: 3 }}>
              {(['crop', 'adjust'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: 999,
                    padding: '7px 18px',
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: tab === t ? '#FFFFFF' : 'transparent',
                    color: tab === t ? DARK : MUTED,
                    boxShadow: tab === t ? '0 1px 4px rgba(51,65,77,0.12)' : 'none',
                  }}
                >
                  {t === 'crop' ? 'Crop' : 'Light & color'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {tab === 'adjust' && matrix && (
                <button
                  type="button"
                  onPointerDown={() => setCompare(true)}
                  onPointerUp={() => setCompare(false)}
                  onPointerLeave={() => setCompare(false)}
                  style={{ cursor: 'pointer', background: 'none', border: `1px solid #D9CCBA`, color: BODY, borderRadius: 999, padding: '7px 12px', fontFamily: FONT, fontSize: 12 }}
                >
                  Hold to compare
                </button>
              )}
              <button
                type="button"
                onClick={resetAll}
                disabled={!edited}
                style={{ cursor: edited ? 'pointer' : 'default', background: 'none', border: 'none', color: edited ? BLUE_DARK : MUTED, fontFamily: FONT, fontSize: 13, padding: '7px 4px' }}
              >
                Reset all
              </button>
            </div>
          </div>

          {tab === 'crop' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                {aspects.map((a) => (
                  <Chip key={a.key} active={edit.aspect === a.key} onClick={() => setEdit((e) => ({ ...e, aspect: a.key }))}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-block',
                        width: a.ratio ? (a.ratio >= 1 ? 14 : 14 * a.ratio) : 12,
                        height: a.ratio ? (a.ratio >= 1 ? 14 / a.ratio : 14) : 12,
                        border: '1.5px solid currentColor',
                        borderRadius: 2,
                        borderStyle: a.ratio ? 'solid' : 'dashed',
                      }}
                    />
                    {a.label}
                  </Chip>
                ))}
                <span style={{ width: 1, background: BORDER, margin: '4px 2px', flex: 'none' }} />
                <Chip onClick={() => setEdit((e) => ({ ...e, rotation: (e.rotation + 3) % 4, x: 0, y: 0 }))} title="Rotate left">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
                  Rotate
                </Chip>
                <Chip active={edit.flip} onClick={() => setEdit((e) => ({ ...e, flip: !e.flip, x: -e.x }))} title="Mirror">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18" /><path d="M8 7 3 12l5 5V7Z" /><path d="m16 7 5 5-5 5V7Z" /></svg>
                  Flip
                </Chip>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <Slider
                  label="Zoom"
                  value={Math.round(edit.zoom * 100) / 100}
                  min={1}
                  max={MAX_ZOOM}
                  step={0.01}
                  format={(v) => `${Math.round(v * 100)}%`}
                  onChange={(v) => { setEdit((e) => { const r = v / e.zoom; return { ...e, zoom: v, x: e.x * r, y: e.y * r }; }); pulse(); }}
                  onReset={() => setEdit((e) => ({ ...e, zoom: 1 }))}
                />
                <Slider
                  label="Straighten"
                  value={edit.straighten}
                  min={-20}
                  max={20}
                  step={0.5}
                  format={(v) => `${v > 0 ? '+' : ''}${v}°`}
                  onChange={(v) => { setEdit((e) => ({ ...e, straighten: v })); pulse(); }}
                  onReset={() => setEdit((e) => ({ ...e, straighten: 0 }))}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {([
                ['brightness', 'Brightness'],
                ['contrast', 'Contrast'],
                ['saturation', 'Saturation'],
                ['warmth', 'Warmth'],
              ] as const).map(([key, label]) => (
                <Slider
                  key={key}
                  label={label}
                  value={edit[key]}
                  min={-100}
                  max={100}
                  onChange={(v) => setEdit((e) => ({ ...e, [key]: v }))}
                  onReset={() => setEdit((e) => ({ ...e, [key]: 0 }))}
                />
              ))}
            </div>
          )}

          {saveError && <p style={{ margin: '10px 0 0', color: '#B4533A', fontSize: 13 }}>{saveError}</p>}
        </div>
      </div>
    </div>
  );
}
