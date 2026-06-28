// tests/unit/progreso-balance-bars.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BalanceBars } from "@/components/progreso/BalanceBars";

afterEach(() => cleanup());

describe("BalanceBars", () => {
  it("renders both bars with rounded percentages", () => {
    render(<BalanceBars recognition={0.876} production={0.642} />);
    expect(screen.getByText("88%")).toBeTruthy();
    expect(screen.getByText("64%")).toBeTruthy();
  });

  it("clamps negative values to 0%", () => {
    render(<BalanceBars recognition={-1} production={0.5} />);
    expect(screen.getAllByText("0%")).toBeTruthy();
    expect(screen.getByText("50%")).toBeTruthy();
  });

  it("clamps values above 1 to 100%", () => {
    render(<BalanceBars recognition={2} production={5} />);
    expect(screen.getAllByText("100%")).toBeTruthy();
  });

  it("renders the note when provided", () => {
    render(
      <BalanceBars
        recognition={0.88}
        production={0.64}
        note="Brecha de 24 pts — sana."
      />,
    );
    expect(screen.getByText("Brecha de 24 pts — sana.")).toBeTruthy();
  });
});
