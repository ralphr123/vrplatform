import { PageHeader } from "@app/components/admin/PageHeader";
import { useUser } from "@app/lib/client/hooks/api/useUser";
import { Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  BsBookmark,
  BsTrash,
  BsCalendar,
  BsGear,
  BsBookmarkFill,
} from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiVideo } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { Dropdown } from "@app/components/input/Dropdown";
import { VideoTable } from "@app/components/video/video-table/VideoTable";
import { UserRole } from "@prisma/client";
import { MouseEventHandler, useState } from "react";
import { formatDate } from "@app/lib/client/formatDate";
import { copyToClipboard } from "@app/lib/client/copyToClipboard";
import { PageInfo } from "@app/components/admin/PageInfo";
import { useSession } from "next-auth/react";
import { rolePriority } from "@app/lib/types/api";
import {
  deleteUserBookmark,
  postUserBookmark,
} from "@app/lib/client/api/bookmark";
import { showToast } from "@app/lib/client/showToast";
import { toastMessages } from "@app/lib/types/toast";
import { UserDetailsModal } from "@app/components/admin/user/UserDetailsModal";
import { UserUpdateModal } from "@app/components/admin/user/UserUpdateModal";

export default function UserPage() {
  const router = useRouter();
  const session = useSession();
  const { data, isLoading, refetchUser } = useUser(
    router.query["userId"] as string | undefined
  );

  const [isOpenUserDetailsModal, setIsOpenUserDetailsModal] = useState(false);
  const [isOpenUserUpdateModal, setIsOpenUserUpdateModal] = useState(false);

  if (isLoading || session.status === "loading") {
    return (
      <Flex width="100%" height="100%">
        <Spinner />
      </Flex>
    );
  }

  const currentUserRole = session.data?.user?.role;

  // Must be an admin user to access this page
  if (
    session.status === "unauthenticated" ||
    !currentUserRole ||
    rolePriority[currentUserRole] < rolePriority[UserRole.Admin]
  ) {
    router.push("/auth/signin");
    return null;
  }

  if (!data?.user) {
    return (
      <Flex width="100%" height="100%">
        <Text>User not found</Text>
      </Flex>
    );
  }

  const {
    user: {
      id,
      role,
      email,
      name,
      registeredDate,
      lastLoginDate,
      isBookmarkedByUser,
    },
    totalViews,
    numVideosUploaded,
  } = data;

  const handleOnClickBookmark: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    (async () => {
      try {
        if (isBookmarkedByUser) {
          await deleteUserBookmark(id);
          refetchUser();
          showToast({
            status: "success",
            description: toastMessages.bookmarkDeleted,
          });
        } else {
          await postUserBookmark(id);
          refetchUser();
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

  const userActions = {
    main: [
      {
        label: "View detailed information",
        icon: AiOutlineInfoCircle,
        onClick: () => setIsOpenUserDetailsModal(true),
      },
      {
        label: "Copy email address",
        icon: MdContentCopy,
        onClick: () => copyToClipboard(email),
      },
      {
        label: isBookmarkedByUser ? "Remove bookmark" : "Add to bookmarks",
        icon: isBookmarkedByUser ? BsBookmarkFill : BsBookmark,
        onClick: (e: any) => handleOnClickBookmark(e),
      },
      ...(rolePriority[currentUserRole] > rolePriority[role]
        ? [
            {
              label: "Modify user",
              icon: BsGear,
              onClick: () => setIsOpenUserUpdateModal(true),
            },
          ]
        : []),
    ],
    footer: [
      {
        label: "Permanently delete user",
        icon: BsTrash,
        onClick: () => {},
      },
    ],
  };

  const onCloseUserDetailsModal = () => {
    setIsOpenUserDetailsModal(false);
  };

  const onCloseUserUpdateModal = () => {
    setIsOpenUserUpdateModal(false);
    refetchUser();
  };

  return (
    <Stack width="100%" gap={5}>
      <UserDetailsModal
        user={data.user}
        totalViews={totalViews}
        numVideosUploaded={numVideosUploaded}
        isOpen={isOpenUserDetailsModal}
        onClose={onCloseUserDetailsModal}
      />
      <UserUpdateModal
        user={data.user}
        isOpen={isOpenUserUpdateModal}
        onClose={onCloseUserUpdateModal}
      />
      <Stack>
        <PageHeader>{name}</PageHeader>
        <Flex>
          {/* ------ User data / actions ------- */}
          <Flex flexDirection="column">
            <PageInfo
              items={[
                /* ------------ User actions ------------ */
                <Flex key={0} gap={2} align="center" fontSize="0.9em">
                  <Dropdown
                    text="User actions"
                    options={userActions.main}
                    footerOptions={userActions.footer}
                  />
                </Flex>,
                /* ------------ Videos count ------------ */
                <Flex key={1} gap={2} align="center">
                  <Icon as={FiVideo} fontSize="1.1em" />
                  <Text fontSize="0.9em">6 videos</Text>
                </Flex>,
                /* ---------- Registered date ----------- */
                <Flex key={2} gap={2} align="center">
                  <Icon as={BsCalendar} fontSize="1.1em" />
                  <Text fontSize="0.9em">
                    Registered on {formatDate(registeredDate)}
                  </Text>
                </Flex>,
                /* ---------- Last login date ----------- */
                <Flex key={3} gap={2} align="center">
                  <Icon as={BsCalendar} fontSize="1.1em" />
                  <Text fontSize="0.9em">
                    Last active on {formatDate(lastLoginDate)}
                  </Text>
                </Flex>,
              ]}
            />
          </Flex>
          {/* ------------------------------------ */}
        </Flex>
      </Stack>
      <VideoTable filters={{ userId: id }} />
    </Stack>
  );
}
