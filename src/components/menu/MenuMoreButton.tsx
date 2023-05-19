import { Flex, Text } from "@chakra-ui/react";

export const MenuMoreButton = () => (
  <Flex
    padding="0em"
    gap={5}
    rounded="md"
    justify="center"
    align="center"
    _hover={{ bgColor: "gray.100", cursor: "pointer" }}
  >
    <Text fontWeight={600} fontSize="1.5em" mb="0.5em">
      ...
    </Text>
  </Flex>
);
