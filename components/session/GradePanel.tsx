// components/session/GradePanel.tsx
// 4 buttons (Otra vez / Difícil / Bien / Fácil) with the resulting
// interval and the keyboard shortcut. Matches design-mockups/sesion.html:64-74.
"use client";
import { formatInterval } from "@/lib/srs/intervals";
import type { GradeRating } from "@/lib/hooks/useGradeKeyboard";

const LABELS: Record<GradeRating, string> = {
  1: "Otra vez",
  2: "Difícil",
  3: "Bien",
  4: "Fácil",
};

const ACCENT: Record<GradeRating, string> = {
  1: "border-error text-error",
  2: "text-review",
  3: "border-lesson text-lesson",
  4: "text-info",
};

export function GradePanel({
  disabled,
  onGrade,
  intervals,
}: {
  disabled: boolean;
  onGrade: (rating: GradeRating) => void;
  intervals: { again: number; hard: number; good: number; easy: number };
}) {
  const buttons: Array<{ rating: GradeRating; interval: number }> = [
    { rating: 1, interval: intervals.again },
    { rating: 2, interval: intervals.hard },
    { rating: 3, interval: intervals.good },
    { rating: 4, interval: intervals.easy },
  ];

  return (
    <div className="grid grid-cols-4 gap-2" data-testid="grade-panel">
      {buttons.map(({ rating, interval }) => {
        const labelColor = ACCENT[rating].split(" ").find((c) => c.startsWith("text-")) ?? "";
        const borderColor = ACCENT[rating].split(" ").find((c) => c.startsWith("border-")) ?? "";
        return (
          <button
            key={rating}
            type="button"
            disabled={disabled}
            onClick={() => onGrade(rating)}
            className={`rounded-[10px] border ${borderColor || "border-rule-strong"} bg-paper-raised p-3 text-center transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-px hover:shadow-sm disabled:opacity-50 disabled:hover:translate-y-0`}
          >
            <div className={`text-[15px] font-semibold ${labelColor}`}>{LABELS[rating]}</div>
            <div className="mt-1 font-mono text-[11px] text-ink-faint">{formatInterval(interval)}</div>
            <div className="mt-1.5 font-mono text-[10px] text-ink-faint">[{rating}]</div>
          </button>
        );
      })}
    </div>
  );
}
