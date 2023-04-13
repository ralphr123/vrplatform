import { ApiReturnType } from "@app/lib/types/api";
import { GetUsersResp } from "@app/pages/api/v1/users";
import { GetVideosResp } from "@app/pages/api/v1/videos";
import { VideoType } from "@prisma/client";
import { route } from "nextjs-routes";
import { useEffect } from "react";
import useSWR from "swr";
import { showToast } from "../../showToast";

export const useVerify = ({
  token,
}: {
  token?: string;
} = {}) => {
  const { data, error, isLoading } = useSWR<ApiReturnType<{}>>(
    route({
      pathname: "/api/v1/auth/verify-email",
      query: {
        ...(token && { token }),
      },
    }),
    async (url: string) => await (await fetch(url)).json()
  );

  useEffect(() => {
    if (error || (!data?.success && data?.error)) {
      console.error(error || (!data?.success ? data?.error : undefined));
    }
  }, [error, isLoading, data]);

  return {
    data: data?.success ? data.data : undefined,
    isLoading,
  };
};
