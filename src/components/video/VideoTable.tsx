import { formatDate } from "@app/lib/client/formatDate";
import { useVideos } from "@app/lib/client/hooks/api/useVideos";
import { useDebounce } from "@app/lib/client/hooks/useDebounce";
import { getVideoStatus, VideoStatus } from "@app/lib/types/api";
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
  Badge,
} from "@chakra-ui/react";
import { User, Video, VideoType } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsBookmark, BsBookmarkFill, BsCalendar } from "react-icons/bs";
import { FiEye, FiEyeOff, FiFilter, FiUpload, FiX } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { MdOndemandVideo, MdOutlinePending } from "react-icons/md";
import { Select } from "../input/Select";
import { FormattedDate } from "../misc/FormattedDate";

type Props = {
  /**
   * If filter fields are passed as false, exlude from filter bar
   * If filter fields are passed as values, filter by these values and exclude from filter bar
   * Filter fields that are not passed will be included in the filter bar for the user
   * Essentially, the purpose is to allow the parent component to:
   * * Pass predefined filters that the user, in turn, cannot change
   * * Choose to disable certain filter fields
   */
  filters?: {
    searchText?: string | false;
    status?: VideoStatus | false;
    type?: VideoType | false;
    createdAfterDate?: Date | false;
    userId?: string | false;
  };
};

export const VideoTable = ({ filters = {} }: Props) => {
  const [searchText, setSearchText] = useState<string>();
  const [status, setStatus] = useState<VideoStatus>();
  const [type, setType] = useState<VideoType>();
  const [createdAfterDate, setCreatedAfterDate] = useState<Date>();

  const debouncedSearchText = useDebounce(searchText, 300);

  const { data: { videos } = {}, isLoading } = useVideos({
    searchText: debouncedSearchText,
    type: filters.type ? filters.type : type,
    createdAfterDate: filters.createdAfterDate
      ? filters.createdAfterDate
      : createdAfterDate,
    userId: filters.userId ? filters.userId : undefined,
    status: filters.status ? filters.status : status,
  });

  return (
    <Flex flexDir="column" gap={5} padding={0}>
      <VideoTableFilters
        searchText={searchText}
        setSearchText={filters.searchText !== false ? setSearchText : undefined}
        setStatus={filters.status !== false ? setStatus : undefined}
        setType={filters.type !== false ? setType : undefined}
        setCreatedAfterDate={
          filters.createdAfterDate !== false ? setCreatedAfterDate : undefined
        }
      />
      <TableContainer width="100%" bgColor="white" rounded={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Video Name</Th>
              <Th>Views</Th>
              <Th>Status</Th>
              <Th whiteSpace="nowrap">Uploaded on</Th>
              <Th whiteSpace="nowrap" hidden={!!filters.userId}>
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
                userId={filters.userId ? filters.userId : undefined}
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
  video,
  pendingReview,
  userId,
}: {
  video: Video & {
    user: User;
  };
  pendingReview?: boolean;
  userId?: string;
}) => {
  const router = useRouter();
  const views = 0;

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
                minWidth={32}
                maxWidth={32}
                bgColor="#87b0f5"
              ></Flex>
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
      <Td hidden={pendingReview}>{views}</Td>
      <Td paddingRight={0}>
        <VideoTableStatusBadge video={video} />
      </Td>
      <Td whiteSpace="nowrap">
        <FormattedDate dateObj={createdDate} />
      </Td>
      <Td paddingRight={0} hidden={!!userId}>
        {userFullName}
      </Td>
      <Td padding={0}>
        <Icon fontSize={20} as={IoIosArrowForward} color="gray.500" />
      </Td>
    </Tr>
  );
};

const VideoTableFilters = ({
  searchText,
  setSearchText,
  setStatus,
  setType,
  setCreatedAfterDate,
  setUserId,
}: {
  searchText?: string;
  setSearchText?: (value: string) => void;
  setStatus?: (value: VideoStatus) => void;
  setType?: (value: VideoType) => void;
  setCreatedAfterDate?: (value?: Date) => void;
  setUserId?: string;
}) => {
  return (
    <Flex align="center" justify="space-between" gap={2} maxWidth="100%">
      {setSearchText && (
        <Input
          type="text"
          placeholder="Search by name or id"
          flex={1}
          bgColor="white"
          value={searchText}
          onChange={({ target: { value } }) => setSearchText(value)}
        />
      )}
      {setType && (
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
      )}
      {setCreatedAfterDate && (
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
      )}
      {setStatus && (
        <Stack flex={1}>
          <Select
            options={[
              { label: "All statuses", value: "" },
              { label: "Published", value: "Published", icon: FiEye },
              { label: "Private", value: "Private", icon: FiEyeOff },
              { label: "Rejected", value: "Rejected", icon: FiX },
              {
                label: "Pending Review",
                value: "Pending Review",
                icon: MdOutlinePending,
              },
              { label: "Uploading", value: "Uploading", icon: FiUpload },
            ]}
            onChange={(value) => setStatus(value as VideoStatus)}
            defaultIcon={FiFilter}
          />
        </Stack>
      )}
      {setUserId && (
        <Stack flex={1}>
          <Select
            options={[{ label: "All users", value: "" }]}
            defaultIcon={HiOutlineUserCircle}
            isSearchable
          />
        </Stack>
      )}
    </Flex>
  );
};

const VideoTableStatusBadge = ({ video }: { video: Video }) => {
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
