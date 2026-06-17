// tests/unit/tags.test.ts
import { describe, it, expect } from "vitest";
import { isKnownTag, parseTag, tagColor, tagLabel, KNOWN_TAGS } from "@/lib/db/tags";

describe("tags (Phase B)", () => {
  it("isKnownTag: known families return true", () => {
    expect(isKnownTag("vocab")).toBe(true);
    expect(isKnownTag("story:b1-s1-foo")).toBe(true);
    expect(isKnownTag("block:1")).toBe(true);
  });

  it("isKnownTag: unknown tags return false (but DB will still accept them)", () => {
    expect(isKnownTag("concept:phon-001")).toBe(false);
    expect(isKnownTag("random-string")).toBe(false);
  });

  it("parseTag: vocab returns family 'vocab' with no id", () => {
    expect(parseTag("vocab")).toEqual({ family: "vocab" });
  });

  it("parseTag: story:block returns family 'story' with the id", () => {
    expect(parseTag("story:b1-s1-foo")).toEqual({ family: "story", id: "b1-s1-foo" });
  });

  it("parseTag: block:N returns family 'block' with the id", () => {
    expect(parseTag("block:3")).toEqual({ family: "block", id: "3" });
  });

  it("parseTag: unknown string returns family 'other'", () => {
    expect(parseTag("xyz")).toEqual({ family: "other" });
  });

  it("tagColor: maps each family to a distinct color token", () => {
    expect(tagColor("vocab")).toBe("primary");
    expect(tagColor("story")).toBe("accent");
    expect(tagColor("block")).toBe("warning");
    expect(tagColor("other")).toBe("muted");
  });

  it("tagLabel: renders the family-specific Spanish label", () => {
    expect(tagLabel("vocab")).toBe("Vocab");
    expect(tagLabel("story:b1-s1-foo")).toBe("Historia b1-s1-foo");
    expect(tagLabel("block:1")).toBe("Bloque 1");
    expect(tagLabel("xyz")).toBe("xyz");
  });

  it("KNOWN_TAGS is exposed for callers that want to type-check the literal", () => {
    expect(KNOWN_TAGS.vocab).toBe("vocab");
    expect(KNOWN_TAGS.storyPrefix).toBe("story:");
    expect(KNOWN_TAGS.blockPrefix).toBe("block:");
  });
});
