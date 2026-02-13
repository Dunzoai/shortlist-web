import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

// ============================================================================
// TIMING (30fps) - 12 seconds = 360 frames
// ============================================================================
const TOTAL_FRAMES = 360;
const COLLISION_FRAME = 120; // 4 seconds - when hearts and empanadas meet
const EXPLOSION_DURATION = 30; // 1 second explosion
const REVEAL_FRAME = COLLISION_FRAME + EXPLOSION_DURATION;

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  green: "#2D5A3D",
  gold: "#C4A052",
  ivory: "#FAF8F5",
  dark: "#1a1a1a",
  red: "#E53935",
  pink: "#FF6B9D",
  hotPink: "#FF1493",
};

// ============================================================================
// HEART COMPONENT
// ============================================================================
const Heart: React.FC<{
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  color?: string;
}> = ({ x, y, size, rotation, opacity, color = COLORS.red }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        transform: `rotate(${rotation}deg)`,
        fontSize: size,
        lineHeight: 1,
        color: color,
        textShadow: `0 4px 20px ${color}80`,
      }}
    >
      ❤️
    </div>
  );
};

// ============================================================================
// FLYING HEARTS FROM LEFT (WIFE'S SIDE)
// ============================================================================
const FlyingHearts: React.FC = () => {
  const frame = useCurrentFrame();

  // Generate multiple hearts with different timings
  const hearts = Array.from({ length: 8 }, (_, i) => {
    const startFrame = i * 12; // Stagger starts
    const localFrame = frame - startFrame;

    if (localFrame < 0 || frame > COLLISION_FRAME) return null;

    // Start position - from left window area (wife)
    const startX = 180;
    const startY = 500 + (i % 3) * 80;

    // End position - center of screen
    const endX = 540;
    const endY = 960;

    // Progress towards center
    const progress = interpolate(localFrame, [0, 80], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Arc trajectory
    const x = interpolate(progress, [0, 1], [startX, endX]);
    const arcHeight = Math.sin(progress * Math.PI) * -200;
    const y = interpolate(progress, [0, 1], [startY, endY]) + arcHeight;

    // Size grows slightly as it approaches
    const size = interpolate(progress, [0, 1], [60, 100]);

    // Rotation
    const rotation = localFrame * 3 + i * 45;

    // Fade in at start
    const opacity = interpolate(localFrame, [0, 15], [0, 1], {
      extrapolateRight: "clamp",
    });

    // Alternate colors
    const colors = [COLORS.red, COLORS.pink, COLORS.hotPink];

    return (
      <Heart
        key={i}
        x={x}
        y={y}
        size={size}
        rotation={rotation}
        opacity={opacity}
        color={colors[i % 3]}
      />
    );
  });

  return <>{hearts}</>;
};

// ============================================================================
// FLYING EMPANADAS FROM RIGHT (DAMIAN'S SIDE)
// ============================================================================
const FlyingEmpanadas: React.FC = () => {
  const frame = useCurrentFrame();

  // Generate multiple empanadas with different timings
  const empanadas = Array.from({ length: 6 }, (_, i) => {
    const startFrame = i * 15; // Stagger starts
    const localFrame = frame - startFrame;

    if (localFrame < 0 || frame > COLLISION_FRAME) return null;

    // Start position - from right window area (Damian)
    const startX = 900;
    const startY = 500 + (i % 3) * 80;

    // End position - center of screen
    const endX = 540;
    const endY = 960;

    // Progress towards center
    const progress = interpolate(localFrame, [0, 80], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Arc trajectory
    const x = interpolate(progress, [0, 1], [startX, endX]);
    const arcHeight = Math.sin(progress * Math.PI) * -200;
    const y = interpolate(progress, [0, 1], [startY, endY]) + arcHeight;

    // Size grows slightly as it approaches
    const size = interpolate(progress, [0, 1], [80, 140]);

    // Spin rotation
    const rotation = localFrame * -5 + i * 60;

    // Fade in at start
    const opacity = interpolate(localFrame, [0, 15], [0, 1], {
      extrapolateRight: "clamp",
    });

    return (
      <Img
        key={i}
        src={staticFile("empanada.png")}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          objectFit: "contain",
          opacity,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
        }}
      />
    );
  });

  return <>{empanadas}</>;
};

