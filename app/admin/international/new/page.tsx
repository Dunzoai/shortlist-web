'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';

const CLIENT_ID = '3c125122-f3d9-4f75-91d9-69cf84d6d20e';

export default function NewInternationalDestination() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    city: '',
    country: '',
    country_es: '',
    slug: '',
    image_url: '',
    description_en: '',
    description_es: '',
    highlights_en: [] as string[],
    highlights_es: [] as string[],
    why_invest_en: [] as string[],
    why_invest_es: [] as string[],
    external_url: '',
    display_order: 0,
    is_active: true,
  });

  const [tagInputs, setTagInputs] = useState({
    highlights_en: '',
    highlights_es: '',
    why_invest_en: '',
    why_invest_es: '',
  });

  const handleAddTag = (field: 'highlights_en' | 'highlights_es' | 'why_invest_en' | 'why_invest_es') => {
    const val = tagInputs[field].trim();
    if (!val) return;
    setForm({ ...form, [field]: [...form[field], val] });
    setTagInputs({ ...tagInputs, [field]: '' });
  };

  const handleRemoveTag = (field: 'highlights_en' | 'highlights_es' | 'why_invest_en' | 'why_invest_es', idx: number) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== idx) });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('international-images')
      .upload(path, file);

    if (!error) {
      const { data: urlData } = supabase.storage
        .from('international-images')
        .getPublicUrl(path);
      setForm({ ...form, image_url: urlData.publicUrl });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const slug = form.slug || form.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { error } = await supabase.from('international_destinations').insert({
      client_id: CLIENT_ID,
      slug,
      city: form.city,
      country: form.country,
      country_es: form.country_es || null,
      image_url: form.image_url || null,
      description_en: form.description_en || null,
      description_es: form.description_es || null,
      highlights_en: form.highlights_en,
      highlights_es: form.highlights_es,
      why_invest_en: form.why_invest_en,
      why_invest_es: form.why_invest_es,
      external_url: form.external_url || null,
      display_order: form.display_order,
      is_active: form.is_active,
    });

    if (error) {
      alert('Error saving: ' + error.message);
      setSaving(false);
      return;
    }

    router.push('/admin/international');
  };

  const inputClass = 'w-full px-4 py-2 border-2 border-[#D6BFAE] rounded focus:outline-none focus:border-[#C4A25A] transition-all';
  const labelClass = 'block text-sm font-medium text-[#3D3D3D] mb-1';

  const TagField = ({ label, field }: { label: string; field: 'highlights_en' | 'highlights_es' | 'why_invest_en' | 'why_invest_es' }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {form[field].map((tag, i) => (
          <span key={i} className="flex items-center gap-1 bg-[#1B365D]/10 text-[#1B365D] px-3 py-1 rounded-full text-sm">
            {tag}
            <button type="button" onClick={() => handleRemoveTag(field, i)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={tagInputs[field]}
          onChange={(e) => setTagInputs({ ...tagInputs, [field]: e.target.value })}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(field); } }}
          className={inputClass}
          placeholder="Type and press Enter"
        />
        <button type="button" onClick={() => handleAddTag(field)} className="px-3 py-2 bg-[#D6BFAE] rounded hover:bg-[#C4A25A] text-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Link href="/admin/international" className="flex items-center gap-2 text-[#1B365D] hover:text-[#C4A25A] mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Destinations
      </Link>

      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1B365D] mb-8">Add Destination</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-[#D6BFAE] p-6 space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City *</label>
            <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug (auto-generated if blank)</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder="e.g. dubai" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Country (English) *</label>
            <input type="text" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Country (Spanish)</label>
            <input type="text" value={form.country_es} onChange={(e) => setForm({ ...form, country_es: e.target.value })} className={inputClass} />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className={labelClass}>Image</label>
          {form.image_url && (
            <div className="mb-2 relative w-full h-48 rounded overflow-hidden">
              <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 px-4 py-2 bg-[#D6BFAE] rounded cursor-pointer hover:bg-[#C4A25A] text-white transition-colors">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <span className="text-sm text-[#3D3D3D]">or</span>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className={inputClass}
              placeholder="Paste image URL"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className={labelClass}>Description (English)</label>
          <textarea rows={4} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description (Spanish)</label>
          <textarea rows={4} value={form.description_es} onChange={(e) => setForm({ ...form, description_es: e.target.value })} className={inputClass} />
        </div>

        {/* Tags */}
        <TagField label="Market Highlights (English)" field="highlights_en" />
        <TagField label="Market Highlights (Spanish)" field="highlights_es" />
        <TagField label="Why Invest (English)" field="why_invest_en" />
        <TagField label="Why Invest (Spanish)" field="why_invest_es" />

        {/* External URL */}
        <div>
          <label className={labelClass}>External Project URL (optional)</label>
          <input type="url" value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} className={inputClass} placeholder="https://..." />
          <p className="text-xs text-[#3D3D3D] mt-1">If set, the &quot;Explore&quot; button links here instead of the contact form</p>
        </div>

        {/* Order & Active */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-5 h-5 accent-[#C4A25A]"
            />
            <label htmlFor="is_active" className="text-[#3D3D3D]">Active (visible on site)</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#C4A25A] text-white py-3 rounded hover:bg-[#1B365D] transition-colors font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Destination'}
        </button>
      </form>
    </div>
  );
}
