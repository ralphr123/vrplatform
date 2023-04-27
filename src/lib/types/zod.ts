import { z } from "zod";
import { zodPreprocessNumber } from "../server/zodHelpers";

// Process string query params into the correct type
export const basePaginationQuerySchema = z.object({
  page: zodPreprocessNumber().optional().default(1),
  limit: zodPreprocessNumber().optional().default(10),
});
