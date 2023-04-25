import prisma from "../../../../lib/prismadb";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import { Prisma, User, Video } from "@prisma/client";
import { ApiReturnType, UserData } from "@app/lib/types/api";
import { authenticateRequest } from "@app/lib/server/authenticateRequest";
import { basePaginationQuerySchema } from "@app/lib/types/zod";
import { getSession } from "next-auth/react";

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
    verified: z.preprocess((value) => {
      const processed = z
        .string()
        .transform((input) => (input === "true" ? true : false))
        .safeParse(value);
      return processed.success ? processed.data : value;
    }, z.boolean().default(false)),
    onlyBookmarked: z.preprocess((value) => {
      const processed = z
        .string()
        .transform((val) => val === "true")
        .safeParse(value);
      return processed.success ? processed.data : value;
    }, z.boolean().optional()),
  })
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        await authenticateRequest(req);
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
  };
  adminId?: string;
}): Promise<ApiReturnType<GetUsersResp>> => {
  try {
    const filters: Prisma.UserWhereInput = {
      ...(verified
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

    const users: (UserData & { userBookmarkedBy: any[] })[] =
      await prisma.user.findMany({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        where: filters,
        include: {
          videos: true,
          userBookmarkedBy: {
            where: {
              adminId: adminId,
            },
          },
        },
      });

    const totalUsers = await prisma.user.count({ where: filters });

    for (const user of users) {
      if (!!user.userBookmarkedBy.length) {
        user.isBookmarkedByUser = true;
      }
    }

    console.log(onlyBookmarked);

    return {
      success: true,
      data: {
        users: onlyBookmarked
          ? users.filter(({ isBookmarkedByUser }) => !!isBookmarkedByUser)
          : users,
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
