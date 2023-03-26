import { ApiReturnType } from "@app/lib/types/api";
import { GetVideosResp } from "@app/pages/api/v1/videos";
import useSWR from "swr";

export const useVideos = (pendingReview: boolean = false) => {
  const { data, error, isLoading } = useSWR<ApiReturnType<GetVideosResp>>(
    `/api/v1/videos?pendingReview=${pendingReview}`,
    async (url: string) => await (await fetch(url)).json()
  );

  return {
    data: data?.success ? data.data : undefined,
    error: error || (!data?.success ? data?.error : undefined),
    isLoading,
  };
};
