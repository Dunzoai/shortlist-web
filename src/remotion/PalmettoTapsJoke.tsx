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
// TIMING (30fps) - Total ~8 seconds = 240 frames
// ============================================================================
const TIMING = {
  // Rapid fire chaos
  CHAOS_START: 0,
  CHAOS_END: 150, // 5 seconds of rapid fire

  // Pieces come together
  ASSEMBLE_START: 150,
  ASSEMBLE_END: 210, // 2 seconds to assemble

  // Hold final composition
  HOLD_START: 210,
  HOLD_END: 240, // 1 second hold
};

// ============================================================================
// COLORS
// ============================================================================
const COLORS = {
  background: "#1a1a1a",
  text: "#ffffff",
};

// ============================================================================
// PUZZLE GRID CONFIGURATION
// ============================================================================
const GRID_SIZE = 4; // 4x4 grid = 16 pieces per image
const PIECE_SIZE = 175; // Each piece is 175x175 (700/4)

// ============================================================================
// IMAGE DEFINITIONS - each image broken into puzzle pieces
// ============================================================================
const IMAGES = [
  {
    src: "Remotion/smashburger.jpg",
    // Final assembled position for this image
    finalCenter: { x: -270, y: -400 },
    finalRotation: -3,
    finalScale: 0.5,
  },
  {
    src: "Remotion/Pizza.jpg",
    finalCenter: { x: 270, y: -400 },
    finalRotation: 4,
    finalScale: 0.5,
  },
  {
    src: "Remotion/taps.jpg",
    finalCenter: { x: 0, y: 380 },
    finalRotation: 0,
    finalScale: 0.55,
  },
];

// Generate chaos path for a single puzzle piece
const generateChaosPath = (
  imageIndex: number,
  row: number,
  col: number,
  frame: number
) => {
  // Unique seed based on piece position
  const seed = imageIndex * 100 + row * 10 + col;
  const phase1 = seed * 0.7;
  const phase2 = seed * 1.3;

  // Frequency modifiers for variety
  const freqX = 0.08 + (seed % 7) * 0.01;
  const freqY = 0.09 + (seed % 5) * 0.01;
  const freqRot = 0.12 + (seed % 3) * 0.02;

  return {
    x:
      Math.sin(frame * freqX + phase1) * 600 +
      Math.cos(frame * freqY * 0.7 + phase2) * 400,
    y:
      Math.cos(frame * freqY + phase1) * 800 +
      Math.sin(frame * freqX * 0.6 + phase2) * 300,
    rotation: frame * (2 + (seed % 4)) + Math.sin(frame * freqRot) * 40,
    scale: 0.3 + Math.sin(frame * 0.08 + phase1) * 0.15,
  };
};

