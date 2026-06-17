// components/settings/StepsField.tsx
// Comma-separated input for FSRS learning_steps / relearning_steps.
// Validates each token against /^\d+[mhd]$/ and surfaces invalid tokens
// inline so the user knows what to fix.
import { useState } from "react";

interface Props {
  label: string;
  /** Stored as a string in the fsrs-overrides store; parsed on read. */
  value: string;
  onChange: (s: string) => void;
  hint?: string;
}

const STEP_TOKEN = /^\d+[mhd]$/;

export function StepsField({ label, value, onChange, hint }: Props) {
  const [touched, setTouched] = useState(false);
  const tokens = value.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
  const invalid = tokens.filter((t) => !STEP_TOKEN.test(t));
  const showError = touched && invalid.length > 0;

  return (
    <label className="block space-y-1">
      <span className="text-sm">{label}</span>
      <input
        type="text"
        value={value}
        placeholder="1m, 10m"
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className="border border-border rounded-md px-3 py-2 bg-background w-full"
      />
      {hint && !showError && <span className="text-xs text-muted-foreground block">{hint}</span>}
      {showError && (
        <span className="text-xs text-destructive block">
          Tokens inválidos: {invalid.join(", ")} — usa números + unidad (m/h/d), separados por coma.
        </span>
      )}
    </label>
  );
}
