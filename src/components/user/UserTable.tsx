import { useUsers } from "@app/lib/client/hooks/api/useUsers";
import { useDebounce } from "@app/lib/client/hooks/useDebounce";
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
  Avatar,
} from "@chakra-ui/react";
import { User, Video } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsBookmark, BsBookmarkFill, BsCalendar } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { Select } from "../Select";

export const UserTable = ({
  pendingReview = false,
}: {
  pendingReview?: boolean;
}) => {
  const [searchText, setSearchText] = useState<string>();
  const [registeredAfterDate, setRegisteredAfterDate] = useState<Date>();

  const debouncedSearchText = useDebounce(searchText, 300);

  const { data: { users } = {}, isLoading } = useUsers({
    pendingReview,
    searchText: debouncedSearchText,
    registeredAfterDate,
  });

  return (
    <Flex flexDir="column" gap={5}>
      <Flex align="center" justify="space-between" gap={5}>
        <Input
          type="text"
          placeholder="Search by name, email, or id"
          flex={1}
          bgColor="white"
          value={searchText}
          onChange={({ target: { value } }) => setSearchText(value)}
        />
        <Flex flex={1}>
          <Select
            options={[
              { label: "All time", value: "" },
              { label: "Today", value: "1" },
              { label: "Last 7 days", value: "7" },
              { label: "Last 30 days", value: "30" },
              { label: "Last 90 days", value: "90" },
              { label: "Last 365 days", value: "365" },
            ]}
            onChange={(value) => {
              if (value) {
                const _createdAfterDate = new Date();
                _createdAfterDate.setDate(
                  _createdAfterDate.getDate() - Number(value)
                );

                setRegisteredAfterDate(_createdAfterDate);
              } else {
                setRegisteredAfterDate(undefined);
              }
            }}
            defaultIcon={BsCalendar}
          />
        </Flex>
      </Flex>
      <TableContainer width="100%" bgColor="white" rounded={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Videos</Th>
              <Th>Total views</Th>
              <Th>Last login</Th>
              <Th>Registered on</Th>
              {/* Right arrow */}
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody hidden={isLoading} fontSize="0.8em">
            {users?.map((user) => (
              <VideoTableRow key={user.id} user={user} />
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
  user: { id, name, image, registeredDate, lastLoginDate, videos },
}: {
  user: User & { videos: Video[] };
}) => {
  const router = useRouter();

  return (
    <Tr
      key={id}
      _hover={{ bgColor: "gray.50", cursor: "pointer" }}
      onClick={() => router.push(`/admin/users/${id}`)}
    >
      <Td width={2}>
        <Flex align="center" gap={4}>
          <Flex align={"center"} gap={4}>
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
            <Avatar name={name} src={image ?? undefined} />
          </Flex>
          <Flex flexDir={"column"}>
            <Text fontWeight={700}>{name}</Text>
            <Text fontSize="smaller" color="gray.400">
              {id}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>{videos.length}</Td>
      <Td>{videos.reduce((acc, video) => acc + video.views, 0)}</Td>
      <Td>{lastLoginDate ? new Date(lastLoginDate)?.toDateString() : ""}</Td>
      <Td>{registeredDate ? new Date(registeredDate)?.toDateString() : ""}</Td>
      <Td>
        <Icon fontSize={20} as={IoIosArrowForward} color="gray.500" />
      </Td>
    </Tr>
  );
};
