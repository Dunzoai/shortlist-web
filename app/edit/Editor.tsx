'use client';

import { useState, useCallback } from 'react';
import TextFieldEditor from './components/TextFieldEditor';
import TextAreaEditor from './components/TextAreaEditor';
import ImageFieldEditor from './components/ImageFieldEditor';
import NavEditor from './components/NavEditor';
import MenuEditor from './components/MenuEditor';
import LocationsEditor from './components/LocationsEditor';
import GalleryEditor from './components/GalleryEditor';
import FaqEditor from './components/FaqEditor';
import OrderEditor from './components/OrderEditor';
import SeoEditor from './components/SeoEditor';

type Props = {
  slug: string;
  businessName: string;
  initialContent: Record<string, any>;
};

const SECTIONS = [
  { id: 'business', label: 'Business' },
  { id: 'nav', label: 'Nav' },
  { id: 'hero', label: 'Hero' },
  { id: 'parallaxBar', label: 'Parallax Bar' },
  { id: 'story', label: 'Our Story' },
  { id: 'parallaxGrandma', label: 'Parallax Grandma' },
  { id: 'locations', label: 'Locations' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'menu', label: 'Menu' },
  { id: 'order', label: 'Order Page' },
  { id: 'seo', label: 'SEO' },
];

export default function Editor({ slug, businessName, initialContent }: Props) {
  const [content, setContent] = useState<Record<string, any>>(initialContent ?? {});
  const [activeSection, setActiveSection] = useState('business');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Generic setter for any nested path in the content object
  const set = useCallback((path: string, value: any) => {
    setContent((prev) => {
      const keys = path.split('.');
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = /^\d+$/.test(keys[i]) ? Number(keys[i]) : keys[i];
        obj = obj[k];
      }
      const lastKey = /^\d+$/.test(keys[keys.length - 1])
        ? Number(keys[keys.length - 1])
        : keys[keys.length - 1];
      obj[lastKey] = value;
      return next;
    });
  }, []);

  const save = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/edit/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveMsg(`Error: ${data.error}`);
      } else {
        setSaveMsg('Saved!');
        setTimeout(() => setSaveMsg(null), 3000);
      }
    } catch {
      setSaveMsg('Error: network failure');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Internal banner */}
      <div className="bg-amber-600 text-black text-center py-2 text-sm font-bold tracking-wide">
        INTERNAL EDITOR — not for public use
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{businessName}</h1>
          <p className="text-xs text-gray-500">Editing: {slug}</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && (
            <span className={`text-sm ${saveMsg.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded text-sm font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar nav */}
        <nav className="w-52 flex-shrink-0 bg-gray-900 border-r border-gray-800 p-4 sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`block w-full text-left px-3 py-2 rounded text-sm mb-1 transition-colors ${
                activeSection === s.id
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Main editor area */}
        <main className="flex-1 p-8 max-w-3xl">
          {activeSection === 'business' && (
            <Section title="Business">
              <TextFieldEditor label="Business Name" value={content.businessName ?? ''} onChange={(v) => set('businessName', v)} />
              <TextFieldEditor label="Brand Label" value={content.brandLabel ?? ''} onChange={(v) => set('brandLabel', v)} />
            </Section>
          )}

          {activeSection === 'nav' && (
            <Section title="Navigation">
              <NavEditor nav={content.nav ?? { links: [], orderButtonText: '' }} onChange={(v) => set('nav', v)} />
            </Section>
          )}

          {activeSection === 'hero' && (
            <Section title="Hero">
              <TextFieldEditor label="Headline" value={content.hero?.headline ?? ''} onChange={(v) => set('hero.headline', v)} />
              <TextFieldEditor label="Subtitle" value={content.hero?.subtitle ?? ''} onChange={(v) => set('hero.subtitle', v)} />
              <TextFieldEditor label="Categories" value={content.hero?.categories ?? ''} onChange={(v) => set('hero.categories', v)} />
              <TextFieldEditor label="CTA Text" value={content.hero?.ctaText ?? ''} onChange={(v) => set('hero.ctaText', v)} />
              <TextFieldEditor label="CTA Link" value={content.hero?.ctaHref ?? ''} onChange={(v) => set('hero.ctaHref', v)} />
              <ImageFieldEditor label="Pizza Image" value={content.hero?.pizzaImage ?? ''} onChange={(v) => set('hero.pizzaImage', v)} slug={slug} />
              <TextFieldEditor label="Pizza Alt Text" value={content.hero?.pizzaAlt ?? ''} onChange={(v) => set('hero.pizzaAlt', v)} />
              <ImageFieldEditor label="Backdrop Image" value={content.hero?.backdropImage ?? ''} onChange={(v) => set('hero.backdropImage', v)} slug={slug} />
            </Section>
          )}

          {activeSection === 'parallaxBar' && (
            <Section title="Parallax Bar">
              <ImageFieldEditor label="Bar Image" value={content.parallaxBar?.image ?? ''} onChange={(v) => set('parallaxBar.image', v)} slug={slug} />
            </Section>
          )}

          {activeSection === 'story' && (
            <Section title="Our Story">
              <TextFieldEditor label="Section Label" value={content.story?.sectionLabel ?? ''} onChange={(v) => set('story.sectionLabel', v)} />
              <TextAreaEditor label="Story Body" value={content.story?.body ?? ''} onChange={(v) => set('story.body', v)} rows={6} />
              <TextAreaEditor label="Pull Quote" value={content.story?.pullQuote ?? ''} onChange={(v) => set('story.pullQuote', v)} />
              <TextFieldEditor label="Closing Line" value={content.story?.closingLine ?? ''} onChange={(v) => set('story.closingLine', v)} />
              <TextFieldEditor label="Signature" value={content.story?.signature ?? ''} onChange={(v) => set('story.signature', v)} />
              <TextFieldEditor label="Attribution" value={content.story?.attribution ?? ''} onChange={(v) => set('story.attribution', v)} />
            </Section>
          )}

          {activeSection === 'parallaxGrandma' && (
            <Section title="Parallax Grandma">
              <ImageFieldEditor label="Image" value={content.parallaxGrandma?.image ?? ''} onChange={(v) => set('parallaxGrandma.image', v)} slug={slug} />
              <TextFieldEditor label="Headline" value={content.parallaxGrandma?.headline ?? ''} onChange={(v) => set('parallaxGrandma.headline', v)} />
            </Section>
          )}

          {activeSection === 'locations' && (
            <Section title="Locations">
              <TextFieldEditor label="Section Label" value={content.locations?.sectionLabel ?? ''} onChange={(v) => set('locations.sectionLabel', v)} />
              <TextFieldEditor label="Heading" value={content.locations?.heading ?? ''} onChange={(v) => set('locations.heading', v)} />
              <TextFieldEditor label="Button Text" value={content.locations?.buttonText ?? ''} onChange={(v) => set('locations.buttonText', v)} />
              <LocationsEditor
                items={content.locations?.items ?? []}
                onChange={(v) => set('locations.items', v)}
              />
              <div className="mt-8">
                <TextFieldEditor label="FAQ Label" value={content.locations?.faqLabel ?? ''} onChange={(v) => set('locations.faqLabel', v)} />
                <FaqEditor
                  faqs={content.locations?.faqs ?? []}
                  onChange={(v) => set('locations.faqs', v)}
                />
              </div>
            </Section>
          )}

          {activeSection === 'gallery' && (
            <Section title="Gallery">
              <TextFieldEditor label="Section Label" value={content.gallery?.sectionLabel ?? ''} onChange={(v) => set('gallery.sectionLabel', v)} />
              <TextFieldEditor label="Image Alt Text" value={content.gallery?.imageAlt ?? ''} onChange={(v) => set('gallery.imageAlt', v)} />
              <GalleryEditor images={content.gallery?.images ?? []} onChange={(v) => set('gallery.images', v)} slug={slug} />
            </Section>
          )}

          {activeSection === 'menu' && (
            <Section title="Menu">
              <TextFieldEditor label="Section Label" value={content.menu?.sectionLabel ?? ''} onChange={(v) => set('menu.sectionLabel', v)} />
              <TextFieldEditor label="Heading" value={content.menu?.heading ?? ''} onChange={(v) => set('menu.heading', v)} />
              <TextFieldEditor label="Subtitle" value={content.menu?.subtitle ?? ''} onChange={(v) => set('menu.subtitle', v)} />
              <MenuEditor
                styles={content.menu?.styles ?? []}
                onChange={(v) => set('menu.styles', v)}
                slug={slug}
              />
            </Section>
          )}

          {activeSection === 'order' && (
            <Section title="Order Page">
              <OrderEditor order={content.order ?? {}} onChange={(v) => set('order', v)} />
            </Section>
          )}

          {activeSection === 'seo' && (
            <Section title="SEO / Structured Data">
              <SeoEditor seo={content.seo ?? {}} onChange={(v) => set('seo', v)} slug={slug} />
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-200">{title}</h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
