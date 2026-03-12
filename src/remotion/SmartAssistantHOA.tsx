import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================================
// TIMING (30fps) - 9 seconds = 270 frames
// ============================================================================
// Frame 1: Hook (0:00-0:02) = 0-60
const HOOK_END = 60;
// Frame 2: Split appears (0:02-0:03) = 60-90
const SPLIT_END = 90;
// Frame 3: Top plays - Feature 1 (0:03-0:08) = 90-240
const TOP_F1_END = 240;
// Frame 4: Bottom activates at 8 seconds = 240

// Attention swap timing
const ATTENTION_SWAP_FRAME = 240; // 8 seconds - attention shifts to bottom
const FREEZE_END = 488; // 16.25 seconds - video ends

// Fade out transition
const FADE_OUT_START = 390; // 13 seconds - fade to black with text

// Feature 1 specific timing
const EMAIL_TYPE_START = 69; // 2.29 seconds - card appears
const EMAIL_BODY_DONE = 105; // Body finishes typing
const EMAIL_SENT_FRAME = 118; // "Sent" appears after breathing
const EMAIL_FLY_FRAME = 133; // Flies off after holding
const CLOCK_START = 140; // Clock appears, starts at 1 hour
const FRAMES_PER_HOUR = 20; // Each hour takes 20 frames
const THREE_HOURS_FRAME = CLOCK_START + (2 * FRAMES_PER_HOUR); // 3 hours - angry face appears

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  dark: "#000000",
  darkBlue: "#000000",
  red: "#EF4444",
  green: "#10B981",
  white: "#FFFFFF",
  dimmed: "rgba(0,0,0,0.5)",
};

// ============================================================================
// HALF HEIGHT
// ============================================================================
const HALF_HEIGHT = 675; // 1350 / 2

// ============================================================================
// LUCIDE CLOCK SVG ICON
// ============================================================================
const ClockIcon: React.FC<{ size: number; rotation: number }> = ({ size, rotation }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#EF4444"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ filter: "drop-shadow(0 4px 20px rgba(239, 68, 68, 0.5))" }}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline
      points="12 6 12 12 16 14"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "12px 12px",
      }}
    />
  </svg>
);

// ============================================================================
// TEXT SLAM ANIMATION
// ============================================================================
const SlamText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, size = 64, color = COLORS.white, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const opacity = interpolate(frame - delay, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shake = frame - delay < 10 ? Math.sin((frame - delay) * 3) * 3 : 0;

  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 900,
        color,
        fontFamily: "system-ui, -apple-system, sans-serif",
        textAlign: "center",
        transform: `scale(${scale}) translateX(${shake}px)`,
        opacity,
        textShadow: "0 4px 20px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// STEAM PUFF COMPONENT - floats horizontally outward from ears
// ============================================================================
const SteamPuff: React.FC<{
  x: number;
  y: number;
  delay: number;
  side: "left" | "right";
}> = ({ x, y, delay, side }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - delay);

  // Loop the steam animation every 25 frames
  const loopFrame = localFrame % 25;

  // Float horizontally outward
  const drift = side === "left" ? -100 : 100;
  const xOffset = interpolate(loopFrame, [0, 25], [0, drift]);

  // Slight vertical wobble
  const wobble = Math.sin(loopFrame * 0.5) * 5;

  const opacity = interpolate(loopFrame, [0, 3, 15, 25], [0, 0.9, 0.7, 0]);
  const scale = interpolate(loopFrame, [0, 25], [0.6, 1.2]);

  // Flip the emoji for left side so it points outward
  const scaleX = side === "left" ? -1 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x + xOffset,
        top: y + wobble,
        fontSize: 50,
        opacity,
        transform: `translate(-50%, -50%) scale(${scale}) scaleX(${scaleX})`,
        zIndex: 199,
      }}
    >
      💨
    </div>
  );
};

