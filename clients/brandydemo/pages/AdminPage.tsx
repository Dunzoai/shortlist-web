'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import content from '../content';
import SquareConnect from '../components/SquareConnect';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const INFO_BG = '#E7F0FA';
const BORDER = '#ECDECB';
const INPUT_BORDER = '#E0D4C4';

const ADD_CATEGORY = '__add_new_category__';

type Product = {
  id: string;
  name: string;
  description: string;
  level: string;
  category: string;
  image_url: string | null;
  price: number | null;
  sort_order: number;
  client_id: string;
};

type GalleryItem = { id: string; image_url: string; caption: string };

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: MUTED,
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${INPUT_BORDER}`,
  borderRadius: 8,
  padding: '10px 12px',
  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
  fontSize: 16,
  color: DARK,
  backgroundColor: CREAM,
  outline: 'none',
};

function GripIcon({ light = false }: { light?: boolean }) {
  const color = light ? '#FFFFFF' : MUTED;
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill={color} aria-hidden="true">
      {[2, 8].map((cx) =>
        [3, 8, 13].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.4" />)
      )}
    </svg>
  );
}

function PhotoDropZone({
  productId,
  imageUrl,
  onUpload,
  uploading,
}: {
  productId: string;
  imageUrl: string | null;
  onUpload: (productId: string, file: File) => void;
  uploading: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    onUpload(productId, file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      onClick={() => fileRef.current?.click()}
      style={{
        width: '100%',
        height: 180,
        borderRadius: 10,
        border: `2px dashed ${dragging ? BLUE_DARK : '#C9BCA9'}`,
        backgroundColor: dragging ? '#F0F7FF' : '#F8F3EC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color .15s ease, background-color .15s ease',
        position: 'relative',
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {uploading && (
        <div style={{
          position: 'absolute', inset: 0, backgroundColor: 'rgba(251,244,234,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: BLUE_DARK, fontWeight: 600, zIndex: 2,
        }}>
          Uploading...
        </div>
      )}
      {imageUrl ? (
        <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <p style={{ margin: '8px 0 2px', fontSize: 14, color: DARK }}>Drop a photo here</p>
          <p style={{ margin: 0, fontSize: 13, color: MUTED }}>
            or <span style={{ textDecoration: 'underline' }}>browse files</span>
          </p>
        </>
      )}
    </div>
  );
}

function SortableProductCard({
  product,
  categories,
  uploadingId,
  onField,
  onPrice,
  onUpload,
  onDelete,
  onAddCategory,
}: {
  product: Product;
  categories: string[];
  uploadingId: string | null;
  onField: (id: string, field: 'name' | 'description' | 'level' | 'category', value: string) => void;
  onPrice: (id: string, raw: string) => void;
  onUpload: (productId: string, file: File) => void;
  onDelete: (id: string, name: string) => void;
  onAddCategory: (id: string, name: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const [addingCat, setAddingCat] = useState(false);
  const [newCat, setNewCat] = useState('');

  const commitCategory = () => {
    const trimmed = newCat.trim();
    if (trimmed) onAddCategory(product.id, trimmed);
    setAddingCat(false);
    setNewCat('');
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 5 : undefined,
    background: '#FFFFFF',
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    boxShadow: isDragging ? '0 18px 40px rgba(51,65,77,0.18)' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle bar */}
      <div
        {...attributes}
        {...listeners}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderBottom: `1px solid ${BORDER}`,
          cursor: 'grab',
          touchAction: 'none',
          color: MUTED,
        }}
      >
        <GripIcon />
        <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {content.admin.dragHint}
        </span>
      </div>

      <div
        style={{
          padding: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Photo drop zone */}
        <div>
          <label style={labelStyle}>Photo — drag & drop</label>
          <PhotoDropZone
            productId={product.id}
            imageUrl={product.image_url}
            onUpload={onUpload}
            uploading={uploadingId === product.id}
          />
        </div>

        {/* Name + Description + Price */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              value={product.name}
              onChange={(e) => onField(product.id, 'name', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={product.description}
              onChange={(e) => onField(product.id, 'description', e.target.value)}
              rows={3}
              style={{ ...inputStyle, fontSize: 15, lineHeight: 1.5, resize: 'vertical' as const }}
            />
          </div>
          <div>
            <label style={labelStyle}>{content.admin.priceLabel}</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 16 }}>
                $
              </span>
              <input
                value={product.price ?? ''}
                onChange={(e) => onPrice(product.id, e.target.value)}
                inputMode="decimal"
                placeholder="0"
                style={{ ...inputStyle, paddingLeft: 24 }}
              />
            </div>
          </div>
        </div>

        {/* Level + Category + Delete */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Level label</label>
            <input
              value={product.level}
              onChange={(e) => onField(product.id, 'level', e.target.value)}
              placeholder="e.g. Level 1, Any level"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            {addingCat ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  autoFocus
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder={content.admin.newCategoryPlaceholder}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitCategory();
                    if (e.key === 'Escape') { setAddingCat(false); setNewCat(''); }
                  }}
                  style={inputStyle}
                />
                <button
                  onClick={commitCategory}
                  style={{
                    cursor: 'pointer',
                    background: DARK,
                    color: CREAM,
                    border: 'none',
                    borderRadius: 8,
                    padding: '0 16px',
                    fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  Add
                </button>
              </div>
            ) : (
              <select
                value={product.category}
                onChange={(e) => {
                  if (e.target.value === ADD_CATEGORY) setAddingCat(true);
                  else onField(product.id, 'category', e.target.value);
                }}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value={ADD_CATEGORY}>{content.admin.addCategoryOption}</option>
              </select>
            )}
          </div>
          <button
            onClick={() => onDelete(product.id, product.name)}
            style={{
              alignSelf: 'flex-start',
              cursor: 'pointer',
              background: 'none',
              border: '1px solid #C9BCA9',
              color: BODY,
              borderRadius: 999,
              padding: '9px 16px',
              fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              transition: 'border-color .15s, color .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = BLUE_DARK; e.currentTarget.style.color = BLUE_DARK; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C9BCA9'; e.currentTarget.style.color = BODY; }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableGalleryTile({
  item,
  onCaption,
  onDelete,
}: {
  item: GalleryItem;
  onCaption: (id: string, caption: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 5 : undefined,
    background: '#FFFFFF',
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ position: 'relative' }}>
        <img
          src={item.image_url}
          alt={item.caption || 'Gallery photo'}
          style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
        />
        <div
          {...attributes}
          {...listeners}
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(51,65,77,0.6)',
            color: '#FFFFFF',
            borderRadius: 8,
            padding: '5px 9px',
            cursor: 'grab',
            touchAction: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <GripIcon light />
          {content.admin.dragHint}
        </div>
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          value={item.caption}
          onChange={(e) => onCaption(item.id, e.target.value)}
          placeholder="Caption (optional)"
          style={{ ...inputStyle, fontSize: 13, padding: '8px 10px' }}
        />
        <button
          onClick={() => onDelete(item.id)}
          style={{
            alignSelf: 'flex-start',
            cursor: 'pointer',
            background: 'none',
            border: '1px solid #C9BCA9',
            color: BODY,
            borderRadius: 999,
            padding: '6px 12px',
            fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function AdminPage() {
  const c = content;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>('');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  // Load products from Supabase (public read via anon)
  useEffect(() => {
    async function load() {
      const { data: client } = await supabase
        .from('web_clients')
        .select('id')
        .eq('slug', 'brandydemo')
        .single();

      if (client) {
        setClientId(client.id);
        const { data } = await supabase
          .from('sunday_products')
          .select('*')
          .eq('client_id', client.id)
          .order('sort_order', { ascending: true });

        if (data) setProducts(data);

        const { data: gallery } = await supabase
          .from('sunday_gallery')
          .select('id, image_url, caption')
          .eq('client_id', client.id)
          .order('sort_order', { ascending: true });

        if (gallery) setGalleryItems(gallery);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Debounced save via the service-role API route
  const saveProduct = (product: Product) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      await fetch('/api/studio-admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          fields: {
            name: product.name,
            description: product.description,
            level: product.level,
            category: product.category,
            image_url: product.image_url,
            price: product.price,
          },
        }),
      });
      setSaving(false);
    }, 500);
  };

  const handleField = (
    id: string,
    field: 'name' | 'description' | 'level' | 'category',
    value: string,
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        saveProduct(updated);
        return updated;
      })
    );
  };

  const handlePrice = (id: string, raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const parsed = cleaned === '' ? null : Number(cleaned);
    const price = parsed !== null && Number.isNaN(parsed) ? null : parsed;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, price };
        saveProduct(updated);
        return updated;
      })
    );
  };

  const handleAddCategory = (id: string, name: string) => {
    setCustomCategories((prev) => (prev.includes(name) ? prev : [...prev, name]));
    handleField(id, 'category', name);
  };

  const persistProductOrder = (list: Product[]) => {
    const order = list.map((p, i) => ({ id: p.id, sort_order: i + 1 }));
    setSaving(true);
    fetch('/api/studio-admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    }).finally(() => setSaving(false));
  };

  const handleProductDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setProducts((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      persistProductOrder(next);
      return next;
    });
  };

  const persistGalleryOrder = (list: GalleryItem[]) => {
    const order = list.map((g, i) => ({ id: g.id, sort_order: i + 1 }));
    setSaving(true);
    fetch('/api/studio-admin/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    }).finally(() => setSaving(false));
  };

  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setGalleryItems((prev) => {
      const oldIndex = prev.findIndex((g) => g.id === active.id);
      const newIndex = prev.findIndex((g) => g.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      persistGalleryOrder(next);
      return next;
    });
  };

  const handleUpload = async (productId: string, file: File) => {
    setUploadingId(productId);
    const form = new FormData();
    form.append('file', file);
    form.append('kind', 'product');
    form.append('productId', productId);

    const res = await fetch('/api/studio-admin/upload', { method: 'POST', body: form });
    if (res.ok) {
      const { url } = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, image_url: url } : p))
      );
    }
    setUploadingId(null);
  };

  const handleAdd = async () => {
    const newId = `p${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: 'New set',
      description: 'Describe this set…',
      level: 'Level 1',
      category: 'Pre-designed',
      image_url: null,
      price: null,
      sort_order: products.length + 1,
      client_id: clientId,
    };

    const res = await fetch('/api/studio-admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: newProduct }),
    });
    if (res.ok) {
      const { product } = await res.json();
      setProducts([...products, product ?? newProduct]);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from the shop?`)) return;
    await fetch('/api/studio-admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleReset = async () => {
    if (!window.confirm(c.admin.resetConfirm)) return;

    const seeds = content.shop.seedProducts.map((p, i) => ({
      id: p.id,
      client_id: clientId,
      name: p.name,
      description: p.desc,
      level: p.level,
      category: p.category,
      image_url: null,
      price: null,
      sort_order: i + 1,
    }));

    const res = await fetch('/api/studio-admin/products/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, seeds }),
    });
    if (res.ok) {
      const { products: data } = await res.json();
      if (data) setProducts(data);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/studio-admin/logout', { method: 'POST' });
    window.location.href = '/studio-admin/login';
  };

  const handleGalleryUpload = async (files: FileList) => {
    setGalleryUploading(true);
    let order = galleryItems.length + 1;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const form = new FormData();
      form.append('file', file);
      form.append('kind', 'gallery');
      form.append('clientId', clientId);
      form.append('sortOrder', String(order));
      order += 1;

      const res = await fetch('/api/studio-admin/upload', { method: 'POST', body: form });
      if (res.ok) {
        const { item } = await res.json();
        if (item) setGalleryItems((prev) => [...prev, item]);
      }
    }
    setGalleryUploading(false);
  };

  const handleGalleryCaption = (id: string, caption: string) => {
    setGalleryItems((prev) => prev.map((g) => (g.id === id ? { ...g, caption } : g)));
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await fetch('/api/studio-admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, caption }),
      });
    }, 500);
  };

  const handleGalleryDelete = async (id: string) => {
    if (!window.confirm('Delete this gallery image?')) return;
    await fetch('/api/studio-admin/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
  };

  // Base categories from content, plus any already on products, plus session-added ones
  const baseCategories = c.shop.categories.filter((cat) => cat !== 'All');
  const productCategories = products.map((p) => p.category).filter(Boolean);
  const allCategories = Array.from(
    new Set([...baseCategories, ...productCategories, ...customCategories])
  );

  if (loading) {
    return (
      <main style={{ backgroundColor: CREAM, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: BODY, fontSize: 16 }}>Loading products...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        backgroundColor: CREAM,
        color: DARK,
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
        minHeight: '100vh',
      }}
    >
      {/* ───── Admin Header ───── */}
      <header style={{ background: 'linear-gradient(120deg, #8EB6D9 0%, #B9D4F1 100%)', color: CREAM }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '24px clamp(20px,4vw,40px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontWeight: 500,
                fontSize: 24,
                letterSpacing: '0.24em',
                color: '#FFFFFF',
              }}
            >
              {c.admin.headerBrand}
            </span>
            <span
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontWeight: 600,
                fontSize: 18,
                color: CREAM,
                marginTop: -1,
              }}
            >
              {c.admin.headerSub}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {saving && (
              <span style={{ fontSize: 12, color: '#FFFFFF', opacity: 0.7 }}>Saving...</span>
            )}
            <a
              href={c.admin.backHref}
              style={{ color: '#FFFFFF', fontSize: 14, textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              {c.admin.backText}
            </a>
            <button
              onClick={handleLogout}
              style={{
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.18)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.5)',
                borderRadius: 999,
                padding: '8px 16px',
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}
            >
              {c.admin.logoutText}
            </button>
          </div>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: 'clamp(32px,5vw,56px) clamp(20px,4vw,40px) clamp(64px,8vw,100px)',
        }}
      >
        {/* ───── Info Banner ───── */}
        <div
          style={{
            background: INFO_BG,
            borderRadius: 14,
            padding: '18px 22px',
            marginBottom: 32,
            fontSize: 15,
            lineHeight: 1.6,
            color: DARK,
          }}
        >
          {c.admin.infoBanner} Drag the handle on any card to reorder. Changes save automatically to the database and show up on the Shop page.
        </div>

        {/* ───── Square Payments ───── */}
        <SquareConnect />

        {/* ───── Heading + Actions ───── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 600,
              fontSize: 'clamp(30px,4vw,44px)',
              color: DARK,
            }}
          >
            Products{' '}
            <span
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                fontSize: '0.7em',
                color: BLUE_DARK,
                fontWeight: 600,
              }}
            >
              ({products.length})
            </span>
          </h1>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleAdd}
              style={{
                cursor: 'pointer',
                background: DARK,
                color: CREAM,
                border: 'none',
                borderRadius: 999,
                padding: '12px 24px',
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                fontWeight: 600,
              }}
            >
              {c.admin.addButtonText}
            </button>
            <button
              onClick={handleReset}
              style={{
                cursor: 'pointer',
                background: 'none',
                color: BODY,
                border: '1px solid #C9BCA9',
                borderRadius: 999,
                padding: '12px 20px',
                fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}
            >
              {c.admin.resetButtonText}
            </button>
          </div>
        </div>

        {/* ───── Product Cards (drag to reorder) ───── */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleProductDragEnd}
        >
          <SortableContext items={products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {products.map((p) => (
                <SortableProductCard
                  key={p.id}
                  product={p}
                  categories={allCategories}
                  uploadingId={uploadingId}
                  onField={handleField}
                  onPrice={handlePrice}
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                  onAddCategory={handleAddCategory}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* ───── Gallery Section ───── */}
        <div style={{ marginTop: 'clamp(48px,6vw,72px)', borderTop: `1px solid ${BORDER}`, paddingTop: 'clamp(32px,4vw,48px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontWeight: 600,
                fontSize: 'clamp(26px,3.4vw,38px)',
                color: DARK,
              }}
            >
              Gallery{' '}
              <span style={{ fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive", fontSize: '0.7em', color: BLUE_DARK, fontWeight: 600 }}>
                ({galleryItems.length})
              </span>
            </h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                ref={galleryFileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => { if (e.target.files?.length) handleGalleryUpload(e.target.files); }}
              />
              <button
                onClick={() => galleryFileRef.current?.click()}
                disabled={galleryUploading}
                style={{
                  cursor: 'pointer',
                  background: DARK,
                  color: CREAM,
                  border: 'none',
                  borderRadius: 999,
                  padding: '12px 24px',
                  fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  fontWeight: 600,
                  opacity: galleryUploading ? 0.6 : 1,
                }}
              >
                {galleryUploading ? 'Uploading...' : '+ Add photos'}
              </button>
            </div>
          </div>

          <p style={{ margin: '0 0 20px', fontSize: 14, color: BODY }}>
            Upload photos of nail sets you&apos;ve done. Drag to reorder — they&apos;ll appear on the Gallery page in this order.
          </p>

          {galleryItems.length === 0 ? (
            <div
              style={{
                border: `2px dashed #C9BCA9`,
                borderRadius: 16,
                padding: 'clamp(40px,6vw,80px) 20px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => galleryFileRef.current?.click()}
            >
              <p style={{ color: MUTED, fontSize: 15 }}>Drop photos here or click to upload</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToParentElement]}
              onDragEnd={handleGalleryDragEnd}
            >
              <SortableContext items={galleryItems.map((g) => g.id)} strategy={rectSortingStrategy}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: 16,
                  }}
                >
                  {galleryItems.map((g) => (
                    <SortableGalleryTile
                      key={g.id}
                      item={g}
                      onCaption={handleGalleryCaption}
                      onDelete={handleGalleryDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </section>
    </main>
  );
}
