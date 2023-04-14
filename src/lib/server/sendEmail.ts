import sgMail from "@sendgrid/mail";
import {
  SendGridTemplateData,
  SendGridTemplateName,
  sendGridTemplateNameToId,
} from "../types/api";

export const sendEmail = async <T extends SendGridTemplateName>({
  email,
  templateName,
  dynamicTemplateData,
}: {
  email: string;
  templateName: T;
  dynamicTemplateData: SendGridTemplateData<T>;
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "ralph.rouhana@gmail.com",
    templateId: sendGridTemplateNameToId[templateName],
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
    console.error(JSON.stringify(error));
  }
};
