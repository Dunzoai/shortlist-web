import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================================
// TIMING (30fps)
// ============================================================================
const TIMING = {
  HOOK_END: 0, // No hook - start directly with content
  SCENE_DURATION: 50,
};

const CONTENT_SCENES = [
  { image: "nitos-gallery/nitos-gallery-1.png", lines: ["THEY BROUGHT", "PIZZA"], style: "glitch" },
  { image: "nitos-gallery/nitos-gallery-2.png", lines: ["YOU BROUGHT", "EMPANADAS"], style: "hero" },
  { image: "nitos-gallery/nitos-gallery-3.png", lines: ["GUESS WHO'S", "THE MVP"], style: "trophy" },
  { image: "nitos-gallery/nitos-gallery-4.png", lines: ["BUY 10", "GET 2 FREE"], style: "deal" },
  { image: "nitos-gallery/nitos-gallery-5.png", lines: ["PICKUP AT", "CLEAR POND"], style: "location" },
  { image: "nitos-gallery/nitos-gallery-6.png", lines: ["TAP THE", "LINK"], style: "cta" },
];

const TOTAL_DURATION = TIMING.HOOK_END + CONTENT_SCENES.length * TIMING.SCENE_DURATION + 30;

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  green: "#2D5A3D",
  gold: "#C4A052",
  ivory: "#FAF8F5",
  dark: "#1a1a1a",
};

