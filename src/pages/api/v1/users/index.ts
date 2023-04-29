import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { Prisma, UserRole } from "@prisma/client";
import { ApiReturnType, UserData } from "@app/lib/types/api";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";
import { basePaginationQuerySchema } from "@app/lib/types/zod";
import { getSession } from "next-auth/react";
import {
  zodPreprocessBoolean,
  zodPreprocessDate,
} from "@app/lib/server/zodHelpers";
import {
  getVideoInclude,
  processVideoData,
} from "@app/lib/server/processVideoData";

const getQuerySchema = z.intersection(
  basePaginationQuerySchema,
  z.object({
    searchText: z.string().optional(),
    registeredAfterDate: zodPreprocessDate().optional(),
    verified: zodPreprocessBoolean().optional(),
    onlyBookmarked: zodPreprocessBoolean().optional(),
    excludeMembers: zodPreprocessBoolean().optional(),
  })
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        await authenticateRequest({ req, role: UserRole.Admin });
        const session = await getSession({ req });
        const adminId = session?.user?.id;
        const filters = getQuerySchema.parse(req.query);
        const result = await getUsers({ filters, adminId });
        return res.status(result.success ? 200 : 500).json(result);
      }
      default:
        return res
          .status(405)
          .json({ success: false, error: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/users: ${error}`
    );
    return res
      .status(500)
      .json({ success: false, error: `Something went wrong: ${error}` });
  }
};

export type GetUsersResp = {
  users: UserData[];
  totalUsersCount: number;
  page: number;
  limit: number;
  totalPageCount: number;
};

const getUsers = async ({
  filters: {
    page,
    limit,
    searchText,
    registeredAfterDate,
    verified,
    onlyBookmarked,
    excludeMembers,
  },
  adminId,
}: {
  filters: {
    page: number;
    limit: number;
    searchText?: string;
    registeredAfterDate?: Date;
    verified?: boolean;
    onlyBookmarked?: boolean;
    excludeMembers?: boolean;
  };
  adminId?: string;
}): Promise<ApiReturnType<GetUsersResp>> => {
  try {
    const filters: Prisma.UserWhereInput = {
      ...(typeof verified === "boolean"
        ? verified
          ? { emailVerified: { not: { equals: null } } }
          : { emailVerified: { equals: null } }
        : {}),
      ...(searchText && {
        OR: [
          { name: { contains: searchText } },
          { id: { contains: searchText } },
          { email: { contains: searchText } },
        ],
      }),
      ...(registeredAfterDate && {
        registeredDate: { gte: registeredAfterDate },
      }),
      ...(excludeMembers && { role: { not: { equals: UserRole.Member } } }),
    };

    const users = await prisma.user.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      where: filters,
      include: {
        videos: {
          include: getVideoInclude(adminId),
        },
        userBookmarkedBy: {
          where: {
            adminId: adminId,
          },
        },
      },
    });

    const totalUsers = await prisma.user.count({ where: filters });

    const usersData: UserData[] = [];

    for (const user of users) {
      usersData.push({
        ...user,
        videos: processVideoData(user.videos),
        isBookmarkedByUser: !!user.userBookmarkedBy.length,
      });
    }

    return {
      success: true,
      data: {
        users: onlyBookmarked
          ? usersData.filter(({ isBookmarkedByUser }) => !!isBookmarkedByUser)
          : usersData,
        totalUsersCount: totalUsers,
        page: Number(page),
        limit: Number(limit),
        totalPageCount: Math.ceil(totalUsers / Number(limit)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `Failed to fetch users: ${error}`,
    };
  }
};

export { handler as default };
