import { Select } from "@app/components/input/Select";
import { fetchJson } from "@app/lib/client/fetchJson";
import { showToast } from "@app/lib/client/showToast";
import { rolePriority } from "@app/lib/types/api";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { User, UserRole } from "@prisma/client";
import { route } from "nextjs-routes";
import { useState } from "react";

type Props = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
};

export const UserUpdateModal = ({
  user: { id, name, role },
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>(name);
  const [userRole, setUserRole] = useState<UserRole>(role);

  const onSubmit = async () => {
    try {
      if (userName === name && userRole === role) {
        showToast({
          description: "No changes detected.",
        });
        return;
      }

      setIsLoading(true);

      const updateResp = await fetchJson({
        method: "POST",
        url: route({
          pathname: "/api/v1/users/[userId]",
          query: { userId: id },
        }),
        body: {
          data: {
            name: userName,
            role: userRole,
          },
        },
      });

      if (!updateResp.success) {
        throw Error(updateResp.error);
      }

      showToast({
        description: "Updated successfully.",
        status: "success",
      });

      onClose();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      showToast({
        description: "There was an error updating the user.",
        status: "error",
      });
    }
  };

  return (
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
            <FormControl isRequired>
              <FormLabel>Full name</FormLabel>
              <Input
                type="text"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
              {!userName && (
                <FormErrorMessage>Name is required</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>User role</FormLabel>
              <Select
                value={userRole}
                onChange={(role) => role && setUserRole(role as UserRole)}
                options={Object.values(UserRole)
                  .map((role) => ({
                    label: role,
                    value: role,
                  }))
                  // Sort in increasing priority
                  .sort(
                    (a, b) => rolePriority[a.value] - rolePriority[b.value]
                  )}
              />
            </FormControl>
          </Stack>
        </Stack>
        <ModalFooter>
          <Button onClick={onSubmit} isLoading={isLoading}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
