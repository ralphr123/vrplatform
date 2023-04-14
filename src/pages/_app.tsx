import { AdminMenu } from "@app/components/AdminMenu";
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
  const isAdminPanel = router.pathname.split("/")[1] === "admin";
  const pageGroup = router.pathname.split("/")[1] as
    | "admin"
    | "dashboard"
    | "auth";
  const [pageLayout, setPageLayout] = useState<ReactNode>();

  useEffect(() => {
    switch (pageGroup) {
      case "admin":
        setPageLayout(
          <Flex height="100vh" width="100vw" bgColor="#FAFAFA">
            <AdminMenu flex={1} />
            <Flex flex={4} padding="3em 2.5em">
              <Component {...pageProps} />
            </Flex>
          </Flex>
        );
        break;
      case "dashboard":
        setPageLayout(
          <Flex height="100vh" width="100vw" bgColor="#FAFAFA">
            <AdminMenu flex={1} />
            <Flex flex={4} padding="3em 2.5em">
              <Component {...pageProps} />
            </Flex>
          </Flex>
        );
        break;
      case "auth":
        setPageLayout(
          <Flex height="100vh" width="100vw" bgColor="gray.100">
            <Component {...pageProps} />
          </Flex>
        );
        break;
      default:
        break;
    }
  }, [pageGroup, Component, pageProps]);

  return (
    <SessionProvider>
      <ChakraProvider>
        {pageLayout}
        <ToastContainer />
      </ChakraProvider>
    </SessionProvider>
  );
}
