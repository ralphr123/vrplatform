import { Flex, FlexProps } from "@chakra-ui/react";

export const Logo = (props: FlexProps) => {
  return (
    <Flex flex={1} align="center" {...props}>
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
  );
};
