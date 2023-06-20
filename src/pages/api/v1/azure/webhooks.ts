import { generateThumbnailAndStreamingUrls } from "@app/lib/azure/encode";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@app/lib/prismadb";

type SupportedEventTypes =
  | "Microsoft.Media.JobOutputFinished"
  | "Microsoft.Media.JobOutputErrored"
  | "Microsoft.EventGrid.SubscriptionValidationEvent";

type AzureMediaWebhookEvent = {
  topic: string;
  subject: string;
  eventType: SupportedEventTypes;
  id: string;
  data: {
    output: {
      "@odata.type": string;
      assetName: string;
      error: string | null;
      label: string;
      progress: number;
      state: "Finished" | "Errored";
    } | null;
    previousState: "Processing";
    state: "Finished";
    correlationData: {};
  };
  dataVersion: string;
  metadataVersion: string;
  eventTime: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const event = req.body[0] as AzureMediaWebhookEvent;

  try {
    switch (req.method) {
      case "POST":
        const mediaServicesAssetName = event.data?.output?.assetName;

        switch (event.eventType) {
          case "Microsoft.Media.JobOutputFinished":
            if (!mediaServicesAssetName) {
              throw Error("No asset name found.");
            }

            await handleVideoEncodingComplete(mediaServicesAssetName);
            return res.send({
              validationCode: req.body[0].data.validationCode,
            });
          case "Microsoft.Media.JobOutputErrored":
            if (!mediaServicesAssetName) {
              throw Error("No asset name found.");
            }

            await handleVideoEncodingError(
              mediaServicesAssetName,
              event.data.output!.error || "Unknown error"
            );
            return res.send({
              validationCode: req.body[0].data.validationCode,
            });
          default:
            return res.send({
              validationCode: req.body[0].data.validationCode,
            });
        }
      default:
        return res
          .status(405)
          .json({ success: false, error: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/azure/webhooks: ${error}`
    );
    return res
      .status(500)
      .json({ success: false, error: `Something went wrong: ${error}` });
  }
};

const handleVideoEncodingComplete = async (mediaServicesAssetName: string) => {
  const { streamingUrls, thumbnailUrl } =
    await generateThumbnailAndStreamingUrls(mediaServicesAssetName);

  // Update video to add streaming URLs
  await prisma.video.updateMany({
    where: {
      mediaServicesAssetName,
    },
    data: {
      hlsUrl:
        streamingUrls.find((url) => url.includes("format=m3u8-cmaf")) || null,
      dashUrl:
        streamingUrls.find((url) => url.includes("format=mpd-time-cmaf")) ||
        null,
      smoothStreamingUrl:
        streamingUrls.find((url) => url[url.length - 1] === "t") || null,
      thumbnailUrl,
      encodingError: null,
    },
  });
};

const handleVideoEncodingError = async (
  mediaServicesAssetName: string,
  error: string
) => {
  await prisma.video.updateMany({
    where: {
      mediaServicesAssetName,
    },
    data: {
      encodingError: error,
    },
  });
};

export { handler as default };