// ============================================================================
// FACE OVERLAY - Fades in over the man's face with angry shake
// ============================================================================
const FaceOverlay: React.FC<{
  type: "angry" | "happy";
  show: boolean;
  position: "top" | "bottom";
  startFrame: number;
}> = ({ type, show, position, startFrame }) => {
  const frame = useCurrentFrame();

  // Don't show if show is false
  if (!show) return null;

  const localFrame = frame - startFrame;

  // Simple fade in over 10 frames
  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle angry shake for angry face only
  const shake = type === "angry" ? Math.sin(frame * 1.5) * 3 : 0;

  // Happy hover animation - gentle bob up and down
  const happyHover = type === "happy" ? Math.sin(localFrame * 0.15) * 5 : 0;

  // Position face directly OVER the man's actual face in the image
  const faceY = position === "top" ? 498 : HALF_HEIGHT + 248 + happyHover;
  const faceX = position === "top" ? 534 : 529; // Bottom moved left 2%
  const faceSize = position === "top" ? 1200 : 1164; // Bottom (happy) shrunk 3%

  // Steam positions right at the ears (close to face)
  const steamLeftX = faceX - 72;
  const steamRightX = faceX + 72;
  const steamY = faceY - 165;

  // Steam stops at FADE_OUT_START
  const showSteam = type === "angry" && opacity > 0.5 && frame < FADE_OUT_START;

  return (
    <>
      {/* Face */}
      <Img
        src={staticFile(`SmartAssistant/${type}-face.png`)}
        style={{
          position: "absolute",
          left: faceX,
          top: faceY,
          width: faceSize,
          height: faceSize,
          objectFit: "contain",
          transform: `translate(-50%, -50%) translateX(${shake}px)`,
          opacity,
          zIndex: 200,
        }}
      />

      {/* Steam from ears - only for angry face, stops at skeleton */}
      {showSteam && (
        <>
          <SteamPuff x={steamLeftX} y={steamY} delay={startFrame} side="left" />
          <SteamPuff x={steamLeftX} y={steamY - 30} delay={startFrame + 10} side="left" />
          <SteamPuff x={steamRightX} y={steamY} delay={startFrame} side="right" />
          <SteamPuff x={steamRightX} y={steamY - 30} delay={startFrame + 10} side="right" />
        </>
      )}
    </>
  );
};

// ============================================================================
// FADE OUT WITH TEXT - Fades to black with animated text
// ============================================================================
const FadeOutWithText: React.FC<{
  show: boolean;
}> = ({ show }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!show || frame < FADE_OUT_START) return null;

  const localFrame = frame - FADE_OUT_START;

  // Fade to black over 20 frames
  const fadeOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Text animations - staggered fade in
  const line1Opacity = interpolate(localFrame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Opacity = interpolate(localFrame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line3Opacity = interpolate(localFrame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slight slide up for each line
  const line1Y = interpolate(localFrame, [15, 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Y = interpolate(localFrame, [30, 45], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line3Y = interpolate(localFrame, [45, 60], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#1a1a1a",
        opacity: fadeOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        zIndex: 400,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: "#FFFFFF",
          fontFamily: "system-ui",
          textAlign: "center",
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
        }}
      >
        Keep Your Residents Happy.
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: "#10B981",
          fontFamily: "system-ui",
          textAlign: "center",
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
        }}
      >
        Get a SmartAssistant.
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: "#888888",
          fontFamily: "system-ui",
          textAlign: "center",
          opacity: line3Opacity,
          transform: `translateY(${line3Y}px)`,
        }}
      >
        Stop communicating like it's 2025.
      </div>
    </div>
  );
};

