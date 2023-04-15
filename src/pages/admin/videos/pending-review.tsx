import { PageHeader } from "@app/components/admin/PageHeader";
import { VideoTable } from "@app/components/admin/tables/VideoTable";
import { Stack } from "@chakra-ui/react";

export default function PendingReview() {
  return (
    <Stack width="100%" gap="1.5em">
      <PageHeader>Pending Review</PageHeader>
      <VideoTable pendingReview={true} />
    </Stack>
  );
}
