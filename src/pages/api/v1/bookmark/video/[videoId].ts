import prisma from "../../../../../lib/prismadb";
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
        const user = await authenticateRequest({ req });
        const { videoId } = querySchema.parse(req.query);
        const result = await postVideoBookmark({ videoId, userId: user.id });
        return res.status(result.success ? 200 : 500).json(result);
      }
      case "DELETE": {
        const user = await authenticateRequest({ req });
        const { videoId } = querySchema.parse(req.query);
        const result = await deleteVideoBookmark({ videoId, userId: user.id });
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
      `Something went wrong making a request to /api/v1/bookmark/video/[videoId]: ${error}`
    );
    return res.status(500).json({
      success: false,
      error: `Something went wrong: ${error}`,
    });
  }
};

const postVideoBookmark = async ({
  videoId,
  userId,
}: {
  videoId: string;
  userId: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    await prisma.videoBookmark.upsert({
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

const deleteVideoBookmark = async ({
  videoId,
  userId,
}: {
  videoId: string;
  userId: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    await prisma.videoBookmark.delete({
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
