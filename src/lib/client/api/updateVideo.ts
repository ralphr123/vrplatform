import { VideoStatus } from "@app/lib/types/api";
import {
  UpdateVideoResp,
  UpdateVideoBody,
} from "@app/pages/api/v1/videos/[videoId]";
import { Prisma } from "@prisma/client";
import { route } from "nextjs-routes";
import { fetchJson } from "../fetchJson";
import { showToast } from "../showToast";

export const updateVideo = ({
  videoId,
  data = {},
  status,
  rejectReason,
  onUpdate,
}: {
  videoId: string;
  data?: Prisma.VideoUpdateInput;
  status?: VideoStatus;
  rejectReason?: string;
  onUpdate?: () => void;
}) => {
  (async () => {
    try {
      const updateResp = await fetchJson<UpdateVideoResp, UpdateVideoBody>({
        url: route({
          pathname: "/api/v1/videos/[videoId]",
          query: { videoId },
        }),
        method: "PUT",
        body: {
          data,
          status,
          rejectReason,
        },
      });

      if (!updateResp.success) {
        throw new Error(updateResp.error);
      }

      onUpdate?.();

      showToast({
        status: "success",
        description: "Updated successfully.",
      });
    } catch (e) {
      console.error(e);
      showToast({
        description: "There was an error.",
        contactSupport: true,
      });
    }
  })();
};
