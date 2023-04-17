import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import { AzureMediaServices } from "@azure/arm-mediaservices";

const {
  AZURE_SUBSCRIPTION_ID: subscriptionId,
  AZURE_RESOURCE_GROUP: resourceGroupName,
  AZURE_MEDIA_SERVICES_ACCOUNT_NAME: mediaServicesAccountName,
} = process.env;

const credential = new DefaultAzureCredential();
const storageUrl = `https://${mediaServicesAccountName}.blob.core.windows.net`;

// Delete the asset
export const deleteAzureMediaServicesAsset = async (
  assetName: string
): Promise<void> => {
  const mediaServicesClient = new AzureMediaServices(
    credential,
    subscriptionId
  );
  const blobServicesClient = new BlobServiceClient(storageUrl, credential);

  // Get the asset
  const asset = await mediaServicesClient.assets.get(
    resourceGroupName,
    mediaServicesAccountName,
    assetName
  );

  // Delete the asset's files in Blob Storage
  if (asset.container) {
    const containerClient = blobServicesClient.getContainerClient(
      asset.container
    );
    await containerClient.delete();
  }

  // Delete the asset in Media Services
  await mediaServicesClient.assets.delete(
    "<your-resource-group-name>",
    "<your-account-name>",
    assetName
  );
};
