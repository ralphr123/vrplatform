import { PageHeader } from "@app/components/PageHeader";
import { VideoPlayer } from "@app/components/video/VideoPlayer";
import { useVideo } from "@app/lib/client/hooks/api/useVideo";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Video() {
  const router = useRouter();
  const { data, isLoading } = useVideo(
    router.query["videoId"] as string | undefined
  );

  if (isLoading) {
    return (
      <Flex width="100%" height="100%">
        <Spinner></Spinner>
      </Flex>
    );
  }

  if (!data?.video) {
    return (
      <Flex width="100%" height="100%">
        Not found
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" width="100%" gap="1.5em">
      <PageHeader>{data.video.name}</PageHeader>
      <Flex width="100%" rounded="5px" overflow="hidden">
        <VideoPlayer />
      </Flex>
      <Flex
        width="100%"
        height="5em"
        bgColor="white"
        border="1px solid #DDDDDD"
        rounded="8px"
        align="center"
        justify="space-between"
        padding="3.25em 2.5em"
      >
        <Flex
          direction="column"
          justify="center"
          gap="0.5em"
          width="12em"
          borderRight="1px solid #EEEEEE"
        >
          <Text fontWeight="600" color="#BBBBBB">
            Published on
          </Text>
          <Text fontSize="0.9em" color="#666666">
            {data.video.verified_date
              ? new Date(data.video.verified_date).toDateString()
              : "-"}
          </Text>
        </Flex>
        <Flex
          direction="column"
          justify="center"
          gap="0.5em"
          width="12em"
          borderRight="1px solid #EEEEEE"
        >
          <Text fontWeight="600" color="#BBBBBB">
            Views
          </Text>
          <Text fontSize="0.9em" color="#666666">
            {data.video.views}
          </Text>
        </Flex>
        <Flex
          direction="column"
          justify="center"
          gap="0.5em"
          width="12em"
          borderRight="1px solid #EEEEEE"
        >
          <Text fontWeight="600" color="#BBBBBB">
            Likes
          </Text>
          <Text fontSize="0.9em" color="#666666">
            {data.video.likes}
          </Text>
        </Flex>
        <Flex
          direction="column"
          justify="center"
          gap="0.5em"
          width="12em"
          borderRight="1px solid #EEEEEE"
        >
          <Text fontWeight="600" color="#BBBBBB">
            Uploaded On
          </Text>
          <Text fontSize="0.9em" color="#666666">
            {new Date(data.video.upload_date).toDateString()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}