import { FormattedDate } from "@app/components/misc/FormattedDate";
import { getPortal } from "@app/lib/client/getPortal";
import { Tr, Td, Flex, Icon, Image, Text, Spinner } from "@chakra-ui/react";
import { Video } from "@prisma/client";
import { User } from "next-auth";
import { useRouter } from "next/router";
import { BsBookmark } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { VideoTableFilters } from "./VideoTable";
import { VideoTableStatusBadge } from "./VideoTableStatusBadge";

type Props = {
  video: Video & {
    user: User;
  };
  // Hide columns if their filters are predefined (unmodifiable)
  // If this is the case, the columns would have a constant value, making them redundant
  filters: VideoTableFilters;
};

export const VideoTableRow = ({ video, filters }: Props) => {
  const router = useRouter();
  const views = 0;
  const showBookmarks = getPortal(router.pathname) === "admin";

  const {
    id,
    name,
    thumbnailUrl,
    createdDate,
    user: { name: userFullName },
  } = video;

  return (
    <Tr
      key={id}
      _hover={{ bgColor: "gray.50", cursor: "pointer" }}
      onClick={() => router.push(`/admin/videos/${id}`)}
    >
      <Td width={2}>
        <Flex align="center" gap={3.5}>
          <Flex align={"center"} gap={5}>
            {showBookmarks && (
              <Flex
                align="center"
                justify="center"
                height={10}
                width={7}
                rounded={3}
                _hover={{ cursor: "pointer", bgColor: "gray.100" }}
                transition={"all 0.1s ease-in-out"}
                onClick={(e) => e.stopPropagation()}
              >
                <Icon as={BsBookmark} fontSize={"lg"} />
              </Flex>
            )}
            {thumbnailUrl ? (
              <Image
                rounded={6}
                // width="18em"
                minWidth={"6em"}
                maxWidth={"9em"}
                height={"5.5em"}
                objectFit="cover"
                src={thumbnailUrl}
                alt={`${name} thumbnail`}
              />
            ) : (
              <Flex
                rounded={6}
                width={"9em"}
                height={"5.5em"}
                align="center"
                justify="center"
              >
                <Spinner size="xs" />
              </Flex>
            )}
          </Flex>
          <Flex flexDir={"column"}>
            <Text fontWeight={700}>{name}</Text>
            <Text fontSize="smaller" color="gray.400">
              {id}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>{views}</Td>
      <Td paddingRight={0} hidden={!!filters.status}>
        <VideoTableStatusBadge video={video} />
      </Td>
      <Td whiteSpace="nowrap">
        <FormattedDate dateObj={createdDate} />
      </Td>
      <Td paddingRight={0} hidden={!!filters.userId}>
        <Flex align="center" gap={1.5}>
          <Icon as={HiOutlineUserCircle} /> {userFullName}
        </Flex>
      </Td>
      <Td padding={0}>
        <Icon fontSize={20} as={IoIosArrowForward} color="gray.500" />
      </Td>
    </Tr>
  );
};
