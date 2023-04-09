import { ApiReturnType } from "@app/lib/types/api";
import { GetVideosResp } from "@app/pages/api/v1/videos";
import { VideoType } from "@prisma/client";
import { route } from "nextjs-routes";
import { useEffect } from "react";
import useSWR from "swr";
import { showToast } from "../../showToast";

export const useVideos = ({
  pendingReview = false,
  searchText,
  type,
  uploadedAfterDate,
  userId,
}: {
  pendingReview?: boolean;
  searchText?: string;
  type?: VideoType;
  uploadedAfterDate?: Date;
  userId?: string;
} = {}) => {
  const { data, error, isLoading } = useSWR<ApiReturnType<GetVideosResp>>(
    route({
      pathname: "/api/v1/videos",
      query: {
        pendingReview: pendingReview ? "true" : "false",
        ...(searchText && { searchText }),
        ...(type && { type }),
        ...(uploadedAfterDate && {
          uploadedAfterDate: uploadedAfterDate.toISOString(),
        }),
        ...(userId && { userId }),
      },
    }),
    async (url: string) => await (await fetch(url)).json()
  );

  useEffect(() => {
    if (error || (!data?.success && data?.error)) {
      console.error(error || (!data?.success ? data?.error : undefined));
      showToast({
        status: "error",
        description:
          "There was an error loading videos. If this persists, contact support.",
      });
    }
  }, [error, isLoading, data]);

  return {
    data: data?.success ? data.data : undefined,
    isLoading,
  };
};
