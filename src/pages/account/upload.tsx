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
  Progress,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { showToast } from "@app/lib/client/showToast";
import { fetchJson } from "@app/lib/client/fetchJson";
import {
  EncodeAndSaveVideoBody,
  EncodeAndSaveVideoResp,
} from "../api/v1/videos";
import { Tb360View } from "react-icons/tb";
import { VideoType } from "@prisma/client";
import { uploadToBlobStore } from "@app/lib/client/uploadToBlobStore";
import { useRouter } from "next/router";

export default function Upload() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoFile, setVideoFile] = useState<File>();
  const [videoType, setVideoType] = useState<VideoType>(VideoType.Regular);
  const [videoName, setVideoName] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [isErrorVideoName, setIsErrorVideoName] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

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

    setIsErrorVideoName(false);

    try {
      const blobUrl = await uploadToBlobStore({
        file: videoFile,
        onProgress: setProgress,
      });

      // 3. Call backend to encode blob to azure media services asset and generate streaming urls
      // This is done asynchronously, the user is redirected to the videos page where they can see the status of the video
      fetchJson<EncodeAndSaveVideoResp, EncodeAndSaveVideoBody>({
        method: "POST",
        url: "/api/v1/videos",
        body: {
          blobUrl,
          name: videoName,
          description: videoDescription,
          type: videoType,
          duration: videoRef.current?.duration ?? 0,
        },
      });

      router.push({
        pathname: "/account/videos",
        query: { successfullyUploadedVideo: "true" },
      });
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
        ref={videoRef}
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
      <FormControl>
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
        <Button padding="1em 1.25em" onClick={onSubmit} colorScheme="blue">
          Submit for approval
        </Button>
      </Flex>
      <Progress
        hidden={!progress}
        value={progress}
        size="xs"
        colorScheme="blue"
      />
    </Stack>
  );
}
