import { LeftNavbar } from "@app/components/LeftNavbar";
import { ToastContainer } from "@app/lib/client/showToast";
import "@app/styles/globals.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/bitmovin.min.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <SessionProvider>
      <ChakraProvider>
        <Flex height="100vh" width="100vw" bgColor="#FAFAFA">
          {router.pathname.split("/")[1] === "admin" && <LeftNavbar flex={1} />}
          <Flex flex={4} padding="3em 3.5em">
            <Component {...pageProps} />
          </Flex>
        </Flex>
        <ToastContainer />
      </ChakraProvider>
    </SessionProvider>
  );
}
