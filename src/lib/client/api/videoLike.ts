import { fetchJson } from "../fetchJson";
import { route } from "nextjs-routes";

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
