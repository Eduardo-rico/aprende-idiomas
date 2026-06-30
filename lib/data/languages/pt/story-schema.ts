import { z } from "zod";

const variantTextSchema = z.object({
  text: z.string(),
  audioHash: z.string(),
});

const vocabItemSchema = z.object({
  word: z.string(),
  ptWord: z.string().optional(),
  meaning: z.string(),
  audioHash: z.record(z.string(), z.string()),
});

export const storySchema = z
  .object({
    id: z.string(),
    blockId: z.number(),
    lessonIds: z.array(z.string()).default([]),
    title: z.string(),
    level: z.number(),
    conceptIds: z.array(z.string()),
    variants: z.object({
      br: variantTextSchema,
      pt: variantTextSchema,
    }),
    vocab: z.array(vocabItemSchema),
    variantHighlights: z.array(z.string()).optional(),
  })
  .passthrough();

export type Story = z.infer<typeof storySchema>;
