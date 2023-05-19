import { VideoData } from "@app/lib/types/api";
import { Flex, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";

type Props = {
  video: VideoData;
  onClick?: () => void;
};

export const MenuSearchItem = ({
  video: { id, name, description, thumbnailUrl },
  onClick,
}: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push({ pathname: "/videos/[videoId]", query: { videoId: id } });
    onClick?.();
  };

  return (
    <Flex
      padding="1em"
      gap={5}
      rounded="md"
      onClick={handleClick}
      align="center"
      _hover={{ bgColor: "gray.100", cursor: "pointer" }}
    >
      <Image
        src={thumbnailUrl || undefined}
        alt="video thumbnail"
        height="3.5em"
        width="5.5em"
        objectFit="cover"
        rounded="md"
      />
      <div>
        <Text fontWeight={500}>{name}</Text>
        <Text color="gray.600">
          {description
            ? description.length > 50
              ? description?.slice(0, 50) + "..."
              : description
            : "No description."}
        </Text>
      </div>
    </Flex>
  );
};
