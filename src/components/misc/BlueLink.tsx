import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Pathname } from "@app/lib/types/api";

type Props = {
  href: Pathname;
  children: ReactNode;
};

export const BlueLink = ({ href, children }: Props) => (
  <Link href={href as any} passHref>
    <ChakraLink color="blue.600">{children}</ChakraLink>
  </Link>
);
