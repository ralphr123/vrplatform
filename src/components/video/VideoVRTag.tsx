import { Flex, Icon } from "@chakra-ui/react";
import { VideoType } from "@prisma/client";
import { AiOutlineGlobal } from "react-icons/ai";

export const VideoVRTag = () => (
  <Flex
    bgColor="#87B0F5"
    padding={"0.25em 0.5em"}
    borderRadius="lg"
    fontSize="0.8em"
    color="white"
    align="center"
    justify="center"
    gap={1}
  >
    <Icon as={AiOutlineGlobal} /> 360
  </Flex>
);
