import { PageHeader } from "@app/components/admin/PageHeader";
import { PageInfo } from "@app/components/admin/PageInfo";
import { Dropdown } from "@app/components/input/Dropdown";
import { VideoStatusBadge } from "@app/components/video/VideoStatusBadge";
import { VideoInfoCard } from "@app/components/video/VideoInfoCard";
import { VideoPlayer } from "@app/components/video/VideoPlayer";
import { formatDate } from "@app/lib/client/formatDate";
import { useVideo } from "@app/lib/client/hooks/api/useVideo";
import { Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { BsBookmark, BsCalendar, BsTrash } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { VideoStatus } from "@app/lib/types/api";
import { HiOutlineDocumentRemove, HiOutlineUserCircle } from "react-icons/hi";
import { GrDocumentMissing, GrDocumentVerified } from "react-icons/gr";
import Link from "next/link";
import { copyToClipboard } from "@app/lib/client/copyToClipboard";
import { route } from "nextjs-routes";
import { updateVideo } from "@app/lib/client/api/updateVideo";
import { useState } from "react";
import { getVideoStatus } from "@app/lib/client/api/getVideoStatus";

export default function Video() {
  const router = useRouter<"/admin/videos/[videoId]">();
  const {
    data,
    isLoading,
    refetch: refetchVideo,
  } = useVideo(router.query.videoId);

  const [isLoadingNewStatus, setIsLoadingNewStatus] = useState<boolean>(false);

  if (isLoading || !data?.video) {
    return (
      <Flex width="100%" height="100%">
        <Spinner />
      </Flex>
    );
  }

  /** -----------------------------------------  */
  /** --------------- Helpers  ---------------  */
  /** -----------------------------------------  */

  const onChangeStatus = (status: VideoStatus) => {
    setIsLoadingNewStatus(true);
    updateVideo({
      videoId: id,
      status,
      onUpdate: () => {
        refetchVideo();
        setIsLoadingNewStatus(false);
      },
    });
  };

  /** -----------------------------------------  */
  /** --------------- Constants ---------------  */
  /** -----------------------------------------  */
  const video = data.video;

  const {
    id,
    name,
    description,
    type,
    hlsUrl,
    smoothStreamingUrl,
    dashUrl,
    blobUrl,
    reviewedDate,
  } = video;

  const videoStatus = getVideoStatus(video);

  const videoUrl = route({
    pathname: "/videos/[videoId]",
    query: { videoId: id },
  });

  const videoActions = {
    main: [
      {
        label: "View online",
        icon: AiOutlinePlayCircle,
        onClick: () => router.push(videoUrl as any),
      },
      {
        label: "Copy URL",
        icon: MdContentCopy,
        onClick: () => copyToClipboard(videoUrl),
      },
      {
        label: "Add to bookmarks",
        icon: BsBookmark,
        onClick: () => {},
      },
    ],
    footer: [
      ...(videoStatus === "Pending Review"
        ? [
            {
              label: "Publish video",
              icon: GrDocumentVerified,
              onClick: () => onChangeStatus("Published"),
            },
          ]
        : []),
      ...(videoStatus === "Pending Review"
        ? [
            {
              label: "Reject video",
              icon: GrDocumentMissing,
              onClick: () => onChangeStatus("Rejected"),
            },
          ]
        : []),
      ...(videoStatus === "Rejected"
        ? [
            {
              label: "Unreject video",
              icon: HiOutlineDocumentRemove,
              onClick: () =>
                updateVideo({
                  videoId: id,
                  status: "Pending Review",
                  onUpdate: () => onChangeStatus("Pending Review"),
                }),
            },
          ]
        : []),
      ...(videoStatus === "Published"
        ? [
            {
              label: "Unpublish video",
              icon: HiOutlineDocumentRemove,
              onClick: () =>
                updateVideo({
                  videoId: id,
                  status: "Pending Review",
                  onUpdate: () => onChangeStatus("Pending Review"),
                }),
            },
          ]
        : []),
      {
        label: "Permanently delete video",
        icon: BsTrash,
        onClick: () => {},
      },
    ],
  };

  return (
    <Flex flexDirection="column" width="100%" gap="1.5em">
      <Stack>
        <PageHeader>{name}</PageHeader>
        {/* ---------- Page info / actions --------- */}
        <PageInfo
          items={[
            <Flex key={1} gap={2} align="center">
              <VideoStatusBadge video={video} isLoading={isLoadingNewStatus} />
            </Flex>,
            /* ------------ User actions ------------ */
            <Flex key={0} gap={2} align="center" fontSize="0.9em">
              <Dropdown
                text="Video actions"
                options={videoActions.main}
                footerOptions={videoActions.footer}
              />
            </Flex>,
            /* ------------ Uploaded by ------------- */
            <Flex key={1} gap={2} align="center">
              <Icon as={HiOutlineUserCircle} />
              <div>
                Uploaded by{" "}
                <Link
                  href={{
                    pathname: "/admin/users/[userId]",
                    query: { userId: video.user.id },
                  }}
                  style={{ textDecoration: "underline" }}
                >
                  {video.user.name}
                </Link>
              </div>
            </Flex>,
            /* ---------- Registered date ----------- */
            ...(reviewedDate
              ? [
                  <Flex key={2} gap={2} align="center">
                    <Icon as={BsCalendar} fontSize="1.1em" />
                    <Text fontSize="0.9em">
                      Approved on {formatDate(reviewedDate)}
                    </Text>
                  </Flex>,
                ]
              : []),
          ]}
        />
        {/* ------------------------------------ */}
      </Stack>

      <VideoPlayer
        id={id}
        name={name}
        type={type}
        hlsUrl={hlsUrl}
        smoothStreamingUrl={smoothStreamingUrl}
        dashUrl={dashUrl}
        blobUrl={blobUrl}
      />

      <VideoInfoCard video={data.video} />

      {/* -------- Video description --------- */}
      <Stack
        width="100%"
        bgColor="white"
        border="1px solid #DDDDDD"
        rounded="lg"
        padding="1.25em 2em"
      >
        <Text fontWeight="600" color="#BBBBBB">
          Description
        </Text>
        <Text>{description}</Text>
      </Stack>
      {/* ------------------------------------ */}
    </Flex>
  );
}
