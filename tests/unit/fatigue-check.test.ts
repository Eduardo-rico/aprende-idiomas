import { describe, it, expect, beforeEach } from "vitest";
import { useSession } from "@/lib/stores/session";

describe("fatigue check", () => {
  beforeEach(() => {
    useSession.setState({ startedAt: undefined, fatigueShownAt: null });
  });

  it("returns false when no session started", () => {
    expect(useSession.getState().showFatigueCheck()).toBe(false);
  });

  it("returns false when less than 18 min elapsed", () => {
    useSession.setState({ startedAt: new Date() });
    expect(useSession.getState().showFatigueCheck()).toBe(false);
  });

  it("returns true when more than 18 min elapsed", () => {
    const past = new Date(Date.now() - 19 * 60 * 1000);
    useSession.setState({ startedAt: past });
    expect(useSession.getState().showFatigueCheck()).toBe(true);
  });

  it("returns false after acknowledged", () => {
    const past = new Date(Date.now() - 19 * 60 * 1000);
    useSession.setState({ startedAt: past });
    useSession.getState().acknowledgeFatigue();
    expect(useSession.getState().showFatigueCheck()).toBe(false);
  });
});
