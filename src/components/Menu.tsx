import { Avatar, Button, Flex, Icon, Input } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiLogOut } from "react-icons/fi";
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
      <Flex gap={4} align="center">
        {user ? (
          <>
            <Link href="/auth/signout">
              <Flex
                align="center"
                justify="center"
                transition="0.15s ease-in-out"
                _hover={{ bgColor: "gray.100" }}
                padding="0.75em"
                rounded="md"
              >
                <Icon as={FiLogOut} fontSize="1.5em" color="black" />
              </Flex>
            </Link>
            <Flex
              rounded="50%"
              height="3.75em"
              width="3.75em"
              align="center"
              justify="center"
              onClick={() => router.push("/account/profile")}
              cursor="pointer"
              _hover={{ bgColor: "gray.100" }}
              transition="0.15s ease-in-out"
            >
              <Avatar
                name={user.name}
                src={user.image ?? undefined}
                size="md"
              />
            </Flex>
          </>
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
