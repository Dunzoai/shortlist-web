'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import content from '../content';

const CREAM = '#FBF4EA';
const BLUE = '#8EB6D9';
const BLUE_DARK = '#5E86AD';
const DARK = '#33414D';
const BODY = '#55606B';
const MUTED = '#A99E92';
const INFO_BG = '#E7F0FA';
const BORDER = '#ECDECB';
const INPUT_BORDER = '#E0D4C4';

const STORAGE_BUCKET = 'client-assets';
const STORAGE_PATH = 'brandydemo/products';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

type Product = {
  id: string;
  name: string;
  description: string;
  level: string;
  category: string;
  image_url: string | null;
  sort_order: number;
  client_id: string;
};

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

export function AdminPage() {
  const c = content;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>('');
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load products from Supabase
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
      }
      setLoading(false);
    }
    load();
  }, []);

  // Debounced save to Supabase
  const saveProduct = (product: Product) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      await supabase
        .from('sunday_products')
        .update({
          name: product.name,
          description: product.description,
          level: product.level,
          category: product.category,
          image_url: product.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);
      setSaving(false);
    }, 500);
  };

  const handleChange = (id: string, field: keyof Product, value: string) => {
    const next = products.map((p) => {
      if (p.id !== id) return p;
      const updated = { ...p, [field]: value };
      saveProduct(updated);
      return updated;
    });
    setProducts(next);
  };

  const handleUpload = async (productId: string, file: File) => {
    setUploadingId(productId);
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${STORAGE_PATH}/${productId}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, { upsert: true });

    if (!error) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;

      // Update product with image URL
      await supabase
        .from('sunday_products')
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', productId);

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, image_url: publicUrl } : p))
      );
    }
    setUploadingId(null);
  };

  const handleAdd = async () => {
    const newId = `p${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: 'New set',
      description: 'Describe this set\u2026',
      level: 'Level 1',
      category: 'Pre-designed',
      image_url: null,
      sort_order: products.length + 1,
      client_id: clientId,
    };

    const { error } = await supabase.from('sunday_products').insert(newProduct);
    if (!error) setProducts([...products, newProduct]);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from the shop?`)) return;
    await supabase.from('sunday_products').delete().eq('id', id);
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleReset = async () => {
    if (!window.confirm(c.admin.resetConfirm)) return;

    // Delete all existing
    await supabase.from('sunday_products').delete().eq('client_id', clientId);

    // Re-insert seeds
    const seeds = content.shop.seedProducts.map((p, i) => ({
      id: p.id,
      client_id: clientId,
      name: p.name,
      description: p.desc,
      level: p.level,
      category: p.category,
      image_url: null,
      sort_order: i + 1,
    }));

    const { data } = await supabase.from('sunday_products').insert(seeds).select();
    if (data) setProducts(data);
  };

  const categories = ['Custom', 'Pre-designed', 'Solid color', 'Sizing kits'];

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
          {c.admin.infoBanner} Drag a photo onto any card to add it. Changes save automatically to the database and show up on the Shop page.
        </div>

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

        {/* ───── Product Cards ───── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
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
                  productId={p.id}
                  imageUrl={p.image_url}
                  onUpload={handleUpload}
                  uploading={uploadingId === p.id}
                />
              </div>

              {/* Name + Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    value={p.name}
                    onChange={(e) => handleChange(p.id, 'name', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={p.description}
                    onChange={(e) => handleChange(p.id, 'description', e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, fontSize: 15, lineHeight: 1.5, resize: 'vertical' as const }}
                  />
                </div>
              </div>

              {/* Level + Category + Delete */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Level label</label>
                  <input
                    value={p.level}
                    onChange={(e) => handleChange(p.id, 'level', e.target.value)}
                    placeholder="e.g. Level 1, Any level"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    value={p.category}
                    onChange={(e) => handleChange(p.id, 'category', e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
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
          ))}
        </div>
      </section>
    </main>
  );
}
