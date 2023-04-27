import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { User, UserRole, Video } from "@prisma/client";
import { ApiReturnType, rolePriority, UserData } from "@app/lib/types/api";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";

const userUpdateDataSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

const querySchema = z.object({
  userId: z.string(),
});

const postBodySchema = z.object({
  data: userUpdateDataSchema,
});

export type UserUpdateData = z.infer<typeof userUpdateDataSchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        const { id: adminId } = await authenticateRequest({
          req,
          role: UserRole.Admin,
        });
        const { userId } = querySchema.parse(req.query);
        const result = await getUser({ userId, adminId });
        return res.status(result.success ? 200 : 500).json(result);
      }
      case "POST": {
        const adminUser = await authenticateRequest({
          req,
          role: UserRole.Admin,
        });
        const { userId } = querySchema.parse(req.query);
        const { data } = postBodySchema.parse(req.body);
        const result = await updateUser({ userId, adminUser, data });
        return res.status(result.success ? 200 : 500).json(result);
      }
      default:
        return res
          .status(405)
          .json({ success: false, error: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/users/[userId]: ${error}`
    );
    return res
      .status(500)
      .json({ success: false, error: `Something went wrong: ${error}` });
  }
};

export type GetUserResp = {
  user: UserData;
  totalViews: number;
  numVideosUploaded: number;
};

const getUser = async ({
  userId,
  adminId,
}: {
  userId: string;
  adminId: string;
}): Promise<ApiReturnType<GetUserResp>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        videos: true,
        userBookmarkedBy: {
          where: {
            adminId,
          },
        },
      },
    });

    if (!user) {
      throw Error("User not found.");
    }

    // @TODO: Get total views for user
    const totalViews = 0;

    const userData: UserData = {
      ...user,
      isBookmarkedByUser: !!user.userBookmarkedBy.length,
    };

    return {
      success: true,
      data: {
        user: userData,
        totalViews,
        numVideosUploaded: user.videos.length,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to fetch user ${userId}: ${error}`,
    };
  }
};

export const updateUser = async ({
  userId,
  adminUser,
  data,
}: {
  userId: string;
  adminUser: User;
  data: UserUpdateData;
}): Promise<ApiReturnType<{}>> => {
  try {
    const userToUpdate = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userToUpdate) {
      throw Error("User not found.");
    }

    if (rolePriority[adminUser.role] <= rolePriority[userToUpdate.role]) {
      throw Error("Unauthorized");
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });

    return {
      success: true,
      data: {},
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to update user ${userId}: ${error}`,
    };
  }
};

export { handler as default };
