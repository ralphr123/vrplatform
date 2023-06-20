import { useVideo } from "@app/lib/client/hooks/api/useVideo";
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { VideoGrid } from "@app/components/video/video-grid/VideoGrid";
import { VideoLayoutView } from "@app/components/video/VideoLayoutVideo";

export default function VideoPage() {
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

  const { video } = data;

  return (
    <Stack gap={5} width="100%">
      <VideoLayoutView video={video} />
      <Stack gap={5} pl={10} pb={10}>
        <Text fontSize="1.8em" fontWeight={500}>
          More videos to watch
        </Text>
        <VideoGrid />
      </Stack>
    </Stack>
  );
}
