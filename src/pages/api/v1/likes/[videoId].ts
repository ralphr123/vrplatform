import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { ApiReturnType } from "@app/lib/types/api";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";

const querySchema = z.object({
  videoId: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST": {
        const user = await authenticateRequest(req);
        const { videoId } = querySchema.parse(req.query);
        const result = await postLike({ videoId, userId: user.id });
        return res.status(result.success ? 200 : 500).json(result);
      }
      case "DELETE": {
        const user = await authenticateRequest(req);
        const { videoId } = querySchema.parse(req.query);
        const result = await deleteLike({ videoId, userId: user.id });
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
      `Something went wrong making a request to /api/v1/likes/[videoId]: ${error}`
    );
    return res.status(500).json({
      success: false,
      error: `Something went wrong: ${error}`,
    });
  }
};

export const postLike = async ({
  videoId,
  userId,
}: {
  videoId: string;
  userId: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    await prisma.videoLike.upsert({
      where: { videoId_userId: { videoId, userId } },
      update: {},
      create: { videoId, userId },
    });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to post view to video ${videoId}: ${error}`,
    };
  }
};

export const deleteLike = async ({
  videoId,
  userId,
}: {
  videoId: string;
  userId: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    await prisma.videoLike.delete({
      where: { videoId_userId: { videoId, userId } },
    });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to post view to video ${videoId}: ${error}`,
    };
  }
};

export { handler as default };
