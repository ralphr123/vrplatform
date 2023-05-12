import { postVideoView } from "@app/lib/client/api/videoData";
import { getLocalStorage, setLocalStorage } from "@app/lib/client/storage";
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

      // If viewed video is not in local storage, post a view
      // This will not necessarily update the view count for authenticated viewers
      if (!viewedVideos?.[id]) {
        // Add view to video in DB if not exists
        await postVideoView(id);

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
            // This is fine to expose, only authorized domains can use the license
            key: "406b8edb-10ba-447d-90f7-df4b5989cd0e",
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
