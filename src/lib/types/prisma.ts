import { VideoType } from "@prisma/client";
import { IconType } from "react-icons";
import { BsCameraVideo } from "react-icons/bs";
import { Tb360View } from "react-icons/tb";

export const videoTypes = ["Regular", "VR"] as const;

export const videoTypeToIcon: { [key in VideoType]: IconType } = {
  Regular: BsCameraVideo,
  VR: Tb360View,
};
