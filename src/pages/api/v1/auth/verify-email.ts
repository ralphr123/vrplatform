import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { ApiReturnType } from "@app/lib/types/api";

const postBodySchema = z.object({
  token: z.string(),
});

export type VerifyEmailBody = z.TypeOf<typeof postBodySchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST": {
        const { token } = postBodySchema.parse(req.body);
        const result = await verifyEmail({ token });
        return res.status(200).json(result);
      }
      default:
        return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/auth/verify-email: ${error}`
    );
    return res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};

const verifyEmail = async ({
  token,
}: {
  token: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
      },
    });

    if (!user) {
      throw Error("Invalid verification token.");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: `Failed to verify email: ${error}`,
    };
  }

  return {
    success: true,
    data: {},
  };
};

export { handler as default };
