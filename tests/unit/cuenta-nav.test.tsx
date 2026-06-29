// tests/unit/cuenta-nav.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CuentaNav } from "@/components/cuenta/CuentaNav";

afterEach(() => cleanup());

describe("CuentaNav", () => {
  it("renders Hub + 4 sub-view links", () => {
    render(<CuentaNav lang="pt" />);
    expect(screen.getByTestId("cuenta-nav-hub")).toBeTruthy();
    expect(screen.getByTestId("cuenta-nav-preferencias")).toBeTruthy();
    expect(screen.getByTestId("cuenta-nav-objetivo")).toBeTruthy();
    expect(screen.getByTestId("cuenta-nav-display")).toBeTruthy();
    expect(screen.getByTestId("cuenta-nav-sesion")).toBeTruthy();
  });

  it("builds hrefs with the lang prefix", () => {
    render(<CuentaNav lang="pt" />);
    expect(screen.getByTestId("cuenta-nav-hub").getAttribute("href")).toBe("/pt/cuenta");
    expect(screen.getByTestId("cuenta-nav-preferencias").getAttribute("href")).toBe("/pt/cuenta/preferencias");
  });

  it("highlights the Hub when no active key", () => {
    render(<CuentaNav lang="pt" />);
    expect(screen.getByTestId("cuenta-nav-hub").className).toContain("bg-ink");
    expect(screen.getByTestId("cuenta-nav-preferencias").className).not.toContain("bg-ink");
  });

  it("highlights the active sub-view", () => {
    render(<CuentaNav lang="pt" active="display" />);
    expect(screen.getByTestId("cuenta-nav-display").className).toContain("bg-ink");
    expect(screen.getByTestId("cuenta-nav-hub").className).not.toContain("bg-ink");
  });
});