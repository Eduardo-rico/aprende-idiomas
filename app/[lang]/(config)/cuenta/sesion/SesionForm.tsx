// app/[lang]/cuenta/sesion/SesionForm.tsx
"use client";
import { useState } from "react";
import { useSettings } from "@/lib/stores/settings";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export function SesionForm() {
  const {
    sessionLengthMinutes,
    setSessionLength,
    fatigueCheckEnabled,
    setFatigueCheck,
  } = useSettings();
  const [length, setLength] = useState<20 | 40>(sessionLengthMinutes);
  const [fatigue, setFatigue] = useState(fatigueCheckEnabled);
  const [saved, setSaved] = useState(false);

  function save() {
    setSessionLength(length);
    setFatigueCheck(fatigue);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div data-testid="sesion-form" className="space-y-8">
      <section>
        <Eyebrow>Duración</Eyebrow>
        <div className="mt-4 inline-flex overflow-hidden rounded-md border border-rule-strong">
          {([20, 40] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLength(l)}
              aria-pressed={length === l}
              className={
                length === l
                  ? "bg-ink text-paper px-5 py-2 text-sm font-medium"
                  : "bg-paper-raised text-ink-muted px-5 py-2 text-sm hover:text-ink"
              }
              data-testid={`sesion-length-${l}`}
            >
              {l} min
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          20 min por defecto. 40 min con opt-in tras terminar una sesión corta.
        </p>
      </section>
      <section>
        <Eyebrow>Fatiga</Eyebrow>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={fatigue}
            onChange={(e) => setFatigue(e.target.checked)}
            data-testid="sesion-fatigue"
          />
          Aviso de fatiga a los 18 min
        </label>
      </section>
      <section>
        <Eyebrow>Cuenta</Eyebrow>
        <Button
          variant="destructive"
          className="mt-4"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          data-testid="sesion-logout"
        >
          Cerrar sesión
        </Button>
      </section>
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={save} data-testid="sesion-save">
          Guardar
        </Button>
        {saved && (
          <span data-testid="sesion-saved" className="text-sm text-lesson">
            ✓ Guardado
          </span>
        )}
      </div>
    </div>
  );
}