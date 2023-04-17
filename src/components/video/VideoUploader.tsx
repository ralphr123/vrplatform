import { showToast } from "@app/lib/client/showToast";
import {
  Flex,
  FormLabel,
  FormLabelProps,
  Input,
  Text,
  Icon,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { TfiUpload } from "react-icons/tfi";
import { BsCameraVideo } from "react-icons/bs";
import { IconType } from "react-icons";

const BG_COLOR_RESTING = "white";
const BG_COLOR_HOVER = "#fbfbfb";

type Props = {
  videoFile?: File;
  label?: string;
  icon?: IconType;
  onChangeVideoFile?: (videoFile?: File) => void;
} & FormLabelProps;

export const VideoUploader = ({
  videoFile,
  onChangeVideoFile,
  label,
  icon,
  ...props
}: Props) => {
  const [bgColor, setBgColor] = useState<string>(BG_COLOR_RESTING);

  const handleSetVideoFile = (imageFile?: File) => {
    if (!imageFile || !imageFile?.type?.includes("video")) {
      showToast({
        description: "Please upload a valid video file",
      });
      onChangeVideoFile?.(undefined);
    } else {
      onChangeVideoFile?.(imageFile);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setBgColor(BG_COLOR_RESTING);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setBgColor(BG_COLOR_HOVER);
  };

  const handleDropFile = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    handleSetVideoFile(e.dataTransfer.files?.[0]);
    setBgColor(BG_COLOR_RESTING);
  };

  return (
    <>
      <FormLabel
        htmlFor="file-upload"
        width="100%"
        height="100%"
        bgColor={bgColor}
        rounded="md"
        margin={0}
        border="1px dashed #BBBBBB"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropFile}
        _hover={{
          bgColor: BG_COLOR_HOVER,
          cursor: "pointer",
          border: "1px solid #BBBBBB",
        }}
        transition="all 0.1s ease-in-out"
        {...props}
      >
        {videoFile ? (
          <Text>{videoFile.name}</Text>
        ) : (
          <Flex
            flexDirection="column"
            align="center"
            width="100%"
            height="100%"
            justifyContent="center"
            gap={3}
          >
            <Icon fontSize="5em" color="#BBBBBB" as={icon || BsCameraVideo} />
            <Text fontWeight={600} fontSize="1.1em">
              {label || "Upload a video"}
            </Text>
            <Flex
              bgColor="gray.100"
              rounded="md"
              padding="0.75em 1.25em"
              mt={4}
              gap={3}
              align="center"
              _hover={{ bgColor: "gray.200" }}
              transition="all 0.1s ease-in-out"
            >
              <Icon as={TfiUpload} />
              <Text fontSize="0.9em">Choose a file to upload</Text>
            </Flex>
          </Flex>
        )}
      </FormLabel>
      <Input
        type="file"
        id="file-upload"
        accept="video/*"
        onChange={(e) => handleSetVideoFile(e.target.files?.[0])}
        hidden
      />
    </>
  );
};
