'use client';

import { useEffect, useRef, useState } from 'react';
import contentFallback from '../content';

const OFF_WHITE = '#f5ede0';

function HeadlineContent({ headline }: { headline: string }) {
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
        {headline}
      </h2>
    </>
  );
}

type ParallaxGrandmaProps = {
  parallaxGrandma?: { image: string; headline: string };
};

export default function ParallaxGrandma({ parallaxGrandma }: ParallaxGrandmaProps) {
  const pg = parallaxGrandma ?? contentFallback.parallaxGrandma;
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
        className="relative h-[90vh] w-screen left-0 right-0 overflow-hidden flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={pg.image}
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
        <HeadlineContent headline={pg.headline} />
      </section>
    );
  }

  return (
    <div className="parallax-riveroaks-grandma">
      <HeadlineContent headline={pg.headline} />
    </div>
  );
}
