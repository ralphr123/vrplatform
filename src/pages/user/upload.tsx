import { VideoUploader } from "@app/components/video/VideoUploader";
import {
  Text,
  Flex,
  Stack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { showToast } from "@app/lib/client/showToast";
import { ApiReturnType } from "@app/lib/types/api";
import { BlockBlobClient } from "@azure/storage-blob";
import { GenerateAzureStorageSasTokenResp } from "../api/v1/azure/generateStorageSasToken";
import { fetchJson } from "@app/lib/client/fetchJson";
import {
  EncodeAndSaveVideoBody,
  EncodeAndSaveVideoResp,
} from "../api/v1/videos";
import { Tb360View } from "react-icons/tb";
import { VideoType } from "@prisma/client";

export default function Upload() {
  const [videoFile, setVideoFile] = useState<File>();
  const [videoType, setVideoType] = useState<VideoType>(VideoType.Regular);
  const [videoName, setVideoName] = useState<string>();
  const [videoDescription, setVideoDescription] = useState<string>();
  const [isErrorVideoName, setIsErrorVideoName] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!videoFile) {
      showToast({
        status: "error",
        description: "No video file provided.",
      });
      return;
    }

    if (!videoName) {
      setIsErrorVideoName(true);
      showToast({
        status: "error",
        description: "No video name provided.",
      });
      return;
    }

    try {
      // 1. Get SAS token with create permission to default azure blob storage container
      // We have a temporary container for client side uploads
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

      // 3. Call backend to enncode blob video to azure media services asset and generate streaming urls
      const streamingUrlsRes = await fetchJson<
        EncodeAndSaveVideoResp,
        EncodeAndSaveVideoBody
      >({
        method: "POST",
        url: "/api/v1/videos",
        body: {
          blobUrl,
          name: videoName,
          description: videoDescription,
          type: videoType,
        },
      });

      if (!streamingUrlsRes.success) {
        throw Error(streamingUrlsRes.error);
      }

      const { videoId } = streamingUrlsRes.data;

      console.log(videoId);
    } catch (error) {
      console.error(error);
      showToast({
        status: "error",
        description: "Failed to upload video.",
      });
    }
  };

  const handleChangeVideoFile = ({
    file,
    type,
  }: {
    file?: File;
    type: VideoType;
  }) => {
    setVideoType(type);
    setVideoFile(file);
  };

  if (!videoFile) {
    return (
      <Flex height="100%" width="100%" align="center" justify="center" gap={2}>
        <VideoUploader
          label="Upload a 2D video"
          videoFile={videoFile}
          onChangeVideoFile={(file) =>
            handleChangeVideoFile({ file, type: VideoType.Regular })
          }
          flex={1}
        />
        <VideoUploader
          label="Upload a 360 video"
          videoFile={videoFile}
          onChangeVideoFile={(file) =>
            handleChangeVideoFile({ file, type: VideoType.VR })
          }
          icon={Tb360View}
          flex={1}
        />
      </Flex>
    );
  }

  return (
    <Stack gap={4} width="100%" margin={0} pb={"0.5em"}>
      <Text fontSize="3xl" fontWeight={600}>
        Video details
      </Text>
      <video
        width="320"
        height="240"
        controls
        style={{ borderRadius: "0.4em", width: "100%" }}
      >
        <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
        Your browser does not support the video tag.
      </video>
      <FormControl isInvalid={isErrorVideoName}>
        <FormLabel>Video name</FormLabel>
        <Input
          type="text"
          placeholder="Enter a title for your video"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
        />
        <FormErrorMessage hidden={!isErrorVideoName}>
          Video name is required.
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={isErrorVideoName}>
        <FormLabel>Video description</FormLabel>
        <Textarea
          value={videoDescription}
          placeholder="Enter a description for your video"
          rows={10}
          onChange={(e) => setVideoDescription(e.target.value)}
        />
      </FormControl>
      <Flex justify="flex-end" gap={5}>
        <Button
          bgColor="transparent"
          padding="1em 1.25em"
          onClick={() => setVideoFile(undefined)}
        >
          Cancel
        </Button>
        <Button padding="1em 1.25em" onClick={onSubmit}>
          Submit for approval
        </Button>
      </Flex>
    </Stack>
  );
}
