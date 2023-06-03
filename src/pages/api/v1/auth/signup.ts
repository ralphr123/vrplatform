import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { ApiReturnType } from "@app/lib/types/api";
import { z } from "zod";

const postBodySchema = z.object({
  email: z.string(),
  name: z.string(),
});

export type SignUpBody = z.TypeOf<typeof postBodySchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST": {
        const { email, name } = postBodySchema.parse(req.body);
        const result = await sendVerificationEmail({ email, name });
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
  name,
  email,
}: {
  name: string;
  email: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        success: true,
        data: {},
      };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        type: "email",
        provider: "email",
        providerAccountId: email,
      },
    });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to create user and account: ${error}`,
    };
  }
};

export { handler as default };
