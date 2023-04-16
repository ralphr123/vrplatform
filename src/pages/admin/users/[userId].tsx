import { PageHeader } from "@app/components/admin/PageHeader";
import { useUser } from "@app/lib/client/hooks/api/useUser";
import {
  Divider,
  Flex,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsBookmark, BsTrash, BsCalendar } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FiVideo } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { Dropdown } from "@app/components/input/Dropdown";
import { VideoTable } from "@app/components/video/VideoTable";
import { User } from "@prisma/client";
import { useState } from "react";
import { formatDate } from "@app/lib/client/formatDate";
import { copyToClipboard } from "@app/lib/client/copyToClipboard";

export default function UserPage() {
  const router = useRouter();
  const { data, isLoading } = useUser(
    router.query["userId"] as string | undefined
  );

  const [isOpenUserDetailsModal, setIsOpenUserDetailsModal] = useState(false);

  if (isLoading || !data?.user) {
    return (
      <Flex width="100%" height="100%">
        <Spinner />
      </Flex>
    );
  }

  const {
    user: { id, email, name, registeredDate, lastLoginDate },
    totalViews,
    numVideosUploaded,
  } = data;

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
        label: "Add to bookmarks",
        icon: BsBookmark,
        onClick: () => {},
      },
    ],
    footer: [
      {
        label: "Permanently delete user",
        icon: BsTrash,
        onClick: () => {},
      },
    ],
  };

  return (
    <Stack width="100%" gap={5}>
      <UserDetailsModal
        user={data.user}
        totalViews={totalViews}
        numVideosUploaded={numVideosUploaded}
        isOpen={isOpenUserDetailsModal}
        onClose={() => setIsOpenUserDetailsModal(false)}
      />
      <Stack>
        <PageHeader>{name}</PageHeader>
        <Flex>
          {/* ------------ User data ------------ */}
          <Flex flexDirection="column">
            <Flex gap={4} align="center" color="#666666">
              {/* ------------ User actions ------------ */}
              <Flex gap={2} align="center" fontSize="0.9em">
                <Dropdown
                  text="User actions"
                  options={userActions.main}
                  footerOptions={userActions.footer}
                />
              </Flex>
              {/* ------------------------------------ */}

              <Text color="#DDDDDD">|</Text>

              {/* ----------- Videos count ------------ */}
              <Flex gap={2} align="center">
                <Icon as={FiVideo} fontSize="1.1em" />
                <Text fontSize="0.9em">6 videos</Text>
              </Flex>
              {/* ------------------------------------ */}

              <Text color="#DDDDDD">|</Text>

              {/* ---------- Registered date ---------- */}
              <Flex gap={2} align="center">
                <Icon as={BsCalendar} fontSize="1.1em" />
                <Text fontSize="0.9em">
                  Registered on {formatDate(registeredDate)}
                </Text>
              </Flex>
              {/* ------------------------------------ */}

              <Text color="#DDDDDD">|</Text>

              {/* ---------- Last login date ---------- */}
              <Flex gap={2} align="center">
                <Icon as={BsCalendar} fontSize="1.1em" />
                <Text fontSize="0.9em">
                  Last active on {formatDate(lastLoginDate)}
                </Text>
              </Flex>
              {/* ------------------------------------ */}
            </Flex>
          </Flex>
          {/* ------------------------------------ */}
        </Flex>
      </Stack>
      <VideoTable setUserId={id} />
    </Stack>
  );
}

const UserDetailsModal = ({
  user: { id, name, email, registeredDate, lastLoginDate },
  totalViews,
  numVideosUploaded,
  isOpen,
  onClose,
}: {
  user: User;
  totalViews: number;
  numVideosUploaded: number;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <Stack padding={10} gap={5}>
        <div>
          <Text fontSize="2xl" fontWeight={600}>
            {name}
          </Text>
          <Text color="#999999" fontSize="sm">
            {id}
          </Text>
        </div>
        <Stack gap={4}>
          <UserDetail label="Email address" value={email} />
          <Divider />
          <UserDetail
            label="Videos uploaded"
            value={numVideosUploaded.toLocaleString()}
          />
          <Divider />
          <UserDetail label="Total views" value={totalViews.toLocaleString()} />
          <Divider />
          <UserDetail
            label="Registered on"
            value={formatDate(registeredDate)}
          />
          <Divider />
          <UserDetail label="Last login on" value={formatDate(lastLoginDate)} />
          <Divider />
        </Stack>
      </Stack>
    </ModalContent>
  </Modal>
);

const UserDetail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Text color="#999999">{label}</Text>
    <Text fontWeight={600}>{value}</Text>
  </div>
);
