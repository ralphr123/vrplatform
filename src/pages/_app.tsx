import { AdminMenu } from "@app/components/admin/AdminMenu";
import { Menu } from "@app/components/Menu";
import { ToastContainer } from "@app/lib/client/showToast";
import "@app/styles/globals.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import "../styles/bitmovin.min.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const portal = router.pathname.split("/")[1] as "admin" | "auth" | undefined;
  const [portalLayout, setPortalLayout] = useState<ReactNode>();

  useEffect(() => {
    // Chakra UI is broken in Safari, so we need to set color mode manually
    localStorage.setItem("chakra-ui-color-mode", "light");

    switch (portal) {
      case "admin":
        setPortalLayout(
          <Flex height="100vh" width="100vw" bgColor="#FAFAFA">
            <AdminMenu flex={1} />
            <Flex flex={4} padding="3em 2.5em">
              <Component {...pageProps} />
            </Flex>
          </Flex>
        );
        break;
      case "auth":
        setPortalLayout(
          <Flex height="100vh" width="100vw" bgColor="gray.100">
            <Component {...pageProps} />
          </Flex>
        );
        break;
      default:
        setPortalLayout(
          <Flex height="100vh" width="100vw" bgColor="#FAFAFA">
            <Menu />
            {/* Top padding is to leave space for Menu */}
            <Flex padding="12vh 3em 3em 3em" height="100vh" width="100vw">
              <Component {...pageProps} />
            </Flex>
          </Flex>
        );
        break;
    }
  }, [portal, Component, pageProps]);

  return (
    <SessionProvider>
      <ChakraProvider>
        {portalLayout}
        <ToastContainer />
      </ChakraProvider>
    </SessionProvider>
  );
}
