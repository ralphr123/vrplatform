import { FlexProps, Flex } from "@chakra-ui/react";

export const VerticalDivider = (props: FlexProps) => (
  <Flex
    height={props.height || "3em"}
    borderLeft="1px solid #EEEEEE"
    {...props}
  />
);
