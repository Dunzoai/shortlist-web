import {
  AbsoluteFill,
  Freeze,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Drizzle = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Stop-motion effect: update every 30 frames (1 fps - stark cartoon look)
  const frameStep = 30;
  const frozenFrame = Math.floor(frame / frameStep) * frameStep;

  // Scale in effect - zooms 70% closer by end (1.5x to 2.55x)
  const scale = interpolate(frame, [0, durationInFrames], [1.5, 2.55], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Freeze frame={frozenFrame}>
        <OffthreadVideo
          src={staticFile("Remotion/drizzle.mov")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 0%",
            transform: `scale(${scale}) translateY(-35%)`,
          }}
        />
      </Freeze>
    </AbsoluteFill>
  );
};
