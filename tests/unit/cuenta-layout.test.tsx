// tests/unit/cuenta-layout.test.tsx
// @vitest-environment jsdom
// Verifies that the (config)/cuenta route-group layout (B.1) wraps its
// children in a semantic <main data-testid="cuenta-layout"> so each
// sub-page doesn't render its own <main> (which was invalid HTML).
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import CuentaLayout from "@/app/[lang]/(config)/cuenta/layout";

afterEach(() => cleanup());

describe("CuentaLayout (route-group)", () => {
  it("wraps children in a semantic <main> with the cuenta-layout test-id", () => {
    render(
      <CuentaLayout>
        <span data-testid="child">hello</span>
      </CuentaLayout>
    );
    const wrapper = screen.getByTestId("cuenta-layout");
    expect(wrapper.tagName.toLowerCase()).toBe("main");
    expect(wrapper.contains(screen.getByTestId("child"))).toBe(true);
  });
});