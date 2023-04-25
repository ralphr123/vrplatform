import { fetchJson } from "../fetchJson";
import { route } from "nextjs-routes";

export const postVideoView = async (videoId: string) => {
  await fetchJson<{}>({
    method: "POST",
    url: route({
      pathname: "/api/v1/views/[videoId]",
      query: { videoId },
    }),
  });
};
