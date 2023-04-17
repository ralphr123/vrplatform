import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { User, Video } from "@prisma/client";
import { ApiReturnType } from "@app/lib/types/api";

const querySchema = z.object({
  userId: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        const { userId } = querySchema.parse(req.query);
        const result = await getUser({ userId });
        return res.status(result.success ? 200 : 500).json(result);
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

export type GetUserResp = {
  user: User;
  totalViews: number;
  numVideosUploaded: number;
};

const getUser = async ({
  userId,
}: {
  userId: string;
}): Promise<ApiReturnType<GetUserResp>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        videos: true,
      },
    });

    if (!user) {
      throw Error(`User not found for id ${userId}`);
    }

    // @TODO: Get total views for user
    const totalViews = 0;

    return {
      success: true,
      data: {
        user,
        totalViews,
        numVideosUploaded: user.videos.length,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to fetch user: ${error}`,
    };
  }
};

export { handler as default };
