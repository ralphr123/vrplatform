import { VideoUploader } from "@app/components/VideoUploader";
import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { showToast } from "@app/lib/client/showToast";
import { isSuccessfulApiResponse } from "@app/lib/client/isSuccessfulApiResponse";
import { GenerateAzureStorageSasTokenSuccessResp } from "./api/v1/azure/generateStorageSasToken";
import { ApiReturnType } from "@app/lib/types/api";
import { BlockBlobClient } from "@azure/storage-blob";
import { GetStreamingUrlsFromBlobSuccessResp } from "@app/lib/azure/encode";

/*
  IN PROGRESS

  Currently a dev demo for uploading a video to Azure Blob Storage 
  and generating streaming links using Azure Media Services.
*/

export default function Home() {
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
      const azureStorageSasTokenRes: ApiReturnType<GenerateAzureStorageSasTokenSuccessResp> =
        await (await fetch("/api/v1/azure/generateStorageSasToken")).json();

      if (
        !isSuccessfulApiResponse<GenerateAzureStorageSasTokenSuccessResp>(
          azureStorageSasTokenRes
        )
      ) {
        throw Error(azureStorageSasTokenRes.error);
      }

      const { sasToken, storageUri } = azureStorageSasTokenRes.data;

      // 2. Use SAS token to upload video to default azure container
      const blobClient = new BlockBlobClient(
        storageUri,
        videoFile.name,
        sasToken
      );
      const blobUrl = `${storageUri}/${videoFile.name}`;
      await blobClient.uploadData(videoFile);

      // 3. Call backend to transform blob video to azure media services asset and get streaming urls
      const streamingUrlsRes: ApiReturnType<GetStreamingUrlsFromBlobSuccessResp> =
        await (
          await fetch(`/api/v1/azure/getStreamingUrlsFromBlob/${blobUrl}`)
        ).json();

      if (
        !isSuccessfulApiResponse<GetStreamingUrlsFromBlobSuccessResp>(
          streamingUrlsRes
        )
      ) {
        throw Error(streamingUrlsRes.error);
      }

      const { streamingUrls } = streamingUrlsRes.data;

      console.log(streamingUrls);
    } catch (error) {
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
