import { User, UserRole } from "@prisma/client";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import { rolePriority } from "../types/api";

export const authenticateRequest = async ({
  req,
  role,
}: {
  req: NextApiRequest;
  role?: UserRole;
}): Promise<User> => {
  const session = await getSession({ req });

  if (!session?.user) {
    throw Error("User not found while authenticating request.");
  }

  const user = session.user;

  if (role && rolePriority[user.role] < rolePriority[role]) {
    throw Error("Unauthorized.");
  }

  return user;
};
