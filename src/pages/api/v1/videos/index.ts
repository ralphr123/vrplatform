import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { Video } from "@prisma/client";
import { ApiReturnType } from "@app/lib/types/api";

const querySchema = z.object({
  page: z.preprocess((value) => {
    const processed = z.string().transform(Number).safeParse(value);
    return processed.success ? processed.data : value;
  }, z.number().default(1)),
  limit: z.preprocess((value) => {
    const processed = z.string().transform(Number).safeParse(value);
    return processed.success ? processed.data : value;
  }, z.number().default(10)),
  pendingReview: z.preprocess((value) => {
    const processed = z
      .string()
      .transform((input) => (input === "true" ? true : false))
      .safeParse(value);
    return processed.success ? processed.data : value;
  }, z.boolean().default(false)),
});

export type GetVideosResp = {
  videos: Video[];
  totalVideoCount: number;
  page: number;
  limit: number;
  totalPageCount: number;
};

const getVideos = async ({
  page,
  limit,
  pendingReview,
}: {
  page: number;
  limit: number;
  pendingReview: boolean;
}): Promise<ApiReturnType<GetVideosResp>> => {
  try {
    const videos = await prisma.video.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      where: pendingReview
        ? { verified_date: { equals: null } }
        : { verified_date: { not: { equals: null } } },
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        const { page, limit, pendingReview } = querySchema.parse(req.query);
        const result = await getVideos({ page, limit, pendingReview });
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
