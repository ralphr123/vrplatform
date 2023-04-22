import { formatDate } from "@app/lib/client/formatDate";
import { VideoData } from "@app/pages/api/v1/videos";
import { FlexProps, Flex, Stack, Text } from "@chakra-ui/react";
import { Video } from "@prisma/client";
import { VerticalDivider } from "../misc/VerticalDivider";

// @TODO: Add views, and likes
export const VideoInfoCard = ({
  video: { reviewedDate, createdDate, views },
  ...props
}: { video: VideoData } & FlexProps) => (
  <Flex
    width="100%"
    height="5em"
    bgColor="white"
    border="1px solid #DDDDDD"
    rounded="lg"
    align="center"
    justify="space-between"
    padding="3.25em 2.5em"
    {...props}
  >
    <VideoInfoCardDetail
      label="Published On"
      value={reviewedDate ? formatDate(reviewedDate) : "-"}
    />
    <VerticalDivider />
    <VideoInfoCardDetail label="Views" value={views.toLocaleString()} />
    <VerticalDivider />
    <VideoInfoCardDetail label="Likes" value={"0"} />
    <VerticalDivider />
    <VideoInfoCardDetail label="Uploaded On" value={formatDate(createdDate)} />
  </Flex>
);

export const VideoInfoCardDetail = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <Stack justify="center" width="12em">
    <Text fontWeight="600" color="#999999">
      {label}
    </Text>
    <Text fontSize="0.9em" color="#666666">
      {value}
    </Text>
  </Stack>
);
