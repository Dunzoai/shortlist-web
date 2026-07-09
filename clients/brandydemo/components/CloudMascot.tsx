'use client';

import { useState, useEffect, useRef } from 'react';

type Behavior = 'wobble' | 'float' | 'follow' | 'peek';

type CloudMascotProps = {
  size?: number;
  /** Size on mobile — defaults to size * 0.4 */
  mobileSize?: number;
  behavior?: Behavior;
  /** Override style on mobile to reposition so it doesn't cover photos/copy */
  mobileStyle?: React.CSSProperties;
  /** If true, hide entirely on mobile */
  hideOnMobile?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export default function CloudMascot({
  size = 80,
  mobileSize,
  behavior = 'wobble',
  mobileStyle,
  hideOnMobile = false,
  style,
  className,
}: CloudMascotProps) {
  const [hovered, setHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // On mobile, follow → float (no cursor to follow)
  const activeBehavior: Behavior = isMobile && behavior === 'follow' ? 'float' : behavior;
  const activeSize = isMobile ? (mobileSize ?? Math.round(size * 0.4)) : size;

  // Smooth follow with lerp — desktop only
  useEffect(() => {
    if (activeBehavior !== 'follow' || isMobile) return;

    const handleMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 600;
      if (dist < maxDist) {
        targetOffset.current = { x: dx * 0.35, y: dy * 0.35 };
      } else {
        targetOffset.current = { x: 0, y: 0 };
      }
    };

    const animate = () => {
      const lerp = 0.06;
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
  }, [activeBehavior, isMobile]);

  if (isMobile && hideOnMobile) return null;

  const mergedStyle: React.CSSProperties = {
    ...(style || {}),
    ...(isMobile && mobileStyle ? mobileStyle : {}),
  };

  const baseStyle: React.CSSProperties = {
    width: activeSize,
    height: activeSize,
    cursor: 'pointer',
    transition: 'filter 0.3s ease',
    filter: hovered ? 'drop-shadow(0 12px 24px rgba(142,182,217,0.5))' : 'none',
    ...mergedStyle,
  };

  let animStyle: React.CSSProperties = {};

  if (activeBehavior === 'wobble') {
    animStyle = {
      animation: 'cloud-idle 3s ease-in-out infinite',
      transform: hovered ? 'rotate(-12deg) scale(1.2)' : undefined,
      transition: 'transform 0.4s ease, filter 0.3s ease',
    };
  } else if (activeBehavior === 'float') {
    animStyle = {
      animation: 'cloud-float 4s ease-in-out infinite',
      transform: hovered ? 'scale(1.25) translateY(-12px)' : undefined,
      transition: 'transform 0.4s ease, filter 0.3s ease',
    };
  } else if (activeBehavior === 'follow') {
    animStyle = {
      transform: `translate(${offset.x}px, ${offset.y}px) ${hovered ? 'scale(1.15) rotate(-5deg)' : ''}`,
      transition: hovered ? 'filter 0.3s ease' : 'filter 0.3s ease',
    };
  } else if (activeBehavior === 'peek') {
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
