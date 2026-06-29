// app/[lang]/(config)/cuenta/sesion/page.tsx
// Sub-view for session length + fatigue check + logout. Server shell
// wraps the client SesionForm which writes the new sessionLengthMinutes
// and fatigueCheckEnabled fields to the Zustand store. The semantic
// <main> wrapper is owned by app/[lang]/(config)/cuenta/layout.tsx;
// this page is a <div> with its own narrower max-width.
import { CuentaNav } from "@/components/cuenta/CuentaNav";
import { SesionForm } from "./SesionForm";

export default async function SesionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div
      className="mx-auto max-w-[640px]"
      data-testid="cuenta-sesion"
    >
      <h1 className="mb-1.5 font-display text-[39px]">Sesión</h1>
      <p className="mb-8 text-ink-muted">
        Duración, fatiga, sesión de la cuenta.
      </p>
      <CuentaNav lang={lang} active="sesion" />
      <SesionForm />
    </div>
  );
}