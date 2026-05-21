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
// STYLING
// ============================================================================
const COLORS = {
  counter: "#1A1715",
  counterHighlight: "#22201D",
  paper: "#F5F0E8",
  text: "#2A2420",
  faded: "#9A9088",
  accent: "#1A1410",
};

const FONT = '"Courier New", Courier, monospace';

// ============================================================================
// LAYOUT
// ============================================================================
const SECTION_HEIGHT = 1920;
const RECEIPT_WIDTH = 960;
const NUM_SECTIONS = 7;
const PAPER_PAD = 400;
const CONTENT_PAD = 50;

// ============================================================================
// TIMING (30fps, 600 frames = 20 seconds)
// ============================================================================
const SCROLL_STARTS = [55, 145, 240, 310, 400, 485];
const SETTLE_FRAMES = [10, 70, 160, 255, 325, 415, 500];

const SCROLL_SPRING = { damping: 15, stiffness: 100 };
const POP_SPRING = { damping: 12, stiffness: 150 };

// ============================================================================
// THERMAL RECEIPT TEXTURE COMPONENTS
// ============================================================================

// SVG noise grain — simulates paper fiber / thermal paper texture
const PaperGrain: React.FC = () => (
  <svg
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      mixBlendMode: "multiply",
    }}
  >
    <defs>
      <filter id="grainFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <pattern
        id="grainPat"
        width="256"
        height="256"
        patternUnits="userSpaceOnUse"
      >
        <rect width="256" height="256" filter="url(#grainFilter)" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grainPat)" opacity="0.05" />
  </svg>
);

// Torn/jagged paper edge — top or bottom
const TornEdge: React.FC<{ position: "top" | "bottom" }> = ({ position }) => {
  const h = 18;
  const segs = 60;

  const edgePoints = Array.from({ length: segs + 1 }, (_, i) => {
    const x = (i / segs) * RECEIPT_WIDTH;
    const noise =
      Math.sin(i * 5.7) * 2.5 +
      Math.cos(i * 11.3) * 2 +
      Math.sin(i * 17.1) * 1;
    const base = i % 2 === 0 ? h * 0.3 : h * 0.75;
    const y = Math.max(2, Math.min(h - 2, base + noise));
    return `${x},${y}`;
  });

  const edgeRev = [...edgePoints].reverse().join(" ");

  if (position === "top") {
    return (
      <svg
        width={RECEIPT_WIDTH}
        height={h}
        style={{ position: "absolute", top: -1, left: 0, display: "block" }}
      >
        <polygon
          points={`0,0 ${RECEIPT_WIDTH},0 ${edgeRev}`}
          fill={COLORS.counter}
        />
      </svg>
    );
  }

  return (
    <svg
      width={RECEIPT_WIDTH}
      height={h}
      style={{ position: "absolute", bottom: -1, left: 0, display: "block" }}
    >
      <polygon
        points={`0,${h} ${RECEIPT_WIDTH},${h} ${edgeRev}`}
        fill={COLORS.counter}
      />
    </svg>
  );
};

// Subtle aging / yellowing spots on the paper
const PaperAging: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `
        radial-gradient(ellipse at 20% 12%, rgba(180,150,100,0.05) 0%, transparent 40%),
        radial-gradient(ellipse at 75% 50%, rgba(160,130,80,0.04) 0%, transparent 35%),
        radial-gradient(ellipse at 35% 82%, rgba(170,140,90,0.04) 0%, transparent 30%)
      `,
      pointerEvents: "none",
    }}
  />
);

// Thermal print head streaks — faint horizontal bands
const ThermalStreaks: React.FC = () => (
  <>
    {[0.08, 0.23, 0.41, 0.59, 0.74, 0.88].map((pos, i) => (
      <div
        key={`streak-${i}`}
        style={{
          position: "absolute",
          top: `${pos * 100}%`,
          left: 0,
          right: 0,
          height: 2 + (i % 3),
          backgroundColor: `rgba(0,0,0,${0.015 + (i % 2) * 0.01})`,
          pointerEvents: "none",
        }}
      />
    ))}
  </>
);

// ============================================================================
// RECEIPT VISUAL ELEMENTS
// ============================================================================
const ReceiptLine: React.FC<{
  children: React.ReactNode;
  size?: number;
  bold?: boolean;
  faded?: boolean;
  spacing?: number;
  marginTop?: number;
}> = ({
  children,
  size = 58,
  bold = false,
  faded: isFaded = false,
  spacing = 0,
  marginTop = 0,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: bold ? 900 : 400,
      color: isFaded ? COLORS.faded : bold ? COLORS.accent : COLORS.text,
      textAlign: "center",
      letterSpacing: spacing,
      lineHeight: 1.8,
      marginTop,
      textShadow: isFaded
        ? "none"
        : "0.5px 0.5px 0.8px rgba(0,0,0,0.12)",
    }}
  >
    {children}
  </div>
);

const ReceiptItem: React.FC<{ left: string; right: string }> = ({
  left,
  right,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontFamily: FONT,
      fontSize: 58,
      fontWeight: 700,
      color: COLORS.text,
      lineHeight: 2.0,
      textShadow: "0.5px 0.5px 0.8px rgba(0,0,0,0.12)",
    }}
  >
    <span>{left}</span>
    <span>{right}</span>
  </div>
);

