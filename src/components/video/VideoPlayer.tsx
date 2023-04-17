import { Flex, FlexProps } from "@chakra-ui/react";
import { VideoType } from "@prisma/client";
import { PlayerAPI } from "bitmovin-player";
import { UIFactory } from "bitmovin-player-ui";
import { useEffect, useRef, useState } from "react";

enum VRContentType {
  Single = "single",
  TAB = "tab",
  SBS = "sbs",
}

type Props = {
  name: string;
  type?: VideoType;
  hlsUrl?: string | null;
  dashUrl?: string | null;
  smoothStreamingUrl?: string | null;
  blobUrl?: string | null;
} & FlexProps;

export const VideoPlayer = ({
  name,
  type = "Regular",
  hlsUrl,
  dashUrl,
  smoothStreamingUrl,
  blobUrl,
  ...props
}: Props) => {
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

  // Test streaming url: https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8"
  useEffect(() => {
    if (player) {
      player.load({
        title: name,
        hls: hlsUrl || undefined,
        smooth: smoothStreamingUrl || undefined,
        dash: dashUrl || undefined,
        // Fallback to blob url
        progressive: blobUrl || undefined,
        // Player needs extra config to play VR videos
        ...(type === "VR" && {
          vr: {
            startPosition: 180,
            contentType: VRContentType.Single,
          },
        }),
      });
      UIFactory.buildDefaultUI(player);
    }
  }, [player, hlsUrl, blobUrl, dashUrl, smoothStreamingUrl, type, name]);

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
