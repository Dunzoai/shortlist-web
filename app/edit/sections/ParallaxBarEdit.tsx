'use client';

import { useEditMode } from '../EditModeContext';
import EditableImage from '../components/EditableImage';

/** Parallax bar — just a full-width image, shown static in editor. */
export default function ParallaxBarEdit() {
  const { content } = useEditMode();

  return (
    <section className="relative h-[50vh] w-full overflow-hidden">
      <EditableImage path="parallaxBar.image" className="w-full h-full">
        {content.parallaxBar?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.parallaxBar.image} alt="" className="w-full h-full object-cover" />
        )}
      </EditableImage>
    </section>
  );
}