// ============================================================================
// PUZZLE PIECE COMPONENT
// ============================================================================
interface PuzzlePieceProps {
  imageSrc: string;
  imageIndex: number;
  row: number;
  col: number;
  assembleProgress: number;
  finalCenter: { x: number; y: number };
  finalRotation: number;
  finalScale: number;
  frame: number;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  imageSrc,
  imageIndex,
  row,
  col,
  assembleProgress,
  finalCenter,
  finalRotation,
  finalScale,
  frame,
}) => {
  // Chaos position
  const chaos = generateChaosPath(imageIndex, row, col, frame);

  // Final assembled position - piece goes to its spot in the grid
  const gridOffsetX = (col - (GRID_SIZE - 1) / 2) * PIECE_SIZE * finalScale;
  const gridOffsetY = (row - (GRID_SIZE - 1) / 2) * PIECE_SIZE * finalScale;

  const finalX = finalCenter.x + gridOffsetX;
  const finalY = finalCenter.y + gridOffsetY;

  // Staggered assembly - pieces closest to center assemble first
  const distFromCenter = Math.abs(row - 1.5) + Math.abs(col - 1.5);
  const staggerDelay = distFromCenter * 3; // frames
  const staggeredProgress = spring({
    frame: Math.max(0, (assembleProgress * 60) - staggerDelay), // Convert progress to frames
    fps: 30,
    config: { damping: 12, stiffness: 100 },
  });

  // Interpolate between chaos and final
  const x = interpolate(staggeredProgress, [0, 1], [chaos.x, finalX]);
  const y = interpolate(staggeredProgress, [0, 1], [chaos.y, finalY]);
  const rotation = interpolate(
    staggeredProgress,
    [0, 1],
    [chaos.rotation % 360, finalRotation]
  );
  const scale = interpolate(
    staggeredProgress,
    [0, 1],
    [chaos.scale, finalScale]
  );

  // Staggered appearance during chaos
  const seed = imageIndex * 16 + row * 4 + col;
  const appearFrame = (seed % 30) + Math.floor(seed / 30) * 2;
  const opacity = interpolate(frame, [appearFrame, appearFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background position to show correct piece of image
  const bgPosX = (col / (GRID_SIZE - 1)) * 100;
  const bgPosY = (row / (GRID_SIZE - 1)) * 100;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
        opacity,
        zIndex: imageIndex * 20 + row * 4 + col,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: `0 ${4 + scale * 8}px ${12 + scale * 16}px rgba(0,0,0,0.5)`,
          border: "2px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            width: PIECE_SIZE * GRID_SIZE,
            height: PIECE_SIZE * GRID_SIZE,
            marginLeft: -col * PIECE_SIZE,
            marginTop: -row * PIECE_SIZE,
          }}
        >
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const PalmettoTapsJoke: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Assembly progress (0 = chaos, 1 = assembled)
  const assembleProgress = spring({
    frame: Math.max(0, frame - TIMING.ASSEMBLE_START),
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Logo fade in during assembly
  const logoOpacity = interpolate(
    frame,
    [TIMING.ASSEMBLE_START + 30, TIMING.ASSEMBLE_START + 50],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const logoScale = spring({
    frame: Math.max(0, frame - TIMING.ASSEMBLE_START - 30),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Tagline fade in
  const taglineOpacity = interpolate(
    frame,
    [TIMING.HOLD_START, TIMING.HOLD_START + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Flash/strobe effect during chaos
  const strobeIntensity =
    frame < TIMING.CHAOS_END ? Math.abs(Math.sin(frame * 0.4)) * 0.12 : 0;

  // Generate all puzzle pieces
  const allPieces: React.ReactNode[] = [];
  IMAGES.forEach((image, imageIndex) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        allPieces.push(
          <PuzzlePiece
            key={`${imageIndex}-${row}-${col}`}
            imageSrc={image.src}
            imageIndex={imageIndex}
            row={row}
            col={col}
            assembleProgress={assembleProgress}
            finalCenter={image.finalCenter}
            finalRotation={image.finalRotation}
            finalScale={image.finalScale}
            frame={frame}
          />
        );
      }
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* All puzzle pieces */}
      {allPieces}

      {/* Strobe/flash overlay during chaos */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#fff",
          opacity: strobeIntensity,
          pointerEvents: "none",
          zIndex: 100,
        }}
      />

      {/* Logo - appears during assembly */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(-50px) scale(${interpolate(logoScale, [0, 1], [0.5, 1])})`,
          opacity: logoOpacity,
          zIndex: 200,
        }}
      >
        <Img
          src={staticFile(
            "Remotion/PalmettoTaps-Logo_Full_2023_Logo-Full-Clr.webp"
          )}
          style={{
            width: 380,
            objectFit: "contain",
            filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.8))",
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: taglineOpacity,
          zIndex: 200,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 32,
            fontWeight: 500,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: 3,
          }}
        >
          SMASHBURGERS • PIZZA • SELF-SERVE BEER
        </span>
      </div>
    </AbsoluteFill>
  );
};
