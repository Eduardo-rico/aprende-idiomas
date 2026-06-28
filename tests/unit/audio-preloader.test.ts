// tests/unit/audio-preloader.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  clearAudioPreloadCache,
  preloadAudio,
  preloadNextAudio,
} from "@/lib/audio/preloader";

describe("audio preloader", () => {
  beforeEach(() => clearAudioPreloadCache());

  it("is a no-op in SSR", () => {
    expect(() => clearAudioPreloadCache()).not.toThrow();
    expect(() => preloadNextAudio([])).not.toThrow();
  });

  it("preloadNextAudio accepts an empty array without throwing", () => {
    expect(() => preloadNextAudio([])).not.toThrow();
  });

  it("preloadAudio is idempotent for the same url", () => {
    // In a jsdom env, Audio is provided by happy-dom/dom. We just
    // verify the function tolerates repeated calls for the same url.
    expect(() => preloadAudio("/audio/same.mp3")).not.toThrow();
    expect(() => preloadAudio("/audio/same.mp3")).not.toThrow();
  });
});