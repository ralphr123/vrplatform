import { Avatar, Button, Flex, Input } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Logo } from "./Logo";

export const Menu = () => {
  const session = useSession();
  const router = useRouter();
  const user = session?.data?.user;

  return (
    <Flex
      width="100vw"
      height="10vh"
      position="fixed"
      top={0}
      left={0}
      align="center"
      borderBottom="1px solid #F3F3F3"
      justify="space-between"
      padding="0 3em"
      bgColor="white"
      zIndex={2}
    >
      <Logo height="3.5em" width="8em" />
      <Input type="text" placeholder="Search" width="40em" />
      <Flex gap={4}>
        {user ? (
          <Button
            padding="2em 0.25em"
            rounded="3xl"
            onClick={() => router.push("/account/profile")}
          >
            <Flex
              align="center"
              justify="center"
              gap={4}
              padding="2em 1.5em"
              borderColor="inherit"
              h="65%"
              rounded="lg"
              fontWeight={500}
            >
              <Avatar
                name={user.name}
                src={user.image ?? undefined}
                size="sm"
              />
              My account
            </Flex>
          </Button>
        ) : (
          <>
            <Button flex={1} padding="1em 0.6em" bgColor="transparent">
              Sign in
            </Button>
            <Button flex={1} padding="1.1em 2.5em">
              Create account
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};