// ============================================================================
// COLLISION EXPLOSION
// ============================================================================
const CollisionExplosion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < COLLISION_FRAME || frame > COLLISION_FRAME + 60) return null;

  const localFrame = frame - COLLISION_FRAME;

  // Explosion scale
  const explosionScale = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 10,
      stiffness: 80,
    },
  });

  // Flash opacity
  const flashOpacity = interpolate(localFrame, [0, 5, 15], [0, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Particle burst
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const distance = interpolate(localFrame, [0, 30], [0, 600], {
      extrapolateRight: "clamp",
    });
    const x = 540 + Math.cos(angle) * distance;
    const y = 960 + Math.sin(angle) * distance;
    const opacity = interpolate(localFrame, [0, 10, 30], [0, 1, 0], {
      extrapolateRight: "clamp",
    });
    const size = interpolate(localFrame, [0, 30], [40, 10], {
      extrapolateRight: "clamp",
    });

    // Alternate between hearts and mini empanadas
    const isHeart = i % 2 === 0;

    return isHeart ? (
      <Heart
        key={i}
        x={x}
        y={y}
        size={size}
        rotation={localFrame * 10 + i * 30}
        opacity={opacity}
        color={i % 4 === 0 ? COLORS.red : COLORS.pink}
      />
    ) : (
      <Img
        key={i}
        src={staticFile("empanada.png")}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          objectFit: "contain",
          opacity,
          transform: `translate(-50%, -50%) rotate(${localFrame * 15 + i * 45}deg)`,
        }}
      />
    );
  });

  return (
    <>
      {/* White/gold flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.gold,
          opacity: flashOpacity,
          zIndex: 100,
        }}
      />

      {/* Radial burst */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 960,
          width: 400 * explosionScale,
          height: 400 * explosionScale,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.gold}80 0%, ${COLORS.red}40 50%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          opacity: interpolate(localFrame, [0, 30], [1, 0]),
          zIndex: 90,
        }}
      />

      {/* Particles */}
      {particles}
    </>
  );
};

// ============================================================================
// REVEAL MESSAGE
// ============================================================================
const RevealMessage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < REVEAL_FRAME) return null;

  const localFrame = frame - REVEAL_FRAME;

  // Scale spring
  const scale = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  // Gentle pulse
  const pulse = 1 + Math.sin(localFrame * 0.1) * 0.03;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${scale * pulse})`,
        textAlign: "center",
        zIndex: 150,
      }}
    >
      {/* Background card */}
      <div
        style={{
          backgroundColor: COLORS.dark,
          borderRadius: 30,
          padding: "60px 80px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 100px ${COLORS.red}40`,
          border: `4px solid ${COLORS.gold}`,
        }}
      >
        {/* Heart emoji above */}
        <div style={{ fontSize: 80, marginBottom: 20 }}>💕</div>

        {/* Main text */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.ivory,
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          LOVE AT
          <br />
          <span style={{ color: COLORS.gold }}>FIRST BITE</span>
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 36,
            color: COLORS.red,
            fontWeight: 700,
            marginTop: 20,
          }}
        >
          Happy Valentine's Day
        </div>

        {/* Empanada + heart */}
        <div style={{ marginTop: 30, fontSize: 60 }}>
          🥟 ❤️ 🥟
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FLOATING HEARTS BACKGROUND (after reveal)
// ============================================================================
const FloatingHeartsBackground: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < REVEAL_FRAME) return null;

  const localFrame = frame - REVEAL_FRAME;
  const opacity = interpolate(localFrame, [0, 30], [0, 0.3], {
    extrapolateRight: "clamp",
  });

  const hearts = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 137) % 1080;
    const baseY = 1920 + 100;
    const speed = 2 + (i % 3);
    const y = baseY - (localFrame * speed) - (i * 100);
    const size = 30 + (i % 4) * 15;
    const rotation = localFrame * (i % 2 === 0 ? 1 : -1) + i * 20;

    if (y < -100) return null;

    return (
      <Heart
        key={i}
        x={x}
        y={y % 2200}
        size={size}
        rotation={rotation}
        opacity={0.6}
        color={i % 3 === 0 ? COLORS.pink : i % 3 === 1 ? COLORS.red : COLORS.hotPink}
      />
    );
  });

  return <div style={{ opacity }}>{hearts}</div>;
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const NitosVday: React.FC = () => {
  const frame = useCurrentFrame();

  // Dim the background image during/after explosion
  const bgDim = frame > COLLISION_FRAME
    ? interpolate(frame, [COLLISION_FRAME, REVEAL_FRAME], [1, 0.3], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* Background image - NITOS-VDAY.png */}
      <Img
        src={staticFile("nitos-gallery/NITOS-VDAY.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: bgDim,
        }}
      />

      {/* Floating hearts background (after reveal) */}
      <FloatingHeartsBackground />

      {/* Flying hearts from left (wife) */}
      <FlyingHearts />

      {/* Flying empanadas from right (Damian) */}
      <FlyingEmpanadas />

      {/* Collision explosion */}
      <CollisionExplosion />

      {/* Reveal message */}
      <RevealMessage />
    </AbsoluteFill>
  );
};
