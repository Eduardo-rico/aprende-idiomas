// app/[lang]/cuenta/objetivo/ObjetivoForm.tsx
"use client";
import { useState } from "react";
import { useSettings } from "@/lib/stores/settings";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export function ObjetivoForm() {
  const { dailyGoalMinutes, setDailyGoal } = useSettings();
  const [goal, setGoal] = useState(dailyGoalMinutes);
  const [saved, setSaved] = useState(false);

  function save() {
    setDailyGoal(goal);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div data-testid="objetivo-form">
      <Eyebrow>Minutos por día</Eyebrow>
      <div className="mt-5 flex items-center gap-4">
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          className="flex-1 accent-[var(--lesson)]"
          aria-label="Minutos por día"
          data-testid="objetivo-slider"
        />
        <span
          className="w-20 text-right font-display text-2xl"
          data-testid="objetivo-value"
        >
          {goal} min
        </span>
      </div>
      <p className="mt-2 text-xs text-ink-faint">
        Entre 5 y 60 minutos, en pasos de 5.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" onClick={save} data-testid="objetivo-save">
          Guardar
        </Button>
        {saved && (
          <span
            data-testid="objetivo-saved"
            className="text-sm text-lesson"
          >
            ✓ Guardado
          </span>
        )}
      </div>
    </div>
  );
}