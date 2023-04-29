import { getVideoStatus } from "@app/lib/client/api/getVideoStatus";
import { Badge, Spinner } from "@chakra-ui/react";
import { Video } from "@prisma/client";

type Props = { video?: Video; isLoading?: boolean };

export const VideoStatusBadge = ({ video, isLoading }: Props) => {
  if (!video) {
    return null;
  }

  const status = getVideoStatus(video!);

  let colorScheme;
  switch (status) {
    case "Failed":
      colorScheme = "red";
      break;
    case "Pending Review":
      colorScheme = "yellow";
      break;
    case "Private":
      colorScheme = "gray";
      break;
    case "Rejected":
      colorScheme = "red";
      break;
    case "Published":
      colorScheme = "green";
      break;
    // Still uploading
    case "Encoding":
      colorScheme = "blue";
      break;
  }

  return !isLoading ? (
    <Badge colorScheme={colorScheme} mr={2} p="0.25em 0.6em" rounded="sm">
      {status}
    </Badge>
  ) : (
    <Spinner size="xs" />
  );
};
