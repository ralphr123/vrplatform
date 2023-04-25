import { fetchJson } from "../fetchJson";
import { route } from "nextjs-routes";

export const postVideoBookmark = async (videoId: string) => {
  await fetchJson<{}>({
    method: "POST",
    url: route({
      pathname: "/api/v1/bookmarks/[videoId]",
      query: { videoId },
    }),
  });
};

export const deleteVideoBookmark = async (videoId: string) => {
  await fetchJson<{}>({
    method: "DELETE",
    url: route({
      pathname: "/api/v1/bookmarks/[videoId]",
      query: { videoId },
    }),
  });
};
