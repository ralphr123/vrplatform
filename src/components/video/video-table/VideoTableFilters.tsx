import { Select } from "@app/components/input/Select";
import { useUsers } from "@app/lib/client/hooks/api/useUsers";
import { VideoStatus } from "@app/lib/types/api";
import { videoTypes, videoTypeToIcon } from "@app/lib/types/prisma";
import { Flex, Input, Stack } from "@chakra-ui/react";
import { VideoType } from "@prisma/client";
import { BsCalendar } from "react-icons/bs";
import { FiEye, FiEyeOff, FiX, FiUpload, FiFilter } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdOndemandVideo, MdOutlinePending } from "react-icons/md";

type Props = {
  searchText?: string;
  setSearchText?: (value: string) => void;
  setStatus?: (value: VideoStatus) => void;
  setType?: (value: VideoType) => void;
  setCreatedAfterDate?: (value?: Date) => void;
  setUserId?: (value: string) => void;
};

export const VideoTableFilters = ({
  searchText,
  setSearchText,
  setStatus,
  setType,
  setCreatedAfterDate,
  setUserId,
}: Props) => {
  const { data: { users } = {}, isLoading: isLoadingUsers } = useUsers(
    { limit: 99999999, verified: true },
    !!setUserId
  );

  return (
    <Flex align="center" justify="space-between" gap={2} maxWidth="100%">
      {setSearchText && (
        <Input
          type="text"
          placeholder="Search by name or id"
          flex={1}
          bgColor="white"
          value={searchText}
          onChange={({ target: { value } }) => setSearchText(value)}
        />
      )}
      {setType && (
        <Stack flex={1}>
          <Select
            options={[
              { value: "", label: "All videos", icon: MdOndemandVideo },
              ...videoTypes.map((videoType: VideoType) => ({
                value: videoType,
                label: videoType,
                icon: videoTypeToIcon[videoType],
              })),
            ]}
            onChange={(value) => setType(value as VideoType)}
          />
        </Stack>
      )}
      {setCreatedAfterDate && (
        <Stack flex={1}>
          <Select
            options={[
              { label: "All time", value: "" },
              { label: "Today", value: "1" },
              { label: "Last 7 days", value: "7" },
              { label: "Last 30 days", value: "30" },
            ]}
            onChange={(value) => {
              if (value) {
                const _createdAfterDate = new Date();
                _createdAfterDate.setDate(
                  _createdAfterDate.getDate() - Number(value)
                );

                setCreatedAfterDate(_createdAfterDate);
              } else {
                setCreatedAfterDate(undefined);
              }
            }}
            defaultIcon={BsCalendar}
          />
        </Stack>
      )}
      {setStatus && (
        <Stack flex={1}>
          <Select
            options={[
              { label: "All statuses", value: "" },
              { label: "Published", value: "Published", icon: FiEye },
              { label: "Private", value: "Private", icon: FiEyeOff },
              { label: "Rejected", value: "Rejected", icon: FiX },
              {
                label: "Pending Review",
                value: "Pending Review",
                icon: MdOutlinePending,
              },
              { label: "Uploading", value: "Uploading", icon: FiUpload },
            ]}
            onChange={(value) => setStatus(value as VideoStatus)}
            defaultIcon={FiFilter}
          />
        </Stack>
      )}
      {setUserId && (
        <Stack flex={1}>
          <Select
            options={[
              { label: "All users", value: "" },
              ...(users || []).map((user) => ({
                label: user.name,
                value: user.id,
                icon: HiOutlineUserCircle,
              })),
            ]}
            defaultIcon={HiOutlineUserCircle}
            onChange={(value) => setUserId(value as string)}
            isSearchable
          />
        </Stack>
      )}
    </Flex>
  );
};
