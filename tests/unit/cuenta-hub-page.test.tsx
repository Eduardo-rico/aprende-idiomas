// tests/unit/cuenta-hub-page.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import CuentaHub from "@/app/[lang]/cuenta/page";

afterEach(() => cleanup());

describe("CuentaHub page", () => {
  it("renders the 4 hub cards", async () => {
    const element = await CuentaHub({ params: Promise.resolve({ lang: "pt" }) });
    render(element);
    expect(screen.getByTestId("cuenta-hub")).toBeTruthy();
    expect(screen.getAllByTestId("hub-card")).toHaveLength(4);
  });

  it("builds card hrefs with the lang prefix", async () => {
    const element = await CuentaHub({ params: Promise.resolve({ lang: "es" }) });
    render(element);
    const hrefs = screen.getAllByTestId("hub-card").map((el) => el.getAttribute("href"));
    expect(hrefs).toEqual([
      "/es/cuenta/preferencias",
      "/es/cuenta/objetivo",
      "/es/cuenta/display",
      "/es/cuenta/sesion",
    ]);
  });

  it("renders the page heading", async () => {
    const element = await CuentaHub({ params: Promise.resolve({ lang: "pt" }) });
    render(element);
    expect(screen.getByRole("heading", { name: "Cuenta", level: 1 })).toBeTruthy();
  });
});