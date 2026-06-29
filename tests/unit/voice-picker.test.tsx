// tests/unit/voice-picker.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

const setVoicePref = vi.fn();

vi.mock("@/lib/stores/settings", () => ({
  useSettings: () => ({
    variant: "pt-br",
    voicePref: { "pt-br": "default", "pt-pt": "default" },
    setVoicePref,
  }),
}));

import { VoicePicker } from "@/components/VoicePicker";

afterEach(() => {
  cleanup();
  setVoicePref.mockClear();
});

describe("VoicePicker (Manual Lusitano chrome)", () => {
  it("renders the select with the current voice", () => {
    render(<VoicePicker />);
    const select = screen.getByTestId("voice-picker") as HTMLSelectElement;
    expect(select.value).toBe("default");
  });

  it("calls setVoicePref on change with the active variant", () => {
    render(<VoicePicker />);
    const select = screen.getByTestId("voice-picker") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "default" } });
    expect(setVoicePref).toHaveBeenCalledWith("pt-br", "default");
  });
});