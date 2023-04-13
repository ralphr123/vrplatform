import { PageHeader } from "@app/components/PageHeader";
import { VideoTable } from "@app/components/video/VideoTable";
import { Flex } from "@chakra-ui/react";

export default function PendingReview() {
  return (
    <Flex flexDirection="column" width="100%" gap="1.5em">
      <PageHeader>Pending Review</PageHeader>
      <VideoTable pendingReview={true} />
    </Flex>
  );
}
