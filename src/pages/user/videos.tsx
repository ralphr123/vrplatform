import { VideoTable } from "@app/components/video/video-table/VideoTable";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function VideosPage() {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <Flex width="100%" height="50%" align="center" justify="center">
        <Spinner />
      </Flex>
    );
  }

  // Redirect is handled in UserMenu.tsx
  if (!session.data?.user) {
    return null;
  }

  const userId = session.data.user.id;

  return (
    <Stack>
      <VideoTable filters={{ userId, type: false, createdAfterDate: false }} />
    </Stack>
  );
}
