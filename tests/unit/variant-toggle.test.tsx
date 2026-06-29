// tests/unit/variant-toggle.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

const setVariant = vi.fn();
const toggleCompare = vi.fn();

vi.mock("@/lib/stores/settings", () => ({
  useSettings: () => ({
    variant: "pt-br",
    setVariant,
    showCompareToggle: false,
    toggleCompare,
  }),
}));

import { VariantToggle } from "@/components/VariantToggle";

afterEach(() => {
  cleanup();
  setVariant.mockClear();
  toggleCompare.mockClear();
});

describe("VariantToggle (Manual Lusitano chrome)", () => {
  it("renders both variant buttons", () => {
    render(<VariantToggle />);
    expect(screen.getByTestId("variant-pt-br")).toBeTruthy();
    expect(screen.getByTestId("variant-pt-pt")).toBeTruthy();
  });

  it("marks the active variant with aria-pressed", () => {
    render(<VariantToggle />);
    expect(screen.getByTestId("variant-pt-br").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("variant-pt-pt").getAttribute("aria-pressed")).toBe("false");
  });

  it("calls setVariant on click", () => {
    render(<VariantToggle />);
    fireEvent.click(screen.getByTestId("variant-pt-pt"));
    expect(setVariant).toHaveBeenCalledWith("pt-pt");
  });

  it("toggles the compare checkbox", () => {
    render(<VariantToggle />);
    fireEvent.click(screen.getByTestId("variant-compare"));
    expect(toggleCompare).toHaveBeenCalled();
  });
});