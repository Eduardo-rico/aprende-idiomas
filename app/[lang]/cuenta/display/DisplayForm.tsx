// app/[lang]/cuenta/display/DisplayForm.tsx
"use client";
import { useTheme } from "@/components/ThemeProvider";
import { useSettings } from "@/lib/stores/settings";
import { Eyebrow } from "@/components/ui/eyebrow";

export function DisplayForm() {
  const { theme, setTheme } = useTheme();
  const {
    showCompareToggle,
    toggleCompare,
    showContrast,
    setShowContrast,
    soundFx,
    setSoundFx,
  } = useSettings();

  return (
    <div data-testid="display-form" className="space-y-8">
      <section>
        <Eyebrow>Tema</Eyebrow>
        <div className="mt-4 inline-flex overflow-hidden rounded-md border border-rule-strong">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              aria-pressed={theme === t}
              className={
                theme === t
                  ? "bg-ink text-paper px-4 py-2 text-sm font-medium"
                  : "bg-paper-raised text-ink-muted px-4 py-2 text-sm hover:text-ink"
              }
              data-testid={`theme-${t}`}
            >
              {t === "light" ? "Claro" : "Oscuro"}
            </button>
          ))}
        </div>
      </section>
      <section>
        <Eyebrow>Ayudas en pantalla</Eyebrow>
        <div className="mt-4 space-y-2">
          <ToggleRow
            label='Mostrar toggle «Comparar BR ↔ PT» en cards'
            checked={showCompareToggle}
            onChange={toggleCompare}
            testId="display-compare"
          />
          <ToggleRow
            label="Mostrar pista para hispanohablantes (esContrast)"
            checked={showContrast}
            onChange={setShowContrast}
            testId="display-contrast"
          />
        </div>
      </section>
      <section>
        <Eyebrow>Sonido</Eyebrow>
        <div className="mt-4">
          <ToggleRow
            label="Efectos de sonido (ding/boop/confetti)"
            checked={soundFx}
            onChange={setSoundFx}
            testId="display-soundfx"
          />
        </div>
      </section>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
  testId,
}: {
  label: string;
  checked: boolean;
  onChange: (b: boolean) => void;
  testId: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-testid={testId}
      />
      {label}
    </label>
  );
}