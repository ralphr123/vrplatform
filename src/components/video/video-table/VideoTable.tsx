import { useVideos } from "@app/lib/client/hooks/api/useVideos";
import { useDebounce } from "@app/lib/client/hooks/useDebounce";
import { VideoStatus } from "@app/lib/types/api";
import {
  Flex,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Spinner,
  Text,
  Td,
} from "@chakra-ui/react";
import { VideoType } from "@prisma/client";
import { useState } from "react";
import { VideoTableFilters } from "./VideoTableFilters";
import { VideoTableRow } from "./VideoTableRow";

export type VideoTableFilters = {
  searchText?: string | false;
  status?: VideoStatus | false;
  type?: VideoType | false;
  createdAfterDate?: Date | false;
  userId?: string | false;
  onlyBookmarked?: boolean;
};

type Props = {
  onClickRow?: (videoId: string) => void;

  /**
   * If filter fields are passed as false, exlude from filter bar
   * If filter fields are passed as values, filter by these values and exclude from filter bar
   * Filter fields that are not passed will be included in the filter bar for the user
   * Essentially, the purpose is to allow the parent to:
   * * Pass predefined filters that the user, in turn, cannot touch
   * * Choose to disable certain filters
   */
  filters?: VideoTableFilters;
};

export const VideoTable = ({ filters = {}, onClickRow }: Props) => {
  const [searchText, setSearchText] = useState<string>();
  const [status, setStatus] = useState<VideoStatus>();
  const [type, setType] = useState<VideoType>();
  const [userId, setUserId] = useState<string>();
  const [createdAfterDate, setCreatedAfterDate] = useState<Date>();

  const debouncedSearchText = useDebounce(searchText, 300);

  const { data: { videos } = {}, isLoading } = useVideos({
    searchText: debouncedSearchText,
    type: filters.type ? filters.type : type,
    createdAfterDate: filters.createdAfterDate
      ? filters.createdAfterDate
      : createdAfterDate,
    userId: filters.userId ? filters.userId : userId,
    status: filters.status ? filters.status : status,
    onlyBookmarked: filters.onlyBookmarked,
  });

  return (
    <Flex flexDir="column" gap={5} padding={0}>
      <VideoTableFilters
        searchText={searchText}
        setSearchText={
          filters.searchText === undefined ? setSearchText : undefined
        }
        setStatus={filters.status === undefined ? setStatus : undefined}
        setType={filters.type === undefined ? setType : undefined}
        setCreatedAfterDate={
          filters.createdAfterDate === undefined
            ? setCreatedAfterDate
            : undefined
        }
        setUserId={filters.userId === undefined ? setUserId : undefined}
      />
      <TableContainer width="100%" bgColor="white" rounded={8}>
        {
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Video Name</Th>
                <Th>Views</Th>
                <Th hidden={!!filters.status}>Status</Th>
                <Th whiteSpace="nowrap">Uploaded on</Th>
                <Th whiteSpace="nowrap" hidden={!!filters.userId}>
                  Uploaded by
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            {videos?.length ? (
              <Tbody hidden={isLoading} fontSize="0.8em">
                {videos.map((video) => (
                  <VideoTableRow
                    key={video.id}
                    video={video}
                    filters={filters}
                    onClick={onClickRow}
                  />
                ))}
              </Tbody>
            ) : (
              <Tr>
                <Td
                  colSpan={6}
                  textAlign="center"
                  height="5em"
                  hidden={!!isLoading}
                >
                  <Text>No videos found.</Text>
                </Td>
              </Tr>
            )}
          </Table>
        }
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
