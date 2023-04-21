import { Pathname } from "../types/api";

export type Portal = "admin" | "auth" | "account" | undefined;

export const getPortal = (pathname: Pathname) =>
  pathname.split("/")[1] as Portal;
