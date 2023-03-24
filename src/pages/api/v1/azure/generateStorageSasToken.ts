import { ApiReturnType } from "@app/lib/types/api";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import type { NextApiRequest, NextApiResponse } from "next/types";

export type GenerateAzureStorageSasTokenSuccessResp = {
  sasToken: string;
  storageUri: string;
};

const generateAzureStorageSasToken = async (): Promise<
  ApiReturnType<GenerateAzureStorageSasTokenSuccessResp>
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
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);

    const sasToken = await containerClient.generateSasUrl({
      permissions: {
        read: false,
        add: true,
        create: true,
        delete: false,
        move: false,
        execute: false,
        filterByTags: false,
        list: false,
        deleteVersion: false,
        permanentDelete: false,
        setImmutabilityPolicy: false,
        tag: false,
        write: false,
      },
      startsOn: startDate,
      expiresOn: expiryDate,
    });

    return {
      success: true,
      data: {
        sasToken,
        storageUri: `https://${accountName}.blob.core.windows.net/${containerName}`,
      },
    };
  } catch (error) {
    console.error(error);
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
