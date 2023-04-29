import { FormattedDate } from "@app/components/misc/FormattedDate";
import { getPortal } from "@app/lib/client/getPortal";
import { Tr, Td, Flex, Icon, Image, Text, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { VideoTableFilters } from "./VideoTable";
import { VideoStatusBadge } from "../VideoStatusBadge";
import { VideoData } from "@app/lib/types/api";
import {
  deleteVideoBookmark,
  postVideoBookmark,
} from "@app/lib/client/api/bookmark";
import { showToast } from "@app/lib/client/showToast";
import { MouseEventHandler, useState } from "react";
import { toastMessages } from "@app/lib/types/toast";

type Props = {
  video: VideoData;
  // Hide columns if their filters are predefined (unmodifiable)
  // If this is the case, the columns would have a constant value, making them redundant
  filters: VideoTableFilters;
};

export const VideoTableRow = ({ video, filters }: Props) => {
  const router = useRouter();
  const showBookmarks = getPortal(router.pathname) === "admin";

  const {
    id,
    name,
    thumbnailUrl,
    createdDate,
    views,
    user: { name: userFullName },
    isBookmarkedByUser,
  } = video;

  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    !!isBookmarkedByUser
  );

  const handleOnClickBookmark: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    (async () => {
      try {
        if (isBookmarkedByUser) {
          await deleteVideoBookmark(id);
          setIsBookmarked(false);
          showToast({
            status: "success",
            description: toastMessages.bookmarkDeleted,
          });
        } else {
          await postVideoBookmark(id);
          setIsBookmarked(true);
          showToast({
            status: "success",
            description: toastMessages.bookmarkAdded,
          });
        }
      } catch (e) {
        console.error(e);
        showToast({ status: "error", description: "Something went wrong." });
      }
    })();
  };

  return (
    <Tr
      key={id}
      _hover={{ bgColor: "gray.50", cursor: "pointer" }}
      transition={"background-color 0.05s ease-in-out"}
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
                onClick={handleOnClickBookmark}
              >
                <Icon
                  as={isBookmarked ? BsBookmarkFill : BsBookmark}
                  fontSize={"lg"}
                />
              </Flex>
            )}
            {thumbnailUrl ? (
              <Image
                rounded={6}
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
        <VideoStatusBadge video={video} />
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
