import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { IconType } from "react-icons";

import { FiUsers, FiVideo, FiSettings, FiUser } from "react-icons/fi";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Pathname } from "@app/lib/types/api";
import { Logo } from "../Logo";

type Props = {
  flex?: number | string;
};

export const AdminMenu = ({ flex = 1 }: Props) => {
  const router = useRouter();
  const session = useSession();
  const [activeNavbarItemIndex, setActiveNavbarItemIndex] = useState<number>();

  const navbarItems: {
    title: string;
    icon: IconType;
    routes: { title: string; pathname: Pathname }[];
  }[] = useMemo(
    () => [
      {
        title: "Videos",
        icon: FiVideo,
        routes: [
          { title: "Published", pathname: "/admin/videos/published" },
          { title: "Pending Review", pathname: "/admin/videos/pending-review" },
        ],
      },
      {
        title: "Users",
        icon: FiUsers,
        routes: [
          {
            title: "Verified",
            pathname: "/admin/users/verified",
          },
          {
            title: "Pending Verification",
            pathname: "/admin/users/pending-verification",
          },
        ],
      },
      {
        title: "Administration",
        icon: FiSettings,
        routes: [],
      },
      {
        title: "My Account",
        icon: FiUser,
        routes: [{ title: "Sign out", pathname: "/auth/signout" }],
      },
    ],
    []
  );

  useEffect(() => {
    if (session.status !== "loading") {
      if (session.status === "authenticated") {
        for (const [i, { routes }] of Object.entries(navbarItems)) {
          if (routes.find(({ pathname }) => pathname === router.pathname)) {
            setActiveNavbarItemIndex(Number(i));
            return;
          }
        }
      }
    }
  }, [session, router, navbarItems]);

  return (
    <Flex
      height="100vh"
      flex={flex}
      flexShrink={0}
      bgColor="white"
      borderRight="1px solid #EEEEEE"
      flexDirection="column"
    >
      <Logo height="5em" width="9em" margin={5} />
      <Accordion
        allowToggle
        width="100%"
        flex={6}
        index={activeNavbarItemIndex}
      >
        {session.status === "authenticated" ? (
          Object.entries(navbarItems).map(([i, { title, icon, routes }]) => (
            <AdminMenuItem
              key={i}
              icon={icon}
              title={title}
              routes={routes}
              currentPath={router.pathname}
              onClick={() => setActiveNavbarItemIndex(Number(i))}
            />
          ))
        ) : (
          <></>
        )}
      </Accordion>
    </Flex>
  );
};

const AdminMenuItem = ({
  icon,
  title,
  routes,
  currentPath,
  onClick,
}: {
  icon: IconType;
  title: string;
  routes: { title: string; pathname: Pathname }[];
  currentPath: Pathname;
  onClick?: () => void;
}) => {
  return (
    <AccordionItem onClick={onClick}>
      <AccordionButton
        height="4.5em"
        bgColor="white"
        borderTop="1px solid #EEEEEE"
        border="none"
        justifyContent="space-between"
        alignItems="center"
        padding="1em 1.5em"
      >
        <Flex gap="1em" align="center">
          <Icon as={icon} fontSize="1.3em" />
          <Text fontSize="1.15em" fontWeight="700">
            {title}
          </Text>
        </Flex>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel width="100%" padding="0 0 0.75em 0">
        {routes.map(({ title, pathname }, i) => (
          <Flex
            _hover={{
              bgColor: "#FAFAFA",
              cursor: "pointer",
              color: "#87B0F5",
              transitionDuration: "0.15s",
              transitionTimingFunction: "ease-in-out",
            }}
            height="3em"
            align="center"
            bgColor={currentPath === pathname ? "gray.50" : undefined}
            color={currentPath === pathname ? "#87B0F5" : undefined}
            key={i}
          >
            <Link
              style={{ width: "100%", padding: "1em 1.5em" }}
              // @ts-ignore
              href={{ pathname }}
            >
              <Flex gap="1em">
                <Icon fontSize="1.3em" opacity="0" />
                <Text fontSize="0.95em" fontWeight="500">
                  {title}
                </Text>
              </Flex>
            </Link>
          </Flex>
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
