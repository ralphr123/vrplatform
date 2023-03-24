import { Flex, FormLabel, Image, Input, Text, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { TfiUpload } from "react-icons/tfi";

const BG_COLOR_RESTING = "#949494";
const BG_COLOR_HOVER = "#565656";

interface Props {
  videoFile?: File;
  onChangeVideoFile?: (videoFile?: File) => void;
}

export const VideoUploader = ({ videoFile, onChangeVideoFile }: Props) => {
  const [bgColor, setBgColor] = useState<string>(BG_COLOR_RESTING);

  const handleSetvideoFile = (imageFile?: File) => {
    const allowedFileTypes = new Set(["video/mp4"]);
    if (!imageFile || !allowedFileTypes.has(imageFile?.type ?? "")) {
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

    handleSetvideoFile(e.dataTransfer.files?.[0]);
    setBgColor(BG_COLOR_RESTING);
  };

  return (
    <Flex>
      <FormLabel
        htmlFor="file-upload"
        className="custom-file-upload"
        width="18em"
        height="18em"
        bgColor={bgColor}
        rounded="md"
        margin="0"
        boxShadow="0 0 10px #dbdbdb"
        _hover={{ bgColor: BG_COLOR_HOVER, cursor: "pointer" }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropFile}
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
          >
            <Icon
              height="1.5em"
              width="1.5em"
              mb="1em"
              color="black"
              as={TfiUpload}
            />
            <Text fontFamily="arial" fontSize="13px" color="#626d75">
              MP4 files only
            </Text>
          </Flex>
        )}
      </FormLabel>
      <Input
        type="file"
        id="file-upload"
        accept="video/mp4"
        onChange={(e) => handleSetvideoFile(e.target.files?.[0])}
        hidden
      />
    </Flex>
  );
};
