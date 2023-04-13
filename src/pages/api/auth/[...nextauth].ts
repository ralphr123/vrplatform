import prisma from "@app/lib/prismadb";
import { sendEmail } from "@app/lib/server/sendEmail";
import { Pathname } from "@app/lib/types/api";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Account, User } from "@prisma/client";
import NextAuth, { Profile, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { route } from "nextjs-routes";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => {
      return {
        ...session,
        user: user,
      };
    },
    /**
     * Returns a boolean to indicate success, or false to throw a default error.
     * Can also return a string to redirect user.
     * */
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account;
      profile: Profile;
    }): Promise<boolean | Pathname> {
      // Send email to user to verify email
      if (!user.emailVerified && !user.emailVerificationToken) {
        try {
          const token = Math.random().toString(36).substring(2, 15);

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              emailVerificationToken: token,
            },
          });

          await sendEmail({
            email: "rrouhana@uwaterloo.ca",
            templateId: "verify-email",
            dynamicTemplateData: {
              Verify_Url: `http://localhost:3000/api/auth/verify-email?token=${token}`,
            },
          });

          return route({ pathname: "/auth/verify/[token]", query: { token } });
        } catch (error) {
          console.error(`Error sending email verification token: ${error}`);
        }
      }

      if (!user.emailVerified) {
        return route({
          pathname: "/auth/verify",
        });
      }

      return true;
    },
  },
};

// @ts-ignore
export default NextAuth(authOptions);
