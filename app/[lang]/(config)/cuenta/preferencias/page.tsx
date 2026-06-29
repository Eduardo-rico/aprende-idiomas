// app/[lang]/(config)/cuenta/preferencias/page.tsx
// Sub-view for variant + voice settings. Wraps the existing shadcn
// VariantToggle and VoicePicker (kept as-is for now; redesign tracked
// separately). The page itself is Manual Lusitano chrome and adds a
// CuentaNav strip above the sections. The semantic <main> wrapper is
// owned by app/[lang]/(config)/cuenta/layout.tsx; this page is a <div>
// with its own narrower max-width (forms read better at 640px).
import { CuentaNav } from "@/components/cuenta/CuentaNav";
import { VariantToggle } from "@/components/VariantToggle";
import { VoicePicker } from "@/components/VoicePicker";
import { Eyebrow } from "@/components/ui/eyebrow";

export default async function PreferenciasPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div
      className="mx-auto max-w-[640px]"
      data-testid="cuenta-preferencias"
    >
      <h1 className="mb-1.5 font-display text-[39px]">Preferencias</h1>
      <p className="mb-8 text-ink-muted">
        Variante y voz para los audios.
      </p>
      <CuentaNav lang={lang} active="preferencias" />
      <section className="mb-8">
        <Eyebrow>Variante</Eyebrow>
        <div className="mt-4">
          <VariantToggle />
        </div>
      </section>
      <section>
        <Eyebrow>Voz</Eyebrow>
        <div className="mt-4">
          <VoicePicker />
        </div>
      </section>
    </div>
  );
}