import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

export const authenticateRequest = async (
  req: NextApiRequest
): Promise<{ name: string; email: string; image?: string | null }> => {
  const session = await getSession({ req });

  if (!session?.user) {
    throw Error("User not found while authenticating request.");
  }

  return session.user;
};
