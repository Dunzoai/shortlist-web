'use client';

interface ParallaxSectionProps {
  imageSrc: string;
  height?: string;
}

export function ParallaxSection({ imageSrc, height = '350px' }: ParallaxSectionProps) {
  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundAttachment: 'fixed',
        height,
      }}
    />
  );
}
