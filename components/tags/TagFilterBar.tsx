// components/tags/TagFilterBar.tsx
// Horizontal scrollable list of tag chips. Click a chip to toggle the
// tag in the active filter set; the "Todos" chip clears the set.
// Stateless — the parent owns the Set<string> state.
"use client";
import { useMemo } from "react";
import { TagChip } from "./TagChip";
import { isKnownTag } from "@/lib/db/tags";

interface Props {
  /** Tags available to filter by (in display order). Only known tags
   *  are shown — see lib/db/tags.ts. */
  available: string[];
  /** Currently selected tag set. Empty = "Todos". */
  selected: Set<string>;
  /** Per-tag card count for the "(N)" label. Optional. */
  counts?: Record<string, number>;
  onChange: (next: Set<string>) => void;
}

export function TagFilterBar({ available, selected, counts, onChange }: Props) {
  const known = useMemo(() => available.filter(isKnownTag), [available]);
  const toggle = (tag: string) => {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    onChange(next);
  };
  const clear = () => onChange(new Set());
  if (known.length === 0) return null;
  return (
    <div className="flex gap-2 overflow-x-auto py-1">
      <button
        type="button"
        onClick={clear}
        aria-pressed={selected.size === 0}
        className={
          "px-3 py-1 rounded-full text-xs font-medium border " +
          (selected.size === 0
            ? "bg-foreground text-background border-2 border-foreground"
            : "bg-background text-foreground border border-border hover:border-foreground")
        }
      >
        Todos
      </button>
      {known.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          active={selected.has(tag)}
          count={counts?.[tag]}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}
