import { useVideos } from "@app/lib/client/hooks/api/useVideos";
import { Flex, Grid, GridItem, Image, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const VideoGrid = () => {
  const { data: { videos } = {}, isLoading } = useVideos({});

  return (
    <Grid
      width="100%"
      templateColumns="repeat(auto-fill, minmax(18em, 1fr))"
      gridGap={5}
    >
      {videos ? (
        videos.map(({ id, name, thumbnailUrl, uploadDate, views }) => (
          <VideoCard
            id={id}
            key={name}
            name={name}
            thumbnailUrl={thumbnailUrl}
            uploadDate={new Date(uploadDate)}
            views={views}
          />
        ))
      ) : (
        <Spinner />
      )}
    </Grid>
  );
};

const VideoCard = ({
  id,
  name,
  thumbnailUrl,
  uploadDate,
  views,
}: {
  id: string;
  name: string;
  thumbnailUrl: string;
  uploadDate: Date;
  views: number;
}) => {
  const router = useRouter();
  return (
    <GridItem
      borderRadius="lg"
      height="16em"
      overflow="hidden"
      _hover={{
        transform: "scale(1.01)",
        cursor: "pointer",
      }}
      transition="transform 0.1s"
      onClick={() => router.push(`/admin/videos/${id}`)}
    >
      <Flex flexDirection="column" height="100%" width="100%">
        <Image
          src={thumbnailUrl}
          alt="video thumbnail"
          minHeight={0}
          flex={4}
          objectFit="cover"
          borderRadius="sm"
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
            <Text>{uploadDate.toDateString()}</Text>
            <Text>{views} views</Text>
          </Flex>
        </Flex>
      </Flex>
    </GridItem>
  );
};
