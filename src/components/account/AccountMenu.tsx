import { showToast } from "@app/lib/client/showToast";
import { toastMessages } from "@app/lib/types/toast";
import {
  Avatar,
  Flex,
  Icon,
  Spinner,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { IconType } from "react-icons";
import { IoIosArrowForward } from "react-icons/io";
import { FiVideo, FiUser, FiUpload, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";
import { Pathname } from "@app/lib/types/api";
import Link from "next/link";

type Page = "videos" | "profile" | "upload";

export const AccountMenu = (props: StackProps) => {
  const session = useSession();
  const router = useRouter();
  const page = router.pathname.split("/")[2] as Page;

  if (session.status === "loading") {
    return (
      <Flex width="100%" height="50%" align="center" justify="center">
        <Spinner />
      </Flex>
    );
  }

  if (!session.data?.user) {
    showToast({
      status: "error",
      description: toastMessages.userNotFound,
    });
    router.push("/auth/signin");
    return null;
  }

  const {
    user: { name, image, email },
  } = session.data;

  return (
    <Stack
      bgColor="white"
      rounded="lg"
      {...props}
      height="min-content"
      padding="1.5em 1em"
      gap={5}
    >
      <Stack align="center" gap={1}>
        <Avatar name={name} src={image ?? undefined} size="lg" />
        <Flex flexDirection="column" align="center">
          <Text fontWeight={600}>{name}</Text>
          <Text color="#999999">{email}</Text>
        </Flex>
      </Stack>
      <Stack gap={2}>
        <UserMenuItem
          label="My Account"
          href="/account/profile"
          icon={FiUser}
          isActive={page === "profile"}
        />
        <UserMenuItem
          label="My Videos"
          href="/account/videos"
          icon={FiVideo}
          isActive={page === "videos"}
        />
        <UserMenuItem
          label="Upload"
          href="/account/upload"
          icon={FiUpload}
          isActive={page === "upload"}
        />
        <UserMenuItem
          href="/auth/signout"
          label="Sign out"
          icon={FiLogOut}
          isDanger
        />
      </Stack>
    </Stack>
  );
};

const UserMenuItem = ({
  label,
  icon,
  href,
  isActive,
  isDanger,
}: {
  label: string;
  icon: IconType;
  href: Pathname;
  isActive?: boolean;
  isDanger?: boolean;
}) => (
  <Link href={href as any}>
    <Flex
      align="center"
      padding="0.75em"
      justify="space-between"
      width="100%"
      cursor="pointer"
      color={isDanger ? "red.500" : isActive ? "blue.500" : undefined}
      bgColor={isActive ? "gray.50" : undefined}
      _hover={{
        bgColor: isDanger ? "red.50" : "gray.50",
        textDecoration: "none",
      }}
      transition="all 0.2s"
    >
      <Flex align="center" gap={5}>
        <Icon as={icon} fontSize="1.25em" />
        <Text fontWeight={600}>{label}</Text>
      </Flex>
      {!isDanger && <Icon as={IoIosArrowForward} color="gray.500" />}
    </Flex>
  </Link>
);
