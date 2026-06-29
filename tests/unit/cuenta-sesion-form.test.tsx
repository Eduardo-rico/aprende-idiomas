// tests/unit/cuenta-sesion-form.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

const setSessionLength = vi.fn();
const setFatigueCheck = vi.fn();

vi.mock("@/lib/stores/settings", () => ({
  useSettings: () => ({
    sessionLengthMinutes: 20,
    setSessionLength,
    fatigueCheckEnabled: true,
    setFatigueCheck,
  }),
}));

import { SesionForm } from "@/app/[lang]/(config)/cuenta/sesion/SesionForm";

afterEach(() => {
  cleanup();
  setSessionLength.mockClear();
  setFatigueCheck.mockClear();
});

describe("SesionForm", () => {
  it("renders length + fatigue + logout controls", () => {
    render(<SesionForm />);
    expect(screen.getByTestId("sesion-length-20")).toBeTruthy();
    expect(screen.getByTestId("sesion-length-40")).toBeTruthy();
    expect(screen.getByTestId("sesion-fatigue")).toBeTruthy();
    expect(screen.getByTestId("sesion-logout")).toBeTruthy();
  });

  it("marks the active length with aria-pressed", () => {
    render(<SesionForm />);
    expect(screen.getByTestId("sesion-length-20").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("sesion-length-40").getAttribute("aria-pressed")).toBe("false");
  });

  it("calls setSessionLength + setFatigueCheck on save", () => {
    render(<SesionForm />);
    fireEvent.click(screen.getByTestId("sesion-save"));
    expect(setSessionLength).toHaveBeenCalledWith(20);
    expect(setFatigueCheck).toHaveBeenCalledWith(true);
    expect(screen.getByTestId("sesion-saved")).toBeTruthy();
  });

  it("toggles length when 40 is clicked, then saves 40", () => {
    render(<SesionForm />);
    fireEvent.click(screen.getByTestId("sesion-length-40"));
    fireEvent.click(screen.getByTestId("sesion-save"));
    expect(setSessionLength).toHaveBeenCalledWith(40);
  });

  it("toggles the fatigue checkbox", () => {
    render(<SesionForm />);
    fireEvent.click(screen.getByTestId("sesion-fatigue"));
    fireEvent.click(screen.getByTestId("sesion-save"));
    expect(setFatigueCheck).toHaveBeenCalledWith(false);
  });
});