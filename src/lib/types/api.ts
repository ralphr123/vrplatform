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
