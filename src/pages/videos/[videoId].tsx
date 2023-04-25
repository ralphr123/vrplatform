import { VideoPlayer } from "@app/components/video/VideoPlayer";
import { VideoVRTag } from "@app/components/video/VideoVRTag";
import { useVideo } from "@app/lib/client/hooks/api/useVideo";
import { Button, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsCalendar } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { VideoGrid } from "@app/components/video/video-grid/VideoGrid";
import { formatDate } from "@app/lib/client/formatDate";
import { deleteVideoLike, postVideoLike } from "@app/lib/client/api/videoLike";
import { VideoData } from "@app/lib/types/api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { showToast } from "@app/lib/client/showToast";

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

  const { video } = data;

  return (
    <Stack gap={5}>
      <VideoCard video={video} />
      <Stack gap={5} pl={10} pb={10}>
        <Text fontSize="1.8em" fontWeight={500}>
          More videos to watch
        </Text>
        <VideoGrid />
      </Stack>
    </Stack>
  );
}

const VideoCard = ({ video }: { video: VideoData }) => {
  const {
    id,
    name,
    description,
    type,
    createdDate,
    user,
    hlsUrl,
    smoothStreamingUrl,
    dashUrl,
    blobUrl,
    likes,
    isLikedByUser,
  } = video;

  const [isLiked, setIsLiked] = useState<boolean>(!!isLikedByUser);
  const [numLikes, setNumLikes] = useState<number>(likes.length);

  const handleOnClickLiked = () => {
    (async () => {
      try {
        if (isLiked) {
          await deleteVideoLike(id);
          setIsLiked(false);
          setNumLikes(numLikes - 1);
        } else {
          await postVideoLike(id);
          setIsLiked(true);
          setNumLikes(numLikes + 1);
        }
      } catch (e) {
        showToast({
          description: "An error occurred while liking the video.",
        });
      }
    })();
  };

  return (
    <Flex
      width="100%"
      gap="1.5em"
      bgColor="white"
      height="min-content"
      padding={10}
      rounded="lg"
    >
      {/* ----------- Video player ----------- */}
      <Flex flex={6} width="100%" rounded="lg" overflow="hidden">
        <VideoPlayer
          id={id}
          name={name}
          type={type}
          hlsUrl={hlsUrl}
          smoothStreamingUrl={smoothStreamingUrl}
          dashUrl={dashUrl}
          blobUrl={blobUrl}
        />
      </Flex>
      {/* ------------------------------------ */}

      {/* ------------ Video info ------------ */}
      <Stack width="100%" rounded="lg" flex={2.75} gap={5}>
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
              <Text>{formatDate(createdDate)}</Text>
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
        <Text>{description}</Text>
        {/* ------------------------------------ */}

        {/* ------------ Video likes ----------- */}
        <Flex gap={4} align="center" color="#999999">
          <Button onClick={handleOnClickLiked}>
            <Flex gap={2} align="center" color="black">
              <Icon
                as={isLiked ? AiFillLike : AiOutlineLike}
                fontSize={"1.1em"}
              />
              <Text fontWeight={400}>Like</Text>
            </Flex>
          </Button>
          <Text color="#DDDDDD">|</Text>
          <Text fontSize="0.9em">{numLikes} likes</Text>
        </Flex>
        {/* ------------------------------------ */}
      </Stack>
      {/* ------------------------------------ */}
    </Flex>
  );
};
