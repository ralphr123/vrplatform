import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { Video } from "@prisma/client";
import { ApiReturnType } from "@app/lib/types/api";

const querySchema = z.object({
  videoId: z.string(),
});

export type GetVideoResp = {
  video: Video | null;
};

const getVideo = async ({
  videoId,
}: {
  videoId: string;
}): Promise<ApiReturnType<GetVideoResp>> => {
  try {
    const video = await prisma.video.findUnique({ where: { id: videoId } });

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
      error: `Failed to fetch videos: ${error}`,
    };
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        const { videoId } = querySchema.parse(req.query);
        const result = await getVideo({ videoId });
        return res.status(result.success ? 200 : 500).json(result);
      }
      default:
        return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/videos: ${error}`
    );
    return res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};

export { handler as default };
