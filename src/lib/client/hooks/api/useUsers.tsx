import { ApiReturnType, FailReturnType } from "@app/lib/types/api";
import { GetUsersResp } from "@app/pages/api/v1/users";
import { route } from "nextjs-routes";
import { useEffect } from "react";
import useSWR from "swr";
import { showToast } from "../../showToast";

export const useUsers = (
  {
    page,
    limit,
    searchText,
    registeredAfterDate,
    verified,
  }: {
    page?: number;
    limit?: number;
    searchText?: string;
    registeredAfterDate?: Date;
    verified?: boolean;
  } = {},
  doFetch = true
) => {
  const {
    data,
    error: fetchError,
    isLoading,
  } = useSWR<ApiReturnType<GetUsersResp>>(
    doFetch
      ? route({
          pathname: "/api/v1/users",
          query: {
            ...(verified && { verified: String(verified) }),
            ...(page && { page: page.toString() }),
            ...(limit && { limit: limit.toString() }),
            ...(searchText && { searchText }),
            ...(registeredAfterDate && {
              registeredAfterDate: registeredAfterDate.toISOString(),
            }),
          },
        })
      : null,
    async (url: string) => await (await fetch(url)).json()
  );

  const error = fetchError || (!data?.success ? data?.error : undefined);

  useEffect(() => {
    if (error) {
      console.error(error);
      showToast({
        status: "error",
        description: "There was an error loading users.",
      });
    }
  }, [error]);

  return {
    data: data?.success ? data.data : undefined,
    isLoading,
  };
};
