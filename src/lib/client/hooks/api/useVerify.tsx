import { ApiReturnType } from "@app/lib/types/api";
import { VerifyEmailBody } from "@app/pages/api/v1/auth/verify-email";
import { route } from "nextjs-routes";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchJson } from "../../fetchJson";

export const useVerify = ({
  token,
}: {
  token?: string;
} = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{}>();

  useEffect(() => {
    if (token) {
      (async () => {
        setIsLoading(true);
        try {
          const resp = await fetchJson<{}, VerifyEmailBody>({
            method: "POST",
            url: "/api/v1/auth/verify-email",
            body: {
              token,
            },
          });

          setData(resp);
        } catch (error) {
          console.error("Error verifying email", error);
        }
        setIsLoading(false);
      })();
    }
  }, [token]);

  return {
    data,
    isLoading,
  };
};
