import { Flex, LinkProps, Link } from "@chakra-ui/react";

export const Logo = (props: LinkProps) => {
  return (
    <Link
      href="/"
      bgColor="gray.100"
      rounded="7px"
      cursor="pointer"
      _hover={{ textDecoration: "none" }}
      {...props}
    >
      <Flex w="100%" h="100%" align="center" justify="center">
        Logo
      </Flex>
    </Link>
  );
};
