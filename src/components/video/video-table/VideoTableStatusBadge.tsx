import { getVideoStatus } from "@app/lib/types/api";
import { Badge } from "@chakra-ui/react";
import { Video } from "@prisma/client";

type Props = { video: Video };

export const VideoTableStatusBadge = ({ video }: Props) => {
  const status = getVideoStatus(video);

  let colorScheme;
  switch (status) {
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
    default:
      colorScheme = "blue";
      break;
  }

  return (
    <Badge colorScheme={colorScheme} mr={2}>
      {status}
    </Badge>
  );
};
