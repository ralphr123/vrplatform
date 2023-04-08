import { HttpMethods } from "@azure/core-http";
import { ApiReturnType, Pathname } from "../types/api";

export const fetchJson = async <ReturnType, BodyType = undefined>({
  method = "GET",
  url,
  body,
}: {
  method?: HttpMethods;
  url: Pathname;
  body?: BodyType;
}) => {
  return (await (
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  ).json()) as ApiReturnType<ReturnType>;
};
