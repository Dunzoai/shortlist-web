import {
  AbsoluteFill,
  Audio,
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
  // Sneakers + "You want empanadas?" pop in
  INTRO_START: 0,
  INTRO_ANIMATE: 15,
  INTRO_PAUSE_END: 75, // 2 second pause after animation (60 frames)

  // "Good." fast cut + truck crash
  GOOD_START: 75,
  GOOD_SETTLE: 125, // When empanadas settle
  TRUCK_START: 133, // 0.25s pause after settle (8 frames)
  TRUCK_DROP: 155, // When truck drops the text
  CHAT_START: 189, // 6.3 seconds - phone transitions to chat
  GOOD_END: 260, // Scene ends after phone settles
  WIPE_START: 390, // ~13 seconds - white diagonal wipe begins
  CTA_START: 420, // ~14 seconds - CTA screen appears after wipe

  TOTAL_DURATION: 630, // 21 seconds - "Just Order" hits at 20s, holds for 1s
};

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  background: "#2D5A3D", // Nito's green
  ivory: "#FAF8F5",
  gold: "#C4A052",
};

// ============================================================================
// FLOATING EMPANADAS CONFIG
// ============================================================================
const FLOATING_EMPANADAS = [
  { img: "empanada.png", x: -80, y: 650, size: 420, delay: 18, floatSpeed: 0.08, floatAmount: 15, rotation: -15 },
  { img: "sweet-empanada.png", x: 720, y: 700, size: 360, delay: 22, floatSpeed: 0.1, floatAmount: 12, rotation: 20 },
  { img: "sweet-empanada-2.png", x: -60, y: 1150, size: 330, delay: 26, floatSpeed: 0.12, floatAmount: 18, rotation: 10 },
  { img: "street-corn-empanada.png", x: 700, y: 1100, size: 390, delay: 20, floatSpeed: 0.09, floatAmount: 14, rotation: -12 },
];

