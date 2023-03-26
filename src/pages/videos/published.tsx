import { PageHeader } from "@app/components/PageHeader";
import { VideoTable } from "@app/components/video/VideoTable";
import { useVideos } from "@app/lib/client/hooks/api/useVideos";
import { showToast } from "@app/lib/client/showToast";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Published() {
  const { data, error, isLoading } = useVideos();

  useEffect(() => {
    if (error) {
      console.error(error);
      showToast({
        status: "error",
        description:
          "There was an error loading videos. If this persists, contact support.",
      });
    }
  }, [error]);

  return (
    <Flex flexDirection="column" width="100%" gap="1.5em">
      <PageHeader>Published Videos</PageHeader>
      <VideoTable videos={data?.videos} isLoading={isLoading} />
    </Flex>
  );
}
