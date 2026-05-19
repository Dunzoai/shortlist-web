'use client';

import { useEffect, useRef, useState } from 'react';

export default function ParallaxBar() {
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

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        imageRef.current.style.transform = `translateY(${scrollProgress * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative h-[90vh] w-screen left-0 right-0 overflow-hidden"
      >
        <div
          ref={imageRef}
          className="absolute -top-[40%] left-0 w-full h-[150%] bg-cover bg-no-repeat will-change-transform"
          style={{
            backgroundImage: 'url(/clients/riveroaks/riveroaks_bar.png)',
            backgroundPosition: 'center center',
          }}
        />
      </section>
    );
  }

  return <div className="parallax-riveroaks-bar" />;
}
