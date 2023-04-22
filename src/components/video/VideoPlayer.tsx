import { fetchJson } from "@app/lib/client/fetchJson";
import { getLocalStorage, setLocalStorage } from "@app/lib/client/storage";
import { Flex, FlexProps } from "@chakra-ui/react";
import { VideoType } from "@prisma/client";
import { PlayerAPI } from "bitmovin-player";
import { UIFactory } from "bitmovin-player-ui";
import { route } from "nextjs-routes";
import { useEffect, useRef, useState } from "react";

enum VRContentType {
  Single = "single",
  TAB = "tab",
  SBS = "sbs",
}

const LOCAL_STORAGE_VIEW_KEY = "viewedVideos";

type Props = {
  id: string;
  name: string;
  type?: VideoType;
  hlsUrl?: string | null;
  dashUrl?: string | null;
  smoothStreamingUrl?: string | null;
  blobUrl?: string | null;
} & FlexProps;

export const VideoPlayer = ({
  id,
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

  // Video views
  useEffect(() => {
    (async () => {
      let viewedVideos = getLocalStorage<Record<string, boolean>>(
        LOCAL_STORAGE_VIEW_KEY
      );

      if (!viewedVideos?.[id]) {
        // Add view to video in DB if not exists
        await fetchJson<{}>({
          method: "POST",
          url: route({
            pathname: "/api/v1/views/[videoId]",
            query: { videoId: id },
          }),
        });

        // Update local storage
        setLocalStorage(LOCAL_STORAGE_VIEW_KEY, {
          ...viewedVideos,
          [id]: true,
        });
      }
    })();
  }, [id]);

  // Import video player
  // Bitmovin does not have a native React SDK
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

  // Initialize video player
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
