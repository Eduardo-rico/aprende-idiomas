import { describe, it, expect } from "vitest";
import { StorySchema } from "@/lib/data/zod-schemas";

describe("StorySchema", () => {
  it("parses a valid story", () => {
    const valid = {
      id: "b1-s1-bom-dia-joao",
      blockId: 1,
      lessonIds: ["b1-l1-alfabeto-acentos"],
      title: "Bom dia, João",
      level: 1,
      conceptIds: ["b1-alfabeto"],
      variants: {
        br: { text: "O João entra na padaria pela manhã.", audioHash: "abc123" },
        pt: { text: "O João entra na padaria pela manhã.", audioHash: "def456" },
      },
      vocab: [
        { word: "padaria", ptWord: "padaria", meaning: "panadería", audioHash: { br: "g1", pt: "j1" } },
        { word: "pão", meaning: "pan", audioHash: { br: "g2", pt: "j2" } },
        { word: "café", meaning: "café", audioHash: { br: "g3", pt: "j3" } },
      ],
    };
    expect(() => StorySchema.parse(valid)).not.toThrow();
  });

  it("rejects vocab with fewer than 3 items", () => {
    const invalid = {
      id: "b1-s1-x", blockId: 1, lessonIds: [], title: "x", level: 1, conceptIds: [],
      variants: { br: { text: "x".repeat(25), audioHash: "x" }, pt: { text: "x".repeat(25), audioHash: "x" } },
      vocab: [],
    };
    expect(() => StorySchema.parse(invalid)).toThrow();
  });

  it("rejects missing audio hash", () => {
    const invalid = {
      id: "b1-s1-x", blockId: 1, lessonIds: [], title: "x", level: 1, conceptIds: [],
      variants: { br: { text: "x".repeat(25), audioHash: "" }, pt: { text: "x".repeat(25), audioHash: "x" } },
      vocab: [
        { word: "a", meaning: "a", audioHash: { br: "x", pt: "x" } },
        { word: "b", meaning: "b", audioHash: { br: "x", pt: "x" } },
        { word: "c", meaning: "c", audioHash: { br: "x", pt: "x" } },
      ],
    };
    expect(() => StorySchema.parse(invalid)).toThrow();
  });
});
