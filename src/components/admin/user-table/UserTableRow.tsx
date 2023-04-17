import { formatDate } from "@app/lib/client/formatDate";
import { Tr, Td, Flex, Icon, Avatar, Text } from "@chakra-ui/react";
import { User, Video } from "@prisma/client";
import { useRouter } from "next/router";
import { BsBookmark } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";

type Props = {
  user: User & { videos: Video[] };
};

export const UserTableRow = ({
  user: { id, name, image, registeredDate, lastLoginDate, videos },
}: Props) => {
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
      {/* @TODO: Fix views */}
      <Td>{videos.reduce((acc, video) => acc + 0, 0)}</Td>
      <Td>{formatDate(lastLoginDate)}</Td>
      <Td>{formatDate(registeredDate)}</Td>
      <Td>
        <Icon fontSize={20} as={IoIosArrowForward} color="gray.500" />
      </Td>
    </Tr>
  );
};
