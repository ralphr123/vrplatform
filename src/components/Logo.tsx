import { Flex, FlexProps } from "@chakra-ui/react";

export const Logo = (props: FlexProps) => {
  return (
    <Flex
      // flex={1}
      {...props}
      bgColor="#F3F3F3"
      align="center"
      justify="center"
      rounded="7px"
    >
      Logo
    </Flex>
  );
};
