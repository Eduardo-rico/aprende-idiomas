// components/lessons/MarginNotesColumn.tsx
// Right-hand margin column for editorial lesson pages. Each entry is a
// `<MarginNote>` (tip / warn / es / variant). On mobile (<=880px) the
// column collapses inline above/below the prose and loses its 120px
// top offset.
import { MarginNote } from "@/components/ui";

export interface MarginNoteEntry {
  variant: "tip" | "warn" | "es" | "variant";
  label: string;
  body: string;
}

interface Props { notes: MarginNoteEntry[]; }

export function MarginNotesColumn({ notes }: Props) {
  if (notes.length === 0) return null;
  return (
    <aside className="flex flex-col gap-[18px] pt-[120px] max-md:pt-8">
      {notes.map((n, i) => (
        <MarginNote key={i} variant={n.variant} label={n.label}>
          {n.body}
        </MarginNote>
      ))}
    </aside>
  );
}
