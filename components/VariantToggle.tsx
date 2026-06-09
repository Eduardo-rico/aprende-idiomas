// components/VariantToggle.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import type { Variant } from "@/lib/db/schema";

export function VariantToggle() {
  const { variant, setVariant, showCompareToggle, toggleCompare } = useSettings();
  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex border border-border rounded-md overflow-hidden">
        {(["br", "pt"] as Variant[]).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-3 py-1 text-sm font-medium ${variant === v ? "bg-primary text-fg" : "text-muted hover:text-foreground"}`}
          >
            {v === "br" ? "🇧🇷 BR" : "🇵🇹 PT"}
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
