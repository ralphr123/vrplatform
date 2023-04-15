import { ReactNode } from "react";
import { Text } from "@chakra-ui/react";

export const PageHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <Text fontSize="1.7em" fontWeight="600">
      {children}
    </Text>
  );
};
