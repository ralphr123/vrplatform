import { fetchJson } from "../fetchJson";
import { route } from "nextjs-routes";
import { VideoData } from "@app/lib/types/api";

export const postVideoLike = async (videoId: string) => {
  await fetchJson<{}>({
    method: "POST",
    url: route({
      pathname: "/api/v1/likes/[videoId]",
      query: { videoId },
    }),
  });
};

export const deleteVideoLike = async (videoId: string) => {
  await fetchJson<{}>({
    method: "DELETE",
    url: route({
      pathname: "/api/v1/likes/[videoId]",
      query: { videoId },
    }),
  });
};

export const postVideoView = async (videoId: string) => {
  await fetchJson<{}>({
    method: "POST",
    url: route({
      pathname: "/api/v1/views/[videoId]",
      query: { videoId },
    }),
  });
};

export const getVideosStats = (
  videos: VideoData[]
): { views: number; likes: number } => {
  let views = 0;
  let likes = 0;

  for (const video of videos) {
    views += video.views;
    likes += video.likes;
  }

  return { views, likes };
};
