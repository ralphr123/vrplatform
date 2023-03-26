import { Flex } from "@chakra-ui/react";
import { PlayerAPI } from "bitmovin-player";
import { UIFactory } from "bitmovin-player-ui";
import { useEffect, useRef, useState } from "react";

enum VRContentType {
  Single = "single",
  TAB = "tab",
  SBS = "sbs",
}

export const VideoPlayer = () => {
  const videoPlayer = useRef<HTMLDivElement>(null);

  const [player, setPlayer] = useState<PlayerAPI>();

  useEffect(() => {
    (async () => {
      if (videoPlayer.current) {
        const { Player } = await import("bitmovin-player");
        setPlayer(
          new Player(videoPlayer.current, {
            key: process.env.BITMOVIN_SECRET!,
            playback: { autoplay: true },
          })
        );
      }
    })();
  }, [videoPlayer]);

  useEffect(() => {
    if (player) {
      player.load({
        title: "Test",
        hls: "https://vrplatform-usea.streaming.media.azure.net/651b0da5-6d1e-4ab6-a26b-ed15df234bcb/ForBiggerBlazes.ism/manifest(format=m3u8-cmaf)",
        // progressive:
        //   "https://cdn.bitmovin.com/content/assets/playhouse-vr/progressive.mp4",
        // vr: {
        //   startPosition: 180,
        //   contentType: VRContentType.Single,
        // },
      });
      UIFactory.buildDefaultUI(player);
    }
  }, [player]);

  return <Flex ref={videoPlayer} height="100%" minWidth="100%"></Flex>;
};
