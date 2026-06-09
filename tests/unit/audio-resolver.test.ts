// tests/unit/audio-resolver.test.ts
import { describe, it, expect } from "vitest";
import { pickVoice, audioUrl } from "@/lib/audio/resolve";

// CRITICAL FIX: 1 voice per variant ("default") — matches b1.json data.
// 6-voice design deferred to Plan #4 (regen).
describe("pickVoice", () => {
  it("returns 'default' (only voice available)", () => {
    expect(pickVoice({ type: "flashcard" } as any, "br", { br: "default", pt: "default" })).toBe("default");
    expect(pickVoice({ type: "chunk" } as any, "pt", { br: "default", pt: "default" })).toBe("default");
  });
});

describe("audioUrl", () => {
  it("builds /audio/<hash>.mp3", () => {
    expect(audioUrl("abc123def")).toBe("/audio/abc123def.mp3");
  });
});
