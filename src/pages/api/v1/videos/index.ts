import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { Prisma, VideoType } from "@prisma/client";
import {
  ApiReturnType,
  VideoData,
  VideoStatus,
  videoStatuses,
} from "@app/lib/types/api";
import { encodeVideoOnAzureFromBlob } from "@app/lib/azure/encode";
import { videoTypes } from "@app/lib/types/prisma";
import { basePaginationQuerySchema } from "@app/lib/types/zod";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";
import {
  zodPreprocessBoolean,
  zodPreprocessDate,
} from "@app/lib/server/zodHelpers";
import {
  getVideoInclude,
  processVideoData,
} from "@app/lib/server/processVideoData";

const videoTypeSchema = z.enum(videoTypes);

const getQuerySchema = z.intersection(
  basePaginationQuerySchema,
  z.object({
    searchText: z.string().optional(),
    type: videoTypeSchema.optional(),
    createdAfterDate: zodPreprocessDate().optional(),
    status: z.enum(videoStatuses).optional(),
    onlyBookmarked: zodPreprocessBoolean().optional(),
    userId: z.string().optional(),
  })
);

const postBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  blobUrl: z.string(),
  type: videoTypeSchema,
  duration: z.preprocess((value) => {
    const processed = z.number().transform(Math.round).safeParse(value);
    return processed.success ? processed.data : value;
  }, z.number()),
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
        const { id: userId } = await authenticateRequest({ req });
        const result = await encodeAndSaveVideo({
          userId,
          ...postBodySchema.parse(req.body),
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
  videos: VideoData[];
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
  onlyBookmarked,
}: {
  page: number;
  limit: number;
  searchText?: string;
  type?: VideoType;
  createdAfterDate?: Date;
  userId?: string;
  status?: VideoStatus;
  onlyBookmarked?: boolean;
}): Promise<ApiReturnType<GetVideosResp>> => {
  const statusFilters: Prisma.VideoWhereInput = {};

  switch (status) {
    case "Pending Review":
      statusFilters.mediaServicesAssetName = { not: { equals: null } };
      statusFilters.reviewedDate = { equals: null };
      break;
    case "Rejected":
      statusFilters.mediaServicesAssetName = { not: { equals: null } };
      statusFilters.reviewedDate = { not: { equals: null } };
      statusFilters.rejectReason = { not: { equals: null } };
      break;
    case "Published":
      statusFilters.mediaServicesAssetName = { not: { equals: null } };
      statusFilters.reviewedDate = { not: { equals: null } };
      statusFilters.rejectReason = { equals: null };
      statusFilters.isPrivate = { equals: false };
      break;
    case "Private":
      statusFilters.mediaServicesAssetName = { not: { equals: null } };
      statusFilters.reviewedDate = { not: { equals: null } };
      statusFilters.rejectReason = { equals: null };
      statusFilters.isPrivate = { equals: true };
      break;
    case "Encoding":
      statusFilters.mediaServicesAssetName = { equals: null };
      break;
  }

  try {
    const videos = await prisma.video.findMany({
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
      include: getVideoInclude(userId),
    });

    const totalVideos = await prisma.video.count();
    const videosData: VideoData[] = processVideoData(videos);

    return {
      success: true,
      data: {
        videos: onlyBookmarked
          ? videosData.filter(({ isBookmarkedByUser }) => isBookmarkedByUser)
          : videosData,
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
  duration,
  description,
  type,
}: {
  userId: string;
  name: string;
  type: VideoType;
  duration: number;
  blobUrl: string;
  description?: string;
}): Promise<ApiReturnType<EncodeAndSaveVideoResp>> => {
  let videoId: string = "";
  try {
    // 1. Create video without streaming URLs
    // This video will be in a pending state until the encoding is complete
    const video = await prisma.video.create({
      data: {
        userId,
        name,
        description,
        blobUrl,
        type,
        duration_seconds: duration,
      },
    });

    videoId = video.id;

    // 2. Encode video on Azure
    const encodeVideoResp = await encodeVideoOnAzureFromBlob(blobUrl);
    const { streamingUrls, thumbnailUrl, mediaServicesAssetName } =
      encodeVideoResp;

    // 3. Update video with streaming URLs
    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        hlsUrl:
          streamingUrls.find((url) => url.includes("format=m3u8-cmaf")) || null,
        dashUrl:
          streamingUrls.find((url) => url.includes("format=mpd-time-cmaf")) ||
          null,
        smoothStreamingUrl:
          streamingUrls.find((url) => url[url.length - 1] === "t") || null,
        thumbnailUrl,
        mediaServicesAssetName,
      },
    });

    return { success: true, data: { videoId: video.id } };
  } catch (error) {
    console.error(error);

    // If there's an error, update the video with the error message
    if (videoId) {
      await prisma.video.update({
        where: {
          id: videoId,
        },
        data: {
          encodingError: String(error),
        },
      });
    }

    return {
      success: false,
      error: `Failed to create video: ${error}`,
    };
  }
};

export { handler as default };
