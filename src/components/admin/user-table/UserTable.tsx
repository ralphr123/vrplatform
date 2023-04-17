import { Select } from "@app/components/input/Select";
import { useUsers } from "@app/lib/client/hooks/api/useUsers";
import { useDebounce } from "@app/lib/client/hooks/useDebounce";
import {
  Flex,
  Input,
  Stack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsCalendar } from "react-icons/bs";
import { UserTableRow } from "./UserTableRow";

export const UserTable = ({ verified = false }: { verified?: boolean }) => {
  const [searchText, setSearchText] = useState<string>();
  const [registeredAfterDate, setRegisteredAfterDate] = useState<Date>();

  const debouncedSearchText = useDebounce(searchText, 300);

  const { data: { users } = {}, isLoading } = useUsers({
    verified,
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
        <Stack flex={1}>
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
        </Stack>
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
              <UserTableRow key={user.id} user={user} />
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
