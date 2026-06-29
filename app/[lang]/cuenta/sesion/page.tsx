// app/[lang]/cuenta/sesion/page.tsx
// Sub-view for session length + fatigue check + logout. Server shell
// wraps the client SesionForm which writes the new sessionLengthMinutes
// and fatigueCheckEnabled fields to the Zustand store.
import { CuentaNav } from "@/components/cuenta/CuentaNav";
import { SesionForm } from "./SesionForm";

export default async function SesionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <main
      className="mx-auto max-w-[640px] px-6 py-12"
      data-testid="cuenta-sesion"
    >
      <h1 className="mb-1.5 font-display text-[39px]">Sesión</h1>
      <p className="mb-8 text-ink-muted">
        Duración, fatiga, sesión de la cuenta.
      </p>
      <CuentaNav lang={lang} active="sesion" />
      <SesionForm />
    </main>
  );
}