'use client';

import EditableText from '../components/EditableText';

const BG = '#f5ede0';
const TEXT = '#1a1410';
const GOLD = '#c9a96e';

/** Our Story section — all static text, so everything is inline contentEditable. */
export default function StoryEdit() {
  return (
    <section id="our-story" className="py-24 md:py-32 px-6" style={{ backgroundColor: BG }}>
      <div className="max-w-[700px] mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
          <EditableText
            path="story.sectionLabel"
            as="p"
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          />
          <div className="h-px w-12" style={{ backgroundColor: GOLD }} />
        </div>

        <EditableText
          path="story.body"
          as="p"
          mode="popup"
          multiline
          label="Story Body"
          className="text-lg leading-relaxed"
          style={{ color: TEXT, fontFamily: 'var(--font-lora)' }}
        />

        <EditableText
          path="story.pullQuote"
          as="p"
          className="mt-8 italic text-center leading-snug"
          style={{ fontFamily: 'var(--font-playfair)', color: TEXT, fontSize: 'clamp(18px, 3vw, 22px)' }}
        />

        <EditableText
          path="story.closingLine"
          as="p"
          className="mt-4 text-lg font-bold text-center"
          style={{ color: TEXT, fontFamily: 'var(--font-lora)' }}
        />

        <EditableText
          path="story.signature"
          as="p"
          className="mt-12 text-center"
          style={{ fontFamily: 'var(--font-caveat)', color: TEXT, fontSize: 'clamp(28px, 5vw, 36px)' }}
        />

        <EditableText
          path="story.attribution"
          as="p"
          className="mt-2 text-sm text-center uppercase tracking-[0.25em]"
          style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
        />
      </div>
    </section>
  );
}
