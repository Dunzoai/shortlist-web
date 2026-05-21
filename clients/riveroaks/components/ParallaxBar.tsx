'use client';

import { useEffect, useRef, useState } from 'react';
import content from '../content';

export default function ParallaxBar() {
  const [isMobile, setIsMobile] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!imageRef.current || !sectionRef.current) {
            ticking = false;
            return;
          }
          const rect = sectionRef.current.getBoundingClientRect();
          const scrollProgress = -rect.top;
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            imageRef.current.style.transform = `translate3d(0, ${scrollProgress * 0.3}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={content.parallaxBar.image}
          alt=""
          loading="eager"
          decoding="async"
          className="absolute -top-[40%] left-0 w-full h-[150%] object-cover"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        />
      </section>
    );
  }

  return <div className="parallax-riveroaks-bar" />;
}
