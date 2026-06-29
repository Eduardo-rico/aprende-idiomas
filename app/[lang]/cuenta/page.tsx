// app/[lang]/cuenta/page.tsx
// Hub page for the /cuenta sub-views. Server component, async params
// (Next 16 contract). Renders a 2x2 grid of HubCard links to the four
// most-used configuration sub-views. The legacy /settings page still
// exists as a fallback for FSRS + local-practice-filter sections that
// are out of scope for A.5.
import { HubCard } from "@/components/cuenta/HubCard";

const ITEMS = [
  {
    slug: "preferencias",
    title: "Preferencias",
    desc: "Variante, voz para los audios.",
  },
  {
    slug: "objetivo",
    title: "Objetivo diario",
    desc: "Cuántos minutos al día querés estudiar.",
  },
  {
    slug: "display",
    title: "Display",
    desc: "Tema, pistas para hispanohablantes, efectos.",
  },
  {
    slug: "sesion",
    title: "Sesión",
    desc: "Duración, aviso de fatiga, cerrar sesión.",
  },
] as const;

export default async function CuentaHub({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <main
      className="mx-auto max-w-[760px] px-6 py-12"
      data-testid="cuenta-hub"
    >
      <h1 className="mb-1.5 font-display text-[39px] font-medium tracking-[-.02em]">
        Cuenta
      </h1>
      <p className="mb-8 text-ink-muted">
        Configurá tu experiencia de estudio.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ITEMS.map((i) => (
          <HubCard
            key={i.slug}
            href={`/${lang}/cuenta/${i.slug}`}
            title={i.title}
            desc={i.desc}
          />
        ))}
      </div>
    </main>
  );
}