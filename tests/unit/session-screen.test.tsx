// tests/unit/session-screen.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { SessionScreen } from "@/components/session/SessionScreen";
import type { Exercise } from "@/lib/data/zod-schemas";

afterEach(() => cleanup());

const ex = {
  id: "x1",
  type: "flashcard",
  blockId: 1,
  lessonId: "b1-l1",
  data: { front: "poupar", back: "ahorrar", example: "Vou poupar dinheiro." },
  concepts: ["b1-vocab"],
  tags: ["vocab"],
  difficulty: 1,
} as unknown as Exercise;

const ex2 = {
  ...ex,
  id: "x2",
  data: { front: "outro", back: "otro", example: "outro exemplo." },
} as unknown as Exercise;

describe("SessionScreen", () => {
  it("renders the topbar and the first card", () => {
    render(
      <SessionScreen exercises={[ex]} onFinish={() => {}} onClose={() => {}} lang="pt" />,
    );
    expect(screen.getByTestId("session-topbar")).toBeTruthy();
    expect(screen.getByText("poupar")).toBeTruthy();
    expect(screen.getByTestId("session-count").textContent).toBe("1 / 1");
  });

  it("reveals on click and advances on grade", () => {
    const onFinish = vi.fn();
    render(
      <SessionScreen
        exercises={[ex, ex2]}
        onFinish={onFinish}
        onClose={() => {}}
        lang="pt"
      />,
    );
    fireEvent.click(screen.getByTestId("reveal-button"));
    expect(screen.getByTestId("reveal-block")).toBeTruthy();
    fireEvent.click(screen.getByText("Bien"));
    expect(screen.getByText("outro")).toBeTruthy();
    expect(screen.getByTestId("session-count").textContent).toBe("2 / 2");
  });

  it("calls onFinish with stats after last card", () => {
    const onFinish = vi.fn();
    render(
      <SessionScreen exercises={[ex]} onFinish={onFinish} onClose={() => {}} lang="pt" />,
    );
    fireEvent.click(screen.getByTestId("reveal-button"));
    fireEvent.click(screen.getByText("Bien"));
    expect(onFinish).toHaveBeenCalledWith({ reviewed: 1, correct: 1 });
  });

  it("counts Again as incorrect", () => {
    const onFinish = vi.fn();
    render(
      <SessionScreen exercises={[ex]} onFinish={onFinish} onClose={() => {}} lang="pt" />,
    );
    fireEvent.click(screen.getByTestId("reveal-button"));
    fireEvent.click(screen.getByText("Otra vez"));
    expect(onFinish).toHaveBeenCalledWith({ reviewed: 1, correct: 0 });
  });
});
