import { VideoStatus } from "@app/lib/types/api";
import { Video } from "@prisma/client";

export const getVideoStatus = (video: Video): VideoStatus => {
  const { hlsUrl, encodingError, reviewedDate, rejectReason, isPrivate } =
    video;

  if (encodingError) {
    return "Failed";
  }

  if (isPrivate) {
    return "Private";
  }

  if (!hlsUrl) {
    return "Encoding";
  }

  if (!reviewedDate) {
    return "Pending Review";
  }

  if (!!rejectReason) {
    return "Rejected";
  }

  return "Published";
};
