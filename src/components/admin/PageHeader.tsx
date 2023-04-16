import { ReactNode } from "react";
import { Text } from "@chakra-ui/react";

export const PageHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <Text fontSize="3xl" fontWeight="600">
      {children}
    </Text>
  );
};
