import { ApiReturnType, VideoStatus } from "@app/lib/types/api";
import { GetVideosResp } from "@app/pages/api/v1/videos";
import { VideoType } from "@prisma/client";
import { route } from "nextjs-routes";
import { useEffect } from "react";
import useSWR from "swr";
import { showToast } from "../../showToast";

export const useVideos = (
  {
    page,
    limit,
    searchText,
    type,
    status,
    createdAfterDate,
    userId,
    onlyBookmarked,
  }: {
    page?: number;
    limit?: number;
    searchText?: string;
    type?: VideoType;
    status?: VideoStatus;
    createdAfterDate?: Date;
    userId?: string;
    onlyBookmarked?: boolean;
  } = {},
  doFetch = true
) => {
  const {
    data,
    error: fetchError,
    isLoading,
  } = useSWR<ApiReturnType<GetVideosResp>>(
    doFetch
      ? route({
          pathname: "/api/v1/videos",
          query: {
            ...(page && { page: page.toString() }),
            ...(limit && { limit: limit.toString() }),
            ...(searchText && { searchText }),
            ...(type && { type }),
            ...(createdAfterDate && {
              createdAfterDate: createdAfterDate.toISOString(),
            }),
            ...(userId && { userId }),
            ...(status && { status }),
            ...(onlyBookmarked && { onlyBookmarked: "true" }),
          },
        })
      : false,
    async (url: string) => await (await fetch(url)).json()
  );

  const error = fetchError || (!data?.success ? data?.error : undefined);

  useEffect(() => {
    if (error) {
      console.error(error);
      showToast({
        status: "error",
        contactSupport: true,
        description: "There was an error loading videos.",
      });
    }
  }, [error]);

  return {
    data: data?.success ? data.data : undefined,
    isLoading,
  };
};
