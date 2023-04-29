import { VideoTable } from "@app/components/video/video-table/VideoTable";
import { showToast } from "@app/lib/client/showToast";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type QueryParams = {
  successfullyUploadedVideo?: string;
};

export default function VideosPage() {
  const session = useSession();
  const router = useRouter();
  const { successfullyUploadedVideo } = router.query as QueryParams;

  if (successfullyUploadedVideo === "true") {
    showToast({
      status: "success",
      title: "Video uploaded",
      description: "Your video is being processed. This may take a while.",
    });
    router.replace("/account/videos");
  }

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
      <VideoTable
        filters={{ userId, type: false, createdAfterDate: false }}
        onClickRow={(videoId) =>
          router.push({
            pathname: "/account/videos/[videoId]",
            query: { videoId },
          })
        }
      />
    </Stack>
  );
}
