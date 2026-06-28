// components/session/ExerciseHead.tsx
// Row above the card: type chip (lesson or info accent) + concept-id in
// mono. Matches design-mockups/sesion.html:41-46.
"use client";

export function ExerciseHead({
  typeLabel,
  typeAccent,
  conceptId,
}: {
  typeLabel: string;
  typeAccent: "lesson" | "info";
  conceptId: string;
}) {
  const accent =
    typeAccent === "info"
      ? "bg-info-soft text-info"
      : "bg-lesson-soft text-lesson";
  return (
    <div className="mb-8 flex items-center justify-between" data-testid="exercise-head">
      <span
        className={`rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[.07em] ${accent}`}
      >
        {typeLabel}
      </span>
      <span className="font-mono text-[13px] text-ink-faint">{conceptId}</span>
    </div>
  );
}
