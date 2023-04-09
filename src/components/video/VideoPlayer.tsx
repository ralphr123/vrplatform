import { Flex } from "@chakra-ui/react";
import { PlayerAPI } from "bitmovin-player";
import { UIFactory } from "bitmovin-player-ui";
import { useEffect, useRef, useState } from "react";

enum VRContentType {
  Single = "single",
  TAB = "tab",
  SBS = "sbs",
}

export const VideoPlayer = ({
  name,
  hlsUrl,
}: {
  name: string;
  hlsUrl?: string;
}) => {
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
        title: name,
        hls: hlsUrl,
        // vr: {
        //   startPosition: 180,
        //   contentType: VRContentType.Single,
        // },
      });
      UIFactory.buildDefaultUI(player);
    }
  }, [player, hlsUrl, name]);

  return <Flex ref={videoPlayer} height="100%" minWidth="100%"></Flex>;
};
