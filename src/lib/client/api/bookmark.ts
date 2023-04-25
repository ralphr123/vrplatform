import { fetchJson } from "../fetchJson";
import { route } from "nextjs-routes";

export const postVideoBookmark = async (videoId: string) => {
  await fetchJson<{}>({
    method: "POST",
    url: route({
      pathname: "/api/v1/bookmark/video/[videoId]",
      query: { videoId },
    }),
  });
};

export const deleteVideoBookmark = async (videoId: string) => {
  await fetchJson<{}>({
    method: "DELETE",
    url: route({
      pathname: "/api/v1/bookmark/video/[videoId]",
      query: { videoId },
    }),
  });
};

export const postUserBookmark = async (userId: string) => {
  await fetchJson<{}>({
    method: "POST",
    url: route({
      pathname: "/api/v1/bookmark/user/[userId]",
      query: { userId },
    }),
  });
};

export const deleteUserBookmark = async (userId: string) => {
  await fetchJson<{}>({
    method: "DELETE",
    url: route({
      pathname: "/api/v1/bookmark/user/[userId]",
      query: { userId },
    }),
  });
};