// ============================================================================
// FLICKER REVEAL HOOK
// ============================================================================
const FlickerRevealHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame >= TIMING.HOOK_END + 5) return null;

  const boomFrame = 28; // When the full reveal happens

  // Flicker pattern - starts slow, gets faster
  const getFlickerState = (f: number): boolean => {
    if (f < 3) return false; // Pure black start
    if (f >= boomFrame) return true; // Full reveal after boom

    // Flicker frequency increases exponentially
    const progress = f / boomFrame;
    const frequency = 1 + progress * progress * 12; // Faster ramp for shorter duration
    const flickerValue = Math.sin(f * frequency);

    // Early: mostly black with brief flashes
    // Late: mostly visible with brief black
    const threshold = interpolate(progress, [0, 0.6, 1], [0.8, 0.2, -1]);

    return flickerValue > threshold;
  };

  const showImage = getFlickerState(frame);
  const isBoom = frame >= boomFrame;

  // After boom: zoom in aggressively like empanada coming at your face
  const postBoomFrames = frame - boomFrame;
  const zoomToFace = isBoom
    ? interpolate(postBoomFrames, [0, TIMING.HOOK_END - boomFrame], [1, 4], {
        extrapolateRight: "clamp",
        easing: (t) => t * t, // Accelerate into face
      })
    : 1;

  // Fade out at end
  const fadeOut = interpolate(frame, [TIMING.HOOK_END - 3, TIMING.HOOK_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash white on boom
  const boomFlash =
    isBoom && postBoomFrames < 3
      ? interpolate(postBoomFrames, [0, 3], [1, 0], { extrapolateRight: "clamp" })
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      {/* The empanada tower image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: showImage ? 1 : 0,
          transform: `scale(${zoomToFace})`,
          transformOrigin: "center 70%", // Zoom toward the empanadas
        }}
      >
        <Img
          src={staticFile("empanada-tower.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      {/* Boom flash overlay */}
      {boomFlash > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#fff",
            opacity: boomFlash,
          }}
        />
      )}

      {/* Scanlines for grit during flicker */}
      {!isBoom && showImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />
      )}

      {/* "2 DAYS LEFT" text during BLACK flickers - huge subliminal text */}
      {!showImage && !isBoom && frame > 3 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 220,
              fontWeight: 900,
              color: COLORS.gold,
              fontFamily: "system-ui, -apple-system, sans-serif",
              textShadow: `0 0 80px ${COLORS.gold}`,
              letterSpacing: -8,
              lineHeight: 0.9,
            }}
          >
            2 DAYS
          </span>
          <span
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: COLORS.ivory,
              fontFamily: "system-ui, -apple-system, sans-serif",
              textShadow: "0 0 60px rgba(255,255,255,0.5)",
              letterSpacing: -4,
              lineHeight: 0.9,
            }}
          >
            LEFT
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// GLITCH TEXT COMPONENT
// ============================================================================
const GlitchText: React.FC<{
  text: string;
  glitchProgress: number; // 0 = normal, 1 = fully glitched
  fontSize: number;
}> = ({ text, glitchProgress, fontSize }) => {
  const frame = useCurrentFrame();

  if (glitchProgress <= 0) {
    return (
      <span
        style={{
          fontSize,
          fontWeight: 900,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 6px 30px rgba(0,0,0,0.8)",
          letterSpacing: -3,
        }}
      >
        {text}
      </span>
    );
  }

  // Glitch intensity ramps up
  const intensity = Math.min(1, glitchProgress * 1.5);

  // RGB split offsets
  const rgbOffset = intensity * 15;

  // Horizontal displacement for slices
  const sliceCount = 6;
  const slices = Array.from({ length: sliceCount }, (_, i) => {
    const sliceHeight = 100 / sliceCount;
    const top = i * sliceHeight;
    const displacement =
      Math.sin(frame * 0.8 + i * 2.5) * intensity * 40 +
      Math.cos(frame * 1.2 + i * 1.8) * intensity * 20;
    return { top, height: sliceHeight, displacement };
  });

  // Flicker
  const flicker = Math.sin(frame * 2.5) > 0.3 ? 1 : 0.7;

  // Scale distortion
  const scaleX = 1 + Math.sin(frame * 0.6) * intensity * 0.3;

  // Final fade out
  const fadeOut = glitchProgress > 0.7 ? interpolate(glitchProgress, [0.7, 1], [1, 0]) : 1;

  return (
    <div
      style={{
        position: "relative",
        opacity: fadeOut * flicker,
        transform: `scaleX(${scaleX})`,
      }}
    >
      {/* Base layer with slices */}
      <div style={{ position: "relative" }}>
        {slices.map((slice, i) => (
          <div
            key={i}
            style={{
              position: i === 0 ? "relative" : "absolute",
              top: i === 0 ? 0 : `${slice.top}%`,
              left: 0,
              right: 0,
              height: i === 0 ? "auto" : `${slice.height}%`,
              overflow: "hidden",
              transform: `translateX(${slice.displacement}px)`,
            }}
          >
            <span
              style={{
                fontSize,
                fontWeight: 900,
                color: "rgba(255,255,255,0.4)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -3,
                display: "block",
                transform: i === 0 ? "none" : `translateY(-${slice.top}%)`,
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Red channel offset */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: rgbOffset,
          mixBlendMode: "screen",
          opacity: intensity * 0.8,
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 900,
            color: "#ff0000",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -3,
          }}
        >
          {text}
        </span>
      </div>

      {/* Blue channel offset */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -rgbOffset,
          mixBlendMode: "screen",
          opacity: intensity * 0.8,
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 900,
            color: "#0088ff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -3,
          }}
        >
          {text}
        </span>
      </div>

      {/* Noise/static overlay */}
      {intensity > 0.3 && (
        <svg
          style={{
            position: "absolute",
            top: -20,
            left: -20,
            right: -20,
            bottom: -20,
            width: "calc(100% + 40px)",
            height: "calc(100% + 40px)",
            opacity: intensity * 0.4,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        >
          <filter id="glitchNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              seed={Math.floor(frame * 3)}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#glitchNoise)" />
        </svg>
      )}
    </div>
  );
};

// ============================================================================
// CONTENT SCENE
// ============================================================================
const ContentScene: React.FC<{
  sceneIndex: number;
  image: string;
  lines: string[];
  style: string;
}> = ({ sceneIndex, image, lines, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStart = TIMING.HOOK_END + sceneIndex * TIMING.SCENE_DURATION;
  const sceneEnd = sceneStart + TIMING.SCENE_DURATION;
  const localFrame = frame - sceneStart;
  const isLast = sceneIndex === CONTENT_SCENES.length - 1;

  if (frame < sceneStart || frame >= sceneEnd + (isLast ? 30 : 0)) return null;

  // Ken Burns
  const zoomDir = sceneIndex % 2 === 0 ? 1 : -1;
  const zoomProgress = interpolate(localFrame, [0, TIMING.SCENE_DURATION], [0, 1], {
    extrapolateRight: "clamp",
  });
  const zoom = 1.1 + zoomProgress * 0.1 * zoomDir;
  const panX = zoomProgress * 25 * zoomDir;

  // Transitions
  const fadeIn = interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = isLast
    ? 1
    : interpolate(localFrame, [TIMING.SCENE_DURATION - 5, TIMING.SCENE_DURATION], [1, 0], {
        extrapolateLeft: "clamp",
      });

  // Style-specific animations
  let line1Transform = "";
  let line2Transform = "";
  let line1Opacity = 1;
  let line2Opacity = 1;
  let line1Color = COLORS.ivory;
  let line2Color = COLORS.gold;
  let line1Size = 130;
  let line2Size = 150;
  let extraElements: React.ReactNode = null;
  let customLine2: React.ReactNode = null;
  let logoAboveText: React.ReactNode = null;

  const textDelay = 6;

  if (style === "glitch") {
    // PIZZA - appears then glitches out
    const appearProgress = interpolate(localFrame, [textDelay, textDelay + 10], [0, 1], {
      extrapolateRight: "clamp",
    });
    const glitchStart = textDelay + 18;
    const glitchProgress = interpolate(localFrame, [glitchStart, glitchStart + 25], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    line1Opacity = appearProgress;
    line1Transform = `translateY(${interpolate(appearProgress, [0, 1], [-30, 0])}px)`;

    // Custom line2 with glitch effect
    customLine2 = (
      <div
        style={{
          opacity: appearProgress,
          transform: `translateY(${interpolate(appearProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        <GlitchText text={lines[1]} glitchProgress={glitchProgress} fontSize={150} />
      </div>
    );
  } else if (style === "hero") {
    // EMPANADAS - dramatic slam with glow
    const slamProgress = spring({
      frame: Math.max(0, localFrame - textDelay),
      fps,
      config: { damping: 8, stiffness: 150 },
    });

    line1Opacity = slamProgress;
    line2Opacity = slamProgress;
    line1Transform = `scale(${interpolate(slamProgress, [0, 1], [0.3, 1])})`;
    line2Transform = `scale(${interpolate(slamProgress, [0, 1], [4, 1])})`;
    line2Color = COLORS.gold;
    line2Size = 155;

    extraElements = (
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          width: 800,
          height: 200,
          background: `radial-gradient(ellipse, ${COLORS.gold}40 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          opacity: slamProgress * 0.6,
          filter: "blur(30px)",
        }}
      />
    );
  } else if (style === "trophy") {
    // MVP - spins in
    const spinProgress = spring({
      frame: Math.max(0, localFrame - textDelay),
      fps,
      config: { damping: 12, stiffness: 100 },
    });

    line1Opacity = spinProgress;
    line2Opacity = spinProgress;
    line1Transform = `translateY(${interpolate(spinProgress, [0, 1], [-80, 0])}px)`;
    line2Transform = `scale(${interpolate(spinProgress, [0, 1], [0.5, 1.1])}) rotate(${interpolate(spinProgress, [0, 1], [-10, 0])}deg)`;
    line2Color = COLORS.gold;
    line2Size = 180;
  } else if (style === "deal") {
    // BUY 10 GET 2 FREE - slides from sides
    const slideProgress = spring({
      frame: Math.max(0, localFrame - textDelay),
      fps,
      config: { damping: 14, stiffness: 120 },
    });

    line1Opacity = slideProgress;
    line2Opacity = slideProgress;
    line1Transform = `translateX(${interpolate(slideProgress, [0, 1], [-400, 0])}px)`;
    line2Transform = `translateX(${interpolate(slideProgress, [0, 1], [400, 0])}px)`;
    line1Size = 140;
    line2Size = 125;

    extraElements = (
      <div
        style={{
          position: "absolute",
          top: 250,
          right: 80,
          transform: `rotate(12deg) scale(${interpolate(slideProgress, [0, 1], [0, 1])})`,
          opacity: slideProgress,
        }}
      >
        <div
          style={{
            backgroundColor: "#ff4444",
            padding: "16px 30px",
            borderRadius: 10,
            fontSize: 38,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "system-ui",
            boxShadow: "0 4px 20px rgba(255,68,68,0.4)",
          }}
        >
          SUPER BOWL SPECIAL!
        </div>
      </div>
    );
  } else if (style === "location") {
    // CLEAR POND - fade in with subtext
    const fadeProgress = spring({
      frame: Math.max(0, localFrame - textDelay),
      fps,
      config: { damping: 12, stiffness: 100 },
    });

    line1Opacity = fadeProgress;
    line2Opacity = fadeProgress;
    line1Transform = `translateY(${interpolate(fadeProgress, [0, 1], [-40, 0])}px)`;
    line2Transform = `translateY(${interpolate(fadeProgress, [0, 1], [40, 0])}px)`;
    line1Size = 110;
    line2Size = 145;

    extraElements = (
      <div
        style={{
          position: "absolute",
          top: "62%",
          left: "50%",
          transform: `translateX(-50%) translateY(${interpolate(fadeProgress, [0, 1], [30, 0])}px)`,
          opacity: interpolate(fadeProgress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" }),
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: COLORS.ivory,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            letterSpacing: 1,
          }}
        >
          You pick the time
        </span>
      </div>
    );
  } else if (style === "cta") {
    // TAP THE LINK - big logo
    const fadeProgress = spring({
      frame: Math.max(0, localFrame - textDelay),
      fps,
      config: { damping: 14, stiffness: 100 },
    });

    line1Opacity = fadeProgress;
    line2Opacity = fadeProgress;
    line1Transform = `translateY(${interpolate(fadeProgress, [0, 1], [30, 0])}px)`;
    line2Transform = `translateY(${interpolate(fadeProgress, [0, 1], [30, 0])}px)`;
    line1Size = 100;
    line2Size = 140;

    // Logo sits right above the text
    const logoScale = spring({
      frame: Math.max(0, localFrame - 4),
      fps,
      config: { damping: 10, stiffness: 100 },
    });
    logoAboveText = (
      <div
        style={{
          transform: `scale(${interpolate(logoScale, [0, 1], [0.3, 1])})`,
          opacity: interpolate(localFrame, [4, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          marginBottom: 30,
        }}
      >
        <Img
          src={staticFile("nitos-logo.avif")}
          style={{
            height: 280,
            objectFit: "contain",
            filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.6))",
          }}
        />
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <Img
        src={staticFile(image)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom}) translateX(${panX}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {extraElements}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {logoAboveText}

        <div style={{ transform: line1Transform, opacity: line1Opacity }}>
          <span
            style={{
              fontSize: line1Size,
              fontWeight: 900,
              color: line1Color,
              fontFamily: "system-ui, -apple-system, sans-serif",
              textShadow: "0 6px 30px rgba(0,0,0,0.8)",
              letterSpacing: -2,
            }}
          >
            {lines[0]}
          </span>
        </div>

        {customLine2 || (
          <div style={{ transform: line2Transform, opacity: line2Opacity }}>
            <span
              style={{
                fontSize: line2Size,
                fontWeight: 900,
                color: line2Color,
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: `0 6px 30px rgba(0,0,0,0.8)${line2Color === COLORS.gold ? `, 0 0 40px ${COLORS.gold}50` : ""}`,
                letterSpacing: -3,
              }}
            >
              {lines[1]}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// PROMO BANNER
// ============================================================================
const PromoBanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bannerStart = TIMING.HOOK_END + TIMING.SCENE_DURATION * 3;
  const bannerEnd = TOTAL_DURATION - 20;

  if (frame < bannerStart || frame > bannerEnd) return null;

  const slideUp = spring({
    frame: frame - bannerStart,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        transform: `translateY(${interpolate(slideUp, [0, 1], [120, 0])}px)`,
        opacity: slideUp,
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.gold,
          padding: "18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 34,
            fontWeight: 900,
            color: COLORS.dark,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: 1,
          }}
        >
          BUY 10 GET 2 FREE
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// FLYING EMPANADA
// ============================================================================
const FlyingEmpanada: React.FC = () => {
  const frame = useCurrentFrame();

  const flyStart = TIMING.HOOK_END + TIMING.SCENE_DURATION + 12;
  const flyDuration = 22;

  if (frame < flyStart || frame > flyStart + flyDuration + 5) return null;

  const localFrame = frame - flyStart;
  const progress = interpolate(localFrame, [0, flyDuration], [0, 1], { extrapolateRight: "clamp" });

  const x = interpolate(progress, [0, 1], [-250, 1350]);
  const y = interpolate(progress, [0, 0.5, 1], [1100, 750, 1200]);
  const rotation = progress * 480;
  const scale = interpolate(progress, [0, 0.3, 0.7, 1], [0.4, 1.1, 1.1, 0.4]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 60,
      }}
    >
      <Img
        src={staticFile("empanada.png")}
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          objectFit: "contain",
          transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
          filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
        }}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const NitosSuperBowlTeaser: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* No hook - starts directly with content */}

      {CONTENT_SCENES.map((scene, i) => (
        <ContentScene
          key={i}
          sceneIndex={i}
          image={scene.image}
          lines={scene.lines}
          style={scene.style}
        />
      ))}

      <FlyingEmpanada />
      <PromoBanner />
    </AbsoluteFill>
  );
};
