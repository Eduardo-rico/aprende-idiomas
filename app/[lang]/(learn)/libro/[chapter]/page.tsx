// app/[lang]/(learn)/libro/[chapter]/page.tsx
// Un capítulo del libro: su descripción y sus lecciones.
//
// Ola 1 (2026-07-28): esta página tampoco existía, y era el destino del
// 308 de `/blocks/[id]` — o sea, del botón «Ir al Bloque N» con el que
// termina el diagnóstico, que es literalmente lo único que se le ofrece
// a alguien que acaba de llegar. Daba 404 en una pantalla que además no
// monta la barra de navegación: un callejón sin salida.
//
// El slug de sección es la cola del lessonId tras `b{N}-l{N}-`, que es
// lo que `loadLesson()` espera.
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadCurriculum } from "@/lib/data/loaders";
import { Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const romanize = (n: number) => ROMAN[n - 1] ?? String(n);

/** `b6-l3-conjuntivo-presente` → `conjuntivo-presente` */
function sectionSlug(lessonId: string): string {
  return lessonId.split("-").slice(2).join("-");
}

export default async function CapituloPage({
  params,
}: {
  params: Promise<{ lang: string; chapter: string }>;
}) {
  const { lang: rawLang, chapter } = await params;
  if (!hasLocale(rawLang)) notFound();
  if (!/^\d+$/.test(chapter)) notFound();
  const lang: LanguageId = rawLang;
  const { BLOCKS } = await loadCurriculum(lang);
  const block = BLOCKS.find((b) => b.id === Number(chapter));
  if (!block) notFound();

  return (
    <main className="mx-auto max-w-[760px] px-6 pb-24 pt-14">
      <Link
        href={`/${lang}/libro`}
        className="font-mono text-xs text-ink-faint hover:text-ink-muted"
      >
        ← El libro
      </Link>

      <div className="mt-6">
        <Eyebrow>Capítulo {romanize(block.id)}</Eyebrow>
        <h1 className="font-display text-4xl tracking-tight mb-2">{block.name}</h1>
        <p className="text-ink-muted">{block.description}</p>
      </div>

      {block.freeDrill && (
        <p className="mt-6 rounded-lg border border-rule bg-paper-sunken px-4 py-3 text-sm text-ink-muted">
          Este capítulo es campo abierto de léxico: no tiene lecciones propias,
          se practica desde el repaso.
        </p>
      )}

      {block.lessons.length > 0 ? (
        <ol className="mt-8 rounded-lg border border-rule bg-paper-raised overflow-hidden">
          {block.lessons.map((l, i) => (
            <li key={l.id} className="border-b border-rule last:border-b-0">
              <Link
                href={`/${lang}/libro/${block.id}/${sectionSlug(l.id)}`}
                className="flex items-baseline gap-4 px-5 py-4 hover:bg-paper-sunken transition-colors"
              >
                <span className="font-mono text-sm text-ink-faint w-6 shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg leading-snug">
                    {l.name}
                  </span>
                  {l.objectives.length > 0 && (
                    <span className="block text-sm text-ink-muted mt-0.5">
                      {l.objectives[0]}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        !block.freeDrill && (
          <p className="mt-8 text-ink-muted">
            Este capítulo todavía no tiene lecciones escritas.
          </p>
        )
      )}
    </main>
  );
}
