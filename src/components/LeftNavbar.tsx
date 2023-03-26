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

const navbarItemIndex = {
  videos: 0,
  users: 1,
  administration: 2,
  myAccount: 3,
};

interface Props {
  flex?: number;
}

export const LeftNavbar = ({ flex = 1 }: Props) => {
  const router = useRouter();
  const session = useSession();
  const [activeNavbarItemIndex, setActiveNavbarItemIndex] = useState<number>();

  useEffect(() => {
    if (session.status !== "loading") {
      if (session.status === "authenticated") {
        switch (router.pathname) {
          case "/videos/published":
          case "/videos/pending-review":
            setActiveNavbarItemIndex(0);
            break;
          default:
            break;
        }
      } else {
        switch (router.pathname) {
          case "/videos/published":
            setActiveNavbarItemIndex(0);
            break;
          default:
            break;
        }
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
          <>
            <LeftNavbarItem
              icon={FiVideo}
              title="Videos"
              currPath={router.pathname}
              onClick={() => setActiveNavbarItemIndex(navbarItemIndex.videos)}
              items={[
                { text: "Published Videos", href: "/videos/published" },
                { text: "Pending Review", href: "/videos/pending-review" },
                { text: "Bookmarked", href: "#" },
              ]}
            />
            <LeftNavbarItem
              icon={FiUsers}
              title="Users"
              onClick={() => setActiveNavbarItemIndex(navbarItemIndex.users)}
              currPath={router.pathname}
              items={[
                { text: "All Users", href: "#" },
                { text: "Pending Verification", href: "#" },
                { text: "Bookmarked", href: "#" },
              ]}
            />
            <LeftNavbarItem
              icon={FiSettings}
              title="Administration"
              onClick={() =>
                setActiveNavbarItemIndex(navbarItemIndex.administration)
              }
              currPath={router.pathname}
              items={[
                { text: "Admin Users", href: "#" },
                { text: "Configurations", href: "#" },
              ]}
            />
            <LeftNavbarItem
              icon={FiUser}
              title="My Account"
              onClick={() =>
                setActiveNavbarItemIndex(navbarItemIndex.myAccount)
              }
              currPath={router.pathname}
              items={[
                { text: "My Profile", href: "#" },
                { text: "Log Out", href: "#" },
              ]}
            />
          </>
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
  items,
  currPath,
  onClick,
}: {
  icon: IconType;
  title: string;
  items: { text: string; href: string }[];
  currPath: string;
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
        {items.map(({ href, text }, i) => (
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
            bgColor={currPath === href ? "#FAFAFA" : undefined}
            color={currPath === href ? "#87B0F5" : undefined}
            key={i}
          >
            <Link style={{ width: "100%", padding: "1em 1.5em" }} href={href}>
              <Flex gap="1em">
                <Icon fontSize="1.3em" opacity="0" />
                <Text fontSize="0.95em" fontWeight="500">
                  {text}
                </Text>
              </Flex>
            </Link>
          </Flex>
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
