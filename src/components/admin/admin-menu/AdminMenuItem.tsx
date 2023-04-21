import { Pathname } from "@app/lib/types/api";
import {
  AccordionItem,
  AccordionButton,
  Text,
  Flex,
  Icon,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import Link from "next/link";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  routes: { title: string; pathname: Pathname }[];
  currentPath: Pathname;
  onClick?: () => void;
};

export const AdminMenuItem = ({
  icon,
  title,
  routes,
  currentPath,
  onClick,
}: Props) => {
  return (
    <AccordionItem onClick={onClick}>
      <AccordionButton
        height="4.5em"
        bgColor="white"
        borderTop="1px solid #EEEEEE"
        border="none"
        justifyContent="space-between"
        alignItems="center"
        padding="1em 1.5em"
      >
        <Flex gap="1em" align="center">
          <Icon as={icon} fontSize="1.3em" />
          <Text fontSize="1.15em" fontWeight="700">
            {title}
          </Text>
        </Flex>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel width="100%" padding="0 0 0.75em 0">
        {routes.map(({ title, pathname }, i) => (
          <Flex
            _hover={{
              bgColor: "#FAFAFA",
              cursor: "pointer",
              color: "blue.400",
              transitionDuration: "0.15s",
              transitionTimingFunction: "ease-in-out",
            }}
            height="3em"
            align="center"
            bgColor={currentPath === pathname ? "gray.50" : undefined}
            color={currentPath === pathname ? "blue.400" : undefined}
            key={i}
          >
            <Link
              style={{ width: "100%", padding: "1em 1.5em" }}
              // @ts-ignore
              href={{ pathname }}
            >
              <Flex gap="1em">
                <Icon fontSize="1.3em" opacity="0" />
                <Text fontSize="0.95em" fontWeight="500">
                  {title}
                </Text>
              </Flex>
            </Link>
          </Flex>
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};
