import { deleteVideoLike, postVideoLike } from "@app/lib/client/api/videoData";
import { formatDate } from "@app/lib/client/formatDate";
import { showToast } from "@app/lib/client/showToast";
import { VideoData } from "@app/lib/types/api";
import { Flex, Stack, Icon, Text, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BsCalendar } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { VideoPlayer } from "./VideoPlayer";
import { VideoVRTag } from "./VideoVRTag";

type Props = {
  video: VideoData;
};

export const VideoLayoutView = ({ video }: Props) => {
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
  const [numLikes, setNumLikes] = useState<number>(likes);
  const session = useSession();
  const router = useRouter();

  const handleOnClickLiked = async () => {
    if (session.status !== "authenticated") {
      router.push("/auth/signup");
      return;
    }
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
        <Text>{description || "No description provided"}</Text>
        {/* ------------------------------------ */}

        {/* ------------ Video likes ----------- */}
        <Flex gap={4} align="center" color="#999999">
          <Button
            onClick={handleOnClickLiked}
            isLoading={session.status === "loading"}
          >
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