// Receipt-style total line — dashed rule, TOTAL: VALUE, double border
const ReceiptTotal: React.FC<{ value: string }> = ({ value }) => (
  <div style={{ marginTop: 100 }}>
    <div
      style={{
        fontFamily: FONT,
        fontSize: 22,
        color: COLORS.faded,
        textAlign: "center",
        letterSpacing: 6,
      }}
    >
      {"- ".repeat(26).trim()}
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontFamily: FONT,
        fontSize: 52,
        fontWeight: 900,
        color: COLORS.accent,
        marginTop: 25,
        marginBottom: 25,
        textShadow: "0.5px 0.5px 0.8px rgba(0,0,0,0.12)",
      }}
    >
      <span>TOTAL</span>
      <span>{value}</span>
    </div>
    <div
      style={{
        borderTop: `3px solid ${COLORS.text}`,
        borderBottom: `3px solid ${COLORS.text}`,
        height: 8,
      }}
    />
  </div>
);

// Thin solid rule
const ThinRule: React.FC<{ marginTop?: number; marginBottom?: number }> = ({
  marginTop = 0,
  marginBottom = 0,
}) => (
  <div
    style={{
      borderBottom: `2px solid ${COLORS.faded}`,
      marginTop,
      marginBottom,
    }}
  />
);

// Double-line border
const DoubleBorder: React.FC = () => (
  <div
    style={{
      borderTop: `3px solid ${COLORS.text}`,
      borderBottom: `3px solid ${COLORS.text}`,
      height: 8,
    }}
  />
);

// Dashed separator between full sections
const DashedSep: React.FC = () => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: 24,
      color: COLORS.faded,
      textAlign: "center",
      letterSpacing: 6,
    }}
  >
    {"- ".repeat(26).trim()}
  </div>
);

// Star break
const StarBreak: React.FC<{ marginTop?: number; marginBottom?: number }> = ({
  marginTop = 30,
  marginBottom = 30,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: 28,
      color: COLORS.faded,
      textAlign: "center",
      letterSpacing: 12,
      marginTop,
      marginBottom,
    }}
  >
    *{"  *  ".repeat(4)}*
  </div>
);

