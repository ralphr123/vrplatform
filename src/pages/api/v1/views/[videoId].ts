import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { ApiReturnType } from "@app/lib/types/api";
import { getSession } from "next-auth/react";

const querySchema = z.object({
  videoId: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "POST": {
        const session = await getSession({ req });
        const { videoId } = querySchema.parse(req.query);
        const result = await postView({ videoId, userId: session?.user?.id });
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
      `Something went wrong making a request to /api/v1/video/[videoId]: ${error}`
    );
    return res.status(500).json({
      success: false,
      error: `Something went wrong: ${error}`,
    });
  }
};

export const postView = async ({
  videoId,
  userId,
}: {
  videoId: string;
  userId?: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    if (userId) {
      await prisma.videoView.upsert({
        where: { videoId_userId: { videoId, userId } },
        update: {},
        create: { videoId, userId },
      });
    } else {
      await prisma.videoView.create({
        data: {
          videoId,
        },
      });
    }

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
