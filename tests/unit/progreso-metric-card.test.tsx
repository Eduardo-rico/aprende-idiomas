// tests/unit/progreso-metric-card.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MetricCard } from "@/components/progreso/MetricCard";

afterEach(() => cleanup());

describe("MetricCard", () => {
  it("renders label, value and unit", () => {
    render(<MetricCard label="Retención" value="87" unit="%" />);
    expect(screen.getByText("Retención")).toBeTruthy();
    expect(screen.getByText("87")).toBeTruthy();
    expect(screen.getByText("%")).toBeTruthy();
  });

  it("renders an up-trend delta in the lesson color", () => {
    render(<MetricCard label="L" value="1" delta="▲ +5%" trend="up" />);
    expect(screen.getByText("▲ +5%").className).toContain("text-lesson");
  });

  it("renders a down-trend delta in the error color", () => {
    render(<MetricCard label="L" value="1" delta="▼ -3%" trend="down" />);
    expect(screen.getByText("▼ -3%").className).toContain("text-error");
  });

  it("omits the delta block when delta is missing", () => {
    render(<MetricCard label="L" value="1" />);
    expect(screen.queryByText(/▲|▼/)).toBeNull();
  });
});
