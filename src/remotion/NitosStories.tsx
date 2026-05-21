import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ============================================================================
// TIMING (30fps)
// ============================================================================
const FPS = 30;
const TIMING = {
  // FRAME 1 - The Problem
  LINE_1_START: 15,                    // "YOU COOK IT." slides in
  LINE_2_START: 30,                    // "YOU PLATE IT." slides in
  // Word-by-word slam: THEY... TAKE... 30%
  WORD_THEY: 55,                       // "THEY" slams
  WORD_TAKE: 70,                       // "TAKE" slams
  WORD_30: 85,                         // "30%" slams
  LINE_4_START: 115,                   // "FOR A BUTTON." fades in (more breathing room)
  FRAME_1_HOLD_END: 160,               // Hold Frame 1
  FRAME_1_FADE_OUT: 160,               // All text fades out (0.5s = 15 frames)

  // FRAME 2 - The Reveal
  PHONE_START: 175,                    // Phone rises (1s = 30 frames)
  PHONE_SETTLE: 205,                   // Phone settled
  REVEAL_TEXT_1: 195,                  // "Your Business." - starts with box
  REVEAL_TEXT_2: 207,                  // "Your Orders."
  REVEAL_TEXT_3: 219,                  // "Your Money."
  FRAME_2_FADE_OUT: 285,               // Scene 2 fades out

  // FRAME 3 - The Tag
  TAG_START: 300,                      // SmartPage text appears
  TAG_HOLD_END: 390,                   // Hold 3 seconds (90 frames)
};

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  mintGreen: "#98D4BB",
  mintDark: "#7AC4A8",
};

// ============================================================================
// NOISE TEXTURE BACKGROUND
// ============================================================================
const NoisyBackground: React.FC<{ shake?: number }> = ({ shake = 0 }) => {
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shake}px, ${shake * 0.5}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -20,
          background: `radial-gradient(ellipse at center, ${COLORS.mintGreen} 0%, ${COLORS.mintDark} 100%)`,
        }}
      />
      <svg
        style={{
          position: "absolute",
          inset: -20,
          width: "calc(100% + 40px)",
          height: "calc(100% + 40px)",
          opacity: 0.4,
          mixBlendMode: "overlay",
        }}
      >
        <defs>
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// BLURRED DELIVERY LOGOS - stuck/frozen loading effect (3 apps, larger, almost legible)
// ============================================================================
const BlurredLogos: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(
    frame,
    [TIMING.FRAME_1_FADE_OUT, TIMING.FRAME_1_FADE_OUT + 15],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (fadeOut === 0) return null;

  // 3 logos above the black box - large (adjusted for 1080x1350)
  const logos = [
    // Left
    { src: "nitos-gallery/doordash logo.png", x: -20, y: 30, size: 320, rotation: -8, delay: 0, hoverSpeed: 0.08, hoverAmount: 6 },
    // Center
    { src: "nitos-gallery/uber eats logo.png", x: 360, y: 10, size: 360, rotation: 5, delay: 5, hoverSpeed: 0.06, hoverAmount: 8 },
    // Right
    { src: "nitos-gallery/grubhub logo ap.png", x: 700, y: 50, size: 340, rotation: 10, delay: 10, hoverSpeed: 0.07, hoverAmount: 7 },
  ];

  return (
    <>
      {logos.map((logo, i) => {
        const startFrame = 10 + logo.delay;
        const localFrame = frame - startFrame;

        // Simple fade in then stay frozen (stuck/faded)
        const opacity = interpolate(
          localFrame,
          [0, 30],
          [0, 0.55],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
        );

        if (localFrame < 0) return null;

        // Gentle hover animation - subtle floating effect
        const hoverY = Math.sin(frame * logo.hoverSpeed) * logo.hoverAmount;
        const hoverX = Math.cos(frame * logo.hoverSpeed * 0.7) * (logo.hoverAmount * 0.4);

        return (
          <Img
            key={i}
            src={staticFile(logo.src)}
            style={{
              position: "absolute",
              left: logo.x + hoverX,
              top: logo.y + hoverY,
              width: logo.size,
              height: logo.size,
              objectFit: "contain",
              opacity: opacity * fadeOut,
              transform: `rotate(${logo.rotation}deg)`,
              filter: "blur(8px)", // Just a touch more blur
            }}
          />
        );
      })}
    </>
  );
};

