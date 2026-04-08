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
// TIMING (30fps) - Total ~18 seconds = 540 frames
// ============================================================================
const TIMING = {
  // QB Throw sequence
  QB_IMG1: 0,       // Holding empanada like a football
  QB_IMG2: 12,      // Cocked back ready to throw
  QB_IMG3: 24,      // Release - empty hand
  THROW_START: 22,  // Empanada starts flying before img3 loads
  IMPACT: 50,       // Empanada fills screen, flash

  // "Super Bowl Pre-Orders" text retracts from flash
  GAMEDAY_START: 52,
  GAMEDAY_HOLD: 137,
  HELMET_COLLIDE: 112, // Helmets smash together, text shatters

  // Helmets retract off screen
  HELMET_RETRACT: 125, // Helmets start going backwards

  // Phone slides up from bottom
  PHONE_START: 140,
  CHAT_START: 175,

  // Field goal scene
  FIELDGOAL_START: 398,

  // CTA scene
  CTA_START: 510,
  TOTAL_DURATION: 690, // ~23 seconds
};

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  background: "#2D5A3D",
  ivory: "#FAF8F5",
  gold: "#C4A052",
  dark: "#1a1a1a",
};

// ============================================================================
// QB THROW SCENE - Rapid image cuts + empanada flying at viewer
// ============================================================================
const QBThrowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame >= TIMING.GAMEDAY_START + 10) return null;

  // Which QB image to show
  const showImg1 = frame >= TIMING.QB_IMG1 && frame < TIMING.QB_IMG2;
  const showImg2 = frame >= TIMING.QB_IMG2 && frame < TIMING.QB_IMG3;
  const showImg3 = frame >= TIMING.QB_IMG3 && frame < TIMING.IMPACT;

  // Scale pulse on each cut
  const getPulseScale = (startFrame: number) => {
    const localFrame = frame - startFrame;
    if (localFrame < 0) return 1;
    return 1 + Math.max(0, 0.08 - localFrame * 0.015);
  };

  // Camera shake building intensity across cuts
  const shakeIntensity =
    frame < TIMING.QB_IMG2
      ? 2
      : frame < TIMING.QB_IMG3
        ? 5
        : frame < TIMING.THROW_START
          ? 10
          : 0;
  const shakeX = Math.sin(frame * 15) * shakeIntensity;
  const shakeY = Math.cos(frame * 12) * shakeIntensity * 0.6;

  // Slight zoom-in across the whole sequence
  const baseZoom = interpolate(frame, [0, TIMING.QB_IMG3], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  // Empanada throw animation
  const throwActive = frame >= TIMING.THROW_START && frame < TIMING.IMPACT;
  const throwFrame = Math.max(0, frame - TIMING.THROW_START);
  const throwProgress = interpolate(throwFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Empanada: starts from his raised hand (upper right), flies toward viewer
  const empScale = interpolate(
    throwProgress,
    [0, 0.3, 1],
    [0.3, 0.8, 18],
    { extrapolateRight: "clamp" }
  );
  const empRotation = interpolate(throwProgress, [0, 1], [-10, 720]);
  // Start from his hand (upper area, slightly right of center) and move toward center
  const empX = interpolate(throwProgress, [0, 0.4, 1], [150, 60, 0]);
  const empY = interpolate(throwProgress, [0, 0.4, 1], [-550, -200, -50]);
  const empOpacity = interpolate(throwFrame, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Impact flash
  const flashOpacity = interpolate(
    frame,
    [TIMING.IMPACT - 4, TIMING.IMPACT - 2, TIMING.IMPACT + 8],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#2E7D32" }}>
      {/* Football field background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #2E7D32 0%, #388E3C 30%, #2E7D32 50%, #388E3C 70%, #2E7D32 100%)",
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${baseZoom})`,
        }}
      >
        {/* Yard lines - horizontal white lines across the field */}
        {Array.from({ length: 21 }).map((_, i) => (
          <div
            key={`yard-${i}`}
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: `${(i / 20) * 100}%`,
              height: i % 5 === 0 ? 4 : 2,
              backgroundColor: "#fff",
              opacity: i % 5 === 0 ? 0.35 : 0.15,
            }}
          />
        ))}

        {/* Yard numbers */}
        {[10, 20, 30, 40, 50, 40, 30, 20, 10].map((num, i) => (
          <div
            key={`num-${i}`}
            style={{
              position: "absolute",
              left: 60,
              top: `${((i + 1) / 10) * 100}%`,
              transform: "translateY(-50%)",
              fontSize: 48,
              fontWeight: 900,
              color: "#fff",
              opacity: 0.18,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 8,
            }}
          >
            {num}
          </div>
        ))}

        {/* Hash marks on sides */}
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={`hash-${i}`}>
            <div
              style={{
                position: "absolute",
                left: 30,
                top: `${(i / 80) * 100}%`,
                width: 20,
                height: 2,
                backgroundColor: "#fff",
                opacity: 0.12,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 30,
                top: `${(i / 80) * 100}%`,
                width: 20,
                height: 2,
                backgroundColor: "#fff",
                opacity: 0.12,
              }}
            />
          </div>
        ))}

        {/* Sideline borders */}
        <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 6, backgroundColor: "#fff", opacity: 0.25 }} />
        <div style={{ position: "absolute", right: 20, top: 0, bottom: 0, width: 6, backgroundColor: "#fff", opacity: 0.25 }} />

        {/* Heavy grain texture - gritty look */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id="grassNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="5" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: "url(#grassNoise)",
            opacity: 0.3,
            mixBlendMode: "overlay",
          }}
        />

        {/* Coarse grain layer */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id="grassGrain">
            <feTurbulence type="turbulence" baseFrequency="2.5" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: "url(#grassGrain)",
            opacity: 0.18,
            mixBlendMode: "multiply",
          }}
        />

        {/* Fine film grain */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id="filmGrain">
            <feTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="1" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: "url(#filmGrain)",
            opacity: 0.15,
            mixBlendMode: "soft-light",
          }}
        />

        {/* Strong vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* Container with shake for QB images */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* QB Image 1 - holding empanada */}
        {showImg1 && (
          <Img
            src={staticFile("Remotion/damian-qb-1.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${baseZoom * getPulseScale(TIMING.QB_IMG1)})`,
            }}
          />
        )}

        {/* QB Image 2 - cocked back */}
        {showImg2 && (
          <Img
            src={staticFile("Remotion/damian-qb-2.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${baseZoom * getPulseScale(TIMING.QB_IMG2)})`,
            }}
          />
        )}

        {/* QB Image 3 - released */}
        {showImg3 && (
          <Img
            src={staticFile("Remotion/damian-qb-3.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${baseZoom * getPulseScale(TIMING.QB_IMG3)})`,
            }}
          />
        )}

        {/* Empanada thrown at viewer */}
        {throwActive && (
          <Img
            src={staticFile("empanada.png")}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 350,
              height: 350,
              objectFit: "contain",
              opacity: empOpacity,
              transform: `translate(-50%, -50%) translate(${empX}px, ${empY}px) scale(${empScale}) rotate(${empRotation}deg)`,
              filter: `drop-shadow(0 ${10 + empScale * 3}px ${20 + empScale * 5}px rgba(0,0,0,0.6))`,
            }}
          />
        )}
      </div>

      {/* Impact flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#fff",
          opacity: flashOpacity,
          zIndex: 50,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// "SUPER BOWL PRE-ORDERS NOW AVAILABLE" - retracts from flash, then shatters
// ============================================================================
const WORDS = ["SUPER", "BOWL", "PRE-ORDERS", "NOW", "AVAILABLE"];

// Generate shatter pieces for each letter of each word
const generateShatterPieces = () => {
  const pieces: Array<{
    wordIdx: number;
    char: string;
    charIdx: number;
    // Random shatter trajectory
    velX: number;
    velY: number;
    velRot: number;
    size: number;
  }> = [];

  WORDS.forEach((word, wordIdx) => {
    word.split("").forEach((char, charIdx) => {
      const seed = wordIdx * 50 + charIdx;
      pieces.push({
        wordIdx,
        char,
        charIdx,
        velX: (Math.sin(seed * 3.7) * 2 - 1) * 1800 + (Math.random() > 0.5 ? 400 : -400),
        velY: (Math.cos(seed * 2.3) * 2 - 1) * 2400 - 600,
        velRot: (Math.sin(seed * 5.1) * 2 - 1) * 720,
        size: WORDS[wordIdx] === "PRE-ORDERS" || WORDS[wordIdx] === "AVAILABLE" ? 130 : WORDS[wordIdx] === "NOW" ? 160 : 150,
      });
    });
  });
  return pieces;
};

const SHATTER_PIECES = generateShatterPieces();

const GameDaySlam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < TIMING.GAMEDAY_START || frame >= TIMING.CTA_START + 15) return null;

  const localFrame = frame - TIMING.GAMEDAY_START;
  const collideFrame = TIMING.HELMET_COLLIDE - TIMING.GAMEDAY_START;
  const hasCollided = localFrame >= collideFrame;
  const shatterFrame = Math.max(0, localFrame - collideFrame);

  // White flash that the text emerges from
  const flashBg = interpolate(localFrame, [0, 6, 18], [1, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Collision flash
  const collisionFlash = interpolate(
    shatterFrame,
    [0, 2, 8],
    [0, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out for CTA transition
  const fadeOut = interpolate(
    frame,
    [TIMING.CTA_START - 10, TIMING.CTA_START + 5],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Helmet positions - come from opposite sides
  const helmetApproach = interpolate(
    localFrame,
    [collideFrame - 25, collideFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Eased approach - slow start, fast at impact
  const helmetEased = helmetApproach * helmetApproach * helmetApproach;

  // Left helmet: starts off-screen left, ends near center (wider gap to avoid overlap)
  const helmetLX = interpolate(helmetEased, [0, 1], [-1200, -180]);
  // Right helmet: starts off-screen right, ends near center
  const helmetRX = interpolate(helmetEased, [0, 1], [1200, 180]);

  // Tilt helmets forward as they approach — lean into the hit
  const helmetLTilt = interpolate(helmetEased, [0, 0.5, 1], [0, 10, 20]);
  const helmetRTilt = interpolate(helmetEased, [0, 0.5, 1], [0, -10, -20]);

  // After collision - helmets bounce slightly then retract backwards off screen
  const retractFrame = TIMING.HELMET_RETRACT - TIMING.GAMEDAY_START;
  const isRetracting = localFrame >= retractFrame;
  const retractProgress = interpolate(
    localFrame,
    [retractFrame, retractFrame + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Ease out - starts slow, accelerates off screen
  const retractEased = retractProgress * retractProgress;

  const postBounce = hasCollided && !isRetracting
    ? interpolate(shatterFrame, [0, 5, 15], [0, 60, 80], { extrapolateRight: "clamp" })
    : 0;

  // Retract offset — helmets fly backwards off screen
  const retractOffsetL = isRetracting ? interpolate(retractEased, [0, 1], [0, -1400]) : 0;
  const retractOffsetR = isRetracting ? interpolate(retractEased, [0, 1], [0, 1400]) : 0;

  const helmetPostOpacity = 1;

  // Screen shake on collision
  const collisionShake = hasCollided && shatterFrame < 12
    ? (12 - shatterFrame) * 6
    : 0;
  const shakeX = Math.sin(shatterFrame * 14) * collisionShake;
  const shakeY = Math.cos(shatterFrame * 11) * collisionShake * 0.6;

  // Word vertical positions for shatter origin
  const wordYPositions = [-340, -180, -20, 140, 300];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        opacity: fadeOut,
      }}
    >
      {/* Shake container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* White flash from empanada impact */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#fff",
            opacity: flashBg,
            zIndex: 5,
          }}
        />

        {/* Intact words - visible before collision */}
        {!hasCollided && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "80px 40px",
              gap: 0,
            }}
          >
            {WORDS.map((word, i) => {
              const wordDelay = i * 4;
              const retractProgress = spring({
                frame: Math.max(0, localFrame - wordDelay),
                fps,
                config: { damping: 14, stiffness: 120 },
              });

              const wordScale = interpolate(retractProgress, [0, 1], [2.5, 1]);
              const wordOpacity = interpolate(
                retractProgress,
                [0, 0.2, 1],
                [0, 0.6, 1],
                { extrapolateRight: "clamp" }
              );

              const isAccent = word === "PRE-ORDERS" || word === "AVAILABLE";

              return (
                <div
                  key={i}
                  style={{
                    transform: `scale(${wordScale})`,
                    opacity: wordOpacity,
                    lineHeight: 1,
                  }}
                >
                  <span
                    style={{
                      color: isAccent ? COLORS.gold : COLORS.ivory,
                      fontSize:
                        word === "PRE-ORDERS" || word === "AVAILABLE"
                          ? 130
                          : word === "NOW"
                            ? 160
                            : 150,
                      fontWeight: 900,
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      textShadow: "0 8px 40px rgba(0,0,0,0.5)",
                      letterSpacing: -3,
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Shattered letter pieces - visible after collision */}
        {hasCollided &&
          SHATTER_PIECES.map((piece, idx) => {
            const t = shatterFrame / 30; // Normalize time
            const gravity = 800;

            // Physics-based movement
            const x = piece.velX * t;
            const y = piece.velY * t + 0.5 * gravity * t * t;
            const rot = piece.velRot * t;

            // Fade out
            const opacity = interpolate(shatterFrame, [0, 5, 25], [1, 0.8, 0], {
              extrapolateRight: "clamp",
            });

            const isAccent =
              WORDS[piece.wordIdx] === "PRE-ORDERS" ||
              WORDS[piece.wordIdx] === "AVAILABLE";

            // Approximate starting position based on word and char index
            const wordWidth = WORDS[piece.wordIdx].length * piece.size * 0.55;
            const startX = -wordWidth / 2 + piece.charIdx * piece.size * 0.55;

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate(${startX + x}px, ${wordYPositions[piece.wordIdx] + y}px) rotate(${rot}deg) scale(${interpolate(shatterFrame, [0, 20], [1, 0.3], { extrapolateRight: "clamp" })})`,
                  opacity,
                  zIndex: 10,
                }}
              >
                <span
                  style={{
                    color: isAccent ? COLORS.gold : COLORS.ivory,
                    fontSize: piece.size,
                    fontWeight: 900,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  {piece.char}
                </span>
              </div>
            );
          })}

        {/* Left helmet - comes from left */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translateX(${helmetLX - (hasCollided ? postBounce : 0) + retractOffsetL}px) rotate(${helmetLTilt}deg)`,
            opacity: helmetPostOpacity,
            zIndex: 20,
          }}
        >
          <Img
            src={staticFile("Remotion/nitos-helmet-L.png")}
            style={{
              width: 1500,
              height: 1500,
              objectFit: "contain",
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.6))",
            }}
          />
        </div>

        {/* Right helmet - comes from right */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translateX(${helmetRX + (hasCollided ? postBounce : 0) + retractOffsetR}px) rotate(${helmetRTilt}deg)`,
            opacity: helmetPostOpacity,
            zIndex: 20,
          }}
        >
          <Img
            src={staticFile("Remotion/nitos-helmet-r.png")}
            style={{
              width: 1500,
              height: 1500,
              objectFit: "contain",
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.6))",
            }}
          />
        </div>

        {/* Collision flash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#fff",
            opacity: hasCollided ? collisionFlash : 0,
            zIndex: 15,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// PHONE SCENE - slides up from bottom with Nito's chat
// ============================================================================
const PhoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < TIMING.PHONE_START || frame >= TIMING.FIELDGOAL_START + 10) return null;

  const localFrame = frame - TIMING.PHONE_START;

  // Phone slides up from bottom
  const slideUp = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const phoneY = interpolate(slideUp, [0, 1], [2200, 0]);

  // Page is already loaded when phone slides up — no fade
  const chatOpacity = 1;

  // Phone slides off to bottom after card shrinks back
  const slideOff = interpolate(
    frame,
    [TIMING.FIELDGOAL_START - 14, TIMING.FIELDGOAL_START + 4],
    [0, 2200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Message appears the moment phone settles (~20 frames after PHONE_START)
  const msgAppear = TIMING.PHONE_START + 20;
  const msg1 = {
    opacity: interpolate(frame, [msgAppear, msgAppear + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    y: interpolate(frame, [msgAppear, msgAppear + 8], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `translateY(${phoneY + slideOff}px)`,
        }}
      >
        {/* iPhone frame */}
        <div
          style={{
            width: 680,
            height: 1390,
            backgroundColor: "#0a0a0a",
            borderRadius: 85,
            border: "8px solid #2a2a2a",
            padding: 16,
            boxShadow:
              "0 50px 120px rgba(0,0,0,0.7), inset 0 0 0 3px #1a1a1a",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Side buttons */}
          <div style={{ position: "absolute", left: -10, top: 240, width: 5, height: 55, backgroundColor: "#2a2a2a", borderRadius: 3 }} />
          <div style={{ position: "absolute", left: -10, top: 350, width: 5, height: 95, backgroundColor: "#2a2a2a", borderRadius: 3 }} />
          <div style={{ position: "absolute", left: -10, top: 460, width: 5, height: 95, backgroundColor: "#2a2a2a", borderRadius: 3 }} />
          <div style={{ position: "absolute", right: -10, top: 380, width: 5, height: 135, backgroundColor: "#2a2a2a", borderRadius: 3 }} />

          {/* Screen area */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#000",
              borderRadius: 72,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                width: 170,
                height: 50,
                backgroundColor: "#0a0a0a",
                borderRadius: 30,
                alignSelf: "center",
                marginTop: 20,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
              }}
            />

            {/* Screen content */}
            <div
              style={{
                flex: 1,
                backgroundColor: COLORS.background,
                margin: 12,
                marginTop: 28,
                borderRadius: 60,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Chat interface */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#C4A78C",
                  borderRadius: 60,
                  opacity: chatOpacity,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "24px 30px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Img
                    src={staticFile("nitos-logo.avif")}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      border: "3px solid #E8DFD4",
                    }}
                  />
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#1E3A5F", fontFamily: "system-ui", marginTop: 6, textAlign: "center" }}>
                    Nito's Empanadas
                  </div>
                  <div style={{ fontSize: 18, color: "#C4A052", fontFamily: "system-ui", textAlign: "center" }}>
                    The Best Empanadas in town!
                  </div>
                  <div style={{ display: "flex", backgroundColor: "rgba(90, 75, 60, 0.4)", borderRadius: 24, padding: 4, marginTop: 8 }}>
                    <div style={{ padding: "8px 28px", backgroundColor: "rgba(50, 40, 30, 0.8)", borderRadius: 20, color: "#fff", fontSize: 16, fontWeight: 600, fontFamily: "system-ui" }}>Chat</div>
                    <div style={{ padding: "8px 28px", color: "rgba(50, 40, 30, 0.7)", fontSize: 16, fontWeight: 500, fontFamily: "system-ui" }}>Links</div>
                  </div>
                </div>

                {/* Chat messages */}
                <div style={{ flex: 1, padding: "8px 20px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
                  {/* User: Can I order 10 empanadas for the Super Bowl? */}
                  <div style={{ alignSelf: "flex-end", backgroundColor: "#fff", borderRadius: 18, padding: "12px 18px", maxWidth: "75%", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", opacity: msg1.opacity, transform: `translateY(${msg1.y}px)` }}>
                    <span style={{ fontSize: 19, color: "#1a1a1a", fontFamily: "system-ui" }}>Can I order 10 empanadas for the Super Bowl? 🏈</span>
                  </div>
                </div>

                {/* Bottom input */}
                <div style={{ padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: 24, padding: "12px 20px", fontSize: 16, color: "#999", fontFamily: "system-ui" }}>Ask Shorty anything...</div>
                    <div style={{ backgroundColor: "rgba(70, 58, 45, 0.9)", borderRadius: 24, padding: "12px 24px", fontSize: 16, color: "#fff", fontWeight: 600, fontFamily: "system-ui" }}>Send</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div style={{ width: 200, height: 6, backgroundColor: "#333", borderRadius: 3, alignSelf: "center", marginBottom: 16 }} />
          </div>
        </div>
      </div>

      {/* Dark blur overlay when messages pop out */}
      {(() => {
        const overlayStart = TIMING.PHONE_START + 28;
        const FADE_OUT_START = overlayStart + 40 + 35 + 20 + 10 + 22 + 20; // matches FADE_START
        const overlayIn = frame >= overlayStart ? interpolate(frame, [overlayStart, overlayStart + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        const overlayOut = frame >= FADE_OUT_START ? interpolate(frame, [FADE_OUT_START, FADE_OUT_START + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        const overlayOpacity = overlayIn * overlayOut;
        if (overlayOpacity <= 0) return null;
        return (
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            opacity: overlayOpacity,
            zIndex: 45,
          }} />
        );
      })()}

      {/* 3D floating messages sequence */}
      {(() => {
        // === TIMING ===
        const MSG1_START = TIMING.PHONE_START + 28; // User message pops out
        const MSG2_START = MSG1_START + 40;          // Response appears below
        const BTN_START = MSG2_START + 35;           // Order Now button appears
        const MSG1_SWIPE = BTN_START + 20;             // msg1 swipes up off screen
        const MSG2_SWIPE = MSG1_SWIPE + 10;           // msg2 swipes up off screen
        const BTN_CENTER = MSG2_SWIPE;                // button moves to center
        const CLICK_FRAME = BTN_CENTER + 22;          // Button gets "clicked" once centered (~0.25s longer)
        const FADE_START = CLICK_FRAME + 20;          // Hold pressed state before fading
        const CONFIRMED_START = FADE_START + 15;      // Order confirmed badge

        // === MSG1: User message pops out from phone ===
        const msg1Frame = frame - MSG1_START;
        const msg1Active = msg1Frame >= 0;

        const msg1GrowProgress = msg1Active ? spring({
          frame: msg1Frame,
          fps,
          config: { damping: 12, stiffness: 120 },
        }) : 0;

        const msg1Scale = interpolate(msg1GrowProgress, [0, 1], [0.15, 1.25]);
        const msg1X = interpolate(msg1GrowProgress, [0, 1], [120, 0]);
        // Nudges up when response appears
        const msg1NudgeY = frame >= MSG2_START ? interpolate(
          spring({ frame: frame - MSG2_START, fps, config: { damping: 14, stiffness: 100 } }),
          [0, 1], [0, -220]
        ) : 0;
        const msg1Y = interpolate(msg1GrowProgress, [0, 1], [-180, -140]) + msg1NudgeY;
        const msg1Opacity = msg1Active ? interpolate(msg1Frame, [0, 4], [0, 1], { extrapolateRight: "clamp" }) : 0;
        const msg1TiltX = interpolate(msg1GrowProgress, [0, 0.5, 1], [25, 8, 0]);

        // Msg1 swipes up off screen
        const msg1SwipeY = frame >= MSG1_SWIPE ? interpolate(frame, [MSG1_SWIPE, MSG1_SWIPE + 12], [0, -1200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        const msg1SwipeOpacity = frame >= MSG1_SWIPE ? interpolate(frame, [MSG1_SWIPE, MSG1_SWIPE + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

        // Msg2 swipes up off screen
        const msg2SwipeY = frame >= MSG2_SWIPE ? interpolate(frame, [MSG2_SWIPE, MSG2_SWIPE + 12], [0, -1200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        const msg2SwipeOpacity = frame >= MSG2_SWIPE ? interpolate(frame, [MSG2_SWIPE, MSG2_SWIPE + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

        // Button moves to center as messages leave
        const btnCenterProgress = frame >= BTN_CENTER ? spring({ frame: frame - BTN_CENTER, fps, config: { damping: 14, stiffness: 100 } }) : 0;
        const btnMoveY = interpolate(btnCenterProgress, [0, 1], [440, 0]); // from 440 offset to center

        // Button fades after click
        const btnFadeOut = frame >= FADE_START ? interpolate(frame, [FADE_START, FADE_START + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

        // === MSG2: Response pops in below ===
        const msg2Frame = frame - MSG2_START;
        const msg2Active = msg2Frame >= 0;

        const msg2GrowProgress = msg2Active ? spring({
          frame: msg2Frame,
          fps,
          config: { damping: 12, stiffness: 120 },
        }) : 0;

        const msg2Scale = interpolate(msg2GrowProgress, [0, 1], [0.3, 1.15]);
        const msg2Y = interpolate(msg2GrowProgress, [0, 1], [150, 130]);
        const msg2Opacity = msg2Active ? interpolate(msg2Frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }) : 0;
        const msg2TiltX = interpolate(msg2GrowProgress, [0, 0.5, 1], [20, 5, 0]);

        // === ORDER NOW BUTTON ===
        const btnFrame = frame - BTN_START;
        const btnActive = btnFrame >= 0;

        const btnGrowProgress = btnActive ? spring({
          frame: btnFrame,
          fps,
          config: { damping: 10, stiffness: 150 },
        }) : 0;

        const btnScale = interpolate(btnGrowProgress, [0, 1], [0.3, 1]);
        const btnOpacity = btnActive ? interpolate(btnFrame, [0, 5], [0, 1], { extrapolateRight: "clamp" }) : 0;

        // Pulse effect — pulses once button is centered
        const pulseTime = frame - (BTN_CENTER + 8);
        const pulse = pulseTime > 0 && frame < CLICK_FRAME
          ? 1 + Math.sin(pulseTime * 0.5) * 0.08
          : 1;

        // Click effect — scale dip + color darken
        const clickActive = frame >= CLICK_FRAME;
        const clickFrame = frame - CLICK_FRAME;
        const clickScale = clickActive
          ? interpolate(clickFrame, [0, 4, 10], [1, 0.88, 0.92], { extrapolateRight: "clamp" })
          : 1;
        // 0 = normal gold, 1 = pressed darker
        const clickPressed = clickActive
          ? interpolate(clickFrame, [0, 3, 10], [0, 1, 0.85], { extrapolateRight: "clamp" })
          : 0;

        // === ORDER CONFIRMED BADGE ===
        const confirmedFrame = frame - CONFIRMED_START;
        const confirmedActive = confirmedFrame >= 0;

        const confirmedProgress = confirmedActive ? spring({
          frame: confirmedFrame,
          fps,
          config: { damping: 10, stiffness: 120 },
        }) : 0;

        const badgeScale = interpolate(confirmedProgress, [0, 1], [0.2, 1]);
        const badgeIn = confirmedActive ? interpolate(confirmedFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" }) : 0;
        // Card shrinks back into phone
        const SHRINK_START = TIMING.FIELDGOAL_START - 28;
        const shrinkProgress = frame >= SHRINK_START ? interpolate(frame, [SHRINK_START, SHRINK_START + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        const badgeShrink = interpolate(shrinkProgress, [0, 1], [1, 0.15]);
        const badgeOpacity = badgeIn * interpolate(shrinkProgress, [0, 0.8, 1], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        const checkTextProgress = confirmedActive ? spring({
          frame: Math.max(0, confirmedFrame - 12),
          fps,
          config: { damping: 14, stiffness: 100 },
        }) : 0;

        // Checkmark draw-in (SVG stroke animation)
        const checkDrawProgress = confirmedActive ? interpolate(confirmedFrame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

        // Pulse after checkmark completes (2 pulses then settle)
        const pulseFrame = confirmedFrame - 25;
        const checkPulse = pulseFrame > 0 && pulseFrame < 30
          ? 1 + Math.sin(pulseFrame * 0.6) * 0.12 * Math.max(0, 1 - pulseFrame / 30)
          : 1;

        // Shadow helper
        const makeShadow = (progress: number) => {
          const blur = interpolate(progress, [0, 1], [5, 60]);
          const sy = interpolate(progress, [0, 1], [2, 30]);
          const spread = interpolate(progress, [0, 1], [0, 10]);
          return `0 ${sy}px ${blur}px rgba(0,0,0,0.35), 0 ${sy * 0.5}px ${blur * 0.4}px rgba(0,0,0,0.2), 0 ${sy * 1.5}px ${blur * 2}px ${spread}px rgba(0,0,0,0.15)`;
        };

        return (
          <>
            {/* User message bubble */}
            {msg1Active && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate(${msg1X}px, ${msg1Y + msg1SwipeY}px) scale(${msg1Scale}) perspective(600px) rotateX(${msg1TiltX}deg)`,
                  opacity: msg1Opacity * msg1SwipeOpacity,
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 36,
                    padding: "40px 52px",
                    maxWidth: 920,
                    boxShadow: makeShadow(msg1GrowProgress),
                    border: "3px solid rgba(255,255,255,0.9)",
                  }}
                >
                  <span style={{ fontSize: 52, color: "#1a1a1a", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 600, lineHeight: 1.3 }}>
                    Can I order 10 empanadas for the Super Bowl? 🏈
                  </span>
                </div>
              </div>
            )}

            {/* Response message bubble */}
            {msg2Active && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translateY(${msg2Y + msg2SwipeY}px) scale(${msg2Scale}) perspective(600px) rotateX(${msg2TiltX}deg)`,
                  opacity: msg2Opacity * msg2SwipeOpacity,
                  zIndex: 51,
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(70, 58, 45, 0.95)",
                    borderRadius: 36,
                    padding: "36px 48px",
                    maxWidth: 920,
                    boxShadow: makeShadow(msg2GrowProgress),
                    border: "3px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <span style={{ fontSize: 44, color: "#FAF8F5", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 600, lineHeight: 1.35 }}>
                    Absolutely! That qualifies for our <span style={{ color: "#C4A052", fontWeight: 800 }}>buy 10 get 2 free</span> big game promotion! 🏈🔥
                  </span>
                </div>
              </div>
            )}

            {/* Order Now button */}
            {btnActive && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translateY(${btnMoveY}px) scale(${btnScale * pulse * clickScale})`,
                  opacity: btnOpacity * btnFadeOut,
                  zIndex: 52,
                }}
              >
                <div
                  style={{
                    backgroundColor: interpolate(clickPressed, [0, 1], [0, 1]) > 0.5 ? "#8B7A30" : "#C4A052",
                    borderRadius: 30,
                    padding: "32px 80px",
                    boxShadow: clickPressed > 0.5
                      ? `0 4px 15px rgba(139, 122, 48, 0.6), 0 2px 8px rgba(0,0,0,0.3), inset 0 2px 8px rgba(0,0,0,0.2)`
                      : `0 12px 40px rgba(196, 160, 82, 0.5), 0 6px 20px rgba(0,0,0,0.2)`,
                    border: clickPressed > 0.5 ? "3px solid rgba(0,0,0,0.15)" : "3px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <span style={{ fontSize: 52, fontWeight: 800, color: clickPressed > 0.5 ? "#fff" : "#1a1a1a", fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: 2 }}>
                    ORDER NOW
                  </span>
                </div>
              </div>
            )}

            {/* Order Confirmed — app-style card */}
            {confirmedActive && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) scale(${badgeScale * badgeShrink})`,
                  opacity: badgeOpacity,
                  zIndex: 60,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Card container */}
                <div
                  style={{
                    width: 780,
                    backgroundColor: "#ffffff",
                    borderRadius: 50,
                    padding: "70px 60px 60px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                    boxShadow: "0 30px 100px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Checkmark circle with pulse */}
                  <div
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: "50%",
                      backgroundColor: "#22C55E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${checkPulse})`,
                      boxShadow: `0 8px 30px rgba(34, 197, 94, 0.4), 0 0 ${checkPulse > 1 ? 40 : 0}px rgba(34, 197, 94, ${(checkPulse - 1) * 3})`,
                      transition: "none",
                    }}
                  >
                    {/* Animated checkmark SVG */}
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                      <path
                        d="M25 52 L42 70 L75 32"
                        stroke="#fff"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="120"
                        strokeDashoffset={interpolate(checkDrawProgress, [0, 1], [120, 0])}
                      />
                    </svg>
                  </div>

                  {/* Order Confirmed heading */}
                  <div
                    style={{
                      opacity: interpolate(checkTextProgress, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(checkTextProgress, [0, 1], [20, 0])}px)`,
                    }}
                  >
                    <span style={{
                      fontSize: 62,
                      fontWeight: 800,
                      color: "#1a1a1a",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}>
                      Order Confirmed
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{
                    width: 580,
                    height: 2,
                    backgroundColor: "#e5e5e5",
                    opacity: interpolate(checkTextProgress, [0, 1], [0, 1]),
                  }} />

                  {/* Order details */}
                  <div
                    style={{
                      opacity: interpolate(checkTextProgress, [0, 1], [0, 1]),
                      transform: `translateY(${interpolate(checkTextProgress, [0, 1], [15, 0])}px)`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{
                      fontSize: 38,
                      fontWeight: 600,
                      color: "#444",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}>
                      12 Empanadas • Super Bowl Sunday
                    </span>
                    <span style={{
                      fontSize: 32,
                      color: "#22C55E",
                      fontWeight: 700,
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}>
                      Buy 10 Get 2 FREE applied ✓
                    </span>
                  </div>

                  {/* Nito's branding footer */}
                  <div style={{
                    marginTop: 16,
                    opacity: interpolate(checkTextProgress, [0, 1], [0, 0.6]),
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}>
                    <span style={{
                      fontSize: 28,
                      color: "#999",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      fontWeight: 500,
                    }}>
                      Nito's Empanadas 🏈🔥
                    </span>
                  </div>
                </div>

                {/* Subtext below card */}
                <div
                  style={{
                    marginTop: 40,
                    opacity: interpolate(checkTextProgress, [0, 1], [0, 0.8]),
                    transform: `translateY(${interpolate(checkTextProgress, [0, 1], [20, 0])}px)`,
                  }}
                >
                  <span style={{
                    fontSize: 36,
                    color: "rgba(250,248,245,0.7)",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontWeight: 500,
                  }}>
                    Game day is handled 🏈🎉
                  </span>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </AbsoluteFill>
  );
};

// ============================================================================
// CTA SCENE
// ============================================================================
const SB_ROTATING_WORDS = [
  { word: "for Game Day", duration: 28 },
  { word: "for the party", duration: 22 },
  { word: "for your crew", duration: 18 },
  { word: "for halftime", duration: 14 },
  { word: "for the tailgate", duration: 10 },
  { word: "right now", duration: 7 },
  { word: "for the win", duration: 5 },
  { word: "today", duration: 4 },
  { word: "always", duration: 3 },
];

// ============================================================================
// FIELD GOAL SCENE — empanada kicked through the uprights
// ============================================================================
const FieldGoalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const START = TIMING.FIELDGOAL_START;
  const END = TIMING.CTA_START;

  if (frame < START || frame >= END + 10) return null;

  const localFrame = frame - START;

  // Scene fade in
  const sceneOpacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Scene fade out at end
  const sceneOut = interpolate(frame, [END - 15, END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // === EMPANADA — already on screen, sitting low center ===
  const kickStart = 35; // frames before it gets kicked
  const kickFrame = Math.max(0, localFrame - kickStart);
  const kickDuration = 28;
  const kickProgress = Math.min(1, kickFrame / kickDuration);

  // Before kick: empanada sits still. After kick: arcs upward through the post.
  const empX = interpolate(kickProgress, [0, 0.5, 1], [0, 20, 40]);
  const empY = kickProgress === 0 ? 0 : interpolate(kickProgress, [0, 0.35, 0.6, 1], [0, -500, -900, -1500]);
  const empBaseScale = 2.4; // 20% larger
  const empScale = interpolate(kickProgress, [0, 0.3, 0.7, 1], [empBaseScale, empBaseScale * 0.7, empBaseScale * 0.4, empBaseScale * 0.15]);
  const empRotation = kickProgress * 720;
  const empOpacity = interpolate(kickProgress, [0, 0.85, 1], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Subtle idle wobble before kick
  const idleWobble = localFrame < kickStart ? Math.sin(localFrame * 0.3) * 3 : 0;

  // === FIELD GOAL POST — grows up from the ground ===
  const postGrowDelay = 8;
  const postGrowFrame = Math.max(0, localFrame - postGrowDelay);
  // Grows from bottom (clipPath reveal from bottom to top)
  const postReveal = spring({
    frame: postGrowFrame,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  // === GOOOOOD scrolling text ===
  const goodStart = kickStart + 18;
  const goodFrame = Math.max(0, localFrame - goodStart);
  const goodActive = localFrame >= goodStart;
  const scrollX = goodActive ? interpolate(goodFrame, [0, 70], [1100, -3500], { extrapolateRight: "clamp" }) : 1100;
  const goodOpacity = goodActive ? interpolate(goodFrame, [0, 5, 60, 70], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background, opacity: sceneOpacity * sceneOut }}>
      {/* Dark field background with subtle lines */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #1a3a1a 0%, #0d200d 100%)" }} />

      {/* Field goal post — top half of screen, grows from its base upward */}
      <div style={{
        position: "absolute",
        top: "8%",
        left: "50%",
        transform: `translateX(-50%)`,
        zIndex: 10,
        clipPath: `inset(${interpolate(postReveal, [0, 1], [100, 0])}% 0 0 0)`,
      }}>
        <svg width="700" height="800" viewBox="0 0 700 800" fill="none">
          {/* Left upright */}
          <rect x="140" y="0" width="24" height="450" rx="4" fill="#F5E06B" />
          {/* Right upright */}
          <rect x="536" y="0" width="24" height="450" rx="4" fill="#F5E06B" />
          {/* Crossbar */}
          <rect x="128" y="430" width="444" height="26" rx="6" fill="#F5E06B" />
          {/* Center post */}
          <rect x="335" y="430" width="30" height="370" rx="4" fill="#D4C85A" />
          {/* Crossbar shadow */}
          <rect x="134" y="450" width="432" height="8" rx="3" fill="rgba(0,0,0,0.3)" />
          {/* Glow effect on crossbar */}
          <rect x="128" y="428" width="444" height="30" rx="8" fill="rgba(245,224,107,0.15)" />
        </svg>
      </div>

      {/* Empanada — sits above the tagline, then launches up through the post */}
      <div style={{
        position: "absolute",
        bottom: "22%",
        left: "50%",
        transform: `translate(-50%, 0) translate(${empX}px, ${empY}px) scale(${empScale}) rotate(${kickProgress > 0 ? empRotation : idleWobble}deg)`,
        opacity: empOpacity * sceneOpacity,
        zIndex: 20,
      }}>
        <Img
          src={staticFile("empanada.png")}
          style={{
            width: 200,
            height: 200,
            objectFit: "contain",
            filter: `drop-shadow(0 12px 30px rgba(0,0,0,0.7))`,
          }}
        />
      </div>

      {/* "This Deal is..." anticipation text under empanada */}
      {localFrame < kickStart + 10 && (
        <div style={{
          position: "absolute",
          bottom: "13%",
          left: "50%",
          transform: `translate(-50%, 0) scale(${interpolate(
            spring({ frame: Math.min(localFrame, 15), fps, config: { damping: 10, stiffness: 100 } }),
            [0, 1], [0.3, 1]
          )})`,
          opacity: interpolate(localFrame, [0, 8, kickStart, kickStart + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          zIndex: 15,
        }}>
          <span style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            letterSpacing: 3,
            display: "inline-block",
            transform: `scale(${1 + Math.sin(localFrame * 0.4) * 0.04}) rotate(${Math.sin(localFrame * 0.6) * 1.5}deg)`,
          }}>
            This Deal is...
          </span>
        </div>
      )}

      {/* GOOOOOD scrolling under the field goal */}
      {goodActive && (
        <div style={{
          position: "absolute",
          top: "55%",
          left: 0,
          whiteSpace: "nowrap",
          transform: `translateX(${scrollX}px)`,
          opacity: goodOpacity,
          zIndex: 8,
        }}>
          <span style={{
            fontSize: 180,
            fontWeight: 900,
            color: "#F5E06B",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 6px 30px rgba(245,224,107,0.4), 0 3px 10px rgba(0,0,0,0.7)",
            letterSpacing: 6,
          }}>
            GOOOOOOOOOOOOOOOD!!
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// CTA SCENE
// ============================================================================
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < TIMING.CTA_START) return null;

  const localFrame = frame - TIMING.CTA_START;

  const NOW_DURATION = 11;
  const ROTATION_START = NOW_DURATION;
  const rotationFrame = Math.max(0, localFrame - ROTATION_START);

  const findCurrentWord = (
    f: number
  ): { index: number; progress: number; duration: number } => {
    let cumulative = 0;
    for (let i = 0; i < SB_ROTATING_WORDS.length; i++) {
      const duration = SB_ROTATING_WORDS[i].duration;
      if (f < cumulative + duration) {
        return { index: i, progress: (f - cumulative) / duration, duration };
      }
      cumulative += duration;
    }
    return { index: -2, progress: 0, duration: 1 };
  };

  const isRotating = localFrame >= ROTATION_START;
  const wordInfo = isRotating
    ? findCurrentWord(rotationFrame)
    : { index: -1, progress: 0, duration: 1 };
  const currentWordIndex = wordInfo.index;
  const wordProgress = wordInfo.progress;
  const currentDuration = wordInfo.duration;

  const fadeRatio =
    currentDuration <= 4 ? 0.3 : currentDuration <= 10 ? 0.2 : 0.15;

  const wordOpacity =
    !isRotating || currentWordIndex === -2
      ? 1
      : wordProgress < fadeRatio
        ? interpolate(wordProgress, [0, fadeRatio], [0, 1])
        : wordProgress > 1 - fadeRatio
          ? interpolate(wordProgress, [1 - fadeRatio, 1], [1, 0])
          : 1;

  const slideAmount =
    currentDuration <= 4 ? 15 : currentDuration <= 10 ? 25 : 35;
  const wordY =
    !isRotating || currentWordIndex === -2
      ? 0
      : wordProgress < fadeRatio
        ? interpolate(wordProgress, [0, fadeRatio], [slideAmount, 0])
        : wordProgress > 1 - fadeRatio
          ? interpolate(wordProgress, [1 - fadeRatio, 1], [0, -slideAmount])
          : 0;

  const sceneOpacity = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const orderProgress = spring({
    frame: Math.max(0, localFrame - 8),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        opacity: sceneOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        {/* Tap the link in bio */}
        <div
          style={{
            color: COLORS.ivory,
            fontSize: 85,
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            textShadow: "0 8px 40px rgba(0,0,0,0.4)",
            transform: `scale(${interpolate(titleProgress, [0, 1], [0.5, 1])})`,
            opacity: titleProgress,
          }}
        >
          Tap the link in bio
        </div>

        {/* Order ___ */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: currentWordIndex === -2 ? 0 : 20,
            transform: `scale(${interpolate(orderProgress, [0, 1], [0.5, 1])})`,
            opacity: orderProgress,
          }}
        >
          {currentWordIndex === -2 ? (
            <span
              style={{
                color: COLORS.gold,
                fontSize: 90,
                fontWeight: 900,
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 8px 40px rgba(0,0,0,0.5)",
              }}
            >
              Just Order.
            </span>
          ) : (
            <>
              <span
                style={{
                  color: COLORS.ivory,
                  fontSize: 72,
                  fontWeight: 800,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  textShadow: "0 6px 30px rgba(0,0,0,0.4)",
                }}
              >
                Order
              </span>
              <span
                style={{
                  color: COLORS.gold,
                  fontSize: 80,
                  fontWeight: 900,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  textShadow: "0 6px 30px rgba(0,0,0,0.4)",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                }}
              >
                {currentWordIndex === -1
                  ? "Now"
                  : SB_ROTATING_WORDS[currentWordIndex].word}
              </span>
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// POWERED BY SHORTLIST FOOTER
// ============================================================================
const PoweredByFooter: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [TIMING.GAMEDAY_START + 5, TIMING.GAMEDAY_START + 20],
    [0, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < TIMING.GAMEDAY_START) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity,
        zIndex: 300,
      }}
    >
      <div
        style={{
          fontSize: 28,
          color: "rgba(250, 248, 245, 0.75)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 500,
          letterSpacing: 1.5,
        }}
      >
        Powered by Shortlist SmartAssistant
      </div>
      <Img
        src={staticFile("shortlist-logo-ivory-transparent.png")}
        style={{
          height: 55,
          objectFit: "contain",
          opacity: 0.85,
        }}
      />
    </div>
  );
};

// ============================================================================
// EMPANADA JUMP SCARE ENDING
// ============================================================================
const EmpanadaJumpScare: React.FC = () => {
  const frame = useCurrentFrame();

  const SCARE_START = TIMING.TOTAL_DURATION - 18;

  if (frame < SCARE_START) return null;

  const localFrame = frame - SCARE_START;

  const burstProgress = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(burstProgress, [0, 0.3, 1], [0.15, 0.4, 12], {
    extrapolateRight: "clamp",
  });
  const rotation = interpolate(burstProgress, [0, 1], [-20, 45]);
  const y = interpolate(burstProgress, [0, 1], [150, -100]);
  const opacity = interpolate(localFrame, [0, 2], [0, 1], {
    extrapolateRight: "clamp",
  });

  const shakeIntensity =
    localFrame > 6 && localFrame < 15 ? (15 - localFrame) * 3 : 0;
  const shakeX = Math.sin(localFrame * 12) * shakeIntensity;
  const shakeY = Math.cos(localFrame * 10) * shakeIntensity * 0.7;

  const flashOpacity = interpolate(localFrame, [6, 7, 10], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 400,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <Img
          src={staticFile("sweet-empanada.png")}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 350,
            height: 350,
            objectFit: "contain",
            opacity,
            transform: `translate(-50%, -50%) translateY(${y}px) scale(${scale}) rotate(${rotation}deg)`,
            filter: `drop-shadow(0 ${10 + scale * 5}px ${20 + scale * 10}px rgba(0,0,0,0.7))`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#fff",
          opacity: flashOpacity,
        }}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const NitosSuperBowl: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <QBThrowScene />
      <GameDaySlam />
      <PhoneScene />
      <FieldGoalScene />
      <CTAScene />
      <PoweredByFooter />
      <EmpanadaJumpScare />
    </AbsoluteFill>
  );
};
