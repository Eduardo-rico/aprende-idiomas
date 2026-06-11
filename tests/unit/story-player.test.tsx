// @vitest-environment jsdom
import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { StoryPlayer } from "@/components/stories/StoryPlayer";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

// jsdom doesn't implement HTMLMediaElement.play; stub Audio as a constructor
// so the component's try/catch tolerates the missing impl.
class MockAudio {
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  duration = 0;
  currentTime = 0;
  src = "";
}

Object.defineProperty(window, "Audio", {
  writable: true,
  value: MockAudio,
});

afterEach(() => cleanup());

describe("StoryPlayer", () => {
  it("renders title and play button", () => {
    render(<StoryPlayer audioBr="/audio/br.mp3" audioPt="/audio/pt.mp3" title="Bom dia" />);
    expect(screen.getByText("Bom dia")).toBeTruthy();
    expect(screen.getByLabelText(/play/i)).toBeTruthy();
  });

  it("shows current variant", () => {
    render(<StoryPlayer audioBr="/audio/br.mp3" audioPt="/audio/pt.mp3" title="Bom dia" initialVariant="pt" />);
    const ptBtn = screen.getByRole("button", { name: /PT/i });
    expect(ptBtn.getAttribute("aria-pressed")).toBe("true");
  });
});
