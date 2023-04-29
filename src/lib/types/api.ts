import { User, UserRole, Video, VideoLike, VideoView } from "@prisma/client";
import { Route } from "nextjs-routes";

/** ------------------------------------------------ */
/** --------------------- Auth --------------------- */
/** ------------------------------------------------ */

export const rolePriority: Record<UserRole, number> = {
  [UserRole.Member]: 0,
  [UserRole.Admin]: 1,
  [UserRole.SuperAdmin]: Infinity,
};

/** ------------------------------------------------ */
/** ------------------ pages/api ------------------- */
/** ------------------------------------------------ */

export type Pathname = Route["pathname"];

export type FailReturnType = {
  success: false;
  error: string;
};

export type SuccessReturnType<T> = {
  success: true;
  data: T;
};

export type ApiReturnType<T> = SuccessReturnType<T> | FailReturnType;

/** ------------------------------------------------ */
/** ------------------- SendGrid ------------------- */
/** ------------------------------------------------ */

const sendGridTemplateNames = [
  "verify-email",
  "video-approved",
  "video-rejected",
] as const;

export type SendGridTemplateName = (typeof sendGridTemplateNames)[number];

export type SendGridTemplateData<T extends SendGridTemplateName> = {
  "verify-email": {
    Redirect_Url: Pathname;
  };
  "video-approved": {
    Video_Name: string;
    Upload_Date: string;
    Redirect_Url: Pathname;
  };
  "video-rejected": {
    Video_Name: string;
    Upload_Date: string;
    Reject_Reason: string;
    Redirect_Url: Pathname;
  };
}[T];

export const sendGridTemplateNameToId: Record<SendGridTemplateName, string> = {
  "verify-email": process.env.SENDGRID_TEMPLATE_ID_VERIFY_EMAIL,
  "video-approved": process.env.SENDGRID_TEMPLATE_ID_VIDEO_APPROVED,
  "video-rejected": process.env.SENDGRID_TEMPLATE_ID_VIDEO_REJECTED,
};

/** ------------------------------------------------ */
/** -------------------- Videos -------------------- */
/** ------------------------------------------------ */

export type VideoData = Video & {
  user: User;
  views: number;
  likes: number;
  isLikedByUser?: boolean;
  isBookmarkedByUser?: boolean;
};

export type UserData = User & {
  videos: VideoData[];
  isBookmarkedByUser?: boolean;
};

export const videoStatuses = [
  "Private",
  "Pending Review",
  "Rejected",
  "Published",
  "Encoding",
  "Failed",
] as const;

export type VideoStatus = (typeof videoStatuses)[number];

export const getVideoStatus = (video: Video): VideoStatus => {
  const {
    mediaServicesAssetName,
    encodingError,
    reviewedDate,
    rejectReason,
    isPrivate,
  } = video;

  if (encodingError) {
    return "Failed";
  }

  if (!mediaServicesAssetName) {
    return "Encoding";
  }

  if (!reviewedDate) {
    return "Pending Review";
  }

  if (!!rejectReason) {
    return "Rejected";
  }

  if (isPrivate) {
    return "Private";
  }

  return "Published";
};
