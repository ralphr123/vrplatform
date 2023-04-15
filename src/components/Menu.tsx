import { Button, Flex, Input } from "@chakra-ui/react";
import { Logo } from "./Logo";

export const Menu = () => {
  return (
    <Flex
      width="100vw"
      height="10vh"
      position="fixed"
      top={0}
      left={0}
      align="center"
      borderBottom="1px solid #F3F3F3"
      justify="space-between"
      padding="0 3em"
      bgColor="white"
    >
      <Logo height="3.5em" width="8em" />
      <Input type="text" placeholder="Search" width="40em" />
      <Flex gap={4}>
        <Button flex={1} padding="1em 0.6em" bgColor="transparent">
          Sign in
        </Button>
        <Button flex={1} bgColor="#666666" color="white" padding="1.1em 2.5em">
          Create account
        </Button>
      </Flex>
    </Flex>
  );
};
