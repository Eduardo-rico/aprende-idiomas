// app/[lang]/settings/page.tsx
// Settings are global; the lang segment exists only so the URL is well-formed
// under the [lang] gate. We accept `params` to satisfy the type but don't
// thread lang into Zustand — the store is process-global.
"use client";
import { useSettings } from "@/lib/stores/settings";
import { useTheme } from "@/components/ThemeProvider";
import { VariantToggle } from "@/components/VariantToggle";
import { VoicePicker } from "@/components/VoicePicker";
import { Section } from "@/components/settings/Section";
import { FsrsSection } from "@/components/settings/FsrsSection";

export default function SettingsPage({
  params: _params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const {
    dailyGoalMinutes, showCompareToggle, showContrast, soundFx,
    localPracticeFilter,
    setDailyGoal, toggleCompare, setShowContrast, setSoundFx, setLocalPracticeFilter,
  } = useSettings();
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

      <Section title="FSRS">
        <FsrsSection />
      </Section>

      <Section title="Práctica local">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={localPracticeFilter}
            onChange={(e) => setLocalPracticeFilter(e.target.checked)}
          />
          Filtrar <code>/practice/[lessonId]</code> a tarjetas listas
        </label>
        <p className="text-xs text-muted-foreground">
          Cuando está activo, las páginas de práctica solo muestran tarjetas
          nuevas o con repaso vencido. Las tarjetas programadas para más tarde
          se ocultan (con un aviso de cuántas hay).
        </p>
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

      <Section title="Sesión">
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            // Hard nav so the proxy re-runs and redirects to /login.
            window.location.href = "/login";
          }}
          className="px-4 py-2 border border-border rounded-md text-sm hover:border-foreground"
        >
          Cerrar sesión
        </button>
      </Section>
    </div>
  );
}
