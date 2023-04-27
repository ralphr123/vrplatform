import { Flex, Icon } from "@chakra-ui/react";
import { RefCallback } from "react";
import { IconType } from "react-icons";
import ReactSelect, { Options } from "react-select";

type Option = { value: string; label: string; icon?: IconType };

type Props = {
  options: Options<Option>;
  onChange?: (value?: string) => void;
  isSearchable?: boolean;
  defaultIcon?: IconType; // Overrides option icon
  isLoading?: boolean;
  value?: string;
};

export const Select = ({
  options,
  onChange,
  isSearchable = false,
  defaultIcon,
  isLoading,
  value,
}: Props) => {
  return (
    <ReactSelect
      options={options}
      onChange={(v) => onChange?.(v?.value)}
      isLoading={isLoading}
      isSearchable={isSearchable}
      value={options.find((option) => option.value === value)}
      defaultValue={value ? undefined : options[0]}
      className="react-select-input"
      components={{
        Option: CustomOption,
      }}
      formatOptionLabel={({ label, icon }) => (
        <Flex
          align="center"
          gap={4}
          padding="5px"
          _hover={{ cursor: "pointer" }}
        >
          {(defaultIcon || icon) && <Icon as={defaultIcon || icon} />}
          {label}
        </Flex>
      )}
      styles={{
        control: (provided) => ({
          ...provided,
          border: "1px solid #E2E8F0",
          width: "100%",
        }),
      }}
    />
  );
};

const CustomOption = ({
  innerProps,
  innerRef,
  data: { label, icon },
}: {
  innerProps: JSX.IntrinsicElements["div"];
  innerRef: RefCallback<HTMLDivElement>;
  data: { value: string; label: string; icon?: IconType };
}) => (
  <Flex
    ref={innerRef}
    {...innerProps}
    align="center"
    gap={4}
    padding={3}
    _hover={{ bgColor: "gray.50", cursor: "pointer" }}
  >
    {icon && <Icon as={icon} />}
    {label}
  </Flex>
);
