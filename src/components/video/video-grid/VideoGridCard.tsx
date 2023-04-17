import { formatDate } from "@app/lib/client/formatDate";
import { GridItem, Flex, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

type Props = {
  id: string;
  name: string;
  thumbnailUrl: string;
  createdDate: Date;
  views: number;
};

export const VideoGridCard = ({
  id,
  name,
  thumbnailUrl,
  createdDate,
  views,
}: Props) => {
  const router = useRouter();
  return (
    <GridItem
      rounded="lg"
      height="16em"
      overflow="hidden"
      _hover={{
        transform: "scale(1.01)",
        cursor: "pointer",
      }}
      transition="transform 0.1s"
      onClick={() => router.push(`/videos/${id}`)}
    >
      <Flex flexDirection="column" height="100%" width="100%">
        <Image
          src={thumbnailUrl}
          alt="video thumbnail"
          minHeight={0}
          flex={4}
          objectFit="cover"
          rounded="sm"
        />
        <Flex
          flexDirection="column"
          bgColor="white"
          flex={1}
          width="100%"
          padding={"1em"}
        >
          <Text fontWeight={700}>{name}</Text>
          <Flex align="center" color="gray.500" gap={3.5} fontSize="0.9em">
            <Text>{formatDate(createdDate)}</Text>
            <Text>{views} views</Text>
          </Flex>
        </Flex>
      </Flex>
    </GridItem>
  );
};
