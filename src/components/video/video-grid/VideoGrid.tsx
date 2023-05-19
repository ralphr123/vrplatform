import { useVideos } from "@app/lib/client/hooks/api/useVideos";
import { showToast } from "@app/lib/client/showToast";
import { toastMessages } from "@app/lib/types/toast";
import { Flex, Grid, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { VideoGridCard } from "./VideoGridCard";

type QueryParams = {
  searchText?: string;
};

export const VideoGrid = () => {
  const router = useRouter();
  const { searchText } = router.query as QueryParams;
  const { data: { videos } = {}, isLoading } = useVideos({
    status: "Published",
    searchText,
  });

  if (isLoading) {
    return (
      <Flex width="100%" height="50%" align="center" justify="center">
        <Spinner />
      </Flex>
    );
  }

  if (!videos) {
    showToast({
      status: "error",
      description: toastMessages.videosErrorFetching,
      contactSupport: true,
    });
    return null;
  }

  return (
    <Grid
      width="100%"
      templateColumns="repeat(auto-fill, minmax(18em, 1fr))"
      gridGap={5}
    >
      {videos.map(({ id, name, thumbnailUrl, createdDate }) => (
        <VideoGridCard
          id={id}
          key={name}
          name={name}
          thumbnailUrl={thumbnailUrl!}
          createdDate={createdDate}
          views={0}
        />
      ))}
    </Grid>
  );
};