// ============================================================================
// INTRO SCENE - Sneakers + "You want empanadas?" speech bubble
// ============================================================================
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame >= TIMING.GOOD_START) return null;

  // Sneakers pop up from bottom
  const sneakersProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const sneakersY = interpolate(sneakersProgress, [0, 1], [600, 0]);

  // Speech bubble pops in after Damian
  const bubbleProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const bubbleScale = interpolate(bubbleProgress, [0, 1], [0.3, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Nito's voice audio */}
      <Audio src={staticFile("nitos-voice.m4a")} startFrom={0} volume={0.3} />

      {/* Floating empanadas around Damian */}
      {FLOATING_EMPANADAS.map((emp, index) => {
        const empProgress = spring({
          frame: Math.max(0, frame - emp.delay),
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        // Smooth hovering motion
        const floatY = Math.sin(frame * emp.floatSpeed) * emp.floatAmount;
        const floatX = Math.cos(frame * emp.floatSpeed * 0.7) * (emp.floatAmount * 0.5);

        return (
          <Img
            key={index}
            src={staticFile(emp.img)}
            style={{
              position: "absolute",
              left: emp.x,
              top: emp.y,
              width: emp.size,
              height: emp.size,
              objectFit: "contain",
              opacity: empProgress,
              transform: `
                translateY(${floatY}px)
                translateX(${floatX}px)
                scale(${interpolate(empProgress, [0, 1], [0.3, 1])})
                rotate(${emp.rotation}deg)
              `,
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
            }}
          />
        );
      })}

      {/* Speech bubble with "You want empanadas?" */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: "50%",
          transform: `translateX(-50%) scale(${bubbleScale})`,
          opacity: bubbleProgress,
          zIndex: 10,
        }}
      >
        {/* Bubble container */}
        <div
          style={{
            position: "relative",
            backgroundColor: COLORS.ivory,
            borderRadius: 40,
            padding: "50px 60px",
            boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
          }}
        >
          {/* Text */}
          <div
            style={{
              color: COLORS.background,
              fontSize: 110,
              fontWeight: 900,
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            You want
            <br />
            empanadas?
          </div>

          {/* Speech bubble tail - curved */}
          <svg
            width="100"
            height="90"
            viewBox="0 0 100 90"
            style={{
              position: "absolute",
              bottom: -85,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <path
              d="M 10 0 Q 25 0, 35 30 Q 50 85, 55 85 Q 50 60, 60 30 Q 70 0, 90 0 Z"
              fill={COLORS.ivory}
            />
          </svg>
        </div>
      </div>

      {/* Damian sneakers - pops up from bottom */}
      <Img
        src={staticFile("damian-sneakers.png")}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          maxWidth: 900,
          objectFit: "contain",
          transform: `translateY(${sneakersY}px)`,
          zIndex: 5,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// "GOOD." SCENE - Empanadas drop and knock O's off screen
// ============================================================================
const GoodScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < TIMING.GOOD_START || frame >= TIMING.WORDS_START) return null;

  const localFrame = frame - TIMING.GOOD_START;

  // Text slams in
  const textProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  // Empanadas drop after text settles (frame 12)
  const dropStart = 12;

  // First empanada drops
  const emp1Drop = spring({
    frame: Math.max(0, localFrame - dropStart),
    fps,
    config: { damping: 8, stiffness: 120 },
  });

  // Second empanada drops slightly after
  const emp2Drop = spring({
    frame: Math.max(0, localFrame - dropStart - 3),
    fps,
    config: { damping: 8, stiffness: 120 },
  });

  // Empanada Y positions (drop from top)
  const emp1Y = interpolate(emp1Drop, [0, 1], [-800, 0]);
  const emp2Y = interpolate(emp2Drop, [0, 1], [-800, 0]);

  // O's get knocked down when empanadas arrive
  const o1Fall = interpolate(
    emp1Drop,
    [0.7, 1],
    [0, 1200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const o2Fall = interpolate(
    emp2Drop,
    [0.7, 1],
    [0, 1200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // O's rotation as they fall
  const o1Rotate = interpolate(emp1Drop, [0.7, 1], [0, 45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o2Rotate = interpolate(emp2Drop, [0.7, 1], [0, -60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // O's opacity (fade as they fall)
  const o1Opacity = interpolate(emp1Drop, [0.7, 0.95], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o2Opacity = interpolate(emp2Drop, [0.7, 0.95], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // G gets bumped to the left when empanadas land
  const gBump = spring({
    frame: Math.max(0, localFrame - dropStart - 3),
    fps,
    config: { damping: 8, stiffness: 150 },
  });
  const gNudge = interpolate(gBump, [0, 1], [0, -50]);

  // d. gets bumped to the right when empanadas land
  const dBump = spring({
    frame: Math.max(0, localFrame - dropStart - 5),
    fps,
    config: { damping: 8, stiffness: 150 },
  });
  const dNudge = interpolate(dBump, [0, 1], [0, 55]);

  const empSize = 330; // 1.5x larger
  const fontSize = 220;

  // Truck animation
  const truckFrame = localFrame - (TIMING.TRUCK_START - TIMING.GOOD_START);
  const truckActive = truckFrame >= 0;

  // Truck drives from right to left across screen (slower to drag text)
  const truckX = truckActive
    ? interpolate(truckFrame, [0, 35], [1400, -1200], { extrapolateRight: "clamp" })
    : 1400;

  // Elements scatter when truck hits (around frame 8-10 of truck animation)
  const scatterTrigger = Math.max(0, truckFrame - 8);

  // G scatters up-left
  const gScatterX = interpolate(scatterTrigger, [0, 15], [0, -600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gScatterY = interpolate(scatterTrigger, [0, 15], [0, -400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gScatterRotate = interpolate(scatterTrigger, [0, 15], [0, -45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gScatterOpacity = interpolate(scatterTrigger, [8, 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // First O falls when empanada drops
  const o1ScatterX = interpolate(scatterTrigger, [0, 15], [0, -200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o1ScatterY = interpolate(scatterTrigger, [0, 15], [0, -500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o1ScatterRotate = interpolate(scatterTrigger, [0, 15], [0, -90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Second O falls when empanada drops
  const o2ScatterX = interpolate(scatterTrigger, [0, 15], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o2ScatterY = interpolate(scatterTrigger, [0, 15], [0, 800], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o2ScatterRotate = interpolate(scatterTrigger, [0, 15], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // First empanada scatters up
  const emp1ScatterX = interpolate(scatterTrigger, [0, 15], [0, -300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emp1ScatterY = interpolate(scatterTrigger, [0, 15], [0, -800], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emp1ScatterRotate = interpolate(scatterTrigger, [0, 15], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emp1ScatterOpacity = interpolate(scatterTrigger, [8, 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Second empanada scatters down-left
  const emp2ScatterX = interpolate(scatterTrigger, [0, 15], [0, -400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emp2ScatterY = interpolate(scatterTrigger, [0, 15], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emp2ScatterRotate = interpolate(scatterTrigger, [0, 15], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emp2ScatterOpacity = interpolate(scatterTrigger, [8, 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // d. scatters down-right
  const dScatterX = interpolate(scatterTrigger, [0, 15], [0, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dScatterY = interpolate(scatterTrigger, [0, 15], [0, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dScatterRotate = interpolate(scatterTrigger, [0, 15], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dScatterOpacity = interpolate(scatterTrigger, [8, 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Text being dragged by truck
  const dropFrame = localFrame - (TIMING.TRUCK_DROP - TIMING.GOOD_START);
  const textDropped = dropFrame >= 0;

  // Text is towed BEHIND the truck (to the right of it since truck moves left)
  const draggedTextX = textDropped
    ? 0 // Centered after drop
    : truckX + 1100; // Towed behind the truck

  // Spring bounce after drop
  const bounceProgress = spring({
    frame: Math.max(0, dropFrame),
    fps,
    config: { damping: 8, stiffness: 80, mass: 1.2 },
  });

  // Oscillating bounce effect
  const bounceAmount = textDropped
    ? Math.sin(dropFrame * 0.5) * Math.max(0, 30 - dropFrame * 0.8)
    : 0;

  // Text opacity (fades in as truck enters)
  const draggedTextOpacity = truckActive
    ? interpolate(truckFrame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* G - nudges left when empanadas land */}
      <span
        style={{
          position: "absolute",
          left: 180 + gNudge,
          top: "50%",
          transform: `translateY(-50%) translateX(${gScatterX}px) translateY(${gScatterY}px) rotate(${gScatterRotate}deg)`,
          color: COLORS.ivory,
          fontSize: fontSize,
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 12px 60px rgba(0,0,0,0.5)",
          opacity: textProgress * gScatterOpacity,
        }}
      >
        G
      </span>

      {/* First O - gets knocked off by empanada then scattered by truck */}
      <span
        style={{
          position: "absolute",
          left: 355,
          top: "50%",
          transform: `translateY(calc(-50% + ${o1Fall}px)) translateX(${o1ScatterX}px) translateY(${o1ScatterY}px) rotate(${o1Rotate + o1ScatterRotate}deg)`,
          color: COLORS.ivory,
          fontSize: fontSize,
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 12px 60px rgba(0,0,0,0.5)",
          opacity: textProgress * o1Opacity * gScatterOpacity,
        }}
      >
        o
      </span>

      {/* Second O - gets knocked off by empanada then scattered by truck */}
      <span
        style={{
          position: "absolute",
          left: 510,
          top: "50%",
          transform: `translateY(calc(-50% + ${o2Fall}px)) translateX(${o2ScatterX}px) translateY(${o2ScatterY}px) rotate(${o2Rotate + o2ScatterRotate}deg)`,
          color: COLORS.ivory,
          fontSize: fontSize,
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 12px 60px rgba(0,0,0,0.5)",
          opacity: textProgress * o2Opacity * gScatterOpacity,
        }}
      >
        o
      </span>

      {/* First empanada */}
      <Img
        src={staticFile("empanada.png")}
        style={{
          position: "absolute",
          left: 240,
          top: "50%",
          transform: `translateY(calc(-50% + ${emp1Y}px)) translateX(${emp1ScatterX}px) translateY(${emp1ScatterY}px) rotate(${emp1ScatterRotate}deg)`,
          width: empSize,
          height: empSize,
          objectFit: "contain",
          filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.5))",
          opacity: textProgress * emp1ScatterOpacity,
        }}
      />

      {/* Second empanada */}
      <Img
        src={staticFile("empanada.png")}
        style={{
          position: "absolute",
          left: 470,
          top: "50%",
          transform: `translateY(calc(-50% + ${emp2Y}px)) translateX(${emp2ScatterX}px) translateY(${emp2ScatterY}px) rotate(${emp2ScatterRotate}deg)`,
          width: empSize,
          height: empSize,
          objectFit: "contain",
          filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.5))",
          opacity: textProgress * emp1ScatterOpacity,
        }}
      />

      {/* d. - nudges right when empanadas land */}
      <span
        style={{
          position: "absolute",
          left: 680 + dNudge,
          top: "50%",
          transform: `translateY(-50%) translateX(${dScatterX}px) translateY(${dScatterY}px) rotate(${dScatterRotate}deg)`,
          color: COLORS.ivory,
          fontSize: fontSize,
          fontWeight: 900,
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 12px 60px rgba(0,0,0,0.5)",
          opacity: textProgress * dScatterOpacity,
        }}
      >
        d.
      </span>

      {/* iPhone scales in as text settles, gets dragged off by flash wave */}
      {textDropped && frame < TIMING.CTA_START + 5 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(
              spring({
                frame: Math.max(0, dropFrame - 15),
                fps,
                config: { damping: 12, stiffness: 100 },
              }),
              [0, 1],
              [0.3, 1]
            )}) translateX(${interpolate(frame, [TIMING.WIPE_START + 5, TIMING.WIPE_START + 22], [0, -1400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px) translateY(${interpolate(frame, [TIMING.WIPE_START + 5, TIMING.WIPE_START + 22], [0, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px) rotate(${interpolate(frame, [TIMING.WIPE_START + 5, TIMING.WIPE_START + 22], [0, -15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}deg)`,
            opacity: interpolate(dropFrame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            zIndex: 5,
          }}
        >
          {/* iPhone frame - realistic (larger to fit matching text) */}
          <div
            style={{
              width: 680,
              height: 1390,
              backgroundColor: "#0a0a0a",
              borderRadius: 85,
              border: "8px solid #2a2a2a",
              padding: 16,
              boxShadow: "0 50px 120px rgba(0,0,0,0.7), inset 0 0 0 3px #1a1a1a",
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
                {/* Chat interface - fades in at CHAT_START */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "#C4A78C",
                    borderRadius: 60,
                    opacity: interpolate(frame, [TIMING.CHAT_START, TIMING.CHAT_START + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* Header section */}
                  <div style={{ padding: "24px 30px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    {/* Logo image */}
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
                    {/* Title */}
                    <div style={{ fontSize: 32, fontWeight: 800, color: "#1E3A5F", fontFamily: "system-ui", marginTop: 6, textAlign: "center" }}>
                      Nito's Empanadas
                    </div>
                    {/* Tagline */}
                    <div style={{ fontSize: 18, color: "#C4A052", fontFamily: "system-ui", textAlign: "center" }}>
                      The Best Empanadas in town!
                    </div>
                    {/* Social icons row */}
                    <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "center" }}>
                      {["📷", "👤", "🌐", "✉️"].map((icon, i) => (
                        <div key={i} style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "rgba(90, 75, 60, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                        }}>{icon}</div>
                      ))}
                    </div>
                    {/* Chat/Links tabs */}
                    <div style={{
                      display: "flex",
                      backgroundColor: "rgba(90, 75, 60, 0.4)",
                      borderRadius: 24,
                      padding: 4,
                      marginTop: 8,
                    }}>
                      <div style={{
                        padding: "8px 28px",
                        backgroundColor: "rgba(50, 40, 30, 0.8)",
                        borderRadius: 20,
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: "system-ui",
                      }}>Chat</div>
                      <div style={{
                        padding: "8px 28px",
                        color: "rgba(50, 40, 30, 0.7)",
                        fontSize: 16,
                        fontWeight: 500,
                        fontFamily: "system-ui",
                      }}>Links</div>
                    </div>
                  </div>

                  {/* Chat messages area - scrollable look */}
                  <div style={{ flex: 1, padding: "8px 20px", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
                    {/* User message 1 */}
                    <div
                      style={{
                        alignSelf: "flex-end",
                        backgroundColor: "#fff",
                        borderRadius: 18,
                        padding: "12px 18px",
                        maxWidth: "70%",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        opacity: interpolate(frame, [TIMING.CHAT_START + 12, TIMING.CHAT_START + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                        transform: `translateY(${interpolate(frame, [TIMING.CHAT_START + 12, TIMING.CHAT_START + 22], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                      }}
                    >
                      <span style={{ fontSize: 20, color: "#1a1a1a", fontFamily: "system-ui" }}>
                        can I place an order?
                      </span>
                    </div>

                    {/* Response 1 */}
                    <div
                      style={{
                        alignSelf: "flex-start",
                        backgroundColor: "rgba(70, 58, 45, 0.9)",
                        borderRadius: 18,
                        padding: "14px 18px",
                        maxWidth: "85%",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        opacity: interpolate(frame, [TIMING.CHAT_START + 42, TIMING.CHAT_START + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                        transform: `translateY(${interpolate(frame, [TIMING.CHAT_START + 42, TIMING.CHAT_START + 55], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                      }}
                    >
                      <span style={{ fontSize: 18, color: "#FAF8F5", fontFamily: "system-ui", lineHeight: 1.35 }}>
                        Absolutely! I'm at <strong>Ocean Bay Elementary</strong> from <strong>5-7 PM</strong>! 🎯 What can I get you?
                      </span>
                    </div>

                    {/* User message 2 */}
                    <div
                      style={{
                        alignSelf: "flex-end",
                        backgroundColor: "#fff",
                        borderRadius: 18,
                        padding: "12px 18px",
                        maxWidth: "75%",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        opacity: interpolate(frame, [TIMING.CHAT_START + 85, TIMING.CHAT_START + 98], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                        transform: `translateY(${interpolate(frame, [TIMING.CHAT_START + 85, TIMING.CHAT_START + 98], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                      }}
                    >
                      <span style={{ fontSize: 20, color: "#1a1a1a", fontFamily: "system-ui" }}>
                        I'll take 3 steak and cheese
                      </span>
                    </div>

                    {/* Response 2 with payment link */}
                    <div
                      style={{
                        alignSelf: "flex-start",
                        backgroundColor: "rgba(70, 58, 45, 0.9)",
                        borderRadius: 18,
                        padding: "14px 18px",
                        maxWidth: "88%",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        opacity: interpolate(frame, [TIMING.CHAT_START + 120, TIMING.CHAT_START + 138], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                        transform: `translateY(${interpolate(frame, [TIMING.CHAT_START + 120, TIMING.CHAT_START + 138], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                      }}
                    >
                      <span style={{ fontSize: 18, color: "#FAF8F5", fontFamily: "system-ui", lineHeight: 1.35 }}>
                        Got it! 🎉 You qualify for the <strong>$5 each when you buy 3+</strong> deal!
                      </span>
                      <div style={{ marginTop: 10 }}>
                        <span style={{ fontSize: 20, color: "#C4A052", fontFamily: "system-ui", fontWeight: 700 }}>
                          Total: $15.00
                        </span>
                      </div>
                      {/* Payment link button */}
                      <div style={{
                        marginTop: 12,
                        backgroundColor: "#C4A052",
                        borderRadius: 12,
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", fontFamily: "system-ui" }}>
                          💳 Pay Now
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom input area */}
                  <div style={{ padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: 24,
                        padding: "12px 20px",
                        fontSize: 16,
                        color: "#999",
                        fontFamily: "system-ui",
                      }}>Ask Shorty anything...</div>
                      <div style={{
                        backgroundColor: "rgba(70, 58, 45, 0.9)",
                        borderRadius: 24,
                        padding: "12px 24px",
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "system-ui",
                      }}>Send</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <div style={{
                        backgroundColor: "#fff",
                        borderRadius: 20,
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "#333",
                        fontFamily: "system-ui",
                      }}>📅 Book Event</div>
                      <div style={{
                        backgroundColor: "#fff",
                        borderRadius: 20,
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "#333",
                        fontFamily: "system-ui",
                      }}>💬 Chat to Order</div>
                      <div style={{
                        backgroundColor: "#C4A052",
                        borderRadius: 20,
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "#1a1a1a",
                        fontWeight: 600,
                        fontFamily: "system-ui",
                      }}>⚡ Quick Order</div>
                    </div>
                  </div>

                  {/* Order Confirmed Overlay - appears after payment, stays until end */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                      borderRadius: 60,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 20,
                      opacity: interpolate(frame, [TIMING.CHAT_START + 165, TIMING.CHAT_START + 178], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    }}
                  >
                    {/* Checkmark badge */}
                    <div
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        backgroundColor: "#22C55E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 30px rgba(34, 197, 94, 0.5)",
                        transform: `scale(${interpolate(
                          spring({
                            frame: Math.max(0, frame - TIMING.CHAT_START - 168),
                            fps,
                            config: { damping: 10, stiffness: 150 },
                          }),
                          [0, 1],
                          [0.3, 1]
                        )})`,
                      }}
                    >
                      <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {/* Order Confirmed text */}
                    <div
                      style={{
                        fontSize: 48,
                        fontWeight: 800,
                        color: "#fff",
                        fontFamily: "system-ui",
                        textAlign: "center",
                        textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                        transform: `translateY(${interpolate(frame, [TIMING.CHAT_START + 175, TIMING.CHAT_START + 188], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                        opacity: interpolate(frame, [TIMING.CHAT_START + 175, TIMING.CHAT_START + 188], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                      }}
                    >
                      Order Confirmed!
                    </div>
                    {/* Subtext */}
                    <div
                      style={{
                        fontSize: 24,
                        color: "rgba(255,255,255,0.8)",
                        fontFamily: "system-ui",
                        textAlign: "center",
                        opacity: interpolate(frame, [TIMING.CHAT_START + 182, TIMING.CHAT_START + 195], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                      }}
                    >
                      Ready in ~15 minutes 🎉
                    </div>
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div
                style={{
                  width: 200,
                  height: 6,
                  backgroundColor: "#333",
                  borderRadius: 3,
                  alignSelf: "center",
                  marginBottom: 16,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dragged text - "We Now Have Mobile Ordering." - fades out as phone appears */}
      {truckActive && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translateX(${textDropped ? bounceAmount : draggedTextX - 540}px)`,
            opacity: draggedTextOpacity * interpolate(frame, [TIMING.CHAT_START, TIMING.CHAT_START + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            zIndex: 15,
          }}
        >
          <div
            style={{
              color: COLORS.ivory,
              fontSize: 72,
              fontWeight: 800,
              fontFamily: "system-ui, -apple-system, sans-serif",
              textShadow: "0 8px 40px rgba(0,0,0,0.5)",
              textAlign: "center",
              lineHeight: 1.2,
              transform: `rotate(${textDropped ? bounceAmount * 0.3 : 0}deg)`,
            }}
          >
            We Now Have
          </div>
          <div
            style={{
              color: COLORS.gold,
              fontSize: 80,
              fontWeight: 900,
              fontFamily: "system-ui, -apple-system, sans-serif",
              textShadow: "0 8px 40px rgba(0,0,0,0.5)",
              textAlign: "center",
              transform: `rotate(${textDropped ? -bounceAmount * 0.2 : 0}deg)`,
            }}
          >
            Mobile Ordering.
          </div>
        </div>
      )}

      {/* Nito's Truck - speeds in from right (2x size) */}
      {truckActive && (
        <Img
          src={staticFile("nitos-truck.png")}
          style={{
            position: "absolute",
            left: truckX,
            top: "50%",
            transform: "translateY(-50%)",
            height: 1000,
            objectFit: "contain",
            filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.6))",
            zIndex: 10,
          }}
        />
      )}
    </AbsoluteFill>
  );
};


// ============================================================================
// CTA SCENE - "Tap the link in bio" + rotating "Order ___"
// ============================================================================
// Scenarios - slow start, then ramps up after "for the Superbowl"
const ROTATING_WORDS = [
  // Slow pace (first 3 after "Now")
  { word: "Tonight", duration: 26 },
  { word: "Tomorrow", duration: 26 },
  { word: "for the Superbowl", duration: 28 },
  // Ramp up starts here
  { word: "on your way home", duration: 18 },
  { word: "for date night", duration: 14 },
  { word: "for the kids", duration: 11 },
  { word: "after practice", duration: 9 },
  { word: "for game day", duration: 7 },
  { word: "for the party", duration: 6 },
  { word: "for lunch", duration: 5 },
  { word: "for dinner", duration: 4 },
  { word: "right now", duration: 4 },
  { word: "for work", duration: 3 },
  { word: "anytime", duration: 3 },
  { word: "today", duration: 3 },
  { word: "later", duration: 2 },
  { word: "always", duration: 2 },
];

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < TIMING.CTA_START) return null;

  const localFrame = frame - TIMING.CTA_START;

  // "Now" stays centered for 0.35 seconds (11 frames), then rotation begins
  const NOW_DURATION = 11;
  const ROTATION_START = NOW_DURATION;
  const rotationFrame = Math.max(0, localFrame - ROTATION_START);

  // Find current word based on cumulative timing
  const findCurrentWord = (frame: number): { index: number; progress: number; duration: number } => {
    let cumulative = 0;
    for (let i = 0; i < ROTATING_WORDS.length; i++) {
      const duration = ROTATING_WORDS[i].duration;
      if (frame < cumulative + duration) {
        return { index: i, progress: (frame - cumulative) / duration, duration };
      }
      cumulative += duration;
    }
    // After all words, show "Just Order" (index = -2)
    return { index: -2, progress: 0, duration: 1 };
  };

  const isRotating = localFrame >= ROTATION_START;
  const wordInfo = isRotating ? findCurrentWord(rotationFrame) : { index: -1, progress: 0, duration: 1 };
  const currentWordIndex = wordInfo.index;
  const wordProgress = wordInfo.progress;
  const currentDuration = wordInfo.duration;

  // Faster fade for faster words
  const fadeRatio = currentDuration <= 4 ? 0.3 : currentDuration <= 10 ? 0.2 : 0.15;

  // Fade in/out for word transitions (only when rotating)
  const wordOpacity = !isRotating || currentWordIndex === -2 ? 1 : (
    wordProgress < fadeRatio
      ? interpolate(wordProgress, [0, fadeRatio], [0, 1])
      : wordProgress > (1 - fadeRatio)
        ? interpolate(wordProgress, [1 - fadeRatio, 1], [1, 0])
        : 1
  );

  // Slide up animation for rotating words
  const slideAmount = currentDuration <= 4 ? 15 : currentDuration <= 10 ? 25 : 35;
  const wordY = !isRotating || currentWordIndex === -2 ? 0 : (
    wordProgress < fadeRatio
      ? interpolate(wordProgress, [0, fadeRatio], [slideAmount, 0])
      : wordProgress > (1 - fadeRatio)
        ? interpolate(wordProgress, [1 - fadeRatio, 1], [0, -slideAmount])
        : 0
  );


  // Scene fade in
  const sceneOpacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // "Tap the link in bio" pop in
  const titleProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // "Order Now" pops in after
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

        {/* Order ___ with rotating word - stays centered */}
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
            // "Just Order." finale
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
                {currentWordIndex === -1 ? "Now" : ROTATING_WORDS[currentWordIndex].word}
              </span>
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// GIANT EMPANADA WIPE TRANSITION
// ============================================================================
const EmpandaWipe: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < TIMING.WIPE_START || frame > TIMING.CTA_START + 5) return null;

  const localFrame = frame - TIMING.WIPE_START;

  // Empanada sweeps from top-right to bottom-left
  const wipeProgress = interpolate(localFrame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Position - diagonal movement
  const empX = interpolate(wipeProgress, [0, 1], [1800, -1800]);
  const empY = interpolate(wipeProgress, [0, 1], [-1200, 1200]);

  // Rotation as it flies across
  const rotation = interpolate(wipeProgress, [0, 1], [-30, 60]);

  // Scale - slightly larger in the middle of the screen
  const scale = interpolate(wipeProgress, [0, 0.5, 1], [1, 1.15, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <Img
        src={staticFile("empanada.png")}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 2200,
          height: 2200,
          objectFit: "contain",
          transform: `translate(-50%, -50%) translateX(${empX}px) translateY(${empY}px) rotate(${rotation}deg) scale(${scale})`,
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))",
        }}
      />
    </div>
  );
};

// ============================================================================
// SWEET EMPANADA JUMP SCARE - Bursts towards viewer
// ============================================================================
const EmpandaJumpScare: React.FC = () => {
  const frame = useCurrentFrame();

  // Starts right after "Just Order" settles
  const SCARE_START = 612;

  if (frame < SCARE_START) return null;

  const localFrame = frame - SCARE_START;

  // Very fast burst - only 8 frames (0.27 seconds)
  const burstProgress = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Scale: starts small, EXPLODES to fill screen
  const scale = interpolate(
    burstProgress,
    [0, 0.3, 1],
    [0.15, 0.4, 12],
    { extrapolateRight: "clamp" }
  );

  // Rotation speeds up as it gets closer
  const rotation = interpolate(burstProgress, [0, 1], [-20, 45]);

  // Y position - comes from slightly below center, moves up as it gets closer
  const y = interpolate(burstProgress, [0, 1], [150, -100]);

  // Opacity - appears suddenly, stays solid
  const opacity = interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: "clamp" });

  // Screen shake after impact
  const shakeIntensity = localFrame > 6 && localFrame < 15 ? (15 - localFrame) * 3 : 0;
  const shakeX = Math.sin(localFrame * 12) * shakeIntensity;
  const shakeY = Math.cos(localFrame * 10) * shakeIntensity * 0.7;

  // Quick white flash at the moment of "impact"
  const flashOpacity = interpolate(localFrame, [6, 7, 10], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 200,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Container with shake */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Sweet empanada flying at viewer */}
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

      {/* Impact flash */}
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
// POWERED BY SHORTLIST FOOTER
// ============================================================================
const PoweredByFooter: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in at start of Good scene
  const opacity = interpolate(
    frame,
    [TIMING.GOOD_START + 5, TIMING.GOOD_START + 20],
    [0, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < TIMING.GOOD_START) return null;

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
// MAIN COMPOSITION
// ============================================================================
export const NitosInstagramPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <IntroScene />
      <GoodScene />
      <CTAScene />
      <EmpandaWipe />
      <PoweredByFooter />
      <EmpandaJumpScare />
    </AbsoluteFill>
  );
};
