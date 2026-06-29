// app/[lang]/(config)/cuenta/display/page.tsx
// Sub-view for theme + on-screen toggles. Server shell wraps the client
// DisplayForm which writes to the Zustand store (toggles) and the
// ThemeProvider (theme). The semantic <main> wrapper is owned by
// app/[lang]/(config)/cuenta/layout.tsx; this page is a <div> with its
// own narrower max-width.
import { CuentaNav } from "@/components/cuenta/CuentaNav";
import { DisplayForm } from "./DisplayForm";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div
      className="mx-auto max-w-[640px]"
      data-testid="cuenta-display"
    >
      <h1 className="mb-1.5 font-display text-[39px]">Display</h1>
      <p className="mb-8 text-ink-muted">
        Tema visual y ayudas en pantalla.
      </p>
      <CuentaNav lang={lang} active="display" />
      <DisplayForm />
    </div>
  );
}