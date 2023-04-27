import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import {
  ApiReturnType,
  VideoData,
  VideoStatus,
  videoStatuses,
} from "@app/lib/types/api";
import { deleteAzureMediaServicesAsset } from "@app/lib/azure/delete";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";
import { Prisma, Video } from "@prisma/client";
import { sendEmail } from "@app/lib/server/sendEmail";
import { getSession } from "next-auth/react";

const querySchema = z.object({
  videoId: z.string(),
});

const putBodySchema = z.object({
  data: z.record(z.any()),
  status: z.enum(videoStatuses).optional(),
  rejectReason: z.string().optional(),
});

export type UpdateVideoBody = {
  data: Prisma.VideoUpdateInput;
  status?: VideoStatus;
  rejectReason?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { videoId } = querySchema.parse(req.query);
    switch (req.method) {
      case "GET": {
        const session = await getSession({ req });
        const result = await getVideo({ videoId, userId: session?.user?.id });
        return res.status(result.success ? 200 : 500).json(result);
      }
      case "PUT": {
        const { data, status } = putBodySchema.parse(req.body);
        const result = await updateVideo({ videoId, data, status });
        return res.status(result.success ? 200 : 500).json(result);
      }
      case "DELETE": {
        const { id: userId } = await authenticateRequest({ req });
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
  userId,
}: {
  videoId: string;
  userId?: string;
}): Promise<ApiReturnType<GetVideoResp>> => {
  try {
    const video: VideoData | null = await prisma.video.findUnique({
      where: { id: videoId },
      include: { user: true, views: true, likes: true },
    });

    if (!video) {
      throw Error(`Video not found for id ${videoId}`);
    }

    video.isLikedByUser = userId
      ? video.likes.some((like) => like.userId === userId)
      : undefined;

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

export type UpdateVideoResp = {
  video: Video;
};

const updateVideo = async ({
  videoId,
  data,
  status,
  rejectReason,
}: {
  videoId: string;
  data: Prisma.VideoUpdateInput;
  status?: VideoStatus;
  rejectReason?: string;
}): Promise<ApiReturnType<UpdateVideoResp>> => {
  try {
    const dataWithStatus: Prisma.VideoUpdateInput = { ...data };

    switch (status) {
      case "Published":
        dataWithStatus.rejectReason = null;
        dataWithStatus.reviewedDate = new Date();
        break;
      case "Rejected":
        dataWithStatus.rejectReason =
          rejectReason || "Breaks community guidelines.";
        dataWithStatus.reviewedDate = new Date();
        break;
      case "Pending Review":
        dataWithStatus.rejectReason = null;
        dataWithStatus.reviewedDate = null;
        break;
    }

    const video = await prisma.video.update({
      where: { id: videoId },
      data: dataWithStatus,
      include: { user: true },
    });

    if (!video) {
      throw Error(`Video not found for id ${videoId}`);
    }

    switch (status) {
      case "Published":
        sendEmail({
          email: video.user.email,
          templateName: "video-approved",
          dynamicTemplateData: {
            Video_Name: video.name,
            Upload_Date: new Date(video.createdDate).toDateString(),
            Redirect_Url: "/account/videos",
          },
        });
        break;
      case "Rejected":
        sendEmail({
          email: video.user.email,
          templateName: "video-rejected",
          dynamicTemplateData: {
            Video_Name: video.name,
            Upload_Date: new Date(video.createdDate).toDateString(),
            Redirect_Url: "/account/videos",
            Reject_Reason: "",
          },
        });
        break;
    }

    return {
      success: true,
      data: { video },
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
