// tests/unit/grade-keyboard.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useGradeKeyboard } from "@/lib/hooks/useGradeKeyboard";
import { useState } from "react";

afterEach(() => cleanup());

function Harness({ enabled, onGrade }: { enabled: boolean; onGrade: (r: 1 | 2 | 3 | 4) => void }) {
  useGradeKeyboard({ enabled, onGrade });
  return null;
}

describe("useGradeKeyboard", () => {
  it("fires onGrade with 1..4 on digit keys", () => {
    const onGrade = vi.fn();
    render(<Harness enabled onGrade={onGrade} />);
    for (const k of ["1", "2", "3", "4"]) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
      expect(onGrade).toHaveBeenLastCalledWith(Number(k) as 1 | 2 | 3 | 4);
    }
    expect(onGrade).toHaveBeenCalledTimes(4);
  });

  it("does nothing when disabled", () => {
    const onGrade = vi.fn();
    render(<Harness enabled={false} onGrade={onGrade} />);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
    expect(onGrade).not.toHaveBeenCalled();
  });

  it("suppresses when target is an INPUT", () => {
    const onGrade = vi.fn();
    render(<Harness enabled onGrade={onGrade} />);
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
    expect(onGrade).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it("ignores modifier-key combinations", () => {
    const onGrade = vi.fn();
    render(<Harness enabled onGrade={onGrade} />);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", metaKey: true, bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "2", ctrlKey: true, bubbles: true }));
    expect(onGrade).not.toHaveBeenCalled();
  });
});
