// components/tags/TagChip.tsx
// Pill rendering for a single tag. Stateless — the parent decides
// whether the chip is "active" (filter on) or "inactive".
"use client";
import { parseTag, tagColor, tagLabel, type TagChipColor } from "@/lib/db/tags";

const COLOR_CLASSES: Record<TagChipColor, string> = {
  primary: "bg-primary text-fg",
  accent:  "bg-accent text-fg",
  warning: "bg-warning text-fg",
  muted:   "bg-muted text-muted-foreground",
};

const ACTIVE_BORDER: Record<TagChipColor, string> = {
  primary: "border-primary",
  accent:  "border-accent",
  warning: "border-warning",
  muted:   "border-muted-foreground",
};

interface Props {
  tag: string;
  active: boolean;
  count?: number;
  onToggle: (tag: string) => void;
}

export function TagChip({ tag, active, count, onToggle }: Props) {
  const family = parseTag(tag).family;
  const color = tagColor(family);
  const label = tagLabel(tag);
  return (
    <button
      type="button"
      onClick={() => onToggle(tag)}
      aria-pressed={active}
      className={
        "px-3 py-1 rounded-full text-xs font-medium border transition-colors " +
        (active
          ? `${COLOR_CLASSES[color]} ${ACTIVE_BORDER[color]} border-2`
          : `bg-background text-foreground border border-border hover:${ACTIVE_BORDER[color]}`)
      }
    >
      {label}
      {typeof count === "number" && (
        <span className="ml-1.5 opacity-75">({count})</span>
      )}
    </button>
  );
}
