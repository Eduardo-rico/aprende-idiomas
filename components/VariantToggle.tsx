// components/VariantToggle.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import { cn } from "@/lib/utils";
import type { VariantKey } from "@/lib/data/variant";

// Phase 4: the toggle emits canonical `VariantKey` values ("pt-br" /
// "pt-pt"). The legacy "br" / "pt" aliases are no longer accepted here —
// the localStorage migration in `lib/stores/settings.ts` translated
// any persisted legacy value to its canonical form on first load.
//
// A.6: chrome migrated from shadcn (border-border / bg-primary /
// text-foreground) to Manual Lusitano tokens (border-rule-strong /
// bg-ink text-paper for active / text-ink-muted for inactive).
const VARIANTS: { id: VariantKey; label: string }[] = [
  { id: "pt-br", label: "🇧🇷 BR" },
  { id: "pt-pt", label: "🇵🇹 PT" },
];

export function VariantToggle() {
  const { variant, setVariant, showCompareToggle, toggleCompare } = useSettings();
  return (
    <div className="inline-flex items-center gap-3">
      <div
        className="inline-flex overflow-hidden rounded-md border border-rule-strong"
        data-testid="variant-toggle"
      >
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVariant(v.id)}
            aria-pressed={variant === v.id}
            className={cn(
              "px-3 py-1.5 text-sm font-medium",
              variant === v.id
                ? "bg-ink text-paper"
                : "bg-paper-raised text-ink-muted hover:text-ink",
            )}
            data-testid={`variant-${v.id}`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-1.5 text-xs text-ink-muted">
        <input
          type="checkbox"
          checked={showCompareToggle}
          onChange={toggleCompare}
          data-testid="variant-compare"
        />
        Comparar
      </label>
    </div>
  );
}
