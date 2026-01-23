import { Composition, Folder } from "remotion";
import { SmartPageFoodTruckVideo } from "./SmartPageFoodTruckVideo";
import { NitosInstagramPromo } from "./NitosInstagramPromo";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="SmartPage">
        <Composition
          id="SmartPageFoodTruck"
          component={SmartPageFoodTruckVideo}
          durationInFrames={946} // ~31.5 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="Nitos">
        <Composition
          id="NitosInstagramPromo"
          component={NitosInstagramPromo}
          durationInFrames={630} // 21 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
