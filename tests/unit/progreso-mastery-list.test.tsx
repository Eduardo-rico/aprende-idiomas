// tests/unit/progreso-mastery-list.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MasteryList } from "@/components/progreso/MasteryList";
import type { MasteryRow } from "@/lib/stats/aggregations";

afterEach(() => cleanup());

const rows: MasteryRow[] = [
  {
    conceptId: "b3-presente-irregular-ter",
    name: "Presente irregular: ter",
    masteryPct: 95,
    decay: null,
  },
  {
    conceptId: "b2-falso-amigo-ficar",
    name: "Falso amigo: ficar",
    masteryPct: 58,
    decay: "decaying",
  },
  {
    conceptId: "b1-vogais-nasais",
    name: "Vogais nasais (ão/õe)",
    masteryPct: 44,
    decay: "review-soon",
  },
];

describe("MasteryList", () => {
  it("renders one row per mastery entry", () => {
    render(<MasteryList rows={rows} />);
    expect(screen.getAllByTestId("mastery-row")).toHaveLength(3);
  });

  it("renders the empty state when the list is empty", () => {
    render(<MasteryList rows={[]} />);
    expect(screen.getByText("Sin conceptos expuestos todavía.")).toBeTruthy();
  });

  it("shows the decay label for decaying rows", () => {
    render(<MasteryList rows={rows} />);
    // The decay label is rendered inside a span that also contains the
    // "· " separator, so we use a substring match rather than the default
    // exact-text matching that getByText applies.
    expect(screen.getByText(/↓ decayendo/)).toBeTruthy();
  });

  it("shows the review-soon label for stale low-mastery rows", () => {
    render(<MasteryList rows={rows} />);
    expect(screen.getByText(/↓ repasar pronto/)).toBeTruthy();
  });
});
