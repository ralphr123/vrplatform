import { ApiReturnType } from "@app/lib/types/api";
import { GetUserResp } from "@app/pages/api/v1/users/[userId]";
import { useEffect } from "react";
import useSWR from "swr";
import { showToast } from "../../showToast";

export const useUser = (userId?: string) => {
  const {
    data,
    error: fetchError,
    isLoading,
  } = useSWR<ApiReturnType<GetUserResp>>(
    userId ? `/api/v1/users/${userId}` : null,
    async (url: string) => await (await fetch(url)).json()
  );

  const error = fetchError || (!data?.success ? data?.error : undefined);

  useEffect(() => {
    if (error) {
      console.error(error);
      showToast({
        status: "error",
        description: "Failed to fetch user.",
      });
    }
  }, [error]);

  return {
    data: data?.success ? data.data : undefined,
    error,
    isLoading,
  };
};
