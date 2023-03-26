import { ToastContainer } from "@app/lib/client/showToast";
import "@app/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../styles/bitmovin.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
}
