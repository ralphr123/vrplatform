import { encodeVideoOnAzureFromBlob } from "@app/lib/azure/encode";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const querySchema = z.object({
  blobUrl: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": {
        const { blobUrl } = querySchema.parse(req.query);
        const result = await encodeVideoOnAzureFromBlob(blobUrl);
        return res.status(result.success ? 200 : 500).json(result);
      }
      default:
        return res.status(405).json({ message: "Method not allowed." });
    }
  } catch (error) {
    console.error(
      `Something went wrong making a request to /api/v1/azure/encodeVideoOnAzureFromBlob: ${error}`
    );
    return res.status(500).json({ message: `Something went wrong: ${error}` });
  }
};

export { handler as default };
