'use client';

import { useEditMode } from '../EditModeContext';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';

const OFF_WHITE = '#f5ede0';

/** Parallax grandma — image + headline overlay, shown static in editor. */
export default function ParallaxGrandmaEdit() {
  const { content } = useEditMode();

  return (
    <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
      <EditableImage path="parallaxGrandma.image" className="absolute inset-0">
        {content.parallaxGrandma?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.parallaxGrandma.image} alt="" className="w-full h-full object-cover" />
        )}
      </EditableImage>
      <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(10,8,7,0.45)' }} />
      <EditableText
        path="parallaxGrandma.headline"
        as="h2"
        mode="popup"
        label="Parallax Headline"
        className="relative z-20 italic font-black text-center leading-tight tracking-tight px-6"
        style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: 'clamp(36px, 7vw, 64px)', textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}
      />
    </section>
  );
}
