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
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Route } from "nextjs-routes";
import { Pathname } from "@app/lib/types/api";

interface Props {
  flex?: number;
}

export const LeftNavbar = ({ flex = 1 }: Props) => {
  const router = useRouter();
  const session = useSession();
  const [activeNavbarItemIndex, setActiveNavbarItemIndex] = useState<number>();

  const navbarItems: {
    title: string;
    icon: IconType;
    routes: { title: string; pathname: Pathname }[];
  }[] = [
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
      routes: [],
    },
    {
      title: "Administration",
      icon: FiSettings,
      routes: [],
    },
    {
      title: "My Account",
      icon: FiUser,
      routes: [],
    },
  ];

  useEffect(() => {
    if (session.status !== "loading") {
      if (session.status === "authenticated") {
        for (const [i, { routes }] of Object.entries(navbarItems)) {
          if (routes.find(({ pathname }) => pathname === router.pathname)) {
            setActiveNavbarItemIndex(Number(i));
            return;
          }
        }
        router.replace("/admin/videos/published");
      } else {
        /** @TODO: make custom signin page */
        // @ts-ignore
        router.replace("/api/auth/signin");
      }
    }
  }, [router.pathname, session]);

  return (
    <Flex
      height="100vh"
      flex={flex}
      bgColor="white"
      borderRight="1px solid #EEEEEE"
      flexDirection="column"
    >
      <Flex flex={1} align="center" paddingLeft="1.5em">
        <Flex
          height="5em"
          width="9em"
          bgColor="#F3F3F3"
          align="center"
          justify="center"
          rounded="7px"
        >
          Logo
        </Flex>
      </Flex>
      <Accordion
        allowToggle
        width="100%"
        flex={6}
        index={activeNavbarItemIndex}
      >
        {session.status === "authenticated" ? (
          Object.entries(navbarItems).map(([i, { title, icon, routes }]) => (
            <LeftNavbarItem
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

const LeftNavbarItem = ({
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
            bgColor={currentPath === pathname ? "#FAFAFA" : undefined}
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
