// app/[lang]/(learn)/leer/serie/[id]/page.tsx
// Una serie de la biblioteca: colección de cuentos o libro por
// capítulos. Cabecera con la procedencia común + índice ordenado.
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadLecturasMeta, type LecturaMeta } from "@/lib/data/loaders";
import { Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

const palabrasDe = (l: LecturaMeta) => l.palabras;

export default async function SeriePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang: rawLang, id } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang: LanguageId = rawLang;
  const piezas = (await loadLecturasMeta(lang))
    .filter((l) => l.serie?.id === id)
    .sort((a, b) => a.serie!.orden - b.serie!.orden);
  if (piezas.length === 0) notFound();

  const cabeza = piezas[0]!;
  const totalPalabras = piezas.reduce((a, l) => a + palabrasDe(l), 0);

  return (
    <main className="mx-auto max-w-[760px] px-6 py-12">
      <Link
        href={`/${lang}/leer`}
        className="font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-cobalt"
      >
        ← Biblioteca
      </Link>
      <header className="border-b border-rule pb-6 mt-6 mb-8">
        <Eyebrow>
          {piezas.length} textos · {totalPalabras.toLocaleString("es")} palabras
        </Eyebrow>
        <h1 className="font-display text-5xl mt-2 mb-1">{cabeza.serie!.titulo}</h1>
        <p className="font-display italic text-lg text-ink-muted">
          {cabeza.autor}
          {cabeza.muerteAutor ? ` († ${cabeza.muerteAutor})` : ""}
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-ink-faint mt-4">
          {cabeza.fuente} · {cabeza.licencia}
          {cabeza.notaOrtografia ? (
            <>
              <br />
              {cabeza.notaOrtografia}
            </>
          ) : null}
        </p>
      </header>
      <ol className="space-y-2">
        {piezas.map((l) => (
          <li key={l.id}>
            <Link
              href={`/${lang}/leer/${l.id}`}
              className="flex items-baseline gap-3 rounded-lg border border-rule bg-surface px-4 py-3 hover:border-cobalt transition-colors"
            >
              <span className="font-display text-lg flex-1">{l.titulo}</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                {l.nivel}
              </span>
              <span className="font-mono text-[11px] text-ink-faint tabular-nums">
                {palabrasDe(l).toLocaleString("es")} palabras
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
