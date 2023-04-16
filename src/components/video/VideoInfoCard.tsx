import { formatDate } from "@app/lib/client/formatDate";
import { FlexProps, Flex, Stack, Text } from "@chakra-ui/react";
import { Video } from "@prisma/client";
import { VerticalDivider } from "../misc/VerticalDivider";

export const VideoInfoCard = ({
  video: { verifiedDate, views, likes, uploadDate },
  ...props
}: { video: Video } & FlexProps) => (
  <Flex
    width="100%"
    height="5em"
    bgColor="white"
    border="1px solid #DDDDDD"
    borderRadius="lg"
    align="center"
    justify="space-between"
    padding="3.25em 2.5em"
    {...props}
  >
    <VideoInfoCardDetail
      label="Published On"
      value={verifiedDate ? formatDate(verifiedDate) : "-"}
    />
    <VerticalDivider />
    <VideoInfoCardDetail label="Views" value={views.toLocaleString()} />
    <VerticalDivider />
    <VideoInfoCardDetail label="Likes" value={likes.toLocaleString()} />
    <VerticalDivider />
    <VideoInfoCardDetail label="Uploaded On" value={formatDate(uploadDate)} />
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
    <Text fontWeight="600" color="#BBBBBB">
      {label}
    </Text>
    <Text fontSize="0.9em" color="#666666">
      {value}
    </Text>
  </Stack>
);
