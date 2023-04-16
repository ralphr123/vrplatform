import { ApiReturnType } from "@app/lib/types/api";
import { GetVideosResp } from "@app/pages/api/v1/videos";
import { GetVideoResp } from "@app/pages/api/v1/videos/[videoId]";
import { useEffect } from "react";
import useSWR from "swr";
import { showToast } from "../../showToast";

export const useVideo = (videoId?: string) => {
  const {
    data,
    error: fetchError,
    isLoading,
  } = useSWR<ApiReturnType<GetVideoResp>>(
    videoId ? `/api/v1/videos/${videoId}` : null,
    async (url: string) => await (await fetch(url)).json()
  );

  const error = fetchError || (!data?.success ? data?.error : undefined);

  useEffect(() => {
    if (error) {
      console.error(error);
      showToast({
        status: "error",
        description: "Failed to fetch video.",
      });
    }
  }, [error]);

  return {
    data: data?.success ? data.data : undefined,
    error,
    isLoading,
  };
};