// ============================================================================
// FRAME 1 - THE PROBLEM (Text in black box)
// ============================================================================
const Frame1Text: React.FC = () => {
  const frame = useCurrentFrame();
  const centerX = 540;
  const screenWidth = 1080;

  // Fade out all text together
  const fadeOut = interpolate(
    frame,
    [TIMING.FRAME_1_FADE_OUT, TIMING.FRAME_1_FADE_OUT + 15],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (fadeOut === 0) return null;

  // Black box appears early
  const boxStart = 10;
  const boxWidth = interpolate(
    frame,
    [boxStart, boxStart + 12],
    [0, screenWidth - 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const boxOpacity = interpolate(
    frame,
    [boxStart, boxStart + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // LINE 1: "YOU COOK IT." - slide from left
  const line1X = interpolate(
    frame,
    [TIMING.LINE_1_START, TIMING.LINE_1_START + 9],
    [-400, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const line1Opacity = interpolate(
    frame,
    [TIMING.LINE_1_START, TIMING.LINE_1_START + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // LINE 2: "YOU PLATE IT." - slide from right
  const line2X = interpolate(
    frame,
    [TIMING.LINE_2_START, TIMING.LINE_2_START + 9],
    [400, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const line2Opacity = interpolate(
    frame,
    [TIMING.LINE_2_START, TIMING.LINE_2_START + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Word-by-word slam animations
  const wordTheyScale = interpolate(
    frame,
    [TIMING.WORD_THEY, TIMING.WORD_THEY + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.8)) }
  );
  const wordTheyOpacity = frame >= TIMING.WORD_THEY ? 1 : 0;

  const wordTakeScale = interpolate(
    frame,
    [TIMING.WORD_TAKE, TIMING.WORD_TAKE + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.8)) }
  );
  const wordTakeOpacity = frame >= TIMING.WORD_TAKE ? 1 : 0;

  const word30Scale = interpolate(
    frame,
    [TIMING.WORD_30, TIMING.WORD_30 + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) }
  );
  const word30Opacity = frame >= TIMING.WORD_30 ? 1 : 0;

  // LINE 4: "FOR A BUTTON?" - slow fade
  const line4Opacity = interpolate(
    frame,
    [TIMING.LINE_4_START, TIMING.LINE_4_START + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ opacity: fadeOut }}>
      {/* Black rounded box containing all text */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: centerX,
          transform: "translateX(-50%)",
          width: boxWidth,
          backgroundColor: "#FFFFFF",
          borderRadius: 32,
          opacity: boxOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 36px",
          gap: 14,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        {/* YOU COOK IT. */}
        <div
          style={{
            fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
            fontSize: 52,
            letterSpacing: 2,
            opacity: line1Opacity,
            transform: `translateX(${line1X}px)`,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: 900, color: "#000000" }}>YOU</span>
          <span style={{ fontWeight: 700, color: "#1A1A1A" }}> COOK IT.</span>
        </div>

        {/* YOU PLATE IT. */}
        <div
          style={{
            fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
            fontSize: 52,
            letterSpacing: 2,
            opacity: line2Opacity,
            transform: `translateX(${line2X}px)`,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: 900, color: "#000000" }}>YOU</span>
          <span style={{ fontWeight: 700, color: "#1A1A1A" }}> PLATE IT.</span>
        </div>

        {/* THEY TAKE 30% - word by word slam */}
        <div
          style={{
            display: "flex",
            gap: 12,
            whiteSpace: "nowrap",
            marginTop: 14,
          }}
        >
          <span
            style={{
              fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
              fontSize: 72,
              fontWeight: 900,
              color: "#000000",
              letterSpacing: -2,
              opacity: wordTheyOpacity,
              transform: `scale(${wordTheyScale})`,
              display: "inline-block",
            }}
          >
            THEY
          </span>
          <span
            style={{
              fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
              fontSize: 72,
              fontWeight: 900,
              color: "#000000",
              letterSpacing: -2,
              opacity: wordTakeOpacity,
              transform: `scale(${wordTakeScale})`,
              display: "inline-block",
            }}
          >
            TAKE
          </span>
          <span
            style={{
              fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
              fontSize: 72,
              fontWeight: 900,
              color: "#000000",
              letterSpacing: -2,
              opacity: word30Opacity,
              transform: `scale(${word30Scale})`,
              display: "inline-block",
            }}
          >
            30%
          </span>
        </div>

        {/* FOR A BUTTON? + mock button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            opacity: line4Opacity,
            marginTop: 14,
          }}
        >
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 30,
              fontWeight: 500,
              color: "#333333",
              letterSpacing: 4,
              whiteSpace: "nowrap",
            }}
          >
            FOR A BUTTON?
          </div>
          {/* Mock delivery app button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#E23B3B",
              borderRadius: 44,
              padding: "14px 28px 14px 22px",
              gap: 12,
              boxShadow: "0 5px 16px rgba(0,0,0,0.4)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="white" />
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="white" />
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div
              style={{
                backgroundColor: "white",
                color: "#E23B3B",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN SHAKE - disabled for cleaner feel
// ============================================================================
const useScreenShake = (): { x: number; y: number } => {
  return { x: 0, y: 0 };
};

// ============================================================================
// PHONE - Stop motion effect
// ============================================================================
const Phone: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < TIMING.PHONE_START) return null;
  if (frame >= TIMING.TAG_START) return null;

  // Stop motion: step through discrete positions
  const stopMotionSteps = 6;
  const duration = TIMING.PHONE_SETTLE - TIMING.PHONE_START;
  const progress = Math.min((frame - TIMING.PHONE_START) / duration, 1);

  // Quantize progress to create stop-motion stepping effect
  const steppedProgress = Math.floor(progress * stopMotionSteps) / stopMotionSteps;

  // Phone rises from off-screen, large and prominent
  const startY = 700; // Start off screen
  const endY = -50; // Final position - move up to show fully
  const y = interpolate(steppedProgress, [0, 1], [startY, endY]);

  // Fade in only, hard cut out handled by return null above
  const opacity = interpolate(
    frame,
    [TIMING.PHONE_START, TIMING.PHONE_START + 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Large phone that overlaps the box and fills most of the screen
  return (
    <Img
      src={staticFile("nitos-gallery/Nitos phone2.png")}
      style={{
        position: "absolute",
        left: "50%",
        top: 250, // 15% higher
        width: 1080, // 20% larger
        height: "auto",
        transform: `translateX(-50%) translateY(${y}px)`,
        opacity,
        zIndex: 100, // Top layer
      }}
    />
  );
};

// ============================================================================
// FRAME 2 - REVEAL TEXT with black box (Your Business. Your Orders. Your Money.)
// ============================================================================
const Frame2Text: React.FC = () => {
  const frame = useCurrentFrame();
  const centerX = 540;
  const screenWidth = 1080;

  // Black box appears first
  const boxStart = TIMING.PHONE_START + 15;
  if (frame < boxStart) return null;
  if (frame >= TIMING.TAG_START) return null;


  // Box stretches in from center
  const boxWidth = interpolate(
    frame,
    [boxStart, boxStart + 12],
    [0, screenWidth - 80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  const boxOpacity = interpolate(
    frame,
    [boxStart, boxStart + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Text slides in horizontally one at a time
  // "Your Business." - slides from left
  const text1X = interpolate(
    frame,
    [TIMING.REVEAL_TEXT_1, TIMING.REVEAL_TEXT_1 + 12],
    [-400, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const text1Opacity = interpolate(
    frame,
    [TIMING.REVEAL_TEXT_1, TIMING.REVEAL_TEXT_1 + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "Your Orders." - slides from right
  const text2X = interpolate(
    frame,
    [TIMING.REVEAL_TEXT_2, TIMING.REVEAL_TEXT_2 + 12],
    [400, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const text2Opacity = interpolate(
    frame,
    [TIMING.REVEAL_TEXT_2, TIMING.REVEAL_TEXT_2 + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "Your Money." - slides from left
  const text3X = interpolate(
    frame,
    [TIMING.REVEAL_TEXT_3, TIMING.REVEAL_TEXT_3 + 12],
    [-400, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const text3Opacity = interpolate(
    frame,
    [TIMING.REVEAL_TEXT_3, TIMING.REVEAL_TEXT_3 + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Position below 30% mark (1350 * 0.3 = 405)
  const boxTop = 420;

  return (
    <>
      {/* Black rounded box */}
      <div
        style={{
          position: "absolute",
          top: boxTop,
          left: centerX,
          transform: "translateX(-50%)",
          width: boxWidth,
          height: 300,
          backgroundColor: "#0A0A0A",
          borderRadius: 32,
          opacity: boxOpacity,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          overflow: "hidden",
        }}
      >
        {/* Text inside the box - mint green */}
        <div
          style={{
            fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
            fontSize: 54,
            fontWeight: 900,
            color: COLORS.mintGreen,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: text1Opacity,
            transform: `translateX(${text1X}px)`,
          }}
        >
          YOUR BUSINESS.
        </div>
        <div
          style={{
            fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
            fontSize: 54,
            fontWeight: 900,
            color: COLORS.mintGreen,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: text2Opacity,
            transform: `translateX(${text2X}px)`,
          }}
        >
          YOUR ORDERS.
        </div>
        <div
          style={{
            fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
            fontSize: 54,
            fontWeight: 900,
            color: COLORS.mintGreen,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: text3Opacity,
            transform: `translateX(${text3X}px)`,
          }}
        >
          YOUR MONEY.
        </div>
      </div>
    </>
  );
};

// ============================================================================
// FRAME 3 - CTA (Black background, precise timing)
// ============================================================================
const Frame3: React.FC = () => {
  const frame = useCurrentFrame();
  const start = TIMING.TAG_START;

  if (frame < start) return null;

  const localFrame = frame - start;

  // ===== PHASE 1: "STOP GIVING AWAY 30% OF EVERY ORDER." =====
  // Frame 0: Both lines appear together instantly
  // Frame 0-45 (1.5s): Hold
  // Frame 45-57 (0.4s): Both slide up and fade out
  const phase1Visible = localFrame >= 0 && localFrame < 57;

  const phase1SlideUp = interpolate(
    localFrame,
    [45, 57],
    [0, -100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const phase1FadeOut = interpolate(
    localFrame,
    [45, 57],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ===== PHASE 2: Black screen 0.5s (frames 57-72) =====

  // ===== PHASE 3: "$44/MO. FLAT." + "KEEP YOUR MONEY." =====
  // Frame 72: "$44/MO. FLAT." starts fading in (0.5s = 15 frames)
  // Frame 90 (0.6s later): "KEEP YOUR MONEY." starts fading in
  // Hold 2s, then fade out
  const phase3Line1Opacity = interpolate(
    localFrame,
    [72, 87, 165, 177],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const phase3Line2Opacity = interpolate(
    localFrame,
    [90, 105, 165, 177],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ===== PHASE 4: Try it free (frames 177-220) =====
  // ===== PHASE 5: Shortlist logo with bleep-bloop (frame 225+) =====

  return (
    <>
      {/* Black background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
        }}
      />

      {/* PHASE 1: STOP GIVING AWAY 30% OF EVERY ORDER */}
      {phase1Visible && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transform: `translateY(${phase1SlideUp}px)`,
            opacity: phase1FadeOut,
          }}
        >
          <div
            style={{
              fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
              fontSize: 58,
              fontWeight: 900,
              color: "#FFFFFF",
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            STOP GIVING AWAY
          </div>
          <div
            style={{
              fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
              fontSize: 58,
              fontWeight: 900,
              color: "#FFFFFF",
              textAlign: "center",
              letterSpacing: 2,
              marginTop: 16,
            }}
          >
            30% OF EVERY ORDER.
          </div>
        </div>
      )}

      {/* PHASE 3: $44/MO. FLAT. / KEEP YOUR MONEY. / Try it free */}
      {localFrame >= 72 && localFrame < 185 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
              fontSize: 54,
              fontWeight: 900,
              color: COLORS.mintGreen,
              textAlign: "center",
              letterSpacing: 2,
              opacity: phase3Line1Opacity,
            }}
          >
            $44/MO. FLAT.
          </div>
          <div
            style={{
              fontFamily: "Impact, 'Arial Black', Haettenschweiler, sans-serif",
              fontSize: 54,
              fontWeight: 900,
              color: COLORS.mintGreen,
              textAlign: "center",
              letterSpacing: 2,
              marginTop: 16,
              opacity: phase3Line2Opacity,
            }}
          >
            KEEP YOUR MONEY.
          </div>
          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: 32,
              fontWeight: 400,
              color: "#CCCCCC",
              textAlign: "center",
              letterSpacing: 2,
              marginTop: 30,
              opacity: interpolate(
                localFrame,
                [120, 135, 165, 177],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
            }}
          >
            Try it free for 7 days.
          </div>
        </div>
      )}

      {/* PHASE 4: Shortlist logo with bleep-bloop */}
      {localFrame >= 185 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: interpolate(
              localFrame,
              [185, 188],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <Img
            src={staticFile("shortlist-logo-ivory-transparent.png")}
            style={{
              width: 480,
              height: "auto",
              transform: `scale(${(() => {
                const t = localFrame - 185;
                if (t < 4) return interpolate(t, [0, 4], [0, 1.15], { easing: Easing.out(Easing.cubic) });
                if (t < 8) return interpolate(t, [4, 8], [1.15, 0.9], { easing: Easing.inOut(Easing.cubic) });
                if (t < 12) return interpolate(t, [8, 12], [0.9, 1.05], { easing: Easing.inOut(Easing.cubic) });
                if (t < 16) return interpolate(t, [12, 16], [1.05, 1], { easing: Easing.out(Easing.cubic) });
                return 1;
              })()})`,
            }}
          />
        </div>
      )}
    </>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const NitosStories: React.FC = () => {
  const shake = useScreenShake();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background */}
      <NoisyBackground shake={shake.x} />

      {/* Blurred logos (Frame 1 only) - no shake, just frozen/stuck */}
      <BlurredLogos />

      {/* Frame 1 - Problem text */}
      <div style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}>
        <Frame1Text />
      </div>

      {/* Phone */}
      <Phone />

      {/* Frame 2 - Reveal text */}
      <Frame2Text />

      {/* Frame 3 - CTA */}
      <Frame3 />
    </AbsoluteFill>
  );
};
