import { formatDate } from "@app/lib/client/formatDate";
import { VideoData } from "@app/lib/types/api";
import { FlexProps, Flex, Stack, Text } from "@chakra-ui/react";
import { VerticalDivider } from "../misc/VerticalDivider";

export const VideoInfoCard = ({
  video: { reviewedDate, createdDate, views, likes },
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
    <VideoInfoCardDetail label="Likes" value={likes.toLocaleString()} />
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
