// app/[lang]/(review)/practicar/page.tsx
// Las colas de práctica: repaso diario y drill de vocabulario.
//
// Ola 1 (2026-07-28): `lib/routes/redirects.ts` mandaba `/practice` →
// `/practicar` con un 308, y `/practicar` no existía. Otro 404 heredado
// del rediseño, que creó los destinos en el mapa de rutas pero no todas
// las páginas.
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PracticarPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang: LanguageId = rawLang;

  const colas = [
    {
      href: `/${lang}/practicar/srs`,
      titulo: "Repaso de hoy",
      detalle:
        "Las tarjetas que tocan según el repaso espaciado, mezcladas por tipo y por concepto.",
      cta: "Empezar",
      principal: true,
    },
    {
      href: `/${lang}/drill/vocab`,
      titulo: "Vocabulario",
      detalle: "Drill libre de palabras, sin calendario. Para cuando tienes cinco minutos.",
      cta: "Abrir",
      principal: false,
    },
  ];

  return (
    <main className="mx-auto max-w-[760px] px-6 pb-24 pt-14">
      <Eyebrow>Practicar</Eyebrow>
      <h1 className="font-display text-4xl tracking-tight mb-2">Las colas</h1>
      <p className="text-ink-muted mb-10">
        El repaso decide qué toca hoy. El vocabulario está siempre abierto.
      </p>

      <div className="space-y-3">
        {colas.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`block rounded-lg border px-5 py-5 transition-colors ${
              c.principal
                ? "border-lesson bg-lesson-soft hover:bg-paper-sunken"
                : "border-rule bg-paper-raised hover:bg-paper-sunken"
            }`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display text-xl">{c.titulo}</span>
              <span className="font-mono text-xs text-ink-muted shrink-0">
                {c.cta} →
              </span>
            </div>
            <p className="text-sm text-ink-muted mt-1">{c.detalle}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