// Section wrapper — fills one screen, vertically centers content
const Section: React.FC<{
  index: number;
  children: React.ReactNode;
}> = ({ index, children }) => (
  <div
    style={{
      position: "absolute",
      top: PAPER_PAD + index * SECTION_HEIGHT,
      left: 0,
      right: 0,
      height: SECTION_HEIGHT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `120px ${CONTENT_PAD}px`,
    }}
  >
    <div style={{ width: "100%" }}>{children}</div>
  </div>
);

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const SmartAssistantReceipt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Scroll position from cumulative springs ---
  let scrollY = 0;
  for (const startFrame of SCROLL_STARTS) {
    const progress = spring({
      frame: Math.max(0, frame - startFrame),
      fps,
      config: SCROLL_SPRING,
    });
    scrollY -= progress * SECTION_HEIGHT;
  }

  // --- Fade in ---
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Emphasis pop helper (scale 0.85 → 1.0 with overshoot) ---
  const emphasisScale = (sectionIndex: number, delay = 10) => {
    const pop = spring({
      frame: Math.max(0, frame - SETTLE_FRAMES[sectionIndex] - delay),
      fps,
      config: POP_SPRING,
    });
    return interpolate(pop, [0, 1], [0.85, 1]);
  };

  const paperHeight = NUM_SECTIONS * SECTION_HEIGHT + 2 * PAPER_PAD;

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(40,35,30,1) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(35,30,25,1) 0%, transparent 60%),
          linear-gradient(160deg, ${COLORS.counter} 0%, ${COLORS.counterHighlight} 50%, ${COLORS.counter} 100%)
        `,
      }}
    >
      {/* Receipt paper strip */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: scrollY - PAPER_PAD,
          transform: "translateX(-50%)",
          width: RECEIPT_WIDTH,
          height: paperHeight,
          backgroundColor: COLORS.paper,
          boxShadow:
            "0 8px 60px rgba(0,0,0,0.45), -8px 0 30px rgba(0,0,0,0.15), 8px 0 30px rgba(0,0,0,0.15), inset 0 0 120px rgba(0,0,0,0.03)",
          opacity: fadeIn,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 4px,
              rgba(0,0,0,0.018) 4px,
              rgba(0,0,0,0.018) 5px
            )
          `,
        }}
      >
        {/* Torn paper edges */}
        <TornEdge position="top" />
        <TornEdge position="bottom" />

        {/* Paper grain texture */}
        <PaperGrain />

        {/* Subtle aging spots */}
        <PaperAging />

        {/* Thermal print head streaks */}
        <ThermalStreaks />

        {/* ═══ S0: HEADER — Logo + Branding ═══ */}
        <Section index={0}>
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Img
                src={staticFile("shortlist-logo-slate-blue.png")}
                style={{
                  height: 360,
                  objectFit: "contain",
                }}
              />
            </div>

            <StarBreak marginTop={60} marginBottom={60} />

            <DoubleBorder />
            <ReceiptLine size={62} bold spacing={10} marginTop={50}>
              SMARTASSISTANT
            </ReceiptLine>
            <div style={{ marginTop: 50 }}>
              <DoubleBorder />
            </div>

            <ReceiptLine size={28} faded spacing={2} marginTop={35}>
              BY THE SHORTLISTPASS COMPANY
            </ReceiptLine>
          </div>
        </Section>

        {/* ═══ S1: YOUR CUSTOMERS TEXTED ═══ */}
        <Section index={1}>
          <div>
            <ThinRule marginBottom={80} />
            <ReceiptLine>YOUR CUSTOMERS TEXTED</ReceiptLine>
            <ReceiptLine>YOU AT 2AM</ReceiptLine>
            <StarBreak marginTop={60} marginBottom={60} />
            <ReceiptLine>YOU WERE SLEEPING</ReceiptLine>
            <div
              style={{
                marginTop: 70,
                transform: `scale(${emphasisScale(1)})`,
              }}
            >
              <ReceiptLine size={80} bold>
                WE ANSWERED
              </ReceiptLine>
            </div>
            <ReceiptTotal value="PRICELESS" />
          </div>
        </Section>

        {/* ═══ S2: THEY ASKED ═══ */}
        <Section index={2}>
          <div>
            <ThinRule marginBottom={80} />
            <ReceiptLine>THEY ASKED YOUR HOURS</ReceiptLine>
            <ReceiptLine>YOUR PRICES</ReceiptLine>
            <ReceiptLine>YOUR MENU</ReceiptLine>
            <ReceiptLine>IF YOU'RE OPEN TOMORROW</ReceiptLine>
            <StarBreak marginTop={50} marginBottom={40} />
            <div
              style={{
                transform: `scale(${emphasisScale(2)})`,
              }}
            >
              <ReceiptLine size={80} bold>
                WE HANDLED IT
              </ReceiptLine>
            </div>
            <ReceiptTotal value="INVALUABLE" />
          </div>
        </Section>

        {/* ═══ S3: STOP LOSING ═══ */}
        <Section index={3}>
          <div>
            <ThinRule marginBottom={80} />
            <ReceiptLine size={62} bold>
              STOP LOSING CUSTOMERS
            </ReceiptLine>
            <ReceiptLine size={62} bold>
              TO YOUR VOICEMAIL
            </ReceiptLine>
            <ReceiptLine size={62} bold>
              OR DMS
            </ReceiptLine>
            <ReceiptTotal value="PREVENTABLE" />
          </div>
        </Section>

        {/* ═══ S4: BOOKINGS ═══ */}
        <Section index={4}>
          <div>
            <ThinRule marginBottom={60} />
            <ReceiptItem left="BOOKINGS?" right="DONE" />
            <ReceiptItem left="ORDERS?" right="TAKEN" />
            <ReceiptItem left="QUESTIONS?" right="ANSWERED" />
            <ThinRule marginTop={50} marginBottom={60} />
            <ReceiptLine>WHILE YOU WERE</ReceiptLine>
            <ReceiptLine>ACTUALLY RUNNING</ReceiptLine>
            <ReceiptLine>YOUR BUSINESS</ReceiptLine>
            <ReceiptTotal value="AUTOMATIC" />
          </div>
        </Section>

        {/* ═══ S5: ONE LINK ═══ */}
        <Section index={5}>
          <div>
            <ThinRule marginBottom={80} />
            <ReceiptLine>NO WEBSITE TO BUILD</ReceiptLine>
            <ReceiptLine>NO EMPLOYEE TO PAY</ReceiptLine>
            <StarBreak marginTop={60} marginBottom={50} />
            <ReceiptLine size={72} bold>
              ONE LINK
            </ReceiptLine>
            <ReceiptLine size={72} bold>DOES IT ALL</ReceiptLine>
            <ReceiptTotal value="EFFORTLESS" />
          </div>
        </Section>

        {/* ═══ S6: PRICE + FOOTER ═══ */}
        <Section index={6}>
          <div>
            <DoubleBorder />
            <div
              style={{
                marginTop: 50,
                transform: `scale(${emphasisScale(6)})`,
              }}
            >
              <ReceiptLine size={130} bold>
                $25/MO
              </ReceiptLine>
            </div>
            <DoubleBorder />

            <StarBreak marginTop={60} marginBottom={40} />

            <ReceiptLine size={48} bold spacing={8}>
              SMARTASSISTANT
            </ReceiptLine>
            <ReceiptLine size={30} faded spacing={3} marginTop={15}>
              YOUR BUSINESS, SMARTER
            </ReceiptLine>
            <ThinRule marginTop={50} />
          </div>
        </Section>

        {/* ═══ DASHED SEPARATORS (between sections) ═══ */}
        {SCROLL_STARTS.map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: PAPER_PAD + (i + 1) * SECTION_HEIGHT - 30,
              left: CONTENT_PAD,
              right: CONTENT_PAD,
            }}
          >
            <DashedSep />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
