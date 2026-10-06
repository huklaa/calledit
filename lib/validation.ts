import { z } from "zod";

export const predictionSchema = z.object({
  text: z.string().trim().min(8, "Prediction is too short").max(280),
  category: z.enum(["crypto", "markets", "sports", "tech", "world", "culture", "other"]),
  creatorHandle: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z0-9_\-.]+$/, "Use letters, numbers, _, - or ."),
  creatorName: z.string().trim().max(60).optional().or(z.literal("")),
  resolutionDate: z.coerce.date().refine((date) => date.getTime() > Date.now(), {
    message: "Resolution date must be in the future",
  }),
});

export const resolveSchema = z.object({
  status: z.enum(["CORRECT", "WRONG", "VOID"]),
  evidenceUrl: z.string().url().optional().or(z.literal("")),
  resolutionNote: z.string().trim().max(500).optional().or(z.literal("")),
});
