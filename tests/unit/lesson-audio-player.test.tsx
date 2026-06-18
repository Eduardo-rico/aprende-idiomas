// tests/unit/lesson-audio-player.test.tsx
// L6 (Item 4 of the follow-up): unit tests for
// `components/lessons/LessonAudioPlayer.tsx`. The component pulls
// the active variant from `useSettings`; we mock that hook so tests
// can pin the variant without touching zustand state.
//
// Tests cover: button-per-audioRef rendering, src on click, empty
// audioRefs renders nothing (degenerate case), disabled state when
// the active variant has no audio for this index.
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// Pin the active variant for the duration of the test file.
const settingsMock = vi.hoisted(() => ({ variant: "pt-br" as string }));
vi.mock("@/lib/stores/settings", () => ({
  useSettings: (sel: (s: { variant: string }) => unknown) =>
    sel({ variant: settingsMock.variant }),
}));

// Spy on `new Audio()` so we can assert the resolved src without
// actually playing sound.
const audioCtorSpy = vi.hoisted(() => vi.fn());
class MockAudio {
  src: string;
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  constructor(src: string) {
    this.src = src;
    audioCtorSpy(src);
  }
}
vi.stubGlobal("Audio", MockAudio as unknown as typeof Audio);

const { LessonAudioPlayer } = await import(
  "@/components/lessons/LessonAudioPlayer"
);

beforeEach(() => {
  audioCtorSpy.mockClear();
  settingsMock.variant = "pt-br";
});

describe("LessonAudioPlayer", () => {
  // The button is identified by the `data-audio-ref` attribute (the
  // aria-label switches between "Reproducir audio" and "Audio no
  // disponible" depending on disabled state, and the text content
  // has the 🔊 emoji that makes string matching fragile). For tests
  // that need to find the (possibly disabled) button, this works
  // regardless of state.
  const getButton = (index: number | string = 0) =>
    screen.getByRole("button", { name: /reproducir audio/i });

  // 3 entries so index 0, 1, 2 all resolve. The MDX emits 3 examples
  // per lesson so the audioRefs array is always that length.
  const threeRefs = (hashes: { br: string; pt: string }) => ({
    "pt-br": [
      { hash: hashes.br, voice: "v1" },
      { hash: hashes.br + "x", voice: "v1" },
      { hash: hashes.br + "y", voice: "v1" },
    ],
    "pt-pt": [
      { hash: hashes.pt, voice: "v2" },
      { hash: hashes.pt + "x", voice: "v2" },
      { hash: hashes.pt + "y", voice: "v2" },
    ],
  });

  it("renders one button labeled 'audio #N' for the given index", () => {
    render(
      <LessonAudioPlayer audioRefs={threeRefs({ br: "aaa", pt: "bbb" })} index={2} />,
    );
    const btn = getButton(2);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("data-audio-ref", "2");
    expect(btn).toHaveAttribute("data-audio-variant", "pt-br");
  });

  it("creates an <audio> element with the right src on click", () => {
    render(
      <LessonAudioPlayer audioRefs={threeRefs({ br: "abc123", pt: "def" })} index={0} />,
    );
    fireEvent.click(getButton(0));
    expect(audioCtorSpy).toHaveBeenCalledWith("/audio/abc123.mp3");
  });

  it("resolves src from the active variant", () => {
    settingsMock.variant = "pt-pt";
    render(
      <LessonAudioPlayer audioRefs={threeRefs({ br: "br-hash", pt: "pt-hash" })} index={0} />,
    );
    fireEvent.click(getButton(0));
    expect(audioCtorSpy).toHaveBeenCalledWith("/audio/pt-hash.mp3");
  });

  it("is disabled when the active variant has no entry for this index", () => {
    // pt-pt is active, but the refs only have pt-br entries → ref
    // for index 0 resolves to undefined → button is disabled.
    settingsMock.variant = "pt-pt";
    render(
      <LessonAudioPlayer
        audioRefs={{
          "pt-br": [
            { hash: "h1", voice: "v" },
            { hash: "h2", voice: "v" },
            { hash: "h3", voice: "v" },
          ],
          "pt-pt": [],
        }}
        index={0}
      />,
    );
    const btn = screen.getByRole("button", { name: /audio no disponible/i });
    expect(btn).toBeDisabled();
  });

  it("does nothing on click when the ref has an empty hash (TTS failed)", () => {
    render(
      <LessonAudioPlayer
        audioRefs={{
          "pt-br": [{ hash: "", voice: "" }],
          "pt-pt": [],
        }}
        index={0}
      />,
    );
    const btn = screen.getByRole("button", { name: /audio no disponible/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(audioCtorSpy).not.toHaveBeenCalled();
  });

  it("uses index 0 by default; the button label reflects the index", () => {
    render(
      <LessonAudioPlayer audioRefs={threeRefs({ br: "x", pt: "y" })} index={0} />,
    );
    const btn = getButton(0);
    expect(btn).toHaveAttribute("data-audio-ref", "0");
  });
});
