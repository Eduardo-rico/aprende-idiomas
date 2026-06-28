// lib/hooks/useGradeKeyboard.ts
// Window-level keydown listener for the 4-button grade panel. Maps
// [1]=Again, [2]=Hard, [3]=Good, [4]=Easy. Suppresses when focus is
// inside an editable element so ClozeCard / ProductionCard inputs
// (WS-D.2/D.3) don't get hijacked once they land.
"use client";
import { useEffect } from "react";

export type GradeRating = 1 | 2 | 3 | 4;

export function useGradeKeyboard({
  enabled,
  onGrade,
}: {
  enabled: boolean;
  onGrade: (rating: GradeRating) => void;
}): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      const digit = e.key;
      if (digit !== "1" && digit !== "2" && digit !== "3" && digit !== "4") return;
      e.preventDefault();
      onGrade(Number(digit) as GradeRating);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onGrade]);
}
