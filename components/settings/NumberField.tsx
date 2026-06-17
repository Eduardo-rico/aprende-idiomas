// components/settings/NumberField.tsx
// Small reusable <label>+<input type="number"> for the FSRS section so
// retention / max interval / leech threshold all read the same.
import type { ChangeEvent } from "react";

interface Props {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  suffix?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
  suffix,
}: Props) {
  return (
    <label className="block space-y-1">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={Number.isFinite(value) ? value : ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(n);
          }}
          min={min}
          max={max}
          step={step}
          className="border border-border rounded-md px-3 py-2 bg-background w-24"
        />
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {hint && <span className="text-xs text-muted-foreground block">{hint}</span>}
    </label>
  );
}
