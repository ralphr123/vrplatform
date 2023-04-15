import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { Prisma, User, Video } from "@prisma/client";
import { ApiReturnType } from "@app/lib/types/api";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";
import { basePaginationQuerySchema } from "@app/lib/types/zod";

const getQuerySchema = z.intersection(
  basePaginationQuerySchema,
  z.object({
    searchText: z.string().optional(),
    registeredAfterDate: z.preprocess((value) => {
      const processed = z
        .string()
        .transform((val) => new Date(val))
        .safeParse(value);
      return processed.success ? processed.data : value;
    }, z.date().optional()),
  })
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        await authenticateRequest(req);
        const result = await getUsers(getQuerySchema.parse(req.query));
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
  users: (User & { videos: Video[] })[];
  totalUsersCount: number;
  page: number;
  limit: number;
  totalPageCount: number;
};

const getUsers = async ({
  pendingReview,
  page,
  limit,
  searchText,
  registeredAfterDate,
}: {
  pendingReview?: boolean;
  page: number;
  limit: number;
  searchText?: string;
  registeredAfterDate?: Date;
}): Promise<ApiReturnType<GetUsersResp>> => {
  try {
    const filters: Prisma.UserWhereInput = {
      ...(pendingReview
        ? { emailVerified: { equals: null } }
        : { emailVerified: { not: { equals: null } } }),
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
    };

    const users = await prisma.user.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      where: filters,
      include: { videos: true },
    });

    const totalUsers = await prisma.user.count({ where: filters });

    return {
      success: true,
      data: {
        users,
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
