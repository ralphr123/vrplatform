import { getVideoStatus } from "@app/lib/types/api";
import { Badge, Spinner } from "@chakra-ui/react";
import { Video } from "@prisma/client";

type Props = { video?: Video; status?: string; isLoading?: boolean };

export const VideoStatusBadge = ({ video, status, isLoading }: Props) => {
  if (!video && !status) {
    return null;
  }

  const _status = status || getVideoStatus(video!);

  let colorScheme;
  switch (_status) {
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
    <Badge colorScheme={colorScheme} mr={2}>
      {_status}
    </Badge>
  ) : (
    <Spinner size="xs" />
  );
};
