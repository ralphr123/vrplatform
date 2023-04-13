import { z } from "zod";

// Process string query params into the correct type
export const basePaginationQuerySchema = z.object({
  page: z.preprocess((value) => {
    const processed = z.string().transform(Number).safeParse(value);
    return processed.success ? processed.data : value;
  }, z.number().default(1)),
  limit: z.preprocess((value) => {
    const processed = z.string().transform(Number).safeParse(value);
    return processed.success ? processed.data : value;
  }, z.number().default(10)),
  pendingReview: z.preprocess((value) => {
    const processed = z
      .string()
      .transform((input) => (input === "true" ? true : false))
      .safeParse(value);
    return processed.success ? processed.data : value;
  }, z.boolean().default(false)),
});
