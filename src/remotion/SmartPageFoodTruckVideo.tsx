import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ============================================================================
// TIMING CONSTANTS (30fps, 30 seconds = 900 frames)
// ============================================================================
const TIMING = {
  TOTAL_DURATION: 946, // ~31.5 seconds (1.5s logo hold)

  // Intro hook (full screen text)
  INTRO_DURATION: 60,
  INTRO_FADE_IN: 12,

  // "Introducing your smart assistant" section
  INTRO_ASSISTANT_START: 55,
  INTRO_ASSISTANT_END: 125, // 70 frames = ~2.3 seconds

  // "Customers never miss your location" overlay - BEFORE first Q&A
  LOCATION_OVERLAY_START: 130,
  LOCATION_OVERLAY_END: 195,

  // First Q&A cycle - text on phone 0.5s, fly out, hold 1.25s (~80 frames)
  CYCLE_1_START: 195,
  CYCLE_1_END: 275,

  // Location confirmed vector on overlay (1.25 seconds = 38 frames)
  LOCATION_ICON_START: 280,
  LOCATION_ICON_END: 318,

  // "Orders, handled" overlay - 1.25 seconds (38 frames)
  ORDERS_OVERLAY_START: 323,
  ORDERS_OVERLAY_END: 361,

  // Second Q&A cycle
  CYCLE_2_START: 361,
  CYCLE_2_END: 441,

  // Order confirmed vector on overlay (1.25 seconds = 38 frames)
  ORDERS_ICON_START: 446,
  ORDERS_ICON_END: 484,

  // "Answers you can trust" overlay - 1.25 seconds
  DIETARY_OVERLAY_START: 489,
  DIETARY_OVERLAY_END: 527,

  // Third Q&A cycle (dietary question)
  CYCLE_3_START: 527,
  CYCLE_3_END: 607,

  // Dietary confirmed vector on overlay (1.25 seconds)
  DIETARY_ICON_START: 612,
  DIETARY_ICON_END: 650,

  // "Events, booked" overlay - 1.25 seconds
  EVENTS_OVERLAY_START: 655,
  EVENTS_OVERLAY_END: 693,

  // Fourth Q&A cycle (events question)
  CYCLE_DURATION: 80,
  CYCLE_4_START: 693,
  CYCLE_4_END: 773,

  // Events confirmed vector on overlay (1.25 seconds)
  EVENTS_ICON_START: 778,
  EVENTS_ICON_END: 816,

  // Headline + Ending
  HEADLINE_START: 821,
  ENDING_START: 891, // ~2.3 seconds for headline, then logo
};

// Cycle timing within each cycle
// Flow: text on phone (0.5s) -> fly out -> hold 1.25s -> fade
const CYCLE_STEPS = {
  // Text already on phone from start
  QUESTION_BUBBLE_START: 0,
  ANSWER_BUBBLE_START: 5,
  // Fly out after 0.5s (15 frames)
  FLY_OUT_START: 15,
  FLY_OUT_ANIMATE: 12,
  // Hold for 1.25s (38 frames) after fly out completes
  HOLD_DURATION: 38,
  // Fade out starts after hold
  FADE_OUT_START: 65, // 15 + 12 + 38
};

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  ivory: "#FAF8F5",
  darkSlate: "#1a1a1a",
  charcoal: "#2a2a2a",
  charcoalOverlay: "rgba(15, 15, 15, 0.75)",
  accent: "#4A7C59",
};

// ============================================================================
// Q&A PAIRS - More variations for 30 seconds
// ============================================================================
const QA_PAIRS = [
  {
    question: "Where are you today?",
    answer: "Main St & 5th until 8pm",
  },
  {
    question: "Can I place an order?",
    answer: "Order ahead and skip the line",
  },
  {
    question: "I'm allergic to gluten — what can I eat?",
    answer: "3 gluten-free options available",
  },
  {
    question: "Do you cater events?",
    answer: "Yes! Book directly through our page",
  },
  {
    question: "What's on the menu today?",
    answer: "Beef, chicken, veggie empanadas + specials",
  },
];

// ============================================================================
// BACKGROUND IMAGES
// ============================================================================
const BACKGROUND_STAGES = [
  { image: "truck-pulling-up.png", startFrame: 0, duration: 200 },
  { image: "customers-lining-up.png", startFrame: 180, duration: 200 },
  { image: "prepping.png", startFrame: 360, duration: 200 },
  { image: "orders.png", startFrame: 540, duration: 200 },
  { image: "served.png", startFrame: 720, duration: 180 },
];

