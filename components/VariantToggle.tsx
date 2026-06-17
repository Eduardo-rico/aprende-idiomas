// components/VariantToggle.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import type { VariantKey } from "@/lib/data/variant";

// Phase 4: the toggle emits canonical `VariantKey` values ("pt-br" /
// "pt-pt"). The legacy "br" / "pt" aliases are no longer accepted here —
// the localStorage migration in `lib/stores/settings.ts` translated
// any persisted legacy value to its canonical form on first load.
const VARIANTS: { id: VariantKey; label: string }[] = [
  { id: "pt-br", label: "🇧🇷 BR" },
  { id: "pt-pt", label: "🇵🇹 PT" },
];

export function VariantToggle() {
  const { variant, setVariant, showCompareToggle, toggleCompare } = useSettings();
  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex border border-border rounded-md overflow-hidden">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            onClick={() => setVariant(v.id)}
            className={`px-3 py-1 text-sm font-medium ${variant === v.id ? "bg-primary text-foreground" : "text-muted hover:text-foreground"}`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-1 text-xs text-muted">
        <input type="checkbox" checked={showCompareToggle} onChange={toggleCompare} />
        Comparar
      </label>
    </div>
  );
}
