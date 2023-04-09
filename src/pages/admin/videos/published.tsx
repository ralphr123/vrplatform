import { PageHeader } from "@app/components/PageHeader";
import { VideoTable } from "@app/components/video/VideoTable";
import { useVideos } from "@app/lib/client/hooks/api/useVideos";
import { showToast } from "@app/lib/client/showToast";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Published() {
  return (
    <Flex flexDirection="column" width="100%" gap="1.5em">
      <PageHeader>Published Videos</PageHeader>
      <VideoTable />
    </Flex>
  );
}
