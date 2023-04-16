import { PageHeader } from "@app/components/admin/PageHeader";
import { VideoInfoCard } from "@app/components/video/VideoInfoCard";
import { VideoPlayer } from "@app/components/video/VideoPlayer";
import { useVideo } from "@app/lib/client/hooks/api/useVideo";
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Video() {
  const router = useRouter();
  const { data, isLoading } = useVideo(
    router.query["videoId"] as string | undefined
  );

  if (isLoading || !data?.video) {
    return (
      <Flex width="100%" height="100%">
        <Spinner />
      </Flex>
    );
  }

  const { name, description, hlsUrl } = data.video;

  return (
    <Flex flexDirection="column" width="100%" gap="1.5em">
      <PageHeader>{name}</PageHeader>
      <VideoPlayer name={name} hlsUrl={hlsUrl} />
      {/* ---------- Video info card --------- */}
      <VideoInfoCard video={data.video} />
      {/* ------------------------------------ */}

      {/* -------- Video description --------- */}
      <Stack
        width="100%"
        bgColor="white"
        border="1px solid #DDDDDD"
        rounded="lg"
        padding="1.25em 2em"
      >
        <Text fontWeight="600" color="#BBBBBB">
          Description
        </Text>
        <Text>{description}</Text>
      </Stack>
      {/* ------------------------------------ */}
    </Flex>
  );
}
