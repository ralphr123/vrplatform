import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { ApiReturnType } from "@app/lib/types/api";
import { deleteAzureMediaServicesAsset } from "@app/lib/azure/delete";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";
import { VideoData } from ".";
import { getViews } from "../views/[videoId]";

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
      case "DELETE": {
        const { id: userId } = await authenticateRequest(req);
        const { videoId } = querySchema.parse(req.body);
        const result = await deleteVideo({
          userId,
          videoId,
        });
        return res.status(200).json(result);
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
  video: VideoData;
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

    const viewsResp = await getViews({ videoId });

    if (!viewsResp.success) {
      throw Error(`Failed to get views for video ${videoId}`);
    }

    const videoWithViews = { ...video, views: viewsResp.data.views };

    return {
      success: true,
      data: {
        video: videoWithViews,
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

const deleteVideo = async ({
  userId,
  videoId,
}: {
  userId: string;
  videoId: string;
}): Promise<ApiReturnType<{}>> => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new Error("Video not found.");
    }

    if (video.userId !== userId) {
      throw new Error("Unauthorized.");
    }

    if (!video.mediaServicesAssetName && !video.encodingError) {
      throw new Error("Please wait for the video to finish encoding.");
    }

    // Delete video from Azure Media Services (also deletes blob)
    if (video.mediaServicesAssetName) {
      await deleteAzureMediaServicesAsset(video.mediaServicesAssetName);
    }

    // Delete video from database
    await prisma.video.delete({
      where: { id: videoId },
    });

    return { success: true, data: {} };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to delete video ${videoId}: ${error}`,
    };
  }
};

export { handler as default };
