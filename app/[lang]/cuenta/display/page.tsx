// app/[lang]/cuenta/display/page.tsx
// Sub-view for theme + on-screen toggles. Server shell wraps the client
// DisplayForm which writes to the Zustand store (toggles) and the
// ThemeProvider (theme).
import { CuentaNav } from "@/components/cuenta/CuentaNav";
import { DisplayForm } from "./DisplayForm";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <main
      className="mx-auto max-w-[640px] px-6 py-12"
      data-testid="cuenta-display"
    >
      <h1 className="mb-1.5 font-display text-[39px]">Display</h1>
      <p className="mb-8 text-ink-muted">
        Tema visual y ayudas en pantalla.
      </p>
      <CuentaNav lang={lang} active="display" />
      <DisplayForm />
    </main>
  );
}