// tests/unit/grade-panel.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { GradePanel } from "@/components/session/GradePanel";

afterEach(() => cleanup());

const intervals = {
  again: 60_000,
  hard: 2 * 86_400_000,
  good: 4 * 86_400_000,
  easy: 9 * 86_400_000,
};

describe("GradePanel", () => {
  it("renders 4 buttons with labels and shortcut hints", () => {
    render(<GradePanel disabled={false} onGrade={() => {}} intervals={intervals} />);
    expect(screen.getByText("Otra vez")).toBeTruthy();
    expect(screen.getByText("Difícil")).toBeTruthy();
    expect(screen.getByText("Bien")).toBeTruthy();
    expect(screen.getByText("Fácil")).toBeTruthy();
    expect(screen.getByText("[1]")).toBeTruthy();
    expect(screen.getByText("[4]")).toBeTruthy();
  });

  it("fires onGrade with the right rating on click", () => {
    const onGrade = vi.fn();
    render(<GradePanel disabled={false} onGrade={onGrade} intervals={intervals} />);
    fireEvent.click(screen.getByText("Bien"));
    expect(onGrade).toHaveBeenCalledWith(3);
    fireEvent.click(screen.getByText("Otra vez"));
    expect(onGrade).toHaveBeenLastCalledWith(1);
  });

  it("is disabled when prop disabled is true", () => {
    const onGrade = vi.fn();
    render(<GradePanel disabled onGrade={onGrade} intervals={intervals} />);
    fireEvent.click(screen.getByText("Bien"));
    expect(onGrade).not.toHaveBeenCalled();
  });
});
