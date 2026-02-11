import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================================
// TIMING (30fps)
// ============================================================================
const TIMING = {
  HYPNO_DURATION: 150, // 5 seconds of hypno
  CTA_DURATION: 90, // 3 seconds of CTA
};

const TOTAL_FRAMES = TIMING.HYPNO_DURATION + TIMING.CTA_DURATION;

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  gold: "#C4A052",
  ivory: "#FAF8F5",
};

// ============================================================================
// CLASSIC HYPNO SPIRAL - black & white rotating segments
// ============================================================================
const HypnoSpiral: React.FC = () => {
  const frame = useCurrentFrame();

  // Continuous rotation - gets faster
  const speedUp = interpolate(frame, [0, TIMING.HYPNO_DURATION], [1, 2.5]);
  const rotation = frame * 4 * speedUp;

  // Create conic gradient for perfect even segments
  const segments = 12;
  const segmentAngle = 360 / segments;
  const gradientStops = [...Array(segments)]
    .map((_, i) => {
      const color = i % 2 === 0 ? "#e8e4dc" : "#000";
      const start = i * segmentAngle;
      const end = (i + 1) * segmentAngle;
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* The classic hypno wheel using conic gradient */}
      <div
        style={{
          position: "absolute",
          width: 3000,
          height: 3000,
          background: `conic-gradient(from 0deg, ${gradientStops})`,
          transform: `rotate(${rotation}deg)`,
        }}
      />

      {/* Pulsing rings that move outward */}
      {[...Array(6)].map((_, i) => {
        const ringPhase = (frame * 3 + i * 40) % 300;
        const ringSize = ringPhase * 8;
        const ringOpacity = interpolate(ringPhase, [0, 100, 300], [0.8, 0.4, 0]);

        return (
          <div
            key={`ring-${i}`}
            style={{
              position: "absolute",
              width: ringSize,
              height: ringSize,
              border: "4px solid rgba(196, 160, 82, 0.6)",
              borderRadius: "50%",
              opacity: ringOpacity,
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================================================
// SWIRLING EMPANADA - spirals around and GROWS HUGE
// ============================================================================
const SwirlingEmpanada: React.FC = () => {
  const frame = useCurrentFrame();

  // Stay visible a bit longer to overlap with CTA fade in
  if (frame >= TIMING.HYPNO_DURATION + 15) return null;

  // Orbit speed increases over time
  const orbitSpeed = interpolate(frame, [0, TIMING.HYPNO_DURATION], [0.08, 0.25]);
  const orbitAngle = frame * orbitSpeed;

  // Spiral inward - starts wide, comes to center
  const spiralRadius = interpolate(frame, [0, TIMING.HYPNO_DURATION - 20, TIMING.HYPNO_DURATION], [350, 100, 0], {
    extrapolateRight: "clamp",
  });

  // Position on spiral
  const x = Math.cos(orbitAngle * Math.PI * 2) * spiralRadius;
  const y = Math.sin(orbitAngle * Math.PI * 2) * spiralRadius;

  // Self rotation - spins faster and faster
  const spinSpeed = interpolate(frame, [0, TIMING.HYPNO_DURATION], [5, 20]);
  const selfRotation = frame * spinSpeed;

  // Scale grows HUGE - keeps going until it fills the screen
  const scale = interpolate(frame, [0, TIMING.HYPNO_DURATION * 0.5, TIMING.HYPNO_DURATION + 15], [1, 3, 15], {
    extrapolateRight: "clamp",
  });

  // Wobble effect
  const wobble = Math.sin(frame * 0.3) * 10;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translate(${x}px, ${y + wobble}px)`,
        zIndex: 100,
      }}
    >
      <Img
        src={staticFile("empanada.png")}
        style={{
          width: 450,
          height: 450,
          objectFit: "contain",
          transform: `rotate(${selfRotation}deg) scale(${scale})`,
          filter: "drop-shadow(0 0 60px rgba(196, 160, 82, 0.9)) drop-shadow(0 0 120px rgba(196, 160, 82, 0.5))",
        }}
      />
    </div>
  );
};

// ============================================================================
// CTA SCREEN - Hypnotic command
// ============================================================================
const CTAScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const ctaStart = TIMING.HYPNO_DURATION;
  const localFrame = frame - ctaStart;

  if (frame < ctaStart) return null;

  // Fade in
  const fadeIn = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Text appears word by word
  const word1 = interpolate(localFrame, [5, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const word2 = interpolate(localFrame, [12, 19], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const word3 = interpolate(localFrame, [19, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const word4 = interpolate(localFrame, [26, 33], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const word5 = interpolate(localFrame, [33, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle pulse on whole thing
  const pulse = Math.sin(localFrame * 0.1) * 0.02 + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        opacity: fadeIn,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        transform: `scale(${pulse})`,
      }}
    >
      {/* YOU */}
      <span
        style={{
          fontSize: 130,
          fontWeight: 900,
          color: COLORS.ivory,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 0 40px rgba(255,255,255,0.3)",
          letterSpacing: -2,
          opacity: word1,
          transform: `translateY(${interpolate(word1, [0, 1], [20, 0])}px)`,
        }}
      >
        YOU
      </span>

      {/* WILL */}
      <span
        style={{
          fontSize: 130,
          fontWeight: 900,
          color: COLORS.ivory,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 0 40px rgba(255,255,255,0.3)",
          letterSpacing: -2,
          opacity: word2,
          transform: `translateY(${interpolate(word2, [0, 1], [20, 0])}px)`,
        }}
      >
        WILL
      </span>

      {/* ORDER */}
      <span
        style={{
          fontSize: 130,
          fontWeight: 900,
          color: COLORS.gold,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: `0 0 60px ${COLORS.gold}60`,
          letterSpacing: -2,
          opacity: word3,
          transform: `translateY(${interpolate(word3, [0, 1], [20, 0])}px)`,
          marginTop: 20,
        }}
      >
        ORDER
      </span>

      {/* NITO'S */}
      <span
        style={{
          fontSize: 140,
          fontWeight: 900,
          color: COLORS.gold,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: `0 0 60px ${COLORS.gold}60`,
          letterSpacing: -3,
          opacity: word4,
          transform: `translateY(${interpolate(word4, [0, 1], [20, 0])}px)`,
        }}
      >
        NITO'S
      </span>

      {/* EMPANADAS */}
      <span
        style={{
          fontSize: 110,
          fontWeight: 900,
          color: COLORS.gold,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: `0 0 60px ${COLORS.gold}60`,
          letterSpacing: -2,
          opacity: word4,
          transform: `translateY(${interpolate(word4, [0, 1], [20, 0])}px)`,
        }}
      >
        EMPANADAS
      </span>

      {/* FOR THE */}
      <span
        style={{
          fontSize: 60,
          fontWeight: 700,
          color: COLORS.ivory,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 0 30px rgba(255,255,255,0.2)",
          letterSpacing: 6,
          opacity: word5,
          transform: `translateY(${interpolate(word5, [0, 1], [20, 0])}px)`,
          marginTop: 30,
        }}
      >
        FOR THE
      </span>

      {/* SUPER BOWL */}
      <span
        style={{
          fontSize: 100,
          fontWeight: 900,
          color: COLORS.ivory,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 0 40px rgba(255,255,255,0.3)",
          letterSpacing: 2,
          opacity: word5,
          transform: `translateY(${interpolate(word5, [0, 1], [20, 0])}px)`,
        }}
      >
        SUPER BOWL
      </span>
    </AbsoluteFill>
  );
};

// ============================================================================
// FADED LOGO BEHIND SPIRAL
// ============================================================================
const FadedLogo: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame >= TIMING.HYPNO_DURATION) return null;

  // Subtle rotation
  const rotation = frame * 0.5;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        opacity: 0.25,
        zIndex: 5,
        mixBlendMode: "multiply",
      }}
    >
      <Img
        src={staticFile("nitos-logo.avif")}
        style={{
          width: 1600,
          height: 1600,
          objectFit: "contain",
        }}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const NitosHypnoTeaser: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <FadedLogo />
      <HypnoSpiral />
      <SwirlingEmpanada />
      <CTAScreen />
    </AbsoluteFill>
  );
};
