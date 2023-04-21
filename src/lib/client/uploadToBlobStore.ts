import { GenerateAzureStorageSasTokenResp } from "@app/pages/api/v1/azure/generateStorageSasToken";
import { BlockBlobClient } from "@azure/storage-blob";
import { ApiReturnType } from "../types/api";

export const uploadToBlobStore = async ({
  file,
  onProgress,
}: {
  file: File;
  onProgress?: (percent: number) => void;
}): Promise<string> => {
  // 1. Get SAS token with create permission to default azure blob storage container
  // We have a temporary container for client side uploads
  const azureStorageSasTokenRes: ApiReturnType<GenerateAzureStorageSasTokenResp> =
    await (await fetch("/api/v1/azure/generateStorageSasToken")).json();

  if (!azureStorageSasTokenRes.success) {
    throw Error(azureStorageSasTokenRes.error);
  }

  const { sasToken, storageUri } = azureStorageSasTokenRes.data;

  // 2. Use SAS token to upload video to default azure container
  const blobUrlWithSasToken = `${storageUri}/${file.name}${sasToken}`;

  const blobClient = new BlockBlobClient(blobUrlWithSasToken);
  await blobClient.uploadData(file, {
    onProgress: (progressEvent) =>
      onProgress?.((progressEvent.loadedBytes / file.size) * 100),
  });

  return `${storageUri}/${file.name}`;
};
