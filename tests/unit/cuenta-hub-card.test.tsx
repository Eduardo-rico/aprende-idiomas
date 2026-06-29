// tests/unit/cuenta-hub-card.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { HubCard } from "@/components/cuenta/HubCard";

afterEach(() => cleanup());

describe("HubCard", () => {
  it("renders title + description", () => {
    render(<HubCard href="/pt/cuenta/objetivo" title="Objetivo" desc="Minutos por día" />);
    expect(screen.getByText("Objetivo")).toBeTruthy();
    expect(screen.getByText("Minutos por día")).toBeTruthy();
  });

  it("wraps the card in a Link with the given href", () => {
    render(<HubCard href="/pt/cuenta/display" title="D" desc="d" />);
    const card = screen.getByTestId("hub-card");
    expect(card.tagName.toLowerCase()).toBe("a");
    expect(card.getAttribute("href")).toBe("/pt/cuenta/display");
  });
});