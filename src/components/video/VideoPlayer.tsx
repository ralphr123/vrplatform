import { Flex, FlexProps } from "@chakra-ui/react";
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
  ...props
}: {
  name: string;
  hlsUrl?: string;
} & FlexProps) => {
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
        // hls: hlsUrl,
        hls: "https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8",
        vr: {
          startPosition: 180,
          contentType: VRContentType.Single,
        },
      });
      UIFactory.buildDefaultUI(player);
    }
  }, [player, hlsUrl, name]);

  return (
    <Flex
      ref={videoPlayer}
      height="100%"
      minWidth="100%"
      rounded="5px"
      overflow="hidden"
      {...props}
    ></Flex>
  );
};
