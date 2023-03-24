import { ApiReturnType, SuccessReturnType } from "../types/api";

export const isSuccessfulApiResponse = <T>(
  resp: ApiReturnType<T>
): resp is SuccessReturnType<T> => {
  return resp.success === true;
};
