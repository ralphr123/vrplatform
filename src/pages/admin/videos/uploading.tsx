import { PageHeader } from "@app/components/admin/PageHeader";
import { VideoTable } from "@app/components/video/video-table/VideoTable";
import { Stack } from "@chakra-ui/react";

export default function Published() {
  return (
    <Stack width="100%" gap="1.5em">
      <PageHeader>Uploading</PageHeader>
      <VideoTable filters={{ status: "Encoding" }} />
    </Stack>
  );
}
