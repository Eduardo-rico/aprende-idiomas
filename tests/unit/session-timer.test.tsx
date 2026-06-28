// tests/unit/session-timer.test.tsx
// @vitest-environment jsdom
//
// Note: we test the hook via a tiny consumer component + screen.getByText
// rather than renderHook. renderHook's result.current does not reflect
// setInterval-driven state updates under React 19 + jsdom + vitest's
// fake timers (the timer fires but the snapshot is stale). Driving
// through the DOM bypasses that issue.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { useSessionTimer } from "@/lib/hooks/useSessionTimer";

afterEach(() => cleanup());

function Clock({ startAt }: { startAt: number }) {
  const { label } = useSessionTimer(startAt);
  return <span data-testid="clock">{label}</span>;
}

describe("useSessionTimer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts at 00:00 right after mount", () => {
    render(<Clock startAt={Date.now()} />);
    expect(screen.getByTestId("clock").textContent).toBe("00:00");
  });

  it("advances to 01:00 after 60s", () => {
    render(<Clock startAt={Date.now()} />);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByTestId("clock").textContent).toBe("01:00");
  });

  it("formats mm:ss past 60 minutes", () => {
    render(<Clock startAt={Date.now()} />);
    act(() => {
      vi.advanceTimersByTime(75 * 60_000);
    });
    expect(screen.getByTestId("clock").textContent).toBe("75:00");
  });

  it("resets when startAt changes", () => {
    const t0 = Date.now();
    const { rerender } = render(<Clock startAt={t0} />);
    act(() => {
      vi.advanceTimersByTime(120_000);
    });
    expect(screen.getByTestId("clock").textContent).toBe("02:00");
    rerender(<Clock startAt={t0 + 100_000} />);
    expect(screen.getByTestId("clock").textContent).toBe("00:00");
  });
});