// ============================================================================
// LABEL BADGE
// ============================================================================
const Label: React.FC<{
  text: string;
  color: string;
  icon: string;
  position: "top" | "bottom";
  show: boolean;
}> = ({ text, color, icon, position, show }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = show
    ? spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 150 },
      })
    : 0;

  const top = position === "top" ? 30 : HALF_HEIGHT + 30;

  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top,
        display: "flex",
        alignItems: "center",
        gap: 12,
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: "12px 24px",
        borderRadius: 12,
        transform: `scale(${scale})`,
        zIndex: 60,
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span
        style={{
          fontSize: 32,
          fontWeight: 800,
          color,
          fontFamily: "system-ui",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ============================================================================
// DIVIDER LINE WITH TEXT
// ============================================================================
const DividerWithText: React.FC<{
  text: string;
  show: boolean;
}> = ({ text, show }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = show
    ? spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 100 },
      })
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: HALF_HEIGHT - 40,
        left: 0,
        right: 0,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        zIndex: 260,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: COLORS.green,
        }}
      />
      <div
        style={{
          backgroundColor: COLORS.dark,
          padding: "12px 30px",
          borderRadius: 50,
          border: `3px solid ${COLORS.green}`,
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: "system-ui",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// STATUS TEXT
// ============================================================================
const StatusText: React.FC<{
  text: string;
  color: string;
  position: "top" | "bottom";
  show: boolean;
}> = ({ text, color, position, show }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = show
    ? spring({
        frame,
        fps,
        config: { damping: 10, stiffness: 150 },
      })
    : 0;

  const top = position === "top" ? HALF_HEIGHT - 120 : 813; // Lowered 3%

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        textAlign: "center",
        transform: `scale(${scale})`,
        zIndex: 70,
      }}
    >
      <span
        style={{
          fontSize: 53,
          fontWeight: 900,
          color,
          fontFamily: "system-ui",
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ============================================================================
// EMAIL CARD - To/Subject pre-filled, body types in two phases
// ============================================================================
const EmailCard: React.FC<{
  show: boolean;
}> = ({ show }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!show || frame < EMAIL_TYPE_START) return null;

  const localFrame = frame - EMAIL_TYPE_START;

  // Email content - To and Subject are pre-filled
  const toText = "MY HOA";
  const subjectText = "New Resident Question";

  // Two-phase body typing
  const bodyPart1 = "When does the Pool Open?";
  const bodyPart2 = "\n\nThanks,\nMatteo\n28 Emma Lane";

  // Phase 1: Type the question (frames 0-20)
  const phase1Duration = 20;
  const phase1Chars = Math.min(
    Math.floor((localFrame / phase1Duration) * bodyPart1.length),
    bodyPart1.length
  );

  // Pause after question (frames 20-28)
  const pauseStart = phase1Duration;
  const pauseDuration = 8;

  // Phase 2: Type the signature (slower - over 18 frames)
  const phase2Start = pauseStart + pauseDuration;
  const phase2Duration = 18;
  const phase2Chars = localFrame > phase2Start
    ? Math.min(
        Math.floor(((localFrame - phase2Start) / phase2Duration) * bodyPart2.length),
        bodyPart2.length
      )
    : 0;

  // Combine the text
  const displayedBody = bodyPart1.substring(0, phase1Chars) +
    (phase1Chars >= bodyPart1.length ? bodyPart2.substring(0, phase2Chars) : "");

  const bodyDone = frame >= EMAIL_BODY_DONE;
  const showSent = frame >= EMAIL_SENT_FRAME;

  const flyOffProgress = frame >= EMAIL_FLY_FRAME
    ? spring({
        frame: frame - EMAIL_FLY_FRAME,
        fps,
        config: { damping: 15, stiffness: 100 },
      })
    : 0;

  const translateX = interpolate(flyOffProgress, [0, 1], [0, -700]);
  const rotation = interpolate(flyOffProgress, [0, 1], [0, -20]);
  const cardOpacity = interpolate(flyOffProgress, [0, 0.8, 1], [1, 1, 0]);

  const popIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const cursorBlink = Math.sin(frame * 0.4) > 0 ? 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 150,
        width: 500,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        zIndex: 1,
        transform: `scale(${popIn}) translateX(${translateX}px) rotate(${rotation}deg)`,
        opacity: cardOpacity,
        overflow: "hidden",
      }}
    >
      {/* Email header bar */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "12px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#fbbf24" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
        </div>
        <span style={{ marginLeft: 12, fontSize: 16, color: "#6b7280", fontFamily: "system-ui" }}>
          New Message
        </span>
      </div>

      {/* Email fields */}
      <div style={{ padding: "16px 20px" }}>
        {/* To field - pre-filled */}
        <div style={{ display: "flex", marginBottom: 12, alignItems: "center" }}>
          <span style={{ fontSize: 18, color: "#9ca3af", fontFamily: "system-ui", width: 80 }}>To:</span>
          <span style={{ fontSize: 20, color: "#111", fontFamily: "system-ui", fontWeight: 600 }}>
            {toText}
          </span>
        </div>

        {/* Subject field - pre-filled */}
        <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontSize: 18, color: "#9ca3af", fontFamily: "system-ui", width: 80 }}>Subject:</span>
          <span style={{ fontSize: 20, color: "#111", fontFamily: "system-ui", fontWeight: 600 }}>
            {subjectText}
          </span>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: 16 }} />

        {/* Body - types out in two phases with pause */}
        <div
          style={{
            fontSize: 22,
            color: "#333",
            fontFamily: "system-ui",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            minHeight: 120,
          }}
        >
          {displayedBody}
          {!bodyDone && (
            <span style={{ opacity: cursorBlink, color: "#666" }}>|</span>
          )}
        </div>

        {/* Sent indicator */}
        {showSent && (
          <div
            style={{
              marginTop: 20,
              padding: "12px 20px",
              backgroundColor: "#dcfce7",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 24 }}>✉️</span>
            <span style={{ fontSize: 22, color: "#10B981", fontWeight: 700, fontFamily: "system-ui" }}>
              Sent!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CLOCK ANIMATION - Centered with spinning Lucide clock
// ============================================================================
const ClockAnimation: React.FC<{
  show: boolean;
}> = ({ show }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!show || frame < CLOCK_START) return null;

  const localFrame = frame - CLOCK_START;

  // Count up by hours
  const hourCount = 1 + Math.floor(localFrame / FRAMES_PER_HOUR);
  const hourText = `${hourCount} hour${hourCount > 1 ? 's' : ''}...`;

  // Color changes as hours increase
  let timeColor = COLORS.white;
  if (hourCount >= 6) {
    timeColor = COLORS.red;
  } else if (hourCount >= 3) {
    timeColor = "#FFA500";
  }

  const rotation = localFrame * 6; // Slowed down clock spin

  const popIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <div
      style={{
        position: "absolute",
        right: 100,
        top: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        zIndex: 45,
        transform: `scale(${popIn})`,
      }}
    >
      <ClockIcon size={120} rotation={rotation} />
      <div
        style={{
          fontSize: 42,
          fontWeight: 800,
          color: timeColor,
          fontFamily: "system-ui",
          textShadow: "0 4px 15px rgba(0,0,0,0.6)",
        }}
      >
        {hourText}
      </div>
    </div>
  );
};

