// tests/unit/audio-resolver.test.ts
import { describe, it, expect } from "vitest";
import { pickVoice, audioUrl } from "@/lib/audio/resolve";

describe("pickVoice", () => {
  it("returns preferred voice for pt-br", () => {
    expect(pickVoice("pt-br", ["vitoria", "francisca", "other"])).toBe("vitoria");
  });
  it("returns preferred voice for pt-pt", () => {
    expect(pickVoice("pt-pt", ["vitoria", "francisca", "other"])).toBe("francisca");
  });
  it("falls back to first matching prefix when preferred unavailable", () => {
    expect(pickVoice("pt-br", ["pt-br-rafael", "other"])).toBe("pt-br-rafael");
  });
  it("falls back to first available when no match", () => {
    expect(pickVoice("xx-xx", ["alpha", "beta"])).toBe("alpha");
  });
  it("returns 'default' when nothing available", () => {
    expect(pickVoice("pt-br", [])).toBe("default");
  });
});

describe("audioUrl", () => {
  it("builds /audio/<hash>.mp3", () => {
    expect(audioUrl("abc123def")).toBe("/audio/abc123def.mp3");
  });
});