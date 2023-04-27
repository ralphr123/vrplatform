import prisma from "../../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { ApiReturnType } from "@app/lib/types/api";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";

const querySchema = z.object({
  userId: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST": {
        const user = await authenticateRequest({ req });
        const { userId } = querySchema.parse(req.query);
        const result = await postUserBookmark({ userId, adminId: user.id });
        return res.status(result.success ? 200 : 500).json(result);
      }
      case "DELETE": {
        const user = await authenticateRequest({ req });
        const { userId } = querySchema.parse(req.query);
        const result = await deleteUserBookmark({ userId, adminId: user.id });
        return res.status(result.success ? 200 : 500).json(result);
      }
      default:
        return res.status(405).json({
          success: false,
          error: "Method not allowed.",
        });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/bookmark/user/[userId]: ${error}`
    );
    return res.status(500).json({
      success: false,
      error: `Something went wrong: ${error}`,
    });
  }
};

const postUserBookmark = async ({
  userId,
  adminId,
}: {
  userId: string;
  adminId: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    await prisma.userBookmark.upsert({
      where: { adminId_userId: { userId, adminId } },
      update: {},
      create: { userId, adminId },
    });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to post view to video ${userId}: ${error}`,
    };
  }
};

const deleteUserBookmark = async ({
  userId,
  adminId,
}: {
  userId: string;
  adminId: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    await prisma.userBookmark.delete({
      where: { adminId_userId: { userId, adminId } },
    });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to post view to video ${userId}: ${error}`,
    };
  }
};

export { handler as default };
