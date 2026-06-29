// app/[lang]/cuenta/objetivo/page.tsx
// Sub-view for the daily-goal slider. Server shell wraps the client
// ObjetivoForm which reads/writes the dailyGoalMinutes field in the
// Zustand useSettings store (persisted to localStorage as "app-settings").
import { CuentaNav } from "@/components/cuenta/CuentaNav";
import { ObjetivoForm } from "./ObjetivoForm";

export default async function ObjetivoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <main
      className="mx-auto max-w-[640px] px-6 py-12"
      data-testid="cuenta-objetivo"
    >
      <h1 className="mb-1.5 font-display text-[39px]">Objetivo diario</h1>
      <p className="mb-8 text-ink-muted">
        Cuántos minutos al día querés estudiar.
      </p>
      <CuentaNav lang={lang} active="objetivo" />
      <ObjetivoForm />
    </main>
  );
}