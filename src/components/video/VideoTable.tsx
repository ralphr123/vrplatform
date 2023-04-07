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
} from "@chakra-ui/react";
import { User, Video } from "@prisma/client";

export const VideoTable = ({
  videos,
  isLoading,
  isPublished = true,
}: {
  videos?: (Video & {
    user: User;
  })[];
  isLoading?: boolean;
  isPublished?: boolean;
}) => {
  return (
    <TableContainer width="100%">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th hidden={!isPublished}>Views</Th>
            <Th hidden={!isPublished}>Likes</Th>
            <Th>Duration</Th>
            <Th>Uploaded on</Th>
            <Th>Uploaded by</Th>
          </Tr>
        </Thead>
        <Tbody hidden={isLoading} fontSize="0.8em">
          {videos?.map(
            ({
              id,
              name,
              views,
              likes,
              duration_seconds,
              upload_date,
              user: { name: userFullName },
            }) => (
              <Tr key={id}>
                <Td width="25em">{name}</Td>
                <Td hidden={!isPublished}>{views}</Td>
                <Td hidden={!isPublished}>{likes}</Td>
                <Td>{duration_seconds}</Td>
                <Td>{new Date(upload_date).toDateString()}</Td>
                {/* @TODO: Should be a link to user page */}
                <Td>{userFullName}</Td>
              </Tr>
            )
          )}
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
  );
};