// ============================================================================
// BACKGROUND LAYER
// ============================================================================
const BackgroundLayer: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in from black during intro
  const introFadeIn = interpolate(
    frame,
    [0, TIMING.INTRO_FADE_IN],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headlineDim = interpolate(
    frame,
    [TIMING.HEADLINE_START - 10, TIMING.HEADLINE_START + 10],
    [1, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const endingFade = interpolate(
    frame,
    [TIMING.ENDING_START, TIMING.ENDING_START + 20],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: introFadeIn * headlineDim * endingFade }}>
      {BACKGROUND_STAGES.map((stage) => {
        const stageFrame = frame - stage.startFrame;
        if (stageFrame < -20 || stageFrame > stage.duration + 20) return null;

        const fadeIn = interpolate(stageFrame, [-20, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(
          stageFrame,
          [stage.duration - 20, stage.duration + 15],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const scale = interpolate(stageFrame, [0, stage.duration], [1.02, 1.08]);
        const panX = interpolate(stageFrame, [0, stage.duration], [0, 12]);

        return (
          <AbsoluteFill
            key={stage.image}
            style={{
              opacity: fadeIn * fadeOut,
              filter: "blur(10px)",
              transform: `scale(${scale}) translateX(${panX}px)`,
            }}
          >
            <Img
              src={staticFile(stage.image)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: COLORS.charcoalOverlay }} />
    </AbsoluteFill>
  );
};

// ============================================================================
// INTRO HOOK - Full screen headline with wipe reveal
// ============================================================================
const IntroHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame >= TIMING.INTRO_DURATION) return null;

  // Words stacked vertically - FULL SCREEN
  const words = [
    { text: "THE", delay: 6, size: 140 },
    { text: "FOOD", delay: 10, size: 160 },
    { text: "TRUCK", delay: 14, size: 160 },
    { text: "GAME", delay: 18, size: 150 },
    { text: "HAS", delay: 22, size: 130 },
    { text: "CHANGED", delay: 26, size: 120 },
  ];

  // Full diagonal wipe from top-right to bottom-left
  // Wipe IN (covers screen): frames 46-52
  // Wipe OUT (reveals new scene): frames 52-58
  const wipeInProgress = interpolate(
    frame,
    [46, 52],
    [-50, 150],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const wipeOutProgress = interpolate(
    frame,
    [52, 58],
    [0, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* White diagonal wipe overlay - sweeps across then out */}
      {frame >= 46 && frame < 58 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#fff",
            clipPath: frame < 52
              ? `polygon(${wipeInProgress}% 0%, 100% 0%, 100% 100%, ${wipeInProgress - 50}% 100%)`
              : `polygon(${wipeOutProgress}% 0%, 100% 0%, 100% 100%, ${wipeOutProgress - 50}% 100%)`,
            zIndex: 200,
          }}
        />
      )}

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
          // Hide when wipe covers
          opacity: frame < 50 ? 1 : 0,
        }}
      >
        {/* Darker overlay during intro */}
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(0, 0, 0, ${interpolate(frame, [0, 10], [1, 0.6], { extrapolateRight: "clamp" })})`,
          }}
        />

        {/* Full screen stacked words */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "120px 20px",
            gap: 0,
          }}
        >
          {words.map((word, index) => {
            const wordProgress = spring({
              frame: Math.max(0, frame - word.delay),
              fps,
              config: { damping: 14, stiffness: 180, mass: 0.6 },
            });

            const wordScale = interpolate(wordProgress, [0, 1], [1.3, 1]);
            const wordOpacity = wordProgress;
            const wordY = interpolate(wordProgress, [0, 1], [40, 0]);

            return (
              <div
                key={index}
                style={{
                  color: COLORS.ivory,
                  fontSize: word.size,
                  fontWeight: 900,
                  textAlign: "center",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -2,
                  lineHeight: 0.85,
                  textShadow: "0 8px 60px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)",
                  transform: `scale(${wordScale}) translateY(${wordY}px)`,
                  opacity: wordOpacity,
                }}
              >
                {word.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// INTRO ASSISTANT TEXT - "INTRODUCING" then "Your Smart Assistant" with arrow
// ============================================================================
const IntroAssistantText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Show after wipe reveal, stays for 2+ seconds
  const startFrame = TIMING.INTRO_ASSISTANT_START;
  const endFrame = TIMING.INTRO_ASSISTANT_END;
  const localFrame = frame - startFrame;

  if (frame < startFrame || frame > endFrame) return null;

  // "INTRODUCING" appears first - big and bold
  const introducingProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // "Your Smart Assistant" appears after more breathing room
  const assistantProgress = spring({
    frame: Math.max(0, localFrame - 28),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Arrow draw animation (starts after text)
  const arrowProgress = spring({
    frame: Math.max(0, localFrame - 40),
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Fade out before Q&A starts
  const fadeOut = interpolate(
    localFrame,
    [endFrame - startFrame - 12, endFrame - startFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Dramatic arch: starts after "Assistant" T, curves out right, then back to point at right side of phone
  // Curve ends going down-left, so arrow head should point that way
  const arrowPath = "M 0 0 C 60 -20, 140 20, 160 80 C 175 130, 150 200, 100 225";
  // Arrow head: tip at end of curve, arms go back up-right (moved up ~35 units)
  const arrowHeadPath = "M 115 207 L 100 225 L 118 230";

  return (
    <AbsoluteFill style={{ zIndex: 50 }}>
      {/* INTRODUCING - moved down closer to phone */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: "50%",
          transform: `translateX(-50%) scale(${interpolate(introducingProgress, [0, 1], [0.8, 1])})`,
          opacity: introducingProgress * fadeOut,
        }}
      >
        <div
          style={{
            color: COLORS.ivory,
            fontSize: 52,
            fontWeight: 800,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            letterSpacing: 6,
            textShadow: "0 6px 40px rgba(0,0,0,0.9)",
          }}
        >
          INTRODUCING
        </div>
      </div>

      {/* Your Smart Assistant - below INTRODUCING with more spacing */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: "50%",
          transform: `translateX(-50%) translateY(${interpolate(assistantProgress, [0, 1], [20, 0])}px)`,
          opacity: assistantProgress * fadeOut,
        }}
      >
        <div
          style={{
            color: COLORS.ivory,
            fontSize: 46,
            fontWeight: 500,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            lineHeight: 1.3,
            textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          }}
        >
          Your Smart
        </div>
        <div
          style={{
            color: COLORS.accent,
            fontSize: 62,
            fontWeight: 700,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
            lineHeight: 1.1,
            textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          }}
        >
          Assistant
        </div>
      </div>

      {/* Arrow - starts after "T" in Assistant, dramatic arch to right side of phone */}
      <svg
        width="200"
        height="300"
        style={{
          position: "absolute",
          top: 470,
          left: "50%",
          transform: `translateX(70px)`,
          opacity: arrowProgress * fadeOut,
        }}
      >
        {/* Arrow curve - dramatic arch outward then down to phone side */}
        <path
          d={arrowPath}
          fill="none"
          stroke={COLORS.ivory}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="400"
          strokeDashoffset={interpolate(arrowProgress, [0, 1], [400, 0])}
          style={{
            filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.6))",
          }}
        />
        {/* Arrow head - points left toward phone */}
        <path
          d={arrowHeadPath}
          fill="none"
          stroke={COLORS.ivory}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={interpolate(arrowProgress, [0.8, 1], [0, 1], { extrapolateLeft: "clamp" })}
          style={{
            filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.6))",
          }}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// LOCATION OVERLAY - "Customers never miss your location" - FULL SCREEN
// ============================================================================
const LocationOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Appears AFTER location icon
  const startFrame = TIMING.LOCATION_OVERLAY_START;
  const endFrame = TIMING.LOCATION_OVERLAY_END;

  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;

  // Words stacked vertically - FULL SCREEN like intro
  const words = [
    { text: "CUSTOMERS", delay: 0, size: 100 },
    { text: "NEVER", delay: 4, size: 120 },
    { text: "MISS", delay: 8, size: 140 },
    { text: "YOUR", delay: 12, size: 120 },
    { text: "LOCATION", delay: 16, size: 95 },
  ];

  // Fade in overlay
  const overlayFade = interpolate(
    localFrame,
    [0, 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out before Q&A starts
  const fadeOut = interpolate(
    frame,
    [TIMING.CYCLE_1_START - 10, TIMING.CYCLE_1_START + 5],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Soft gaussian blur layer behind the overlay */}
      <AbsoluteFill
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 44,
          opacity: overlayFade * fadeOut,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 45,
          opacity: overlayFade * fadeOut,
        }}
      >
        {/* Full screen stacked words */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "120px 20px",
          gap: 45,
        }}
      >
        {words.map((word, index) => {
          const wordProgress = spring({
            frame: Math.max(0, localFrame - word.delay),
            fps,
            config: { damping: 14, stiffness: 180, mass: 0.6 },
          });

          const wordScale = interpolate(wordProgress, [0, 1], [1.3, 1]);
          const wordOpacity = wordProgress * fadeOut;
          const wordY = interpolate(wordProgress, [0, 1], [40, 0]);

          return (
            <div
              key={index}
              style={{
                color: COLORS.ivory,
                fontSize: word.size,
                fontWeight: 900,
                textAlign: "center",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -2,
                lineHeight: 1,
                textShadow: "0 8px 60px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)",
                transform: `scale(${wordScale}) translateY(${wordY}px)`,
                opacity: wordOpacity,
              }}
            >
              {word.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
    </>
  );
};

// ============================================================================
// LOCATION CONFIRMED - Icon on overlay, centered
// ============================================================================
const LocationConfirmed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = TIMING.LOCATION_ICON_START;
  const endFrame = TIMING.LOCATION_ICON_END;

  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;

  // Overlay fade
  const overlayFade = interpolate(
    localFrame,
    [0, 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Stamp-in effect with scale settle
  const stampProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.8 },
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [endFrame - 8, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const iconScale = interpolate(stampProgress, [0, 1], [1.4, 1]);

  return (
    <>
      {/* Dark overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 50,
          opacity: overlayFade * fadeOut,
        }}
      />
      {/* Centered icon */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 51,
          opacity: stampProgress * fadeOut,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
            transform: `scale(${iconScale})`,
          }}
        >
          {/* Green circle with white map pin */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              backgroundColor: COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(74,124,89,0.5), 0 8px 30px rgba(0,0,0,0.3)",
            }}
          >
            <svg
              width="110"
              height="110"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginTop: -6 }}
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill={COLORS.ivory}
              />
            </svg>
          </div>

          {/* Text */}
          <div
            style={{
              color: COLORS.ivory,
              fontSize: 36,
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            Location confirmed
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// ORDERS HANDLED - Icon on overlay, centered with stamp-in effect
// ============================================================================
const OrdersHandledIcon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = TIMING.ORDERS_ICON_START;
  const endFrame = TIMING.ORDERS_ICON_END;

  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;

  // Overlay fade
  const overlayFade = interpolate(
    localFrame,
    [0, 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Stamp-in effect with scale settle
  const stampProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.8 },
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [endFrame - 8, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const iconScale = interpolate(stampProgress, [0, 1], [1.4, 1]);

  return (
    <>
      {/* Dark overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 50,
          opacity: overlayFade * fadeOut,
        }}
      />
      {/* Centered icon */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 51,
          opacity: stampProgress * fadeOut,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
            transform: `scale(${iconScale})`,
          }}
        >
          {/* Green circle with receipt + check icon */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              backgroundColor: COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(74,124,89,0.5), 0 8px 30px rgba(0,0,0,0.3)",
            }}
          >
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 .55.23 1.05.59 1.41l.01.01c.36.36.85.58 1.4.58h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"
                fill={COLORS.ivory}
                opacity="0.3"
              />
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                fill="none"
                stroke={COLORS.ivory}
                strokeWidth="1.5"
              />
              <path
                d="M9 12l2 2 4-4"
                fill="none"
                stroke={COLORS.ivory}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Text */}
          <div
            style={{
              color: COLORS.ivory,
              fontSize: 36,
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            Order confirmed
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// ORDERS HANDLED OVERLAY - Full screen text
// ============================================================================
const OrdersOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = TIMING.ORDERS_OVERLAY_START;
  const endFrame = TIMING.ORDERS_OVERLAY_END;

  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;

  // Words stacked vertically
  const words = [
    { text: "ORDERS,", delay: 0, size: 140 },
    { text: "HANDLED.", delay: 6, size: 150 },
  ];

  // Fade in overlay
  const overlayFade = interpolate(
    localFrame,
    [0, 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out
  const fadeOut = interpolate(
    frame,
    [endFrame - 12, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Soft gaussian blur layer */}
      <AbsoluteFill
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 44,
          opacity: overlayFade * fadeOut,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 45,
          opacity: overlayFade * fadeOut,
        }}
      >
        {/* Full screen stacked words */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "120px 20px",
            gap: 30,
          }}
        >
          {words.map((word, index) => {
            const wordProgress = spring({
              frame: Math.max(0, localFrame - word.delay),
              fps,
              config: { damping: 14, stiffness: 180, mass: 0.6 },
            });

            const wordScale = interpolate(wordProgress, [0, 1], [1.3, 1]);
            const wordOpacity = wordProgress * fadeOut;
            const wordY = interpolate(wordProgress, [0, 1], [40, 0]);

            return (
              <div
                key={index}
                style={{
                  color: COLORS.ivory,
                  fontSize: word.size,
                  fontWeight: 900,
                  textAlign: "center",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -2,
                  lineHeight: 1,
                  textShadow: "0 8px 60px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)",
                  transform: `scale(${wordScale}) translateY(${wordY}px)`,
                  opacity: wordOpacity,
                }}
              >
                {word.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// DIETARY OVERLAY - "Dietary questions, handled." - FULL SCREEN
// ============================================================================
const DietaryOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = TIMING.DIETARY_OVERLAY_START;
  const endFrame = TIMING.DIETARY_OVERLAY_END;

  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;

  // Words stacked vertically
  const words = [
    { text: "ANSWERS", delay: 0, size: 110 },
    { text: "YOU CAN", delay: 4, size: 100 },
    { text: "TRUST.", delay: 8, size: 140 },
  ];

  // Overlay fade
  const overlayFade = interpolate(
    localFrame,
    [0, 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out
  const fadeOut = interpolate(
    frame,
    [endFrame - 10, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      <AbsoluteFill
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 44,
          opacity: overlayFade * fadeOut,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 45,
          opacity: overlayFade * fadeOut,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "120px 20px",
            gap: 30,
          }}
        >
          {words.map((word, index) => {
            const wordProgress = spring({
              frame: Math.max(0, localFrame - word.delay),
              fps,
              config: { damping: 14, stiffness: 180, mass: 0.6 },
            });

            const wordScale = interpolate(wordProgress, [0, 1], [1.3, 1]);
            const wordOpacity = wordProgress * fadeOut;
            const wordY = interpolate(wordProgress, [0, 1], [40, 0]);

            return (
              <div
                key={index}
                style={{
                  color: COLORS.ivory,
                  fontSize: word.size,
                  fontWeight: 900,
                  textAlign: "center",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -2,
                  lineHeight: 1,
                  textShadow: "0 8px 60px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)",
                  transform: `scale(${wordScale}) translateY(${wordY}px)`,
                  opacity: wordOpacity,
                }}
              >
                {word.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// DIETARY CONFIRMED - Shield + checkmark icon on overlay
// ============================================================================
const DietaryConfirmedIcon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = TIMING.DIETARY_ICON_START;
  const endFrame = TIMING.DIETARY_ICON_END;

  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;

  // Overlay fade
  const overlayFade = interpolate(
    localFrame,
    [0, 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Stamp-in effect with scale settle
  const stampProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.8 },
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [endFrame - 8, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const iconScale = interpolate(stampProgress, [0, 1], [1.4, 1]);

  // Muted blue-green color
  const mutedTeal = "#3D7A7A";

  return (
    <>
      {/* Dark overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 50,
          opacity: overlayFade * fadeOut,
        }}
      />
      {/* Centered icon */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 51,
          opacity: stampProgress * fadeOut,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
            transform: `scale(${iconScale})`,
          }}
        >
          {/* Muted teal circle with shield + checkmark */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              backgroundColor: mutedTeal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(61,122,122,0.5), 0 8px 30px rgba(0,0,0,0.3)",
            }}
          >
            {/* Shield with checkmark SVG */}
            <svg width="110" height="110" viewBox="0 0 24 24" fill="none">
              {/* Shield shape */}
              <path
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
                fill={COLORS.ivory}
                opacity="0.2"
              />
              <path
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
                fill="none"
                stroke={COLORS.ivory}
                strokeWidth="1.5"
              />
              {/* Checkmark */}
              <path
                d="M9 12l2 2 4-4"
                fill="none"
                stroke={COLORS.ivory}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Text */}
          <div
            style={{
              color: COLORS.ivory,
              fontSize: 36,
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            Dietary info confirmed
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// EVENTS OVERLAY - "Events, booked." - FULL SCREEN
// ============================================================================
const EventsOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = TIMING.EVENTS_OVERLAY_START;
  const endFrame = TIMING.EVENTS_OVERLAY_END;

  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;

  // Words stacked vertically
  const words = [
    { text: "EVENTS,", delay: 0, size: 140 },
    { text: "BOOKED.", delay: 6, size: 150 },
  ];

  // Overlay fade
  const overlayFade = interpolate(
    localFrame,
    [0, 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade out
  const fadeOut = interpolate(
    frame,
    [endFrame - 10, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      <AbsoluteFill
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 44,
          opacity: overlayFade * fadeOut,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 45,
          opacity: overlayFade * fadeOut,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "120px 20px",
            gap: 30,
          }}
        >
          {words.map((word, index) => {
            const wordProgress = spring({
              frame: Math.max(0, localFrame - word.delay),
              fps,
              config: { damping: 14, stiffness: 180, mass: 0.6 },
            });

            const wordScale = interpolate(wordProgress, [0, 1], [1.3, 1]);
            const wordOpacity = wordProgress * fadeOut;
            const wordY = interpolate(wordProgress, [0, 1], [40, 0]);

            return (
              <div
                key={index}
                style={{
                  color: COLORS.ivory,
                  fontSize: word.size,
                  fontWeight: 900,
                  textAlign: "center",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: -2,
                  lineHeight: 1,
                  textShadow: "0 8px 60px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)",
                  transform: `scale(${wordScale}) translateY(${wordY}px)`,
                  opacity: wordOpacity,
                }}
              >
                {word.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// EVENTS CONFIRMED - Calendar + checkmark icon on overlay
// ============================================================================
const EventsConfirmedIcon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = TIMING.EVENTS_ICON_START;
  const endFrame = TIMING.EVENTS_ICON_END;

  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;

  // Overlay fade
  const overlayFade = interpolate(
    localFrame,
    [0, 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Calendar snap-in effect
  const calendarProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 220, mass: 0.7 },
  });

  // Checkmark lands a beat later
  const checkProgress = spring({
    frame: Math.max(0, localFrame - 8),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [endFrame - 8, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const calendarScale = interpolate(calendarProgress, [0, 1], [1.5, 1]);

  return (
    <>
      {/* Dark overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 50,
          opacity: overlayFade * fadeOut,
        }}
      />
      {/* Centered icon */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          zIndex: 51,
          opacity: calendarProgress * fadeOut,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
            transform: `scale(${calendarScale})`,
          }}
        >
          {/* Green circle with calendar + checkmark */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              backgroundColor: COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(74,124,89,0.5), 0 8px 30px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            {/* Calendar SVG */}
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
              {/* Calendar body */}
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                fill={COLORS.ivory}
                opacity="0.2"
              />
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                fill="none"
                stroke={COLORS.ivory}
                strokeWidth="1.5"
              />
              {/* Calendar top bar */}
              <path
                d="M3 9h18"
                stroke={COLORS.ivory}
                strokeWidth="1.5"
              />
              {/* Calendar hooks */}
              <path
                d="M8 2v4M16 2v4"
                stroke={COLORS.ivory}
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Date squares (symbolic) */}
              <rect x="7" y="12" width="3" height="3" rx="0.5" fill={COLORS.ivory} opacity="0.5" />
              <rect x="12" y="12" width="3" height="3" rx="0.5" fill={COLORS.ivory} opacity="0.5" />
              <rect x="7" y="17" width="3" height="3" rx="0.5" fill={COLORS.ivory} opacity="0.5" />
            </svg>

            {/* Checkmark overlay - lands a beat later */}
            <div
              style={{
                position: "absolute",
                bottom: 15,
                right: 15,
                width: 50,
                height: 50,
                borderRadius: "50%",
                backgroundColor: "#2D5A3D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: checkProgress,
                transform: `scale(${interpolate(checkProgress, [0, 1], [0.5, 1])})`,
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L19 7"
                  stroke={COLORS.ivory}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div
            style={{
              color: COLORS.ivory,
              fontSize: 36,
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: 2,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            Event booked
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// TYPING INPUT - Static placeholder (typing animation removed)
// ============================================================================
const TypingInput: React.FC = () => {
  return (
    <div style={{ color: "rgba(250,248,245,0.4)", fontSize: 11 }}>
      Ask Shorty anything...
    </div>
  );
};

// ============================================================================
// PHONE COMPONENT - CENTER
// ============================================================================
const PhoneHero: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone fades in after wipe reveal (frame 50+)
  // Fully visible by the time Q&A starts
  const phoneRevealStart = 50;

  const phoneOpacity = interpolate(
    frame,
    [phoneRevealStart, phoneRevealStart + 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const blurAmount = interpolate(
    frame,
    [phoneRevealStart, phoneRevealStart + 20],
    [4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fadeOut = interpolate(
    frame,
    [TIMING.ENDING_START, TIMING.ENDING_START + 20],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const phoneWidth = 340;
  const phoneHeight = 680;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(-50%)",
        opacity: phoneOpacity * fadeOut,
        filter: `blur(${blurAmount}px)`,
      }}
    >
      {/* Shadow beneath phone */}
      <div
        style={{
          position: "absolute",
          width: phoneWidth + 100,
          height: phoneHeight + 60,
          top: 40,
          left: -50,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 65%)",
          filter: "blur(40px)",
          transform: "rotateX(80deg) translateZ(-100px)",
          zIndex: -1,
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: phoneWidth + 80,
          height: phoneHeight + 60,
          top: -30,
          left: -40,
          background: "radial-gradient(ellipse at center, rgba(250,248,245,0.06) 0%, transparent 55%)",
          filter: "blur(25px)",
          zIndex: -1,
        }}
      />

      {/* Phone body */}
      <div
        style={{
          width: phoneWidth,
          height: phoneHeight,
          backgroundColor: COLORS.charcoal,
          borderRadius: 40,
          border: "3px solid #3a3a3a",
          overflow: "hidden",
          boxShadow: `
            0 30px 70px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255,255,255,0.04),
            inset 0 0 25px rgba(0,0,0,0.2)
          `,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Status bar */}
          <div style={{ height: 30 }} />

          {/* Logo with circular background */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "rgba(80, 80, 80, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Img
                src={staticFile("shortlist-logo-ivory-transparent.png")}
                style={{ width: 42, height: 42, objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: COLORS.ivory,
              fontSize: 22,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            Shortlist Pass
          </div>

          {/* Tagline */}
          <div
            style={{
              color: "rgba(250,248,245,0.6)",
              fontSize: 11,
              textAlign: "center",
              marginBottom: 14,
              lineHeight: 1.3,
            }}
          >
            We help small businesses show up like BIG ones
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 14 }}>
            {["○", "⊕", "✉"].map((icon, i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(250,248,245,0.6)",
                  fontSize: 14,
                }}
              >
                {icon}
              </div>
            ))}
          </div>

          {/* Chat / Links tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
              backgroundColor: "rgba(60,60,60,0.5)",
              borderRadius: 20,
              padding: 3,
              alignSelf: "center",
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.ivory,
                color: COLORS.darkSlate,
                padding: "6px 18px",
                borderRadius: 16,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Chat
            </div>
            <div
              style={{
                color: "rgba(250,248,245,0.5)",
                padding: "6px 18px",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Links
            </div>
          </div>

          {/* Chat area - dynamic content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              position: "relative",
              paddingTop: 8,
            }}
          >
            {children}
          </div>

          {/* Input field with typing animation */}
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                backgroundColor: "rgba(60,60,60,0.6)",
                borderRadius: 20,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "rgba(250,248,245,0.4)", fontSize: 11 }}>
                  Ask Shorty anything...
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(80,80,80,0.8)",
                  color: "rgba(250,248,245,0.6)",
                  padding: "5px 12px",
                  borderRadius: 12,
                  fontSize: 10,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Send
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Q&A CYCLE - Text in phone first, then flies out to top
// ============================================================================
type CycleProps = {
  question: string;
  answer: string;
  startFrame: number;
  endFrame?: number; // Optional early cutoff
};

const QACycle: React.FC<CycleProps> = ({ question, answer, startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // Use custom endFrame if provided, otherwise use standard duration
  const cycleDuration = endFrame ? endFrame - startFrame : TIMING.CYCLE_DURATION;

  if (localFrame < -5 || localFrame > cycleDuration + 5) return null;

  // === TEXT FLYING OUT TO TOP ===
  const flyOutProgress = spring({
    frame: Math.max(0, localFrame - CYCLE_STEPS.FLY_OUT_START),
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Position: starts from center (phone area), flies to top third
  const flyOutY = interpolate(flyOutProgress, [0, 1], [960, 280]); // Center to top third
  const flyOutScale = interpolate(flyOutProgress, [0, 1], [0.6, 1]);

  // Fade in when fly-out starts, stay visible with phone texts, then both fade out together
  // Use earlier fade out if endFrame is specified, but ensure monotonically increasing
  const fadeOutStart = endFrame
    ? Math.max(CYCLE_STEPS.FLY_OUT_START + 20, cycleDuration - 15)
    : CYCLE_STEPS.FADE_OUT_START;
  const flyOutOpacity = interpolate(
    localFrame,
    [CYCLE_STEPS.FLY_OUT_START, CYCLE_STEPS.FLY_OUT_START + 15,
     fadeOutStart, fadeOutStart + 12],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* TEXT FLYING OUT - Top third of screen */}
      <div
        style={{
          position: "absolute",
          top: flyOutY,
          left: "50%",
          transform: `translateX(-50%) scale(${flyOutScale})`,
          opacity: flyOutOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          zIndex: 20,
        }}
      >
        {/* Question bubble */}
        <div
          style={{
            backgroundColor: COLORS.ivory,
            color: COLORS.darkSlate,
            fontSize: 26,
            fontWeight: 600,
            padding: "18px 28px",
            borderRadius: 22,
            maxWidth: 800,
            textAlign: "center",
            boxShadow: "0 18px 50px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.3)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.3,
          }}
        >
          {question}
        </div>

        {/* Answer bubble - BIGGER */}
        <div
          style={{
            backgroundColor: COLORS.accent,
            color: COLORS.ivory,
            fontSize: 34,
            fontWeight: 700,
            padding: "24px 36px",
            borderRadius: 24,
            maxWidth: 750,
            textAlign: "center",
            boxShadow: "0 15px 40px rgba(0,0,0,0.35), 0 5px 15px rgba(74,124,89,0.3)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.3,
          }}
        >
          {answer}
        </div>
      </div>
    </>
  );
};

// ============================================================================
// PHONE SCREEN CONTENT - Chat conversation with typing animation
// ============================================================================
const PhoneScreenContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cycles = [
    { start: TIMING.CYCLE_1_START, ...QA_PAIRS[0] },
    { start: TIMING.CYCLE_2_START, ...QA_PAIRS[1] },
    { start: TIMING.CYCLE_3_START, ...QA_PAIRS[2] },
    { start: TIMING.CYCLE_4_START, ...QA_PAIRS[3] },
  ];

  return (
    <>
      {cycles.map((cycle, index) => {
        const localFrame = frame - cycle.start;
        // All cycles have custom end times
        let cycleDuration = TIMING.CYCLE_DURATION;
        if (index === 0) cycleDuration = TIMING.CYCLE_1_END - TIMING.CYCLE_1_START;
        if (index === 1) cycleDuration = TIMING.CYCLE_2_END - TIMING.CYCLE_2_START;
        if (index === 2) cycleDuration = TIMING.CYCLE_3_END - TIMING.CYCLE_3_START;
        if (index === 3) cycleDuration = TIMING.CYCLE_4_END - TIMING.CYCLE_4_START;
        if (localFrame < 0 || localFrame > cycleDuration) return null;

        // Use earlier fade for all cycles
        const fadeOutStart = cycleDuration - 15;
        const textFade = interpolate(
          localFrame,
          [fadeOutStart, fadeOutStart + 12],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Question bubble appears after typing
        const qBubbleProgress = spring({
          frame: Math.max(0, localFrame - CYCLE_STEPS.QUESTION_BUBBLE_START),
          fps,
          config: { damping: 18, stiffness: 120 },
        });

        // Answer bubble appears
        const aBubbleProgress = spring({
          frame: Math.max(0, localFrame - CYCLE_STEPS.ANSWER_BUBBLE_START),
          fps,
          config: { damping: 18, stiffness: 120 },
        });

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: textFade,
              padding: "0 8px",
            }}
          >
            {/* User question bubble - right aligned */}
            <div
              style={{
                alignSelf: "flex-end",
                opacity: qBubbleProgress,
                transform: `scale(${interpolate(qBubbleProgress, [0, 1], [0.8, 1])}) translateY(${interpolate(qBubbleProgress, [0, 1], [10, 0])}px)`,
                backgroundColor: "rgba(255,255,255,0.15)",
                color: COLORS.ivory,
                fontSize: 12,
                fontWeight: 500,
                padding: "10px 14px",
                borderRadius: "16px 16px 4px 16px",
                maxWidth: 220,
                textAlign: "right",
                lineHeight: 1.35,
              }}
            >
              {cycle.question}
            </div>

            {/* Bot answer bubble - left aligned, slightly larger */}
            <div
              style={{
                alignSelf: "flex-start",
                opacity: aBubbleProgress,
                transform: `scale(${interpolate(aBubbleProgress, [0, 1], [0.8, 1])}) translateY(${interpolate(aBubbleProgress, [0, 1], [10, 0])}px)`,
                backgroundColor: COLORS.accent,
                color: COLORS.ivory,
                fontSize: 13,
                fontWeight: 600,
                padding: "11px 15px",
                borderRadius: "16px 16px 16px 4px",
                maxWidth: 210,
                textAlign: "left",
                lineHeight: 1.35,
              }}
            >
              {cycle.answer}
            </div>
          </div>
        );
      })}
    </>
  );
};


// ============================================================================
// HEADLINE - Simple closing message, then cut to logo
// "That's your smart assistant." -> "Taking stuff off your plate" -> "So you can sell more of them."
// ============================================================================
const HeadlineMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extend slightly past ENDING_START to ensure no gap
  if (frame < TIMING.HEADLINE_START || frame > TIMING.ENDING_START + 15) return null;

  const localFrame = frame - TIMING.HEADLINE_START;

  // Overlay fade
  const overlayFade = interpolate(
    localFrame,
    [0, 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Line 1: "That's your smart assistant." - big and bold
  const line1Progress = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Line 2: "Taking stuff off your plate" - animates in after line 1
  const line2Progress = spring({
    frame: Math.max(0, localFrame - 12),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Line 3: "So you can sell more of them." - animates in after line 2
  const line3Progress = spring({
    frame: Math.max(0, localFrame - 24),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <>
      {/* Dark overlay with blur */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 50,
          opacity: overlayFade,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
          zIndex: 51,
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* "That's Your" - Line 1 */}
        <div
          style={{
            color: COLORS.ivory,
            fontSize: 90,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.0,
            opacity: line1Progress,
            transform: `scale(${interpolate(line1Progress, [0, 1], [1.15, 1])}) translateY(${interpolate(line1Progress, [0, 1], [40, 0])}px)`,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 8px 50px rgba(0,0,0,0.9)",
            letterSpacing: -2,
          }}
        >
          That's Your
        </div>

        {/* "Smart Assistant." - Line 2 */}
        <div
          style={{
            color: COLORS.accent,
            fontSize: 100,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.1,
            opacity: line1Progress,
            transform: `scale(${interpolate(line1Progress, [0, 1], [1.15, 1])}) translateY(${interpolate(line1Progress, [0, 1], [40, 0])}px)`,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 8px 50px rgba(0,0,0,0.9)",
            letterSpacing: -3,
            marginBottom: 50,
          }}
        >
          Smart Assistant.
        </div>

        {/* "Taking stuff off your plate" - Line 3 */}
        <div
          style={{
            color: COLORS.ivory,
            fontSize: 48,
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.2,
            opacity: line2Progress,
            transform: `translateY(${interpolate(line2Progress, [0, 1], [30, 0])}px)`,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 6px 40px rgba(0,0,0,0.8)",
            marginBottom: 15,
          }}
        >
          Taking stuff off your plate
        </div>

        {/* "So you can sell more of them." - Line 4 */}
        <div
          style={{
            color: COLORS.ivory,
            fontSize: 52,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.2,
            opacity: line3Progress,
            transform: `translateY(${interpolate(line3Progress, [0, 1], [25, 0])}px)`,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 6px 40px rgba(0,0,0,0.8)",
          }}
        >
          So you can sell more of them.
        </div>
      </AbsoluteFill>
    </>
  );
};

// ============================================================================
// END CARD
// ============================================================================
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - TIMING.ENDING_START;
  if (localFrame < 0) return null;

  // Immediate background - no fade delay
  const bgFade = interpolate(localFrame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const logoProgress = spring({ frame: Math.max(0, localFrame - 5), fps, config: { damping: 18, stiffness: 100 } });
  const taglineProgress = spring({ frame: Math.max(0, localFrame - 15), fps, config: { damping: 200 } });

  const sweepX = interpolate(localFrame, [10, 40], [-150, 1230], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo scale animation
  const logoScale = interpolate(logoProgress, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill style={{ opacity: bgFade, zIndex: 60 }}>
      <AbsoluteFill style={{ backgroundColor: COLORS.darkSlate }} />

      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: sweepX,
          width: 100,
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
          transform: "skewX(-10deg)",
        }}
      />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <Img
          src={staticFile("shortlist-logo-ivory-transparent.png")}
          style={{
            width: 380,
            height: 380,
            objectFit: "contain",
            marginBottom: 50,
            opacity: logoProgress,
            transform: `scale(${logoScale})`,
          }}
        />
        <div
          style={{
            color: COLORS.ivory,
            fontSize: 36,
            fontWeight: 600,
            opacity: taglineProgress,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: 2,
          }}
        >
          One link. 24/7 support.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================================
// TOP LOGO - appears after intro
// ============================================================================
const TopLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Only appear after intro
  if (frame < TIMING.INTRO_DURATION) return null;

  const entryProgress = spring({
    frame: frame - TIMING.INTRO_DURATION,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const fadeOut = interpolate(
    frame,
    [TIMING.HEADLINE_START - 10, TIMING.HEADLINE_START],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: "50%",
        transform: `translateX(-50%) translateY(${interpolate(entryProgress, [0, 1], [-30, 0])}px)`,
        opacity: entryProgress * fadeOut,
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 10,
      }}
    >
      <Img
        src={staticFile("shortlist-logo-ivory-transparent.png")}
        style={{ width: 50, height: 50, objectFit: "contain" }}
      />
      <div
        style={{
          color: COLORS.ivory,
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: 1,
          textShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        SHORTLIST
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const SmartPageFoodTruckVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.darkSlate }}>
      <BackgroundLayer />

      {/* Intro hook */}
      <IntroHook />

      {/* "Introducing your smart assistant" with arrow */}
      <IntroAssistantText />

      {/* "Customers never miss your location" overlay - BEFORE Q&A */}
      <LocationOverlay />

      <TopLogo />

      <PhoneHero>
        <PhoneScreenContent />
      </PhoneHero>

      {/* First Q&A Cycle (location question) */}
      <QACycle
        question={QA_PAIRS[0].question}
        answer={QA_PAIRS[0].answer}
        startFrame={TIMING.CYCLE_1_START}
        endFrame={TIMING.CYCLE_1_END}
      />

      {/* Location confirmed vector */}
      <LocationConfirmed />

      {/* "Orders, handled" overlay */}
      <OrdersOverlay />

      {/* Second Q&A Cycle (orders question) - overlay lifts to reveal */}
      <QACycle
        question={QA_PAIRS[1].question}
        answer={QA_PAIRS[1].answer}
        startFrame={TIMING.CYCLE_2_START}
        endFrame={TIMING.CYCLE_2_END}
      />

      {/* Order confirmed vector */}
      <OrdersHandledIcon />

      {/* "Answers you can trust" / Dietary overlay */}
      <DietaryOverlay />

      {/* Third Q&A Cycle (dietary question) */}
      <QACycle
        question={QA_PAIRS[2].question}
        answer={QA_PAIRS[2].answer}
        startFrame={TIMING.CYCLE_3_START}
        endFrame={TIMING.CYCLE_3_END}
      />

      {/* Dietary confirmed vector */}
      <DietaryConfirmedIcon />

      {/* "Events, booked" overlay */}
      <EventsOverlay />

      {/* Fourth Q&A Cycle (events question) */}
      <QACycle
        question={QA_PAIRS[3].question}
        answer={QA_PAIRS[3].answer}
        startFrame={TIMING.CYCLE_4_START}
        endFrame={TIMING.CYCLE_4_END}
      />

      {/* Events confirmed vector */}
      <EventsConfirmedIcon />

      <HeadlineMoment />
      <EndCard />
    </AbsoluteFill>
  );
};
