// tests/unit/intervals.test.ts
import { describe, it, expect } from "vitest";
import { formatInterval } from "@/lib/srs/intervals";

describe("formatInterval (T3.7)", () => {
  it("0 ms and negative ms render as 'ahora'", () => {
    expect(formatInterval(0)).toBe("ahora");
    expect(formatInterval(-1000)).toBe("ahora");
  });

  it("seconds: <= 1s shows 'ahora', > 1s shows 'en N s'", () => {
    expect(formatInterval(500)).toBe("ahora");
    expect(formatInterval(2000)).toBe("en 2 s");
    expect(formatInterval(30_000)).toBe("en 30 s");
  });

  it("minutes: under 60 minutes shows 'en N min'", () => {
    expect(formatInterval(60_000)).toBe("en 1 min");
    expect(formatInterval(5 * 60_000)).toBe("en 5 min");
    expect(formatInterval(59 * 60_000)).toBe("en 59 min");
  });

  it("hours: under 24 hours shows 'en N h'", () => {
    expect(formatInterval(60 * 60_000)).toBe("en 1 h");
    expect(formatInterval(3 * 60 * 60_000)).toBe("en 3 h");
    expect(formatInterval(23 * 60 * 60_000)).toBe("en 23 h");
  });

  it("days: 1 day shows 'mañana', 2-29 days shows 'en N días', 0 days shows 'hoy'", () => {
    // Rounding can produce 0 when the interval rounds down. formatInterval
    // shows "hoy" in that case so the user isn't told "mañana" for a card
    // that is actually due right now.
    expect(formatInterval(0)).toBe("ahora");
    expect(formatInterval(24 * 60 * 60_000)).toBe("mañana");
    expect(formatInterval(3 * 24 * 60 * 60_000)).toBe("en 3 días");
    expect(formatInterval(29 * 24 * 60 * 60_000)).toBe("en 29 días");
  });

  it("months: 30-329 days shows 'en N mes/meses' with singular/plural agreement", () => {
    expect(formatInterval(30 * 24 * 60 * 60_000)).toBe("en 1 mes");
    expect(formatInterval(90 * 24 * 60 * 60_000)).toBe("en 3 meses");
    // 330 days rounds to 11 months, still in the months range.
    expect(formatInterval(330 * 24 * 60 * 60_000)).toBe("en 11 meses");
  });

  it("years: 350+ days shows 'en N año(s)' with singular/plural agreement", () => {
    // 350 days rounds to 12 months which rounds to 1 year.
    expect(formatInterval(350 * 24 * 60 * 60_000)).toBe("en 1 año");
    expect(formatInterval(2 * 365 * 24 * 60 * 60_000)).toBe("en 2 años");
    expect(formatInterval(5 * 365 * 24 * 60 * 60_000)).toBe("en 5 años");
  });
});
