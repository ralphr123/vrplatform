import { getVideosStats } from "@app/lib/client/api/videoData";
import { formatDate } from "@app/lib/client/formatDate";
import { UserData } from "@app/lib/types/api";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Stack,
  Divider,
  Text,
} from "@chakra-ui/react";

type Props = {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
};

export const UserDetailsModal = ({
  user: { id, name, email, registeredDate, lastLoginDate, videos },
  isOpen,
  onClose,
}: Props) => (
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
            value={videos.length.toLocaleString()}
          />
          <Divider />
          <UserDetail
            label="Total views"
            value={getVideosStats(videos).views.toLocaleString()}
          />
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
