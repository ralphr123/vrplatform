import { formatDate } from "@app/lib/client/formatDate";
import { useVideos } from "@app/lib/client/hooks/api/useVideos";
import { useDebounce } from "@app/lib/client/hooks/useDebounce";
import { videoTypes, videoTypeToIcon } from "@app/lib/types/prisma";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Spinner,
  Flex,
  Icon,
  Image,
  Text,
  Input,
  Stack,
} from "@chakra-ui/react";
import { User, Video, VideoType } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsBookmark, BsBookmarkFill, BsCalendar } from "react-icons/bs";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { MdOndemandVideo } from "react-icons/md";
import { Select } from "../../input/Select";

export const VideoTable = ({
  pendingReview = false,
  setUserId,
}: {
  pendingReview?: boolean;
  setUserId?: string;
}) => {
  const [searchText, setSearchText] = useState<string>();
  const [type, setType] = useState<VideoType>();
  const [uploadedAfterDate, setCreatedAfterDate] = useState<Date>();

  const debouncedSearchText = useDebounce(searchText, 300);

  const { data: { videos } = {}, isLoading } = useVideos({
    pendingReview,
    searchText: debouncedSearchText,
    type,
    uploadedAfterDate,
    userId: setUserId,
  });

  return (
    <Flex flexDir="column" gap={5} padding={0}>
      <Flex align="center" justify="space-between" gap={5} maxWidth="100%">
        <Input
          type="text"
          placeholder="Search by name or id"
          flex={1}
          bgColor="white"
          value={searchText}
          onChange={({ target: { value } }) => setSearchText(value)}
        />
        <Stack flex={1}>
          <Select
            options={[
              { value: "", label: "All videos", icon: MdOndemandVideo },
              ...videoTypes.map((videoType: VideoType) => ({
                value: videoType,
                label: videoType,
                icon: videoTypeToIcon[videoType],
              })),
            ]}
            onChange={(value) => setType(value as VideoType)}
          />
        </Stack>
        <Stack flex={1}>
          <Select
            options={[
              { label: "All time", value: "" },
              { label: "Today", value: "1" },
              { label: "Last 7 days", value: "7" },
              { label: "Last 30 days", value: "30" },
            ]}
            onChange={(value) => {
              if (value) {
                const _createdAfterDate = new Date();
                _createdAfterDate.setDate(
                  _createdAfterDate.getDate() - Number(value)
                );

                setCreatedAfterDate(_createdAfterDate);
              } else {
                setCreatedAfterDate(undefined);
              }
            }}
            defaultIcon={BsCalendar}
          />
        </Stack>
        {!setUserId && (
          <Stack flex={1}>
            <Select
              options={[{ label: "All users", value: "" }]}
              defaultIcon={HiOutlineUserCircle}
              isSearchable
            />
          </Stack>
        )}
      </Flex>
      <TableContainer
        width="100%"
        bgColor="white"
        rounded={8}
        whiteSpace="normal"
        overflowX={undefined}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Video Name</Th>
              <Th hidden={pendingReview}>Views</Th>
              <Th hidden={pendingReview}>Likes</Th>
              <Th>Duration</Th>
              <Th whiteSpace="nowrap">Uploaded on</Th>
              <Th whiteSpace="nowrap" hidden={!!setUserId}>
                Uploaded by
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody hidden={isLoading} fontSize="0.8em">
            {videos?.map((video) => (
              <VideoTableRow
                key={video.id}
                video={video}
                setUserId={setUserId}
                pendingReview={pendingReview}
              />
            ))}
          </Tbody>
        </Table>
        <Flex
          hidden={!isLoading}
          width="90%"
          height="5em"
          align="center"
          justify="center"
        >
          <Spinner />
        </Flex>
      </TableContainer>
    </Flex>
  );
};

const VideoTableRow = ({
  video: {
    id,
    name,
    views,
    likes,
    thumbnailUrl,
    duration_seconds,
    uploadDate,
    user: { name: userFullName },
  },
  pendingReview = false,
  setUserId,
}: {
  video: Video & {
    user: User;
  };
  pendingReview?: boolean;
  setUserId?: string;
}) => {
  const router = useRouter();

  return (
    <Tr
      key={id}
      _hover={{ bgColor: "gray.50", cursor: "pointer" }}
      onClick={() => router.push(`/admin/videos/${id}`)}
    >
      <Td width={2}>
        <Flex align="center" gap={3}>
          <Flex align={"center"} gap={5}>
            {!pendingReview && (
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
            <Image
              rounded={6}
              minWidth={32}
              maxWidth={32}
              src={thumbnailUrl}
              alt={`${name} thumbnail`}
            />
          </Flex>
          <Flex flexDir={"column"}>
            <Text fontWeight={700}>{name}</Text>
            <Text fontSize="smaller" color="gray.400">
              {id}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td hidden={pendingReview}>{views}</Td>
      <Td hidden={pendingReview}>{likes}</Td>
      <Td>{duration_seconds}s</Td>
      <Td whiteSpace="nowrap">{formatDate(uploadDate)}</Td>
      <Td hidden={!!setUserId}>{userFullName}</Td>
      <Td>
        <Icon fontSize={20} as={IoIosArrowForward} color="gray.500" />
      </Td>
    </Tr>
  );
};
