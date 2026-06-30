// components/bloque/BloqueBreadcrumb.tsx
// Small "Bloque {n}" eyebrow shown above the page h1 in lesson/block
// detail views. Was hand-rolled 3 times:
//   - app/[lang]/blocks/[id]/page.tsx                → "Bloque {n}"
//   - app/[lang]/blocks/[id]/lessons/[lid]/page.tsx  → "Bloque {n} · Lección"
//   - app/[lang]/lessons/[lessonId]/page.tsx         → "Lección · Bloque {n}"
// (The 4th site stories/[id]/page.tsx uses text-sm + <p> wrapper, which
// is a deliberate per-page override — out of scope here.)
//
// Server-renderable (no hooks). Accepts the block id and an optional
// position specifier that places the "Lección" word either before or
// after the block id.
export function BloqueBreadcrumb({
  blockId,
  suffix,
}: {
  blockId: number | string;
  suffix?: "lesson-after" | "lesson-before";
}) {
  const text =
    suffix === "lesson-after"
      ? `Bloque ${blockId} · Lección`
      : suffix === "lesson-before"
        ? `Lección · Bloque ${blockId}`
        : `Bloque ${blockId}`;
  return <div className="text-xs text-ink-muted">{text}</div>;
}