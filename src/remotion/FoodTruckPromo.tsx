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
  LOGO_BLOOP_START: 10,
  LOGO_HOLD: 60, // Hold logo for ~2 sec
  FADE_TO_SCENE: 20, // Fade transition duration
};

const SCENE_START = TIMING.LOGO_BLOOP_START + TIMING.LOGO_HOLD;

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  ivory: "#FAF8F5",
  dark: "#0a0a0a",
};

// ============================================================================
// LOGO INTRO - bloops in
// ============================================================================
const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade out as scene fades in
  const fadeOut = interpolate(
    frame,
    [SCENE_START, SCENE_START + TIMING.FADE_TO_SCENE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (fadeOut <= 0) return null;

  // Bloop in effect - spring with overshoot
  const bloopProgress = spring({
    frame: frame - TIMING.LOGO_BLOOP_START,
    fps,
    config: {
      damping: 10,
      stiffness: 150,
      mass: 0.8,
    },
  });

  const scale = interpolate(bloopProgress, [0, 1], [0, 1]);
  const opacity = interpolate(bloopProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.dark,
        opacity: fadeOut,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: opacity * fadeOut,
        }}
      >
        <Img
          src={staticFile("shortlist-logo-ivory-transparent.png")}
          style={{
            width: 500,
            objectFit: "contain",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// TRUCK SCENE - two layers
// ============================================================================
const TruckScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(
    frame,
    [SCENE_START, SCENE_START + TIMING.FADE_TO_SCENE],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (fadeIn <= 0) return null;

  // Message bubbles - staggered
  const bubble1Start = SCENE_START + TIMING.FADE_TO_SCENE + 20;
  const bubble2Start = bubble1Start + 25;
  const bubble3Start = bubble2Start + 25;
  const bubblesFadeStart = bubble3Start + 40;
  const locationCardStart = bubblesFadeStart + 20;

  const bubble1Progress = spring({
    frame: frame - bubble1Start,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const bubble2Progress = spring({
    frame: frame - bubble2Start,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const bubble3Progress = spring({
    frame: frame - bubble3Start,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Fade out all bubbles together
  const bubblesFadeOut = interpolate(
    frame,
    [bubblesFadeStart, bubblesFadeStart + 15],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const locationProgress = spring({
    frame: frame - locationCardStart,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Light sweeps and dollar signs timing
  const lightSweepStart = locationCardStart + 60;
  const peopleFadeStart = 309; // 10.3 seconds
  const peopleFadeEnd = 340; // 11:10
  const dollarSignsStart = 326; // 10:26
  const dollarSignsEnd = 390; // Extended - 13 seconds
  const emailStart = 400; // After dollar signs
  const replyStart = 440; // Food truck reply within card
  const responseStart = 475; // Emma's response within card
  const confirmButtonStart = 510; // Confirm booking button appears
  const confirmButtonClick = 550; // Button gets clicked
  const emailFadeStart = 575; // Email card fades
  const bookingConfirmedStart = 590; // Booking confirmed
  const bookingConfirmedEnd = 660; // Booking confirmed fades
  const darkOverlayStart = 680; // Dark overlay with rotating text
  // Scene runs: 6 words * 40 frames = 240 frames + 20 delay + ~90 for tagline = ~350 frames total

  // Fade out location card when light sweeps start
  const locationFadeOut = interpolate(
    frame,
    [lightSweepStart - 10, lightSweepStart + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeIn, backgroundColor: "#1a1a1a" }}>
      {/* Background layer - truck scene */}
      <Img
        src={staticFile("Remotion/truck-scene.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Moving noise overlay on background */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <filter id="truckNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="3"
            seed={Math.floor(frame * 0.5)}
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#truckNoise)" />
      </svg>

      {/* Foreground layer - truck (transparent PNG) */}
      <Img
        src={staticFile("Remotion/truck.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          left: "0",
          top: "15%",
        }}
      />

      {/* Message bubble 1 - "where are you located tonight?" */}
      {frame >= bubble1Start - 5 && (
        <div
          style={{
            position: "absolute",
            top: interpolate(bubble1Progress, [0, 1], [55, 42]) + "%",
            left: "15%",
            transform: `scale(${interpolate(bubble1Progress, [0, 1], [0, 1])})`,
            transformOrigin: "center bottom",
            opacity: bubble1Progress * bubblesFadeOut,
            zIndex: 5,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 25,
              padding: "18px 28px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: "#000",
                fontFamily: "system-ui, -apple-system, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              where are you located tonight?
            </span>
          </div>
        </div>
      )}

      {/* Message bubble 2 - "Where are you guys?" */}
      {frame >= bubble2Start - 5 && (
        <div
          style={{
            position: "absolute",
            top: interpolate(bubble2Progress, [0, 1], [55, 35]) + "%",
            right: "10%",
            transform: `scale(${interpolate(bubble2Progress, [0, 1], [0, 1])})`,
            transformOrigin: "center bottom",
            opacity: bubble2Progress * bubblesFadeOut,
            zIndex: 5,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 25,
              padding: "18px 28px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: "#000",
                fontFamily: "system-ui, -apple-system, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              Where are you guys?
            </span>
          </div>
        </div>
      )}

      {/* Message bubble 3 - "Where can I find you?" */}
      {frame >= bubble3Start - 5 && (
        <div
          style={{
            position: "absolute",
            top: interpolate(bubble3Progress, [0, 1], [55, 28]) + "%",
            left: "25%",
            transform: `scale(${interpolate(bubble3Progress, [0, 1], [0, 1])})`,
            transformOrigin: "center bottom",
            opacity: bubble3Progress * bubblesFadeOut,
            zIndex: 5,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 25,
              padding: "18px 28px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: "#000",
                fontFamily: "system-ui, -apple-system, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              Where can I find you?
            </span>
          </div>
        </div>
      )}

      {/* Location card - Google Maps style - appears AFTER messages fade */}
      {frame >= locationCardStart - 5 && (
        <div
          style={{
            position: "absolute",
            top: interpolate(locationProgress, [0, 1], [65, 35]) + "%",
            left: "50%",
            transform: `translateX(-50%) scale(${interpolate(locationProgress, [0, 1], [0, 1.25])})`,
            transformOrigin: "center bottom",
            opacity: locationProgress * locationFadeOut,
            zIndex: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: "25px 35px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Location icon */}
            <div
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#e74c3c",
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(-45deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  transform: "rotate(45deg)",
                }}
              />
            </div>
            {/* Address */}
            <span
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#000",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textAlign: "center",
              }}
            >
              57 Matteo Road
            </span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: "#444",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Jersey City, NJ
            </span>
            {/* Time */}
            <div
              style={{
                marginTop: 10,
                backgroundColor: "#000",
                borderRadius: 12,
                padding: "10px 25px",
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                5 - 7:30pm
              </span>
            </div>
            {/* Tap the link */}
            <span
              style={{
                marginTop: 15,
                fontSize: 24,
                fontWeight: 600,
                color: "#0066cc",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              tap the link for directions
            </span>
          </div>
          {/* Pin */}
          <div
            style={{
              position: "absolute",
              bottom: -45,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 4,
                height: 30,
                backgroundColor: "#fff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            />
            <div
              style={{
                width: 14,
                height: 14,
                backgroundColor: "#fff",
                borderRadius: "50%",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      )}

      {/* Vignette around truck */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 55%, transparent 30%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Blurred people rushing by - in front of truck at street level */}
      {frame >= lightSweepStart && frame < peopleFadeEnd + 10 && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 50 }}>
          {[...Array(30)].map((_, i) => {
            const goingRight = i % 2 === 0;
            const sweepDelay = i * 3;
            const speed = 12 + (i % 5) * 3;
            const sweepProgress = interpolate(
              frame - lightSweepStart - sweepDelay,
              [0, speed],
              goingRight ? [-30, 130] : [130, -30],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181", "#aa96da", "#fcbad3", "#a8d8ea", "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff7675", "#74b9ff", "#a29bfe", "#fd79a8"];
            const yPos = 85 + (i % 5) * 2; // Lower - connected to ground
            const height = 200 + (i % 4) * 100;
            const width = 60 + (i % 3) * 30;

            // Individual opacity with global fade out
            const individualOpacity = interpolate(
              frame - lightSweepStart - sweepDelay,
              [0, 3, speed - 3, speed],
              [0, 0.7, 0.7, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Global fade out starting at 10.3s
            const globalFade = interpolate(
              frame,
              [peopleFadeStart, peopleFadeEnd],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={`person-${i}`}
                style={{
                  position: "absolute",
                  top: `${yPos}%`,
                  left: `${sweepProgress}%`,
                  width: width,
                  height: height,
                  background: `linear-gradient(${goingRight ? '90deg' : '270deg'}, transparent 0%, ${colors[i % colors.length]}80 20%, ${colors[i % colors.length]} 50%, ${colors[i % colors.length]}80 80%, transparent 100%)`,
                  opacity: individualOpacity * globalFade,
                  filter: "blur(20px)",
                  borderRadius: "40% 40% 20% 20%",
                  transform: "translateY(-50%)",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Dollar signs popping up from behind truck - 5 total */}
      {frame >= dollarSignsStart && frame < dollarSignsEnd + 20 && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 60 }}>
          {[
            { x: 20, y: 55, size: 120, delay: 0 },
            { x: 45, y: 50, size: 150, delay: 8 },
            { x: 70, y: 58, size: 100, delay: 15 },
            { x: 35, y: 48, size: 130, delay: 22 },
            { x: 60, y: 52, size: 140, delay: 30 },
          ].map((dollar, i) => {
            const popFrame = frame - dollarSignsStart - dollar.delay;
            const popProgress = spring({
              frame: popFrame,
              fps,
              config: { damping: 10, stiffness: 120 },
            });

            if (popFrame < 0) return null;

            // Rise up from behind truck
            const riseY = interpolate(popProgress, [0, 1], [100, 0]);

            // Fade out by dollarSignsEnd
            const fadeOut = interpolate(
              frame,
              [dollarSignsEnd - 10, dollarSignsEnd],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={`dollar-${i}`}
                style={{
                  position: "absolute",
                  left: `${dollar.x}%`,
                  top: `${dollar.y}%`,
                  transform: `translateX(-50%) translateY(${riseY}px) scale(${popProgress})`,
                  opacity: popProgress * fadeOut,
                  fontSize: dollar.size,
                  fontWeight: 900,
                  color: "#2ecc71",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  textShadow: "0 6px 25px rgba(46, 204, 113, 0.6), 0 0 50px rgba(46, 204, 113, 0.3)",
                }}
              >
                $
              </div>
            );
          })}
        </div>
      )}

      {/* Email conversation card */}
      {frame >= emailStart && frame < emailFadeStart + 20 && (() => {
        const emailProgress = spring({
          frame: frame - emailStart,
          fps,
          config: { damping: 12, stiffness: 100 },
        });

        const replyProgress = frame >= replyStart ? spring({
          frame: frame - replyStart,
          fps,
          config: { damping: 12, stiffness: 100 },
        }) : 0;

        const responseProgress = frame >= responseStart ? spring({
          frame: frame - responseStart,
          fps,
          config: { damping: 12, stiffness: 100 },
        }) : 0;

        const confirmButtonProgress = frame >= confirmButtonStart ? spring({
          frame: frame - confirmButtonStart,
          fps,
          config: { damping: 12, stiffness: 100 },
        }) : 0;

        // Button glow animation before click - pulsing glow effect
        const glowIntensity = frame >= confirmButtonStart && frame < confirmButtonClick
          ? Math.sin((frame - confirmButtonStart) * 0.12) * 0.3 + 0.7
          : 0;

        // Button click animation - transitions from dark green to light green
        const buttonClicked = frame >= confirmButtonClick;
        const clickProgress = frame >= confirmButtonClick ? interpolate(
          frame,
          [confirmButtonClick, confirmButtonClick + 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        ) : 0;

        const cardFadeOut = interpolate(
          frame,
          [emailFadeStart, emailFadeStart + 15],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            style={{
              position: "absolute",
              top: interpolate(emailProgress, [0, 1], [85, 28]) + "%",
              left: "50%",
              transform: `translateX(-50%) scale(${interpolate(emailProgress, [0, 1], [0, 1])})`,
              transformOrigin: "center bottom",
              opacity: emailProgress * cardFadeOut,
              zIndex: 70,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: "30px 35px",
                boxShadow: "0 10px 50px rgba(0,0,0,0.5)",
                width: 900,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Emma's initial message - left aligned */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 15 }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#4285f4",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>E</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#000", fontFamily: "system-ui" }}>Emma</span>
                    <span style={{ fontSize: 18, color: "#666", fontFamily: "system-ui" }}>Destiny Commons</span>
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 500, color: "#222", fontFamily: "system-ui", lineHeight: 1.4, margin: 0 }}>
                    Hi, this is Emma from Destiny Commons Luxury Rentals. Are you available for a residents event on the 17th?
                  </p>
                </div>
              </div>

              {/* Your Business reply - right aligned */}
              {frame >= replyStart && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 15,
                    justifyContent: "flex-end",
                    opacity: replyProgress,
                    transform: `translateY(${interpolate(replyProgress, [0, 1], [20, 0])}px)`,
                  }}
                >
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 24, fontWeight: 700, color: "#000", fontFamily: "system-ui" }}>Your Business</span>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#2D5A3D",
                        borderRadius: 18,
                        padding: "15px 22px",
                        display: "inline-block",
                      }}
                    >
                      <span style={{ fontSize: 26, fontWeight: 500, color: "#fff", fontFamily: "system-ui" }}>
                        how many units and will there be other vendors?
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: "#2D5A3D",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>YB</span>
                  </div>
                </div>
              )}

              {/* Emma's response - left aligned */}
              {frame >= responseStart && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 15,
                    opacity: responseProgress,
                    transform: `translateY(${interpolate(responseProgress, [0, 1], [20, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: "#4285f4",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>E</span>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#f0f0f0",
                      borderRadius: 18,
                      padding: "15px 22px",
                    }}
                  >
                    <span style={{ fontSize: 26, fontWeight: 500, color: "#000", fontFamily: "system-ui" }}>
                      1000 units and no other vendors
                    </span>
                  </div>
                </div>
              )}

              {/* Confirm Booking button - right aligned */}
              {frame >= confirmButtonStart && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    opacity: confirmButtonProgress,
                    transform: `translateY(${interpolate(confirmButtonProgress, [0, 1], [20, 0])}px) scale(${buttonClicked ? interpolate(clickProgress, [0, 0.3, 1], [1, 0.95, 1]) : 1})`,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: buttonClicked
                        ? `rgba(45, 90, 61, ${interpolate(clickProgress, [0, 1], [1, 0.5])})`
                        : "#2D5A3D",
                      borderRadius: 16,
                      padding: "18px 40px",
                      boxShadow: buttonClicked
                        ? "0 2px 10px rgba(0,0,0,0.2)"
                        : `0 4px 20px rgba(45, 90, 61, 0.4), 0 0 ${30 + glowIntensity * 25}px rgba(45, 90, 61, ${glowIntensity})`,
                    }}
                  >
                    <span style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "system-ui" }}>
                      {buttonClicked ? "✓ Confirmed" : "Confirm Booking"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Booking Confirmed - SaaS style notification */}
      {frame >= bookingConfirmedStart && frame < bookingConfirmedEnd + 20 && (
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(
              spring({
                frame: frame - bookingConfirmedStart,
                fps,
                config: { damping: 8, stiffness: 150 },
              }),
              [0, 1],
              [0.5, 1]
            )})`,
            opacity: interpolate(
              frame,
              [bookingConfirmedStart, bookingConfirmedStart + 10, bookingConfirmedEnd, bookingConfirmedEnd + 15],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: "50px 70px",
              boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Checkmark circle */}
            <div
              style={{
                width: 100,
                height: 100,
                backgroundColor: "#2ecc71",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 30px rgba(46, 204, 113, 0.4)",
              }}
            >
              <span style={{ fontSize: 60, color: "#fff" }}>✓</span>
            </div>
            {/* Booking Confirmed text */}
            <span
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#000",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: -1,
              }}
            >
              Booking Confirmed
            </span>
            {/* Details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                marginTop: 10,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: "#444",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Destiny Commons Luxury Rentals
              </span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: "#666",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Residents Event • The 17th
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dark overlay with final tagline - truck stays visible */}
      {frame >= darkOverlayStart && (() => {
        const overlayFadeIn = interpolate(
          frame,
          [darkOverlayStart, darkOverlayStart + 15],
          [0, 0.92],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const localFrame = frame - darkOverlayStart;

        // Phase 1: "Work Smarter." appears (frames 15-60)
        // Phase 2: "Work Smarter." fades out (frames 60-75)
        // Phase 3: "Choose SmartAssistant." fades in (frames 75+)
        const phase2Start = 55; // Work Smarter starts fading out
        const phase3Start = 70; // Choose SmartAssistant appears

        // Work Smarter opacity
        const workSmarterIn = spring({ frame: Math.max(0, localFrame - 15), fps, config: { damping: 10, stiffness: 100 } });
        const workSmarterOut = localFrame >= phase2Start ? interpolate(
          localFrame,
          [phase2Start, phase2Start + 12],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        ) : 1;

        // Choose SmartAssistant
        const chooseProgress = localFrame >= phase3Start ? spring({
          frame: localFrame - phase3Start,
          fps,
          config: { damping: 10, stiffness: 100 },
        }) : 0;

        return (
          <>
            {/* Dark overlay - extends down closer to truck */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "85%",
                background: `linear-gradient(to bottom,
                  rgba(0,0,0,${overlayFadeIn}) 0%,
                  rgba(0,0,0,${overlayFadeIn}) 60%,
                  rgba(0,0,0,${overlayFadeIn * 0.6}) 80%,
                  rgba(0,0,0,0) 100%)`,
                zIndex: 110,
              }}
            />

            {/* Work Smarter. - appears then fades out */}
            {localFrame < phase3Start + 10 && (
              <div
                style={{
                  position: "absolute",
                  top: "38%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 120,
                  textAlign: "center",
                  opacity: workSmarterIn * workSmarterOut,
                }}
              >
                <span
                  style={{
                    fontSize: 110,
                    fontWeight: 900,
                    color: "#FAF8F5",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textShadow: "0 6px 30px rgba(0,0,0,0.8)",
                    letterSpacing: -3,
                  }}
                >
                  Work Smarter.
                </span>
              </div>
            )}

            {/* Choose SmartAssistant. - fades in after */}
            {localFrame >= phase3Start && (
              <div
                style={{
                  position: "absolute",
                  top: "38%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translateY(${interpolate(chooseProgress, [0, 1], [30, 0])}px)`,
                  zIndex: 120,
                  textAlign: "center",
                  opacity: chooseProgress,
                }}
              >
                <span
                  style={{
                    fontSize: 95,
                    fontWeight: 900,
                    color: "#FAF8F5",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textShadow: "0 6px 30px rgba(0,0,0,0.8)",
                    letterSpacing: -2,
                  }}
                >
                  Choose SmartAssistant.
                </span>
              </div>
            )}
          </>
        );
      })()}
    </AbsoluteFill>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const FoodTruckPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <TruckScene />
      <LogoIntro />
    </AbsoluteFill>
  );
};
