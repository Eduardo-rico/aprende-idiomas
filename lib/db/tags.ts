// lib/db/tags.ts
// Tag taxonomy for cards. Tags are flat strings in the DB (Dexie multiEntry
// indexes any string, so we don't need enums in the schema). This module
// owns the *vocabulary* the UI uses to render tag chips: constants, parsers,
// and a chip color picker. Adding a new tag family is a one-line change
// here — no schema migration needed.

/** Tag literal types used by the UI. The DB accepts any string; these are
 *  just the ones we know how to display nicely. */
export const KNOWN_TAGS = {
  /** All vocab cards created via getOrCreateVocabCard get this tag. */
  vocab: "vocab",
  /** Vocab cards auto-created from a story get this + the story id. */
  storyPrefix: "story:",
  /** Block-scoped filter — set when a block is selected in /learn. */
  blockPrefix: "block:",
} as const;

export type KnownTag = typeof KNOWN_TAGS[keyof typeof KNOWN_TAGS];

/** A tag is "known" if it matches one of the families we render. We don't
 *  reject unknown tags — the DB will store them just fine — but the filter
 *  bar only shows known ones so the user doesn't see a mess of random
 *  strings. */
export function isKnownTag(tag: string): boolean {
  if (tag === KNOWN_TAGS.vocab) return true;
  if (tag.startsWith(KNOWN_TAGS.storyPrefix)) return true;
  if (tag.startsWith(KNOWN_TAGS.blockPrefix)) return true;
  return false;
}

/** Parse a `story:foo` or `block:1` tag into its prefix and id, or return
 *  null for plain tags like `vocab`. Used by the UI to render a label
 *  ("Historia b1-s1") instead of the raw string. */
export function parseTag(tag: string): { family: "vocab" | "story" | "block" | "other"; id?: string } {
  if (tag === KNOWN_TAGS.vocab) return { family: "vocab" };
  if (tag.startsWith(KNOWN_TAGS.storyPrefix)) {
    return { family: "story", id: tag.slice(KNOWN_TAGS.storyPrefix.length) };
  }
  if (tag.startsWith(KNOWN_TAGS.blockPrefix)) {
    return { family: "block", id: tag.slice(KNOWN_TAGS.blockPrefix.length) };
  }
  return { family: "other" };
}

/** Color family for the chip. The block/page level CSS picks the actual
 *  classes from this token. */
export type TagChipColor = "primary" | "accent" | "muted" | "warning";
export function tagColor(family: ReturnType<typeof parseTag>["family"]): TagChipColor {
  switch (family) {
    case "vocab": return "primary";
    case "story": return "accent";
    case "block": return "warning";
    case "other": return "muted";
  }
}

/** Human-readable label for a chip, e.g. "Vocab", "Historia b1-s1",
 *  "Bloque 1". */
export function tagLabel(tag: string): string {
  const parsed = parseTag(tag);
  if (parsed.family === "vocab") return "Vocab";
  if (parsed.family === "story") return `Historia ${parsed.id}`;
  if (parsed.family === "block") return `Bloque ${parsed.id}`;
  return tag;
}
