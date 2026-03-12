import {
  AbsoluteFill,
  Img,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================================
// TIMING (30fps) - 30 seconds = 900 frames
// ============================================================================
const TIMING = {
  // Video plays from start
  VIDEO_START: 0,

  // Text overlays appear
  LOGO_FADE_IN: 15,
  CTA_START: 450, // 15 seconds in - midway through video

  // End card
  END_CARD_START: 750, // 25 seconds
};

// ============================================================================
// COLORS - Nito's brand
// ============================================================================
const COLORS = {
  green: "#2D5A3D",
  gold: "#C4A052",
  ivory: "#FAF8F5",
  dark: "#1a1a1a",
};

// ============================================================================
// VIDEO BACKGROUND LAYER
// ============================================================================
const VideoBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle zoom effect over time (30 seconds = 900 frames)
  const scale = interpolate(frame, [0, 900], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <Video
      src={staticFile("nitos-gallery/Order Empanadas.mov")}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale})`,
      }}
    />
  );
};

// ============================================================================
// LOGO OVERLAY - Top of screen
// ============================================================================
const LogoOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame: Math.max(0, frame - TIMING.LOGO_FADE_IN),
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const opacity = interpolate(fadeIn, [0, 1], [0, 1]);
  const y = interpolate(fadeIn, [0, 1], [-30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <Img
        src={staticFile("nitos-logo.avif")}
        style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          border: `4px solid ${COLORS.gold}`,
        }}
      />
    </div>
  );
};

// ============================================================================
// CTA OVERLAY - "Order Now" pops in
// ============================================================================
const CTAOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < TIMING.CTA_START) return null;

  const localFrame = frame - TIMING.CTA_START;

  // Scale bounce in
  const scaleSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // Gentle pulse after settled
  const pulse = localFrame > 20 ? 1 + Math.sin(localFrame * 0.1) * 0.03 : 1;

  const scale = interpolate(scaleSpring, [0, 1], [0.3, 1]) * pulse;
  const opacity = interpolate(scaleSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Glass card background */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(10px)",
          borderRadius: 30,
          padding: "40px 60px",
          border: `3px solid ${COLORS.gold}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Main CTA text */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.ivory,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          ORDER
          <br />
          <span style={{ color: COLORS.gold }}>EMPANADAS</span>
        </div>

        {/* Arrow indicator */}
        <div
          style={{
            marginTop: 25,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 48,
              animation: "bounce 1s infinite",
            }}
          >
            👇
          </div>
        </div>

        {/* Link in bio hint */}
        <div
          style={{
            marginTop: 15,
            fontSize: 28,
            color: COLORS.gold,
            fontWeight: 600,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Tap link in bio
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FLOATING EMPANADA ACCENTS
// ============================================================================
const FloatingEmpanadas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const empanadas = [
    { x: -60, y: 400, size: 200, delay: 60, speed: 0.06 },
    { x: 940, y: 600, size: 180, delay: 90, speed: 0.07 },
    { x: -40, y: 1200, size: 160, delay: 120, speed: 0.08 },
    { x: 920, y: 1400, size: 190, delay: 100, speed: 0.065 },
  ];

  return (
    <>
      {empanadas.map((emp, i) => {
        const fadeIn = spring({
          frame: Math.max(0, frame - emp.delay),
          fps,
          config: { damping: 15, stiffness: 100 },
        });

        const floatY = Math.sin(frame * emp.speed) * 15;
        const floatX = Math.cos(frame * emp.speed * 0.7) * 8;
        const rotation = Math.sin(frame * emp.speed * 0.5) * 5;

        return (
          <Img
            key={i}
            src={staticFile("empanada.png")}
            style={{
              position: "absolute",
              left: emp.x,
              top: emp.y,
              width: emp.size,
              height: emp.size,
              objectFit: "contain",
              opacity: fadeIn * 0.9,
              transform: `
                translateY(${floatY}px)
                translateX(${floatX}px)
                rotate(${rotation}deg)
                scale(${interpolate(fadeIn, [0, 1], [0.5, 1])})
              `,
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
            }}
          />
        );
      })}
    </>
  );
};

// ============================================================================
// VIGNETTE OVERLAY - Darkens edges for text readability
// ============================================================================
const VignetteOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%),
          linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.7) 100%)
        `,
        pointerEvents: "none",
      }}
    />
  );
};

// ============================================================================
// POWERED BY SHORTLIST FOOTER
// ============================================================================
const PoweredByFooter: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in with CTA, fade out near end
  const fadeIn = interpolate(frame, [TIMING.CTA_START, TIMING.CTA_START + 30], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [850, 900], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 22,
          color: "rgba(250, 248, 245, 0.7)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 500,
          letterSpacing: 1,
        }}
      >
        Powered by Shortlist SmartAssistant
      </div>
      <Img
        src={staticFile("shortlist-logo-ivory-transparent.png")}
        style={{
          height: 45,
          objectFit: "contain",
          opacity: 0.8,
        }}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const NitosOrderPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* Base video layer */}
      <VideoBackground />

      {/* Vignette for better text contrast */}
      <VignetteOverlay />

      {/* Floating empanada accents */}
      <FloatingEmpanadas />

      {/* Logo at top */}
      <LogoOverlay />

      {/* CTA overlay */}
      <CTAOverlay />

      {/* Footer */}
      <PoweredByFooter />
    </AbsoluteFill>
  );
};
