import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { Prisma, User, Video, VideoType } from "@prisma/client";
import {
  ApiReturnType,
  getVideoStatus,
  VideoStatus,
  videoStatuses,
} from "@app/lib/types/api";
import { encodeVideoOnAzureFromBlob } from "@app/lib/azure/encode";
import { videoTypes } from "@app/lib/types/prisma";
import { basePaginationQuerySchema } from "@app/lib/types/zod";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";
import { deleteAzureMediaServicesAsset } from "@app/lib/azure/delete";

const videoTypeSchema = z.enum(videoTypes);

const getQuerySchema = z.intersection(
  basePaginationQuerySchema,
  z.object({
    searchText: z.string().optional(),
    type: videoTypeSchema.optional(),
    createdAfterDate: z.preprocess((value) => {
      const processed = z
        .string()
        .transform((val) => new Date(val))
        .safeParse(value);
      return processed.success ? processed.data : value;
    }, z.date().optional()),
    userId: z.string().optional(),
    status: z
      .enum([
        ...videoStatuses,
        "Uploading",
        "Encoding",
        "Generating_Streaming_Urls",
      ])
      .optional(),
  })
);

const postBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  blobUrl: z.string(),
  type: videoTypeSchema,
});

const deleteBodySchema = z.object({
  videoId: z.string(),
});

export type EncodeAndSaveVideoBody = z.TypeOf<typeof postBodySchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        const result = await getVideos(getQuerySchema.parse(req.query));
        return res.status(result.success ? 200 : 500).json(result);
      }
      case "POST": {
        const { id: userId } = await authenticateRequest(req);
        const result = await encodeAndSaveVideo({
          userId,
          ...postBodySchema.parse(req.body),
        });
        return res.status(200).json(result);
      }
      case "DELETE": {
        const { id: userId } = await authenticateRequest(req);
        const { videoId } = deleteBodySchema.parse(req.body);
        const result = await deleteVideo({
          userId,
          videoId,
        });
        return res.status(200).json(result);
      }
      default:
        return res
          .status(405)
          .json({ success: false, error: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/videos: ${error}`
    );
    return res
      .status(500)
      .json({ success: false, error: `Something went wrong: ${error}` });
  }
};

export type GetVideosResp = {
  videos: (Video & {
    user: User;
  })[];
  totalVideoCount: number;
  page: number;
  limit: number;
  totalPageCount: number;
};

const getVideos = async ({
  page,
  limit,
  searchText,
  type,
  createdAfterDate,
  userId,
  status,
}: {
  page: number;
  limit: number;
  searchText?: string;
  type?: VideoType;
  createdAfterDate?: Date;
  userId?: string;
  status?: VideoStatus;
}): Promise<ApiReturnType<GetVideosResp>> => {
  const statusFilters: Prisma.VideoWhereInput = {};

  switch (status) {
    case "Pending Review":
      statusFilters.uploadStatus = { equals: "Uploaded" };
      statusFilters.reviewedDate = { equals: null };
      break;
    case "Rejected":
      statusFilters.uploadStatus = { equals: "Uploaded" };
      statusFilters.reviewedDate = { not: { equals: null } };
      statusFilters.isApproved = { equals: false };
      break;
    case "Published":
      statusFilters.uploadStatus = { equals: "Uploaded" };
      statusFilters.reviewedDate = { not: { equals: null } };
      statusFilters.isApproved = { equals: true };
      statusFilters.isPrivate = { equals: false };
      break;
    case "Private":
      statusFilters.uploadStatus = { equals: "Uploaded" };
      statusFilters.reviewedDate = { not: { equals: null } };
      statusFilters.isApproved = { equals: true };
      statusFilters.isPrivate = { equals: true };
      break;
    case "Uploading":
    case "Encoding":
    case "Generating_Streaming_Urls":
      statusFilters.uploadStatus = { not: { equals: "Uploaded" } };
      break;
  }

  try {
    let videos = await prisma.video.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      where: {
        ...(searchText && {
          OR: [
            { name: { contains: searchText } },
            { id: { contains: searchText } },
          ],
        }),
        ...(type && { type: { equals: type } }),
        ...(userId && { userId: { equals: userId } }),
        ...(createdAfterDate && {
          createdDate: { gte: createdAfterDate },
        }),
        ...statusFilters,
      },
      include: { user: true },
    });

    const totalVideos = await prisma.video.count();

    return {
      success: true,
      data: {
        videos,
        totalVideoCount: totalVideos,
        page: Number(page),
        limit: Number(limit),
        totalPageCount: Math.ceil(totalVideos / Number(limit)),
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

export type EncodeAndSaveVideoResp = {
  videoId: string;
};

const encodeAndSaveVideo = async ({
  userId,
  name,
  blobUrl,
  description,
  type,
}: {
  userId: string;
  name: string;
  description?: string;
  blobUrl: string;
  type: VideoType;
}): Promise<ApiReturnType<EncodeAndSaveVideoResp>> => {
  try {
    const encodeVideoResp = await encodeVideoOnAzureFromBlob(blobUrl);

    const { streamingUrls, thumbnailUrl, mediaServicesAssetName } =
      encodeVideoResp;

    const video = await prisma.video.create({
      data: {
        userId,
        name,
        blobUrl,
        type,
        hlsUrl:
          streamingUrls.find((url) => url.includes("format=m3u8-cmaf")) || "",
        dashUrl:
          streamingUrls.find((url) => url.includes("format=mpd-time-cmaf")) ||
          "",
        smoothStreamingUrl:
          streamingUrls.find((url) => url[url.length - 1] === "t") || "",
        thumbnailUrl,
        mediaServicesAssetName,
        duration_seconds: 69,
      },
    });

    return { success: true, data: { videoId: video.id } };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to fetch videos: ${error}`,
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

    if (video.uploadStatus !== "Uploaded") {
      throw new Error("Please wait for the video to finish uploading.");
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
      error: `Failed to fetch video ${videoId}: ${error}`,
    };
  }
};

export { handler as default };