// ============================================================================
// PHONE FRAME WITH VIDEO
// ============================================================================
const PhoneWithVideo: React.FC<{
  show: boolean;
  startFrame: number;
}> = ({ show, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!show) return null;

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div
      style={{
        position: "absolute",
        right: 60,
        top: HALF_HEIGHT + 50,
        width: 300,
        height: 550,
        backgroundColor: "#000",
        borderRadius: 35,
        padding: 10,
        boxShadow: `0 0 50px ${COLORS.green}60, 0 20px 60px rgba(0,0,0,0.4)`,
        border: `4px solid ${COLORS.green}`,
        transform: `scale(${scale})`,
        zIndex: 80,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 28,
          overflow: "hidden",
        }}
      >
        <OffthreadVideo
          src={staticFile("SmartAssistant/pool-hours.MP4")}
          playbackRate={1.5}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const SmartAssistantHOA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ========== PHASE DETECTION ==========
  const isHook = frame < HOOK_END;
  const isSplitAppearing = frame >= HOOK_END && frame < SPLIT_END;
  const isFeature1Top = frame >= SPLIT_END && frame < ATTENTION_SWAP_FRAME;
  const isFeature1Bot = frame >= ATTENTION_SWAP_FRAME; // Bottom activates at 8 seconds

  const showSplit = frame >= HOOK_END;

  // ========== SPLIT ANIMATION ==========
  const splitProgress = spring({
    frame: Math.max(0, frame - HOOK_END),
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const topSlide = interpolate(splitProgress, [0, 1], [-HALF_HEIGHT, 0]);
  const botSlide = interpolate(splitProgress, [0, 1], [HALF_HEIGHT, 0]);

  // ========== DIM STATES ==========
  const ATTENTION_SWAP = 242; // 8.05 seconds - swap attention to bottom
  const topDimmed = frame >= ATTENTION_SWAP && frame < FADE_OUT_START; // Dim top after 8.05s until fade out
  const botDimmed = frame < ATTENTION_SWAP; // Undim bottom at 8.05s

  // ========== FADE OUT TRANSITION ==========
  const isFadingOut = frame >= FADE_OUT_START;

  // ========== FACE STATES ==========
  const showAngryTop = frame >= THREE_HOURS_FRAME; // Angry face appears at 3 hours, stays until fade out
  const showHappyBot = isFeature1Bot && frame >= 330; // 11 seconds

  // ========== USE THUMBS UP IMAGE ==========
  const useThumbsUp = isFeature1Bot && frame > 332; // Same time as happy face

  // ========== STATUS TEXTS ==========
  const show3Seconds = isFeature1Bot && frame > 347; // 0.5s after happy face

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      {/* ========== FRAME 1: HOOK ========== */}
      {isHook && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <SlamText size={72} delay={10}>
            Your HOA still
          </SlamText>
          <SlamText size={72} delay={20}>
            sends emails?
          </SlamText>
          <SlamText size={100} delay={35}>
            😬
          </SlamText>
        </AbsoluteFill>
      )}

      {/* ========== SPLIT SCREEN ========== */}
      {showSplit && (
        <>
          {/* TOP HALF */}
          <div
            style={{
              position: "absolute",
              top: topSlide,
              left: 0,
              right: 0,
              height: HALF_HEIGHT,
              overflow: "hidden",
              backgroundColor: isFeature1Bot ? "#000000" : "#1A1A1A",
              zIndex: 1,
            }}
          >
            {/* Email card - behind the man */}
            <EmailCard show={isFeature1Top || isSplitAppearing} />

            <Img
              src={staticFile("SmartAssistant/scene-1-nuetral.png")}
              style={{
                position: "absolute",
                bottom: -70,
                left: "50%",
                transform: "translateX(-50%)",
                width: 500,
                objectFit: "contain",
                zIndex: 10,
              }}
            />

            {topDimmed && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: COLORS.dimmed,
                  zIndex: 50,
                }}
              />
            )}
          </div>

          {/* BOTTOM HALF */}
          <div
            style={{
              position: "absolute",
              top: HALF_HEIGHT + botSlide,
              left: 0,
              right: 0,
              height: HALF_HEIGHT,
              overflow: "hidden",
              backgroundColor: isFeature1Bot ? "#1A1A1A" : "#000000",
              zIndex: 1,
            }}
          >
            <Img
              src={staticFile(
                useThumbsUp
                  ? "SmartAssistant/scene-2-thumbs-up.png"
                  : "SmartAssistant/scene-2-phone.png"
              )}
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                width: 500,
                objectFit: "contain",
                zIndex: 2,
              }}
            />

            {botDimmed && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: COLORS.dimmed,
                  zIndex: 50,
                }}
              />
            )}
          </div>

          {/* CLOCK ANIMATION */}
          <ClockAnimation show={frame >= CLOCK_START} />

          {/* PHONE WITH VIDEO */}
          <PhoneWithVideo show={isFeature1Bot} startFrame={ATTENTION_SWAP_FRAME} />

          {/* LABELS */}
          <Label
            text="Email"
            color={COLORS.red}
            icon="❌"
            position="top"
            show={frame >= SPLIT_END}
          />
          <Label
            text="SmartAssistant"
            color={COLORS.green}
            icon="✅"
            position="bottom"
            show={frame >= SPLIT_END}
          />

          {/* DIVIDER WITH TEXT */}
          <DividerWithText
            text='"When does the pool open?"'
            show={frame >= HOOK_END}
          />

          {/* FACE OVERLAYS */}
          <FaceOverlay
            type="angry"
            show={showAngryTop}
            position="top"
            startFrame={THREE_HOURS_FRAME}
          />
          <FaceOverlay
            type="happy"
            show={showHappyBot}
            position="bottom"
            startFrame={330}
          />

          {/* STATUS TEXTS */}
          <StatusText
            text="3 seconds. ✅"
            color={COLORS.green}
            position="bottom"
            show={show3Seconds}
          />

          {/* FADE OUT WITH TEXT */}
          <FadeOutWithText show={isFadingOut} />
        </>
      )}
    </AbsoluteFill>
  );
};
