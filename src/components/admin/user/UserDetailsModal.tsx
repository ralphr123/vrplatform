import { formatDate } from "@app/lib/client/formatDate";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Stack,
  Divider,
  Text,
} from "@chakra-ui/react";
import { User } from "@prisma/client";

type Props = {
  user: User;
  totalViews: number;
  numVideosUploaded: number;
  isOpen: boolean;
  onClose: () => void;
};

export const UserDetailsModal = ({
  user: { id, name, email, registeredDate, lastLoginDate },
  totalViews,
  numVideosUploaded,
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
