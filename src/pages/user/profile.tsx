import { getFirstAndLastName } from "@app/lib/client/getFirstAndLastName";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
  const session = useSession();
  const [isErrorFirstName, setIsErrorFirstName] = useState<boolean>(false);
  const [newFirstName, setNewFirstName] = useState<string>();
  const [newLastName, setNewLastName] = useState<string>();

  if (session.status === "loading") {
    return (
      <Flex width="100%" height="50%" align="center" justify="center">
        <Spinner />
      </Flex>
    );
  }

  // Redirect is handled in UserMenu.tsx
  if (!session.data?.user) {
    return null;
  }

  const { name, email } = session.data.user;
  const [firstName, lastName] = getFirstAndLastName(name);

  return (
    <Stack width="100%" gap={6}>
      <Text fontSize="3xl" fontWeight={600}>
        My Account
      </Text>
      {/* ------------ Update profile ------------ */}
      <Stack gap={4}>
        <Grid
          width="100%"
          templateColumns="repeat(auto-fill, minmax(45%, 1fr))"
          gridGap={5}
        >
          <GridItem>
            <FormControl isInvalid={isErrorFirstName}>
              <FormLabel>First name</FormLabel>
              <Input
                type="text"
                defaultValue={firstName}
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
              <FormErrorMessage hidden={!isErrorFirstName}>
                Email is required.
              </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Last name</FormLabel>
              <Input
                type="text"
                defaultValue={lastName}
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="text" value={email} disabled={true} />
              <FormHelperText fontSize="sm" ml={1}>
                Email address cannot be changed.
              </FormHelperText>
            </FormControl>
          </GridItem>
        </Grid>
        <Flex width="100%">
          <Button>Update profile</Button>
        </Flex>
      </Stack>
      {/* ------------------------------------ */}

      <Divider />

      {/* ------------ Change password ------------ */}
      <Flex width="100%" justify="space-between">
        <Stack>
          <Text fontSize="xl" fontWeight={600}>
            Change password
          </Text>
          <Text fontSize="sm" color="#999999">
            You will be sent an email with instructions on how to change your
            password.
          </Text>
        </Stack>
        <Button width="11em">Change password</Button>
      </Flex>
      {/* ------------------------------------ */}

      <Divider />

      {/* ------------ Delete account ------------ */}
      <Flex width="100%" justify="space-between">
        <Stack>
          <Text fontSize="xl" fontWeight={600}>
            Delete account
          </Text>
          <Text fontSize="sm" color="#999999">
            All your data will be deleted. This action is irreversible.
          </Text>
        </Stack>
        <Button colorScheme="red" width="11em">
          Delete account
        </Button>
      </Flex>
      {/* ------------------------------------ */}

      <Divider />
    </Stack>
  );
}
