import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

// ============================================================================
// TIMING (30fps) - 15 seconds = 450 frames
// ============================================================================
const TOTAL_FRAMES = 450;
const INTRO_DURATION = 120; // 4 seconds for intro wipe scene
const IMAGE_COUNT = 12;
const FRAMES_PER_IMAGE = 30; // 1 second per image, will loop

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
// EMPANADA WIPE INTRO - reveals words as it passes
// ============================================================================
const EmpanadaWipeIntro: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame >= INTRO_DURATION) return null;

  // Three wipes: left-to-right, right-to-left, left-to-right
  const wipe1Start = 5;
  const wipe1End = 30;
  const wipe2Start = 33;
  const wipe2End = 58;
  const wipe3Start = 61;
  const wipe3End = 86;
  const flashStart = 90;
  const flashEnd = 100;

  // Wipe progress
  const wipe1Progress = interpolate(frame, [wipe1Start, wipe1End], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipe2Progress = interpolate(frame, [wipe2Start, wipe2End], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wipe3Progress = interpolate(frame, [wipe3Start, wipe3End], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gigantic empanada positions (swipes across screen)
  const empanadaSize = 700;
  const empanada1X = interpolate(wipe1Progress, [0, 1], [-empanadaSize, 1080 + 100]);
  const empanada2X = interpolate(wipe2Progress, [0, 1], [1080 + 100, -empanadaSize]);
  const empanada3X = interpolate(wipe3Progress, [0, 1], [-empanadaSize, 1080 + 100]);

  // Rotation as it moves
  const empanada1Rot = wipe1Progress * 720;
  const empanada2Rot = wipe2Progress * -720;
  const empanada3Rot = wipe3Progress * 720;

  // Reveal follows behind the empanada (offset by empanada size)
  // Text only reveals AFTER empanada passes
  const reveal1Width = interpolate(wipe1Progress, [0.3, 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reveal2Width = interpolate(wipe2Progress, [0.3, 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reveal3Width = interpolate(wipe3Progress, [0.3, 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // APOCALYPTIC FLASH BANG - multiple intense pulses
  const flashLocalFrame = frame - flashStart;
  const flashPulse1 = interpolate(flashLocalFrame, [0, 2, 4], [0, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashPulse2 = interpolate(flashLocalFrame, [4, 6, 9], [0.3, 1, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashPulse3 = interpolate(flashLocalFrame, [9, 11, 15], [0.1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashOpacity = frame >= flashStart ? Math.max(flashPulse1, flashPulse2, flashPulse3) : 0;

  // Screen shake during flash
  const shakeX = frame >= flashStart && frame <= flashEnd ? Math.sin(flashLocalFrame * 8) * 15 : 0;
  const shakeY = frame >= flashStart && frame <= flashEnd ? Math.cos(flashLocalFrame * 10) * 10 : 0;

  // Fade out after flash - complete before card shows
  const fadeOut = interpolate(frame, [flashEnd, flashEnd + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text vertical positions - tightly stacked and centered
  const textTop1 = "40%";
  const textTop2 = "50%";
  const textTop3 = "60%";

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark, opacity: fadeOut, transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      {/* NITO'S - revealed left to right */}
      <div
        style={{
          position: "absolute",
          top: textTop1,
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          clipPath: `inset(0 ${100 - reveal1Width}% 0 0)`,
        }}
      >
        <span
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: COLORS.gold,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 80px ${COLORS.gold}50`,
            letterSpacing: -5,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          NITO'S
        </span>
      </div>

      {/* IS - revealed right to left */}
      <div
        style={{
          position: "absolute",
          top: textTop2,
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          clipPath: `inset(0 0 0 ${100 - reveal2Width}%)`,
        }}
      >
        <span
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: COLORS.ivory,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 8px 40px rgba(0,0,0,0.8)",
            letterSpacing: -4,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          IS
        </span>
      </div>

      {/* HIRING - revealed left to right */}
      <div
        style={{
          position: "absolute",
          top: textTop3,
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          clipPath: `inset(0 ${100 - reveal3Width}% 0 0)`,
        }}
      >
        <span
          style={{
            fontSize: 180,
            fontWeight: 900,
            color: COLORS.gold,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 80px ${COLORS.gold}50`,
            letterSpacing: -4,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          HIRING
        </span>
      </div>

      {/* GIGANTIC Empanada wipe 1 - left to right over NITO'S */}
      {frame >= wipe1Start && frame <= wipe1End + 3 && (
        <Img
          src={staticFile("empanada.png")}
          style={{
            position: "absolute",
            top: textTop1,
            left: empanada1X,
            width: empanadaSize,
            height: empanadaSize,
            objectFit: "contain",
            transform: `translateY(-50%) rotate(${empanada1Rot}deg)`,
            filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.8))",
            zIndex: 20,
          }}
        />
      )}

      {/* GIGANTIC Empanada wipe 2 - right to left over IS */}
      {frame >= wipe2Start && frame <= wipe2End + 3 && (
        <Img
          src={staticFile("empanada.png")}
          style={{
            position: "absolute",
            top: textTop2,
            left: empanada2X,
            width: empanadaSize,
            height: empanadaSize,
            objectFit: "contain",
            transform: `translateY(-50%) rotate(${empanada2Rot}deg)`,
            filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.8))",
            zIndex: 20,
          }}
        />
      )}

      {/* GIGANTIC Empanada wipe 3 - left to right over HIRING */}
      {frame >= wipe3Start && frame <= wipe3End + 3 && (
        <Img
          src={staticFile("empanada.png")}
          style={{
            position: "absolute",
            top: textTop3,
            left: empanada3X,
            width: empanadaSize,
            height: empanadaSize,
            objectFit: "contain",
            transform: `translateY(-50%) rotate(${empanada3Rot}deg)`,
            filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.8))",
            zIndex: 20,
          }}
        />
      )}

      {/* APOCALYPTIC FLASH BANG */}
      {frame >= flashStart && frame <= flashEnd + 5 && (
        <>
          {/* Base white flash */}
          <div
            style={{
              position: "absolute",
              inset: -50,
              backgroundColor: "#fff",
              opacity: flashOpacity,
              zIndex: 100,
            }}
          />
          {/* Gold overlay pulse */}
          <div
            style={{
              position: "absolute",
              inset: -50,
              backgroundColor: COLORS.gold,
              opacity: flashOpacity * 0.4 * Math.abs(Math.sin(flashLocalFrame * 3)),
              mixBlendMode: "overlay",
              zIndex: 101,
            }}
          />
          {/* Radial burst */}
          <div
            style={{
              position: "absolute",
              inset: -100,
              background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${flashOpacity}) 0%, rgba(255,200,100,${flashOpacity * 0.8}) 30%, transparent 70%)`,
              zIndex: 102,
              transform: `scale(${1 + flashLocalFrame * 0.1})`,
            }}
          />
          {/* OLD SCHOOL TV STATIC */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 103,
              opacity: flashOpacity * 0.8,
              overflow: "hidden",
            }}
          >
            {/* Horizontal scan lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.3) 2px,
                  rgba(0,0,0,0.3) 4px
                )`,
              }}
            />
            {/* Static noise - using multiple offset divs to simulate */}
            {Array.from({ length: 30 }).map((_, i) => {
              const seed = (flashLocalFrame * 137 + i * 73) % 100;
              const y = ((seed * 7 + flashLocalFrame * 13 + i * 41) % 100);
              const width = 20 + (seed % 80);
              const brightness = 0.3 + (seed % 70) / 100;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${(seed * 11 + i * 17) % 100}%`,
                    top: `${y}%`,
                    width: `${width}%`,
                    height: 3 + (i % 4),
                    backgroundColor: `rgba(255,255,255,${brightness})`,
                    transform: `translateX(-50%)`,
                  }}
                />
              );
            })}
            {/* Vertical glitch bars */}
            {Array.from({ length: 8 }).map((_, i) => {
              const offset = (flashLocalFrame * 23 + i * 47) % 100;
              return (
                <div
                  key={`v${i}`}
                  style={{
                    position: "absolute",
                    left: `${offset}%`,
                    top: 0,
                    width: 2 + (i % 3),
                    height: "100%",
                    backgroundColor: `rgba(255,255,255,${0.2 + (i % 5) * 0.1})`,
                  }}
                />
              );
            })}
            {/* Flickering color bars */}
            {flashLocalFrame % 3 === 0 && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: `${20 + (flashLocalFrame * 7) % 60}%`,
                  width: "100%",
                  height: 8,
                  background: "linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ffff00, #ff00ff, #00ffff)",
                  opacity: 0.6,
                }}
              />
            )}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// GALLERY IMAGES
// ============================================================================
const galleryImages = Array.from({ length: IMAGE_COUNT }, (_, i) =>
  `nitos-gallery/nitos-gallery-${i + 1}.png`
);

// ============================================================================
// HIRING CARD OVERLAY - shrinks and ping pongs with vibrant colors
// ============================================================================
const HiringCardOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Show right after the flash explosion (frame 100)
  if (frame < 100) return null;

  const localFrame = frame - 100;
  const galleryFrame = frame - INTRO_DURATION + 15;

  // Shrink animation - from full size to half over first 30 frames
  const shrinkProgress = interpolate(localFrame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.5]);

  // Unpredictable ping pong movement - multiple overlapping waves
  const bounceStartFrame = 30;
  const bounceEaseIn = localFrame > bounceStartFrame
    ? interpolate(localFrame, [bounceStartFrame, bounceStartFrame + 45], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const bounceFrame = Math.max(0, localFrame - bounceStartFrame);

  // Combine multiple sine waves at different frequencies for chaotic movement
  const pingPongX = (
    Math.sin(bounceFrame * 0.05) * 200 +
    Math.sin(bounceFrame * 0.11) * 150 +
    Math.cos(bounceFrame * 0.07) * 100
  ) * bounceEaseIn;

  const pingPongY = (
    Math.cos(bounceFrame * 0.06) * 250 +
    Math.sin(bounceFrame * 0.09) * 180 +
    Math.cos(bounceFrame * 0.13) * 120
  ) * bounceEaseIn;

  // Masculine but fun colors that change with each image
  const vibrantColors = [
    { bg: "#1E3A5F", text1: "#F4A020", text2: "#FFFFFF", text3: "#F4A020" }, // Navy + Orange
    { bg: "#2D5A3D", text1: "#C4A052", text2: "#FFFFFF", text3: "#C4A052" }, // Forest Green + Gold
    { bg: "#8B2635", text1: "#FFFFFF", text2: "#C4A052", text3: "#FFFFFF" }, // Burgundy
    { bg: "#D35400", text1: "#FFFFFF", text2: "#1a1a1a", text3: "#FFFFFF" }, // Burnt Orange
    { bg: "#2C3E50", text1: "#E74C3C", text2: "#FFFFFF", text3: "#E74C3C" }, // Charcoal + Red
    { bg: "#1ABC9C", text1: "#FFFFFF", text2: "#1a1a1a", text3: "#FFFFFF" }, // Teal
    { bg: "#34495E", text1: "#F39C12", text2: "#FFFFFF", text3: "#F39C12" }, // Slate + Amber
    { bg: "#6C3483", text1: "#FFFFFF", text2: "#F4D03F", text3: "#FFFFFF" }, // Deep Purple + Gold
    { bg: "#0E4D45", text1: "#C4A052", text2: "#FFFFFF", text3: "#C4A052" }, // Dark Teal + Gold
    { bg: "#922B21", text1: "#FFFFFF", text2: "#F4D03F", text3: "#FFFFFF" }, // Deep Red + Yellow
    { bg: "#1B4F72", text1: "#FFFFFF", text2: "#E67E22", text3: "#FFFFFF" }, // Deep Blue + Orange
    { bg: "#145A32", text1: "#F4D03F", text2: "#FFFFFF", text3: "#F4D03F" }, // Hunter Green + Gold
  ];

  // Current color based on which image is showing
  const currentImageIndex = Math.max(0, Math.floor(galleryFrame / FRAMES_PER_IMAGE) % IMAGE_COUNT);
  const currentColors = localFrame < 30
    ? { bg: COLORS.dark, text1: COLORS.gold, text2: COLORS.ivory, text3: COLORS.gold }
    : vibrantColors[currentImageIndex % vibrantColors.length];

  // Card dimensions at current scale
  const cardWidth = 900 * scale;
  const cardHeight = 580 * scale;

  // Rotation based on movement direction for dragging effect
  const dragRotation = localFrame > bounceStartFrame
    ? (Math.sin(bounceFrame * 0.08) * 8 + Math.cos(bounceFrame * 0.05) * 5) * bounceEaseIn
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: `calc(50% + ${pingPongY}px)`,
        left: `calc(50% + ${pingPongX}px)`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${dragRotation}deg)`,
        zIndex: 50,
        transition: localFrame > 30 ? "background-color 0.3s ease" : "none",
      }}
    >
      {/* Giant empanada dragging the card - attached to top right corner */}
      {localFrame > 20 && (
        <Img
          src={staticFile("empanada.png")}
          style={{
            position: "absolute",
            top: -450,
            right: -350,
            width: 800,
            height: 800,
            objectFit: "contain",
            transform: `rotate(${-dragRotation * 2 + 45}deg)`,
            filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.6))",
            zIndex: 60,
          }}
        />
      )}

      {/* Note card with vibrant background */}
      <div
        style={{
          width: 900,
          height: 580,
          backgroundColor: currentColors.bg,
          borderRadius: 20,
          boxShadow: "0 30px 100px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* NITO'S */}
        <span
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: currentColors.text1,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            letterSpacing: -5,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          NITO'S
        </span>

        {/* IS */}
        <span
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: currentColors.text2,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            letterSpacing: -4,
            whiteSpace: "nowrap",
            lineHeight: 1,
            marginTop: -15,
          }}
        >
          IS
        </span>

        {/* HIRING */}
        <span
          style={{
            fontSize: 180,
            fontWeight: 900,
            color: currentColors.text3,
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            letterSpacing: -4,
            whiteSpace: "nowrap",
            lineHeight: 1,
            marginTop: -15,
          }}
        >
          HIRING
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// SCROLLING GALLERY
// ============================================================================
const ScrollingGallery: React.FC = () => {
  const frame = useCurrentFrame();

  // Don't show until intro is done
  if (frame < INTRO_DURATION - 15) return null;

  // Fade in gallery
  const fadeIn = interpolate(frame, [INTRO_DURATION - 15, INTRO_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Adjust frame for gallery timing (starts after intro)
  const galleryFrame = frame - INTRO_DURATION + 15;

  // Images rotate at double speed (15 frames = 0.5 seconds per image)
  const imageFrames = FRAMES_PER_IMAGE / 2;

  // Calculate which image to show (loops continuously)
  const currentImageIndex = Math.floor(galleryFrame / imageFrames) % IMAGE_COUNT;
  const nextImageIndex = (currentImageIndex + 1) % IMAGE_COUNT;

  // Progress within current image (0 to 1)
  const imageProgress = (galleryFrame % imageFrames) / imageFrames;

  // Simple crossfade between images
  const currentOpacity = interpolate(imageProgress, [0, 0.9, 1], [1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const nextOpacity = interpolate(imageProgress, [0.9, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* Current image */}
      <Img
        src={staticFile(galleryImages[currentImageIndex])}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: currentOpacity,
        }}
      />

      {/* Next image (fading in) */}
      {nextOpacity > 0 && (
        <Img
          src={staticFile(galleryImages[nextImageIndex])}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: nextOpacity,
          }}
        />
      )}

      {/* Subtle moving noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: -100,
          opacity: 0.06,
          pointerEvents: "none",
          transform: `translate(${(frame * 3) % 100}px, ${(frame * 2) % 100}px)`,
        }}
      >
        {Array.from({ length: 200 }).map((_, i) => {
          const x = (i * 37) % 120;
          const y = (i * 53) % 120;
          const size = 2 + (i % 4);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                backgroundColor: i % 2 === 0 ? "#fff" : "#000",
                borderRadius: "50%",
              }}
            />
          );
        })}
      </div>

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// LOOP TRANSITION - fade to black at the end to match the intro
// ============================================================================
const LoopTransition: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade to black in the last 30 frames
  const fadeStart = TOTAL_FRAMES - 30;
  const fadeOpacity = interpolate(frame, [fadeStart, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < fadeStart) return null;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.dark,
        opacity: fadeOpacity,
        zIndex: 200,
      }}
    />
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const NitosHiring: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ScrollingGallery />
      <HiringCardOverlay />
      <EmpanadaWipeIntro />
      <LoopTransition />
    </AbsoluteFill>
  );
};
