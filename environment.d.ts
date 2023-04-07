import { type DefaultSession } from "next-auth";
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DATABASE_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      BITMOVIN_SECRET: string;
      AZURE_CLIENT_ID: string;
      AZURE_CLIENT_SECRET: string;
      AZURE_TENANT_DOMAIN: string;
      AZURE_TENANT_ID: string;
      AZURE_MEDIA_SERVICES_ACCOUNT_NAME: string;
      AZURE_STORAGE_ACCOUNT_NAME: string;
      AZURE_STORAGE_ACCOUNT_KEY: string;
      AZURE_STORAGE_CONTAINER_NAME: string;
      AZURE_RESOURCE_GROUP: string;
      AZURE_SUBSCRIPTION_ID: string;
      AZURE_ARM_TOKEN_AUDIENCE: string;
      AZURE_ARM_ENDPOINT: string;
    }
  }
}
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   * Defaults to default prisma schema, needs to be updated on User table schema changes
   */
  interface Session {
    user?: {
      name: string;
      email: string;
      image?: string | null;
    };
  }
}

export {};
