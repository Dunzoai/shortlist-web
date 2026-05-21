'use client';

import { useEditMode } from '../EditModeContext';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';

const BG = '#0a0807';
const GOLD = '#c9a96e';
const OFF_WHITE = '#f5ede0';

/**
 * Hero section for edit mode.
 * Pizza shown static (no rotation) so images are easily tappable.
 * Text uses popup mode because it's layered over imagery.
 */
export default function HeroEdit() {
  const { content } = useEditMode();
  const hero = content.hero ?? {};

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: BG }}>
      {/* Backdrop */}
      <EditableImage path="hero.backdropImage" className="absolute inset-0 z-0">
        {hero.backdropImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.backdropImage} alt="" className="w-full h-full object-cover opacity-15 blur-sm" />
        )}
      </EditableImage>

      {/* Vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,8,7,0.7) 100%)' }} />

      {/* Pizza + text */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Pizza image — static, editable */}
        <EditableImage path="hero.pizzaImage" className="relative w-[80vw] h-[80vw] md:w-[55vh] md:h-[55vh] rounded-full overflow-hidden">
          {hero.pizzaImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.pizzaImage} alt={hero.pizzaAlt || ''} className="w-full h-full object-cover" />
          )}
        </EditableImage>

        {/* Text block */}
        <div className="mt-6 flex flex-col items-center text-center z-20">
          <EditableText
            path="hero.subtitle"
            as="p"
            mode="popup"
            label="Hero Subtitle"
            className="font-serif italic text-xs md:text-base tracking-wide mb-1"
            style={{ color: OFF_WHITE, fontFamily: 'var(--font-lora)' }}
          />
          <EditableText
            path="hero.headline"
            as="h1"
            mode="popup"
            label="Hero Headline"
            className="font-black italic text-center leading-[0.9] tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)', color: OFF_WHITE, fontSize: 'clamp(36px, 8vw, 56px)' }}
          />
          <EditableText
            path="hero.categories"
            as="p"
            mode="popup"
            label="Categories"
            className="mt-3 text-xs md:text-sm uppercase tracking-[0.25em] font-normal"
            style={{ color: GOLD, fontFamily: 'var(--font-lora)' }}
          />
        </div>

        {/* CTA */}
        <div className="mt-6 z-20">
          <EditableText
            path="hero.ctaText"
            as="span"
            mode="popup"
            label="CTA Button Text"
            className="inline-block px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.18em] font-normal"
            style={{ fontFamily: 'var(--font-lora)', color: GOLD, border: `1px solid ${GOLD}` }}
          />
        </div>
      </div>
    </section>
  );
}
