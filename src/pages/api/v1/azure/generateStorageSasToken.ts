import { ApiReturnType } from "@app/lib/types/api";
import {
  AccountSASPermissions,
  AccountSASResourceTypes,
  AccountSASServices,
  generateAccountSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import type { NextApiRequest, NextApiResponse } from "next/types";

export type GenerateAzureStorageSasTokenResp = {
  sasToken: string;
  storageUri: string;
};

const generateAzureStorageSasToken = async (): Promise<
  ApiReturnType<GenerateAzureStorageSasTokenResp>
> => {
  try {
    const {
      AZURE_STORAGE_ACCOUNT_NAME: accountName,
      AZURE_STORAGE_ACCOUNT_KEY: accountKey,
      AZURE_STORAGE_CONTAINER_NAME: containerName,
    } = process.env;

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    const sasOptions = {
      services: AccountSASServices.parse("btqf").toString(), // blobs, tables, queues, files
      resourceTypes: AccountSASResourceTypes.parse("sco").toString(), // service, container, object
      permissions: AccountSASPermissions.parse("rwdlacupi"), // permissions
      protocol: SASProtocol.Https,
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 10 * 60 * 1000), // 10 minutes
    };

    const sasToken = generateAccountSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();

    return {
      success: true,
      data: {
        sasToken: sasToken[0] === "?" ? sasToken : `?${sasToken}`,
        storageUri: `https://${accountName}.blob.core.windows.net/${containerName}`,
      },
    };
  } catch (error) {
    console.error(`Failed to generate SAS token: ${error}`);
    return {
      success: false,
      error: `Failed to fetch videos: ${error}`,
    };
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        const result = await generateAzureStorageSasToken();
        return res.status(result.success ? 200 : 500).json(result);
      }
      default:
        return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/azure/generateSasToken: ${error}`
    );
    return res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};

export { handler as default };
