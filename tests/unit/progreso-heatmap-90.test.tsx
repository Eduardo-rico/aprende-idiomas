// tests/unit/progreso-heatmap-90.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Heatmap90 } from "@/components/progreso/Heatmap90";

afterEach(() => cleanup());

describe("Heatmap90", () => {
  it("renders exactly 90 cells", () => {
    render(<Heatmap90 data={[]} endDate={new Date("2026-06-27T00:00:00Z")} />);
    expect(screen.getByTestId("heatmap-90").children).toHaveLength(90);
  });

  it("uses the empty (rule) colour for cells with count = 0", () => {
    render(<Heatmap90 data={[]} endDate={new Date("2026-06-27T00:00:00Z")} />);
    const cell = screen.getByTestId("heatmap-90").children[0] as HTMLElement;
    // jsdom doesn't parse `var(--rule)` (CSS custom properties) into
    // style.backgroundColor; check the raw inline style attribute instead.
    expect(cell.getAttribute("style")).toContain("var(--rule)");
  });

  it("paints the most-active day with the deepest green", () => {
    const today = new Date("2026-06-27T00:00:00Z");
    const todayIso = today.toISOString().slice(0, 10);
    render(
      <Heatmap90
        data={[{ date: todayIso, count: 100 }]}
        endDate={today}
      />,
    );
    // jsdom normalises inline hex to rgb() in style.backgroundColor;
    // #2E8B57 → rgb(46, 139, 87).
    expect(
      (screen.getByTitle(`${todayIso}: 100 tarjetas`) as HTMLElement).style
        .backgroundColor,
    ).toBe("rgb(46, 139, 87)");
  });

  it("buckets a moderate count into the second level (#8FCBA8)", () => {
    const today = new Date("2026-06-27T00:00:00Z");
    const todayIso = today.toISOString().slice(0, 10);
    render(
      <Heatmap90
        data={[
          { date: todayIso, count: 100 },
          // 30% of max → falls in the 0.25..0.50 band → L2.
          { date: "2026-06-26", count: 30 },
        ]}
        endDate={today}
      />,
    );
    // #8FCBA8 → rgb(143, 203, 168).
    expect(
      (screen.getByTitle("2026-06-26: 30 tarjetas") as HTMLElement).style
        .backgroundColor,
    ).toBe("rgb(143, 203, 168)");
  });
});
