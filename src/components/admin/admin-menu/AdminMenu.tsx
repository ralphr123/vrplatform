import { Logo } from "@app/components/Logo";
import { Pathname } from "@app/lib/types/api";
import { Flex, Accordion } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useMemo, useEffect } from "react";
import { IconType } from "react-icons";
import { FiVideo, FiUsers, FiSettings, FiUser } from "react-icons/fi";
import { AdminMenuItem } from "./AdminMenuItem";

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
          { title: "Rejected", pathname: "/admin/videos/rejected" },
          { title: "Private", pathname: "/admin/videos/private" },
          { title: "Uploading", pathname: "/admin/videos/uploading" },
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
