import { ApiReturnType } from "@app/lib/types/api";
import { GetVideosResp } from "@app/pages/api/v1/videos";
import { GetVideoResp } from "@app/pages/api/v1/videos/[videoId]";
import useSWR from "swr";

export const useVideo = (videoId?: string) => {
  const { data, error, isLoading } = useSWR<ApiReturnType<GetVideoResp>>(
    videoId ? `/api/v1/videos/${videoId}` : null,
    async (url: string) => await (await fetch(url)).json()
  );

  return {
    data: data?.success ? data.data : undefined,
    error: error || (!data?.success ? data?.error : undefined),
    isLoading,
  };
};
