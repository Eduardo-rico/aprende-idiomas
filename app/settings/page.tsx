// app/settings/page.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import { useTheme } from "@/components/ThemeProvider";
import { VariantToggle } from "@/components/VariantToggle";
import { VoicePicker } from "@/components/VoicePicker";

export default function SettingsPage() {
  const { dailyGoalMinutes, showCompareToggle, showContrast, soundFx, setDailyGoal, toggleCompare, setShowContrast, setSoundFx } = useSettings();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-display text-4xl">Settings</h1>

      <Section title="Variante">
        <VariantToggle />
      </Section>

      <Section title="Voz del audio">
        <VoicePicker />
      </Section>

      <Section title="Tema">
        <select value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")} className="border border-border rounded-md px-3 py-2 bg-background">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
      </Section>

      <Section title="Meta diaria (minutos)">
        <input
          type="number" min={5} max={120} step={5}
          value={dailyGoalMinutes}
          onChange={(e) => setDailyGoal(Number(e.target.value))}
          className="border border-border rounded-md px-3 py-2 bg-background w-24"
        />
      </Section>

      <Section title="Display">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showCompareToggle} onChange={toggleCompare} />
          Mostrar toggle &quot;Comparar BR ↔ PT&quot; en cards
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showContrast} onChange={(e) => setShowContrast(e.target.checked)} />
          Mostrar pista para hispanohablantes (esContrast)
        </label>
      </Section>

      <Section title="Sonido">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={soundFx} onChange={(e) => setSoundFx(e.target.checked)} />
          Efectos de sonido (ding/boop/confetti)
        </label>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border rounded-lg p-4 space-y-2">
      <h2 className="font-medium">{title}</h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}
