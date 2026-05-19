'use client';

import { useEffect, useRef, useState } from 'react';

const OFF_WHITE = '#f5ede0';

function HeadlineContent() {
  return (
    <>
      <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(10,8,7,0.45)' }} />
      <h2
        className="relative z-20 italic font-black text-center leading-tight tracking-tight px-6"
        style={{
          fontFamily: 'var(--font-playfair)',
          color: OFF_WHITE,
          fontSize: 'clamp(36px, 7vw, 64px)',
          textShadow: '0 4px 24px rgba(0,0,0,0.7)',
        }}
      >
        Home of the Grandma Pizza
      </h2>
    </>
  );
}

export default function ParallaxGrandma() {
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
        className="relative h-[90vh] w-screen left-0 right-0 overflow-hidden flex items-center justify-center"
      >
        <div
          ref={imageRef}
          className="absolute -top-[40%] left-0 w-full h-[150%] bg-cover bg-no-repeat will-change-transform"
          style={{
            backgroundImage: 'url(/clients/riveroaks/grandma-pizza.jpg)',
            backgroundPosition: 'center center',
          }}
        />
        <HeadlineContent />
      </section>
    );
  }

  return (
    <div className="parallax-riveroaks-grandma">
      <HeadlineContent />
    </div>
  );
}
