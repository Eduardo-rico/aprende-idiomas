// components/settings/FsrsSection.tsx
// Composes the 8 FSRS_CONFIG fields into a single /settings section.
// Reads defaults from lib/srs/config.ts and per-field overrides from
// the persisted useFsrsOverrides store. The "Reset to defaults" button
// clears the override store.
"use client";
import { FSRS_CONFIG } from "@/lib/srs/config";
import { useFsrsOverrides, type FsrsOverrides } from "@/lib/stores/fsrs-overrides";
import { NumberField } from "./NumberField";
import { StepsField } from "./StepsField";

function num(o: FsrsOverrides, k: keyof FsrsOverrides, fallback: number): number {
  const v = o[k];
  return typeof v === "number" ? v : fallback;
}
function bool(o: FsrsOverrides, k: keyof FsrsOverrides, fallback: boolean): boolean {
  const v = o[k];
  return typeof v === "boolean" ? v : fallback;
}
function str(o: FsrsOverrides, k: keyof FsrsOverrides, fallback: string): string {
  const v = o[k];
  return typeof v === "string" ? v : fallback;
}

export function FsrsSection() {
  const { overrides, setOverride, clearOverrides } = useFsrsOverrides();
  const isDirty = Object.keys(overrides).length > 0;

  return (
    <div className="space-y-4">
      <NumberField
        label="Retención objetivo"
        value={num(overrides, "request_retention", FSRS_CONFIG.request_retention)}
        onChange={(n) => setOverride("request_retention", Math.min(0.99, Math.max(0.5, n)))}
        min={0.5}
        max={0.99}
        step={0.05}
        hint="Probabilidad de recordar una tarjeta al verla. 0.9 = 90 %."
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={bool(overrides, "enable_fuzz", FSRS_CONFIG.enable_fuzz)}
          onChange={(e) => setOverride("enable_fuzz", e.target.checked)}
        />
        Aplicar fuzz (±5 % de jitter en los intervalos)
      </label>
      <NumberField
        label="Intervalo máximo"
        value={num(overrides, "maximum_interval", FSRS_CONFIG.maximum_interval)}
        onChange={(n) => setOverride("maximum_interval", Math.max(1, n))}
        min={1}
        max={3650}
        step={1}
        suffix="días"
        hint="Tope para cualquier intervalo individual. 365 = 1 año."
      />
      <StepsField
        label="Pasos de aprendizaje"
        value={str(overrides, "learning_steps", FSRS_CONFIG.learning_steps.join(", "))}
        onChange={(s) => setOverride("learning_steps", s)}
        hint="Pasos (en min/h/d) que sigue una tarjeta nueva antes de graduarse a Repaso."
      />
      <StepsField
        label="Pasos de reaprendizaje"
        value={str(overrides, "relearning_steps", FSRS_CONFIG.relearning_steps.join(", "))}
        onChange={(s) => setOverride("relearning_steps", s)}
        hint="Pasos que sigue una tarjeta que fallaste en Repaso antes de volver."
      />
      <NumberField
        label="Tope diario de repasos"
        value={num(overrides, "daily_review_cap", FSRS_CONFIG.daily_review_cap)}
        onChange={(n) => setOverride("daily_review_cap", Math.max(1, n))}
        min={1}
        max={500}
        step={10}
        suffix="tarjetas/sesión"
      />
      <NumberField
        label="Tarjetas nuevas por día"
        value={num(overrides, "new_cards_per_day", FSRS_CONFIG.new_cards_per_day)}
        onChange={(n) => setOverride("new_cards_per_day", Math.max(0, n))}
        min={0}
        max={50}
        step={1}
        suffix="tarjetas/sesión"
      />
      <NumberField
        label="Umbral de leech"
        value={num(overrides, "leech_lapses_threshold", FSRS_CONFIG.leech_lapses_threshold)}
        onChange={(n) => setOverride("leech_lapses_threshold", Math.max(1, n))}
        min={1}
        max={50}
        step={1}
        suffix="fallos"
        hint="Una tarjeta se marca como leech cuando la fallas en Repaso esta cantidad de veces."
      />
      {isDirty && (
        <button
          onClick={clearOverrides}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Restaurar valores predeterminados
        </button>
      )}
    </div>
  );
}
