import sgMail from "@sendgrid/mail";
import { SendGridTemplateData, SendGridTemplateId } from "../types/api";

export const sendEmail = async <T extends SendGridTemplateId>({
  email,
  templateId,
  dynamicTemplateData,
}: {
  email: string;
  templateId: T;
  dynamicTemplateData: SendGridTemplateData<T>;
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "ralph.rouhana@gmail.com",
    templateId,
    dynamicTemplateData: {
      ...dynamicTemplateData,
      Sender_Address: "63 Hillhurst Blvd",
      Sender_City: "Toronto",
      Sender_State: "ON",
      Sender_Zip: "M5N 1N5",
    },
  };

  try {
    const sendResp = await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};
