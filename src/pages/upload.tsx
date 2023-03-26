import { VideoUploader } from "@app/components/video/VideoUploader";
import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { showToast } from "@app/lib/client/showToast";
import { GenerateAzureStorageSasTokenResp } from "./api/v1/azure/generateStorageSasToken";
import { ApiReturnType } from "@app/lib/types/api";
import { BlockBlobClient } from "@azure/storage-blob";
import { GetStreamingUrlsFromBlobResp } from "@app/lib/azure/encode";

export default function Upload() {
  const [videoFile, setVideoFile] = useState<File>();

  const onSubmit = async () => {
    // No video uploaded to client
    if (!videoFile) {
      showToast({
        status: "error",
        description: "No video file provided.",
      });
      return;
    }

    try {
      // 1. Get SAS token for create permission to default azure blob storage container
      const azureStorageSasTokenRes: ApiReturnType<GenerateAzureStorageSasTokenResp> =
        await (await fetch("/api/v1/azure/generateStorageSasToken")).json();

      if (!azureStorageSasTokenRes.success) {
        throw Error(azureStorageSasTokenRes.error);
      }

      const { sasToken, storageUri } = azureStorageSasTokenRes.data;

      // 2. Use SAS token to upload video to default azure container
      const blobUrlWithSasToken = `${storageUri}/${videoFile.name}${sasToken}`;

      const blobClient = new BlockBlobClient(blobUrlWithSasToken);
      await blobClient.uploadData(videoFile);
      const blobUrl = `${storageUri}/${videoFile.name}`;

      // 3. Call backend to transform blob video to azure media services asset and get streaming urls
      const streamingUrlsRes: ApiReturnType<GetStreamingUrlsFromBlobResp> =
        await (
          await fetch(
            `/api/v1/azure/getStreamingUrlsFromBlob/${encodeURIComponent(
              blobUrl
            )}`
          )
        ).json();

      if (!streamingUrlsRes.success) {
        throw Error(streamingUrlsRes.error);
      }

      const { streamingUrls } = streamingUrlsRes.data;

      console.log(streamingUrls);
    } catch (error) {
      console.error(error);
      showToast({
        status: "error",
        description:
          "Failed to upload video. If this error persists, contact support at support@vrplatform.com",
      });
    }
  };

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <VideoUploader videoFile={videoFile} onChangeVideoFile={setVideoFile} />
      <Button onClick={onSubmit}>Submit</Button>
    </Flex>
  );
}
