// tests/unit/cuenta-display-form.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

const setShowContrast = vi.fn();
const setSoundFx = vi.fn();
const toggleCompare = vi.fn();
const setTheme = vi.fn();

vi.mock("@/lib/stores/settings", () => ({
  useSettings: () => ({
    showCompareToggle: false,
    toggleCompare,
    showContrast: true,
    setShowContrast,
    soundFx: true,
    setSoundFx,
  }),
}));

vi.mock("@/components/ThemeProvider", () => ({
  useTheme: () => ({ theme: "light", setTheme }),
}));

import { DisplayForm } from "@/app/[lang]/cuenta/display/DisplayForm";

afterEach(() => {
  cleanup();
  setShowContrast.mockClear();
  setSoundFx.mockClear();
  toggleCompare.mockClear();
  setTheme.mockClear();
});

describe("DisplayForm", () => {
  it("renders all four controls", () => {
    render(<DisplayForm />);
    expect(screen.getByTestId("theme-light")).toBeTruthy();
    expect(screen.getByTestId("theme-dark")).toBeTruthy();
    expect(screen.getByTestId("display-compare")).toBeTruthy();
    expect(screen.getByTestId("display-contrast")).toBeTruthy();
    expect(screen.getByTestId("display-soundfx")).toBeTruthy();
  });

  it("marks the active theme with aria-pressed", () => {
    render(<DisplayForm />);
    expect(screen.getByTestId("theme-light").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("theme-dark").getAttribute("aria-pressed")).toBe("false");
  });

  it("toggles the theme on click", () => {
    render(<DisplayForm />);
    fireEvent.click(screen.getByTestId("theme-dark"));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles the contrast checkbox", () => {
    render(<DisplayForm />);
    fireEvent.click(screen.getByTestId("display-contrast"));
    expect(setShowContrast).toHaveBeenCalledWith(false);
  });
});