import { AbsoluteFill, Video, staticFile } from "remotion";

const PhoneMockup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Video is 886x1920 (phone screen ratio ~0.46)
  const screenWidth = 340;
  const screenHeight = 736; // 340 / (886/1920) = 736
  const bezelWidth = 10;
  const bezelTop = 12;
  const bezelBottom = 12;
  const borderRadius = 45;
  const notchWidth = 90;
  const notchHeight = 24;

  const phoneWidth = screenWidth + bezelWidth * 2;
  const phoneHeight = screenHeight + bezelTop + bezelBottom;

  return (
    <div
      style={{
        position: "relative",
        width: phoneWidth,
        height: phoneHeight,
      }}
    >
      {/* Phone outer frame */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#1a1a1a",
          borderRadius,
          boxShadow: "0 30px 100px rgba(0,0,0,0.7), 0 15px 40px rgba(0,0,0,0.5)",
          border: "3px solid #2a2a2a",
        }}
      />

      {/* Screen area */}
      <div
        style={{
          position: "absolute",
          top: bezelTop,
          left: bezelWidth,
          width: screenWidth,
          height: screenHeight,
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {children}
      </div>

      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: bezelTop + 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: notchWidth,
          height: notchHeight,
          backgroundColor: "#000",
          borderRadius: 20,
          zIndex: 10,
        }}
      />

      {/* Side button (power) */}
      <div
        style={{
          position: "absolute",
          right: -4,
          top: 120,
          width: 5,
          height: 70,
          backgroundColor: "#2a2a2a",
          borderTopRightRadius: 3,
          borderBottomRightRadius: 3,
        }}
      />

      {/* Volume buttons */}
      <div
        style={{
          position: "absolute",
          left: -4,
          top: 100,
          width: 5,
          height: 30,
          backgroundColor: "#2a2a2a",
          borderTopLeftRadius: 3,
          borderBottomLeftRadius: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -4,
          top: 140,
          width: 5,
          height: 55,
          backgroundColor: "#2a2a2a",
          borderTopLeftRadius: 3,
          borderBottomLeftRadius: 3,
        }}
      />
    </div>
  );
};

export const ShortlistTest = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PhoneMockup>
        <Video
          src={staticFile("nitos-gallery/nitos-order-video-1.mov")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />
      </PhoneMockup>
    </AbsoluteFill>
  );
};
