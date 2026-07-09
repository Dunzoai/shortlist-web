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
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  // Follow cursor within a radius when behavior is 'follow'
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
      const maxDist = 200;
      if (dist < maxDist) {
        const factor = 0.15;
        setMouseOffset({ x: dx * factor, y: dy * factor });
      } else {
        setMouseOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [behavior]);

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    cursor: 'pointer',
    transition: 'transform 0.3s ease, filter 0.3s ease',
    filter: hovered ? 'drop-shadow(0 8px 16px rgba(142,182,217,0.4))' : 'none',
    ...style,
  };

  let animStyle: React.CSSProperties = {};
  let animClass = '';

  if (behavior === 'wobble') {
    animStyle = {
      animation: 'cloud-idle 3s ease-in-out infinite',
      transform: hovered ? 'rotate(-8deg) scale(1.15)' : undefined,
    };
  } else if (behavior === 'float') {
    animStyle = {
      animation: 'cloud-float 4s ease-in-out infinite',
      transform: hovered ? 'scale(1.2) translateY(-8px)' : undefined,
    };
  } else if (behavior === 'follow') {
    animStyle = {
      transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px) ${hovered ? 'scale(1.15)' : ''}`,
      animation: hovered ? undefined : 'cloud-idle 3s ease-in-out infinite',
    };
  } else if (behavior === 'peek') {
    animStyle = {
      animation: 'cloud-peek 5s ease-in-out infinite',
      transform: hovered ? 'translateX(0) scale(1.1)' : undefined,
    };
  }

  return (
    <>
      <style>{`
        @keyframes cloud-idle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes cloud-float {
          0%, 100% { transform: translateY(0); }
          33% { transform: translateY(-10px) translateX(4px); }
          66% { transform: translateY(-4px) translateX(-4px); }
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
