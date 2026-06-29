// tests/unit/cuenta-objetivo-form.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

const setDailyGoal = vi.fn();

vi.mock("@/lib/stores/settings", () => ({
  useSettings: () => ({
    dailyGoalMinutes: 20,
    setDailyGoal,
  }),
}));

import { ObjetivoForm } from "@/app/[lang]/(config)/cuenta/objetivo/ObjetivoForm";

afterEach(() => {
  cleanup();
  setDailyGoal.mockClear();
});

describe("ObjetivoForm", () => {
  it("renders the initial value from the store", () => {
    render(<ObjetivoForm />);
    expect(screen.getByTestId("objetivo-value").textContent).toBe("20 min");
  });

  it("updates the local value when the slider changes", () => {
    render(<ObjetivoForm />);
    const slider = screen.getByTestId("objetivo-slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "30" } });
    expect(screen.getByTestId("objetivo-value").textContent).toBe("30 min");
  });

  it("calls setDailyGoal and shows the saved chip on save", () => {
    render(<ObjetivoForm />);
    fireEvent.click(screen.getByTestId("objetivo-save"));
    expect(setDailyGoal).toHaveBeenCalledWith(20);
    expect(screen.getByTestId("objetivo-saved")).toBeTruthy();
  });
});