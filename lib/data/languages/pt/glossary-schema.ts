import { z } from "zod";

export const glossaryEntrySchema = z.object({
  word: z.string().min(1),
  translations: z.array(z.string()).min(1),
  falseFriend: z.boolean().default(false),
  note: z.string().optional(),
  variants: z.object({ br: z.string(), pt: z.string() }),
  register: z.enum(["neutral", "formal", "informal", "slang"]),
  tabu: z.boolean().optional(),
  conceptIds: z.array(z.string()),
  examples: z.array(z.string()).default([]),
});

export const glossarySchema = z.array(glossaryEntrySchema);
export type GlossaryEntry = z.infer<typeof glossaryEntrySchema>;
