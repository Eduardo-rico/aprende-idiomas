// tests/unit/session-card-display.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { SessionCardDisplay } from "@/components/session/SessionCardDisplay";
import type { Exercise } from "@/lib/data/zod-schemas";

afterEach(() => cleanup());

const flashcardEx = {
  id: "x1",
  type: "flashcard",
  blockId: 1,
  lessonId: "b1-l1",
  data: { front: "poupar", back: "ahorrar", example: "Vou poupar dinheiro." },
  concepts: ["b1-vocab"],
  tags: ["vocab"],
  difficulty: 1,
  esContrast: "no es popar — es ahorrar",
} as unknown as Exercise;

describe("SessionCardDisplay", () => {
  it("renders the front word in display serif", () => {
    render(
      <SessionCardDisplay
        exercise={flashcardEx}
        reveal={false}
        onReveal={() => {}}
        onPlayAudio={() => {}}
        lang="pt"
      />,
    );
    expect(screen.getByText("poupar")).toBeTruthy();
    expect(screen.getByText("¿Qué significa en español?")).toBeTruthy();
  });

  it("renders the reveal block when reveal=true", () => {
    render(
      <SessionCardDisplay
        exercise={flashcardEx}
        reveal
        onReveal={() => {}}
        onPlayAudio={() => {}}
        lang="pt"
      />,
    );
    expect(screen.getByText("ahorrar")).toBeTruthy();
    expect(screen.getByText(/Vou poupar dinheiro/)).toBeTruthy();
    expect(screen.getByTestId("es-contrast").textContent).toMatch(/no es popar/);
  });

  it("calls onReveal when 'Mostrar respuesta' is clicked", () => {
    const onReveal = vi.fn();
    render(
      <SessionCardDisplay
        exercise={flashcardEx}
        reveal={false}
        onReveal={onReveal}
        onPlayAudio={() => {}}
        lang="pt"
      />,
    );
    fireEvent.click(screen.getByTestId("reveal-button"));
    expect(onReveal).toHaveBeenCalledTimes(1);
  });
});
