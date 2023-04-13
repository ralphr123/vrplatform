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

const sendGridEmailTypes = ["verify-email"] as const;

export type SendGridTemplateId = (typeof sendGridEmailTypes)[number];

export type SendGridTemplateData<T extends SendGridTemplateId> = {
  "verify-email": {
    Verify_Url: string;
  };
}[T];
