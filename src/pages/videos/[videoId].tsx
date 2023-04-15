import { VideoPlayer } from "@app/components/video/VideoPlayer";
import { VideoVRTag } from "@app/components/video/VideoVRTag";
import { useVideo } from "@app/lib/client/hooks/api/useVideo";
import { Button, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsCalendar } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { AiOutlineLike } from "react-icons/ai";
import { User, Video } from "@prisma/client";
import { VideoGrid } from "@app/components/VideoGrid";

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

  return (
    <Stack gap={5}>
      <VideoCard video={data.video} />
      <Stack gap={5} pl={10} pb={10}>
        <Text fontSize="1.8em" fontWeight={500}>
          More videos to watch
        </Text>
        <VideoGrid />
      </Stack>
    </Stack>
  );
}

const VideoCard = ({
  video,
}: {
  video: Video & {
    user: User;
  };
}) => {
  const { name, uploadDate, user, type, likes } = video;

  return (
    <Flex
      width="100%"
      gap="1.5em"
      bgColor="white"
      height="min-content"
      padding={10}
      borderRadius="lg"
    >
      {/* ----------- Video player ----------- */}
      <Flex flex={6} width="100%" borderRadius="lg" overflow="hidden">
        {/* <VideoPlayer name={video.name} hlsUrl={video.hlsUrl} /> */}
        <Flex
          height="450px"
          minWidth="100%"
          borderRadius="lg"
          bgColor="#87B0F5"
        ></Flex>
      </Flex>
      {/* ------------------------------------ */}

      {/* ------------ Video info ------------ */}
      <Stack width="100%" borderRadius="lg" flex={2.75} gap={5}>
        {/* ------------ Video data ------------ */}
        <Flex flexDirection="column">
          <Text fontSize="1.8em" fontWeight={500}>
            {name}
          </Text>
          <Flex gap={4} align="center" color="#666666">
            {type === "VR" && (
              <>
                <VideoVRTag />
                <Text color="#DDDDDD">|</Text>
              </>
            )}
            <Flex gap={2} align="center" fontSize="0.9em">
              <Icon as={BsCalendar} />
              <Text>{new Date(uploadDate).toDateString()}</Text>
            </Flex>
            <Text color="#DDDDDD">|</Text>
            <Flex gap={2} align="center">
              <Icon as={HiOutlineUserCircle} fontSize="1.1em" />
              <Text fontSize="0.9em">{user.name}</Text>
            </Flex>
          </Flex>
        </Flex>
        {/* ------------------------------------ */}

        {/* ------------ Video desc ------------ */}
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          consectetur, nisl nec ultricies lacinia, nunc nisl aliquet nunc, vel
          tincidunt nunc nisl eget nunc. Donec euismod, nisl ut aliquam
          consectetur, nunc nisl aliquet nunc, vel tincidunt nunc nisl eget
          nunc.
        </Text>
        {/* ------------------------------------ */}

        {/* ------------ Video likes ----------- */}
        <Flex gap={4} align="center" color="#999999">
          <Button bgColor="#f3f3f3">
            <Flex gap={2} align="center" color="black">
              <Icon as={AiOutlineLike} fontSize={"1.1em"} />
              <Text fontWeight={400}>Like</Text>
            </Flex>
          </Button>
          <Text color="#DDDDDD">|</Text>
          <Text fontSize="0.9em">{likes} likes</Text>
        </Flex>
        {/* ------------------------------------ */}
      </Stack>
      {/* ------------------------------------ */}
    </Flex>
  );
};
