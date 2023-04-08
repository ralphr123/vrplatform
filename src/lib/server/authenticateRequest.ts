import { User } from "@prisma/client";
import { NextApiRequest } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export const authenticateRequest = async (
  req: NextApiRequest
): Promise<User> => {
  const session = await getSession({ req });

  if (!session?.user) {
    throw Error("User not found while authenticating request.");
  }

  return session.user;
};
