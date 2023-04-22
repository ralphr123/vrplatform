import { Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  items: ReactNode[];
};

export const PageInfo = ({ items }: Props) => (
  <Flex gap={4} align="center" color="#666666">
    {items.map((item, i) => (
      <>
        {item}
        {i !== items.length - 1 && <Text color="#DDDDDD">|</Text>}
      </>
    ))}
  </Flex>
);
