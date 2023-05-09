import { fetchJson } from "@app/lib/client/fetchJson";
import { showToast } from "@app/lib/client/showToast";
import { rolePriority } from "@app/lib/types/api";
import {
  Avatar,
  Button,
  Center,
  Flex,
  Icon,
  Input,
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { Logo } from "./Logo";

const UNVERIFIED_BANNER_HEIGHT = "2.5em";

const sendVerificationEmail = async () =>
  await fetchJson({
    method: "POST",
    url: "/api/v1/auth/send-verification-email",
  });

type QueryParams = {
  successfullyVerified?: string;
};

export const Menu = () => {
  const session = useSession();
  const router = useRouter();
  const { successfullyVerified } = router.query as QueryParams;

  const user = session?.data?.user;

  const isUnverifiedUser = !!user && !user.emailVerified;
  const [isOpenVerificationBanner, setIsOpenVerificationBanner] =
    useState<boolean>(isUnverifiedUser);

  useEffect(() => {
    if (isUnverifiedUser) {
      // Send verification email if unsent
      if (!user.emailVerificationToken) {
        sendVerificationEmail();
      }

      // Send verification email if user has not yet been sent one
      setIsOpenVerificationBanner(true);
    }
  }, [isUnverifiedUser, user?.emailVerificationToken]);

  // Handle query params
  useEffect(() => {
    if (successfullyVerified === "true") {
      showToast({
        status: "success",
        description: "Email successfully verified.",
      });

      router.push("/");
    }
  }, [successfullyVerified, router]);

  if (session.status === "loading") {
    return (
      <Center w="100%">
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <UnverifiedUserBanner
        show={isOpenVerificationBanner && successfullyVerified !== "true"}
        onClose={() => setIsOpenVerificationBanner(false)}
      />
      <Flex
        width="100vw"
        height="10vh"
        position="fixed"
        top={isOpenVerificationBanner ? UNVERIFIED_BANNER_HEIGHT : 0}
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
              {rolePriority[user.role] >= rolePriority[UserRole.Admin] && (
                <Link href="/admin">
                  <Flex
                    align="center"
                    justify="center"
                    transition="0.15s ease-in-out"
                    _hover={{ bgColor: "gray.100" }}
                    padding="0.75em"
                    rounded="md"
                  >
                    <Icon as={RiAdminLine} fontSize="1.5em" color="black" />
                  </Flex>
                </Link>
              )}
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
              <Button
                flex={1}
                padding="1em 0.6em"
                bgColor="transparent"
                onClick={() => router.push("/auth/signin")}
              >
                Sign in
              </Button>
              <Button
                flex={1}
                padding="1.1em 2.5em"
                onClick={() => router.push("/auth/signup")}
              >
                Create account
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};

const UnverifiedUserBanner = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const onClickResendVerificationEmail = async () => {
    try {
      await sendVerificationEmail();
      showToast({
        status: "success",
        description: "Email sent!",
      });
    } catch (error) {
      showToast({
        status: "success",
        description:
          "There was an error sending your verification email. Please contact support.",
      });
    }
  };

  return (
    <Flex hidden={!show}>
      <Center
        width="100vw"
        height={UNVERIFIED_BANNER_HEIGHT}
        bgColor="orange.200"
        zIndex={3}
        gap={1}
        position="fixed"
        top={0}
        left={0}
      >
        Keep your account secure by verifying your email.
        <ChakraLink color={"blue.600"} onClick={onClickResendVerificationEmail}>
          Resend verification email.
        </ChakraLink>
      </Center>
      <Flex
        position="absolute"
        top={0}
        left={0}
        height={UNVERIFIED_BANNER_HEIGHT}
        width="100vw"
        align="center"
        justify="end"
        pr={5}
      >
        <Icon as={FiX} cursor="pointer" onClick={onClose} zIndex={4} />
      </Flex>
    </Flex>
  );
};
