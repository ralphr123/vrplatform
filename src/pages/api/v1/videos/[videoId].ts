import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { User, Video } from "@prisma/client";
import { ApiReturnType } from "@app/lib/types/api";

const querySchema = z.object({
  videoId: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        const { videoId } = querySchema.parse(req.query);
        const result = await getVideo({ videoId });
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

export type GetVideoResp = {
  video:
    | Video & {
        user: User;
      };
};

const getVideo = async ({
  videoId,
}: {
  videoId: string;
}): Promise<ApiReturnType<GetVideoResp>> => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { user: true },
    });

    if (!video) {
      throw Error(`Video not found for id ${videoId}`);
    }

    return {
      success: true,
      data: {
        video,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to fetch video: ${error}`,
    };
  }
};

export { handler as default };
