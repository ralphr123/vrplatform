import { Logo } from "@app/components/Logo";
import { Pathname, rolePriority } from "@app/lib/types/api";
import { Flex, Accordion, Center, Spinner } from "@chakra-ui/react";
import { UserRole } from "@prisma/client";
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
  const [activeMenuItemIndex, setActiveMenuItemIndex] = useState<number>();

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
          { title: "Uploading", pathname: "/admin/videos/uploading" },
          { title: "Bookmarked", pathname: "/admin/videos/bookmarked" },
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
          {
            title: "Bookmarked",
            pathname: "/admin/users/bookmarked",
          },
        ],
      },
      {
        title: "Administration",
        icon: FiSettings,
        routes: [
          {
            title: "Admin Users",
            pathname: "/admin/administration/admin-users",
          },
        ],
      },
      {
        title: "My Account",
        icon: FiUser,
        routes: [
          { title: "Profile", pathname: "/account/profile" },
          { title: "Sign out", pathname: "/auth/signout" },
        ],
      },
    ],
    []
  );

  // Highlight correct menu item
  useEffect(() => {
    if (session.status !== "authenticated") {
      return;
    }

    for (const [i, { routes }] of Object.entries(navbarItems)) {
      if (routes.find(({ pathname }) => pathname === router.pathname)) {
        setActiveMenuItemIndex(Number(i));
        return;
      }
    }
  }, [session, router, navbarItems]);

  if (session.status === "loading") {
    return (
      <Center height="100%" width="100%">
        <Spinner />
      </Center>
    );
  }

  if (
    session.status === "unauthenticated" ||
    !session.data?.user ||
    rolePriority[session.data.user.role] < rolePriority[UserRole.Admin]
  ) {
    router.push("/404");
    return null;
  }

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
      <Accordion allowToggle width="100%" flex={6} index={activeMenuItemIndex}>
        {session.status === "authenticated" ? (
          Object.entries(navbarItems).map(([i, { title, icon, routes }]) => (
            <AdminMenuItem
              key={i}
              icon={icon}
              title={title}
              routes={routes}
              currentPath={router.pathname}
              onClick={() => setActiveMenuItemIndex(Number(i))}
            />
          ))
        ) : (
          <></>
        )}
      </Accordion>
    </Flex>
  );
};
