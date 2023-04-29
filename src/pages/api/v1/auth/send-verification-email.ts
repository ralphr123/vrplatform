import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { ApiReturnType } from "@app/lib/types/api";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";
import { User } from "@prisma/client";
import { route } from "nextjs-routes";
import { sendEmail } from "@app/lib/server/sendEmail";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST": {
        const user = await authenticateRequest({ req });
        const result = await sendVerificationEmail({ user });
        return res.status(200).json(result);
      }
      default:
        return res
          .status(405)
          .json({ success: false, error: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/auth/verify-email: ${error}`
    );
    return res
      .status(500)
      .json({ success: false, error: `Something went wrong: ${error}` });
  }
};

const sendVerificationEmail = async ({
  user: { id, email },
}: {
  user: User;
}): Promise<ApiReturnType<{}>> => {
  try {
    const token = Math.random().toString(36).substring(2, 15);

    await sendEmail({
      email,
      templateName: "verify-email",
      dynamicTemplateData: {
        Redirect_Url: route({
          pathname: "/auth/verify/[token]",
          query: { token },
        }),
      },
    });

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        emailVerificationToken: token,
      },
    });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to verify email: ${error}`,
    };
  }
};

export { handler as default };
