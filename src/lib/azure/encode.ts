// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultAzureCredential } from "@azure/identity";
import {
  AzureMediaServices,
  BuiltInStandardEncoderPreset,
  JobOutputAsset,
  JobInputUnion,
  JobsGetResponse,
} from "@azure/arm-mediaservices";
import * as factory from "./transformFactory";
import { v4 as uuidv4 } from "uuid";
import * as util from "util";
import { ApiReturnType } from "../types/api";

let mediaServicesClient: AzureMediaServices;

const {
  AZURE_SUBSCRIPTION_ID: subscriptionId,
  AZURE_RESOURCE_GROUP: resourceGroup,
  AZURE_MEDIA_SERVICES_ACCOUNT_NAME: accountName,
} = process.env;

const credential = new DefaultAzureCredential();

// Timer values
const TIMEOUT_SECONDS = 60 * 10;
const SLEEP_INTERVAL = 1000 * 2;
const setTimeoutPromise = util.promisify(setTimeout);

// Args
const NAME_PREFIX = "stream";

export type GetStreamingUrlsFromBlobSuccessResp = {
  streamingUrls: string[];
};

export const getStreamingUrlsFromBlob = async (
  blobUrl: string
): Promise<ApiReturnType<GetStreamingUrlsFromBlobSuccessResp>> => {
  // Define the name to use for the encoding Transform that will be created
  const encodingTransformName = "ContentAwareEncoding";

  mediaServicesClient = new AzureMediaServices(credential, subscriptionId);

  try {
    // Ensure that we have the desired encoding Transform. This is really a one time setup operation.
    // Use 'ContentAwareEncoding' preset which chooses the best output based on an analysis of the input video.
    let adaptiveStreamingTransform: BuiltInStandardEncoderPreset =
      factory.createBuiltInStandardEncoderPreset({
        presetName: "ContentAwareEncoding",
      });

    let encodingTransform = await mediaServicesClient.transforms.createOrUpdate(
      resourceGroup,
      accountName,
      encodingTransformName,
      {
        name: encodingTransformName,
        outputs: [
          {
            preset: adaptiveStreamingTransform,
          },
        ],
      }
    );

    let uniqueness = uuidv4();
    let input = await getJobInputType({ blobUrl, uniqueness });
    let outputAssetName = `${NAME_PREFIX}-output-${uniqueness}`;
    let jobName = `${NAME_PREFIX}-job-${uniqueness}`;
    let locatorName = `locator${uniqueness}`;

    // Create output media services asset to encode content into
    let outputAsset = await mediaServicesClient.assets.createOrUpdate(
      resourceGroup,
      accountName,
      outputAssetName,
      {}
    );

    if (outputAsset.name !== undefined) {
      // Submit the encoding job to the Transform's job queue
      let job = await submitJob(
        encodingTransformName,
        jobName,
        input,
        outputAsset.name
      );

      // Wait for job to finish encoding
      job = await waitForJobToFinish(encodingTransformName, jobName);

      let locator = await createStreamingLocator(outputAsset.name, locatorName);
      if (locator.name !== undefined) {
        let streamingUrls = await getStreamingUrls(locator.name);
        return { success: true, data: { streamingUrls } };
      } else {
        throw new Error("Locator was not created or Locator.name is undefined");
      }
    } else {
      throw new Error("Output asset was unable to be created.");
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: String(error) };
  }
};

const waitForJobToFinish = async (transformName: string, jobName: string) => {
  let timeout = new Date();
  timeout.setSeconds(timeout.getSeconds() + TIMEOUT_SECONDS);

  async function pollForJobStatus(): Promise<JobsGetResponse> {
    let job = await mediaServicesClient.jobs.get(
      resourceGroup,
      accountName,
      transformName,
      jobName
    );
    console.log(job.state);
    if (
      job.state == "Finished" ||
      job.state == "Error" ||
      job.state == "Canceled"
    ) {
      return job;
    } else if (new Date() > timeout) {
      console.log(
        `Job ${job.name} timed out. Please retry or check the source file.`
      );
      return job;
    } else {
      await setTimeoutPromise(SLEEP_INTERVAL, null);
      return pollForJobStatus();
    }
  }

  return await pollForJobStatus();
};

// Selects the JobInput type to use based on the value of inputFile or blobUrl.
// Set inputFile to null to create a Job input that sources from an HTTP URL path
// Creates a new input Asset and uploads the local file to it before returning a JobInputAsset object
// Returns a JobInputHttp object if inputFile is set to null, and the blobUrl is set to a valid URL
const getJobInputType = async ({
  blobUrl,
  uniqueness,
}: {
  blobUrl: string;
  uniqueness: string;
}): Promise<JobInputUnion> => {
  return factory.createJobInputHttp({
    files: [blobUrl],
  });
};

const submitJob = async (
  transformName: string,
  jobName: string,
  jobInput: JobInputUnion,
  outputAssetName: string
) => {
  if (outputAssetName == undefined) {
    throw new Error(
      "OutputAsset Name is not defined. Check creation of the output asset"
    );
  }
  let jobOutputs: JobOutputAsset[] = [
    factory.createJobOutputAsset({
      assetName: outputAssetName,
    }),
  ];

  return await mediaServicesClient.jobs.create(
    resourceGroup,
    accountName,
    transformName,
    jobName,
    {
      input: jobInput,
      outputs: jobOutputs,
    }
  );
};

const createStreamingLocator = async (
  assetName: string,
  locatorName: string
) => {
  let streamingLocator = {
    assetName: assetName,
    streamingPolicyName: "Predefined_ClearStreamingOnly", // no DRM or AES128 encryption protection on this asset. Clear means unencrypted.
  };

  let locator = await mediaServicesClient.streamingLocators.create(
    resourceGroup,
    accountName,
    locatorName,
    streamingLocator
  );

  return locator;
};

const getStreamingUrls = async (locatorName: string) => {
  // Make sure the streaming endpoint is in the "Running" state on account
  let streamingEndpoint = await mediaServicesClient.streamingEndpoints.get(
    resourceGroup,
    accountName,
    "default"
  );

  let paths = await mediaServicesClient.streamingLocators.listPaths(
    resourceGroup,
    accountName,
    locatorName
  );

  const streamingUrls: string[] = [];
  if (paths.streamingPaths) {
    paths.streamingPaths.forEach((path) => {
      path.paths?.forEach((formatPath) => {
        let manifestPath = "https://" + streamingEndpoint.hostName + formatPath;
        streamingUrls.push(manifestPath);
      });
    });
  }

  return streamingUrls;
};
