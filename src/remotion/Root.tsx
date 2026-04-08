import { Composition, Folder } from "remotion";
import { SmartPageFoodTruckVideo } from "./SmartPageFoodTruckVideo";
import { NitosInstagramPromo } from "./NitosInstagramPromo";
import { NitosSuperBowl } from "./NitosSuperBowl";
import { NitosSuperBowlTeaser } from "./NitosSuperBowlTeaser";
import { NitosHypnoTeaser } from "./NitosHypnoTeaser";
import { NitosHiring } from "./NitosHiring";
import { NitosVday } from "./NitosVday";
import { PalmettoTapsJoke } from "./PalmettoTapsJoke";
import { SmartAssistantReceipt } from "./SmartAssistantReceipt";
import { FoodTruckPromo } from "./FoodTruckPromo";

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
        <Composition
          id="NitosHiring"
          component={NitosHiring}
          durationInFrames={450} // 15 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="NitosVday"
          component={NitosVday}
          durationInFrames={360} // 12 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="NitosSuperBowl">
        <Composition
          id="NitosSuperBowl"
          component={NitosSuperBowl}
          durationInFrames={690} // ~23 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="NitosSuperBowlTeaser"
          component={NitosSuperBowlTeaser}
          durationInFrames={330} // 11 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="NitosHypnoTeaser"
          component={NitosHypnoTeaser}
          durationInFrames={240} // 8 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="PalmettoTaps">
        <Composition
          id="PalmettoTapsJoke"
          component={PalmettoTapsJoke}
          durationInFrames={240} // 8 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="SmartAssistant">
        <Composition
          id="SmartAssistantReceipt"
          component={SmartAssistantReceipt}
          durationInFrames={600} // 20 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="FoodTruckPromo"
          component={FoodTruckPromo}
          durationInFrames={800} // ~27 seconds at 30fps
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
