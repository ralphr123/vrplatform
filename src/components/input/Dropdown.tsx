import {
  Popover,
  PopoverTrigger,
  Flex,
  Icon,
  Portal,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  Text,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BsChevronDown } from "react-icons/bs";
import { MouseEvent } from "react";

type DropdownOptionType = {
  label: string;
  icon: IconType;
  onClick: (e: any) => void;
};

export const Dropdown = ({
  text,
  options,
  footerOptions,
}: {
  text: string;
  options: DropdownOptionType[];
  footerOptions?: DropdownOptionType[];
}) => (
  <Popover placement="bottom-start">
    <PopoverTrigger>
      <Flex align="center" gap={1} cursor="pointer">
        <Text>{text}</Text>
        <Icon as={BsChevronDown} />
      </Flex>
    </PopoverTrigger>
    <Portal>
      <PopoverContent>
        <PopoverBody padding={0}>
          {options.map(({ label, icon, onClick }) => (
            <DropdownOption
              key={label}
              label={label}
              icon={icon}
              onClick={onClick}
            />
          ))}
        </PopoverBody>
        {footerOptions && (
          <PopoverFooter padding={0}>
            {footerOptions.map(({ label, icon, onClick }) => (
              <DropdownOption
                key={label}
                label={label}
                icon={icon}
                onClick={onClick}
              />
            ))}
          </PopoverFooter>
        )}
      </PopoverContent>
    </Portal>
  </Popover>
);

const DropdownOption = ({ label, icon, onClick }: DropdownOptionType) => (
  <Flex
    key={label}
    align={"center"}
    padding={"0.75em 1em"}
    width="100%"
    gap={1.5}
    cursor="pointer"
    onClick={onClick}
    _hover={{ background: "#F5F5F5" }}
  >
    <Icon as={icon} fontSize="1.3em" />
    <Text ml={2}>{label}</Text>
  </Flex>
);
