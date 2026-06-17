// tests/unit/scheduler.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { getScheduler, _resetSchedulerForTests } from "@/lib/srs/scheduler";

describe("getScheduler lazy rebuild (Phase A)", () => {
  beforeEach(() => {
    _resetSchedulerForTests();
  });

  it("returns a stable instance for the same default config", () => {
    const a = getScheduler();
    const b = getScheduler();
    expect(a).toBe(b);
  });

  it("returns the same instance when a non-rebuild field is overridden", () => {
    // daily_review_cap is one of the 3 hot-readable fields, NOT part of
    // REBUILD_KEY_FIELDS. Overriding it must NOT trigger a fresh fsrs().
    const a = getScheduler();
    const b = getScheduler({ daily_review_cap: 50 });
    expect(a).toBe(b);
  });

  it("returns a new instance when request_retention changes", () => {
    const a = getScheduler();
    const b = getScheduler({ request_retention: 0.85 });
    expect(a).not.toBe(b);
  });

  it("returns a new instance when learning_steps changes", () => {
    const a = getScheduler();
    const b = getScheduler({ learning_steps: ["5m", "30m"] });
    expect(a).not.toBe(b);
  });

  it("returns a new instance when enable_fuzz toggles", () => {
    const a = getScheduler();
    const b = getScheduler({ enable_fuzz: false });
    expect(a).not.toBe(b);
  });

  it("returns a new instance when maximum_interval changes", () => {
    const a = getScheduler();
    const b = getScheduler({ maximum_interval: 180 });
    expect(a).not.toBe(b);
  });

  it("returns a new instance when relearning_steps changes", () => {
    const a = getScheduler();
    const b = getScheduler({ relearning_steps: ["5m"] });
    expect(a).not.toBe(b);
  });

  it("subsequent calls with the same override return the same instance", () => {
    // After a rebuild, the cache key matches; the next call short-circuits.
    getScheduler({ request_retention: 0.85 }); // forces a rebuild
    const a = getScheduler({ request_retention: 0.85 });
    const b = getScheduler({ request_retention: 0.85 });
    expect(a).toBe(b);
  });

  it("_resetSchedulerForTests drops the cache", () => {
    const a = getScheduler();
    _resetSchedulerForTests();
    const b = getScheduler();
    expect(a).not.toBe(b);
  });
});
