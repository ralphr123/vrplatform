import { Video } from "@prisma/client";
import { Route } from "nextjs-routes";

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

const sendGridTemplateNames = ["verify-email"] as const;

export type SendGridTemplateName = (typeof sendGridTemplateNames)[number];

export type SendGridTemplateData<T extends SendGridTemplateName> = {
  "verify-email": {
    Verify_Url: Pathname;
  };
}[T];

export const sendGridTemplateNameToId: Record<SendGridTemplateName, string> = {
  "verify-email": process.env.SENDGRID_TEMPLATE_ID_VERIFY_EMAIL,
};

/** ------------------------------------------------ */
/** -------------------- Videos -------------------- */
/** ------------------------------------------------ */

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
    isApproved,
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

  if (!isApproved) {
    return "Rejected";
  }

  if (isPrivate) {
    return "Private";
  }

  return "Published";
};
