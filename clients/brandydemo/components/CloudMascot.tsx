'use client';

import { useState, useEffect, useRef } from 'react';

type Behavior = 'wobble' | 'float' | 'follow' | 'peek';

type CloudMascotProps = {
  size?: number;
  behavior?: Behavior;
  style?: React.CSSProperties;
  className?: string;
};

export default function CloudMascot({
  size = 80,
  behavior = 'wobble',
  style,
  className,
}: CloudMascotProps) {
  const [hovered, setHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  // Smooth follow with lerp — stickier, more responsive, longer trail
  useEffect(() => {
    if (behavior !== 'follow') return;

    const handleMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 600; // much larger follow radius
      if (dist < maxDist) {
        const factor = 0.35; // stronger pull
        targetOffset.current = { x: dx * factor, y: dy * factor };
      } else {
        // Slow drift back instead of snap
        targetOffset.current = { x: 0, y: 0 };
      }
    };

    // Lerp animation loop for smooth sticky movement
    const animate = () => {
      const lerp = 0.06; // lower = stickier / more trailing
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * lerp;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * lerp;
      setOffset({ x: currentOffset.current.x, y: currentOffset.current.y });
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [behavior]);

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    cursor: 'pointer',
    transition: 'filter 0.3s ease',
    filter: hovered ? 'drop-shadow(0 12px 24px rgba(142,182,217,0.5))' : 'none',
    ...style,
  };

  let animStyle: React.CSSProperties = {};

  if (behavior === 'wobble') {
    animStyle = {
      animation: 'cloud-idle 3s ease-in-out infinite',
      transform: hovered ? 'rotate(-12deg) scale(1.2)' : undefined,
      transition: 'transform 0.4s ease, filter 0.3s ease',
    };
  } else if (behavior === 'float') {
    animStyle = {
      animation: 'cloud-float 4s ease-in-out infinite',
      transform: hovered ? 'scale(1.25) translateY(-12px)' : undefined,
      transition: 'transform 0.4s ease, filter 0.3s ease',
    };
  } else if (behavior === 'follow') {
    animStyle = {
      transform: `translate(${offset.x}px, ${offset.y}px) ${hovered ? 'scale(1.15) rotate(-5deg)' : ''}`,
      transition: hovered ? 'filter 0.3s ease' : 'filter 0.3s ease',
    };
  } else if (behavior === 'peek') {
    animStyle = {
      animation: 'cloud-peek 5s ease-in-out infinite',
      transform: hovered ? 'translateX(0) scale(1.15)' : undefined,
      transition: 'transform 0.4s ease, filter 0.3s ease',
    };
  }

  return (
    <>
      <style>{`
        @keyframes cloud-idle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes cloud-float {
          0%, 100% { transform: translateY(0); }
          33% { transform: translateY(-16px) translateX(6px); }
          66% { transform: translateY(-6px) translateX(-6px); }
        }
        @keyframes cloud-peek {
          0%, 80%, 100% { transform: translateX(-60%) rotate(-5deg); opacity: 0.6; }
          30%, 60% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
      `}</style>
      <div
        ref={ref}
        className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ ...baseStyle, ...animStyle, display: 'inline-block' }}
      >
        <img
          src="/clients/brandydemo/cloud-mascot.png"
          alt="Sunday cloud"
          style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
          draggable={false}
        />
      </div>
    </>
  );
}
