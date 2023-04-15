import { PageHeader } from "@app/components/admin/PageHeader";
import { useUser } from "@app/lib/client/hooks/api/useUser";
import { Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsBookmark, BsTrash, BsCalendar } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdContentCopy } from "react-icons/md";
import { Dropdown } from "@app/components/input/Dropdown";
import { VideoTable } from "@app/components/admin/tables/VideoTable";

export default function UserPage() {
  const router = useRouter();
  const { data, isLoading } = useUser(
    router.query["userId"] as string | undefined
  );

  if (isLoading || !data?.user) {
    return (
      <Flex width="100%" height="100%">
        <Spinner />
      </Flex>
    );
  }

  const { id, name, registeredDate, lastLoginDate } = data.user;

  return (
    <Stack width="100%" gap={5}>
      <Stack>
        <PageHeader>{name}</PageHeader>
        <Flex>
          {/* ------------ User data ------------ */}
          <Flex flexDirection="column">
            <Flex gap={4} align="center" color="#666666">
              <Flex gap={2} align="center" fontSize="0.9em">
                <Dropdown
                  text="User actions"
                  options={[
                    {
                      label: "View detailed information",
                      icon: AiOutlineInfoCircle,
                      onClick: () => {},
                    },
                    {
                      label: "Copy email address",
                      icon: MdContentCopy,
                      onClick: () => {},
                    },
                    {
                      label: "Add to bookmarks",
                      icon: BsBookmark,
                      onClick: () => {},
                    },
                  ]}
                  footerOptions={[
                    {
                      label: "Permanently delete user",
                      icon: BsTrash,
                      onClick: () => {},
                    },
                  ]}
                />
              </Flex>
              <Text color="#DDDDDD">|</Text>
              <Flex gap={2} align="center">
                <Icon as={HiOutlineUserCircle} fontSize="1.1em" />
                <Text fontSize="0.9em">6 videos</Text>
              </Flex>
              <Text color="#DDDDDD">|</Text>
              <Flex gap={2} align="center">
                <Icon as={BsCalendar} fontSize="1.1em" />
                <Text fontSize="0.9em">
                  Registered on {new Date(registeredDate).toDateString()}
                </Text>
              </Flex>
              <Text color="#DDDDDD">|</Text>
              <Flex gap={2} align="center">
                <Icon as={BsCalendar} fontSize="1.1em" />
                <Text fontSize="0.9em">
                  Last active on {new Date(lastLoginDate).toDateString()}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          {/* ------------------------------------ */}
        </Flex>
      </Stack>
      <VideoTable setUserId={id} />
    </Stack>
  );
}
