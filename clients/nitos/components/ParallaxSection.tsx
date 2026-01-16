'use client';

import { useEffect, useRef, useState } from 'react';

interface ParallaxSectionProps {
  imageSrc: string;
  height?: string;
}

export function ParallaxSection({ imageSrc, height = '350px' }: ParallaxSectionProps) {
  // Larger height on desktop
  const desktopHeight = '500px';
  const [isMobile, setIsMobile] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (!imageRef.current || !sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = -rect.top;

      // Only apply effect when section is in view
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        imageRef.current.style.transform = `translateY(${scrollProgress * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Mobile: Use JavaScript-based parallax (background-attachment: fixed doesn't work on mobile)
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{
          height,
          boxShadow: 'inset 0 8px 16px -4px rgba(0,0,0,0.3), inset 0 -8px 16px -4px rgba(0,0,0,0.3)',
        }}
      >
        <div
          ref={imageRef}
          className="absolute -top-[40%] left-0 w-full h-[180%] bg-cover bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: 'center center',
            filter: 'brightness(0.85) saturate(0.9)',
          }}
        />
        {/* Green overlay */}
        <div className="absolute inset-0 bg-[#2D5A3D]/20" />
      </section>
    );
  }

  // Desktop: Use CSS parallax (background-attachment: fixed works here)
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: desktopHeight,
        boxShadow: 'inset 0 12px 24px -6px rgba(0,0,0,0.35), inset 0 -12px 24px -6px rgba(0,0,0,0.35)',
      }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.85) saturate(0.9)',
        }}
      />
      {/* Green overlay */}
      <div className="absolute inset-0 bg-[#2D5A3D]/20" />
    </div>
  );
}
