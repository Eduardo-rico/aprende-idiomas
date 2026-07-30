// app/[lang]/(learn)/leer/page.tsx
// Catálogo de la biblioteca de lectura (Ola L). Cada entrada declara su
// procedencia — el gate del generador garantiza que los campos existen.
// Las lecturas con `serie` se agrupan en UNA tarjeta (colección o libro
// por capítulos); sin eso, 43 cuentos de Junqueiro + capítulos de
// novela harían del catálogo una lista infinita.
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadLecturas, type Lectura } from "@/lib/data/loaders";
import { Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

const ORDEN_NIVEL = ["A1", "A2", "B1", "B2", "C1", "C2"];
const nivelIdx = (n: string) => ORDEN_NIVEL.indexOf(n);

const palabrasDe = (l: Lectura) =>
  l.parrafos.reduce((a, p) => a + p.texto.split(/\s+/).filter(Boolean).length, 0);

export default async function LeerIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang: LanguageId = rawLang;
  const lecturas = await loadLecturas(lang);

  if (lecturas.length === 0) {
    return (
      <main className="mx-auto max-w-[760px] px-6 py-16 text-center">
        <h1 className="font-display text-3xl mb-3">Todavía no hay lecturas</h1>
        <p className="text-ink-muted">
          Este idioma aún no tiene biblioteca. La de portugués sí.
        </p>
        <Link href="/pt/leer" className="text-cobalt underline mt-4 inline-block">
          Ir a la biblioteca de portugués
        </Link>
      </main>
    );
  }

  const sueltas = lecturas.filter((l) => !l.serie);
  const series = new Map<string, Lectura[]>();
  for (const l of lecturas) {
    if (!l.serie) continue;
    const grupo = series.get(l.serie.id) ?? [];
    grupo.push(l);
    series.set(l.serie.id, grupo);
  }

  // Una fila por lectura suelta y una por serie, ordenadas por nivel
  // (el nivel de una serie es el mínimo de sus piezas) y título.
  type Fila =
    | { tipo: "lectura"; nivel: string; titulo: string; l: Lectura }
    | { tipo: "serie"; nivel: string; nivelMax: string; titulo: string; id: string; piezas: Lectura[] };
  const filas: Fila[] = [
    ...sueltas.map((l) => ({ tipo: "lectura" as const, nivel: l.nivel, titulo: l.titulo, l })),
    ...[...series.entries()].map(([id, piezas]) => {
      const niveles = [...piezas].sort((a, b) => nivelIdx(a.nivel) - nivelIdx(b.nivel));
      return {
        tipo: "serie" as const,
        nivel: niveles[0]!.nivel,
        nivelMax: niveles.at(-1)!.nivel,
        titulo: piezas[0]!.serie!.titulo,
        id,
        piezas,
      };
    }),
  ].sort(
    (a, b) => nivelIdx(a.nivel) - nivelIdx(b.nivel) || a.titulo.localeCompare(b.titulo, "pt"),
  );

  return (
    <main className="mx-auto max-w-[760px] px-6 py-12">
      <Eyebrow>Biblioteca</Eyebrow>
      <h1 className="font-display text-4xl mt-2 mb-2">Leer</h1>
      <p className="text-ink-muted mb-10 max-w-[52ch]">
        Textos reales de dominio público. Los que llevan karaoke traen
        audio con el texto resaltado palabra a palabra mientras suena;
        los demás son lectura pura.
      </p>
      <ul className="space-y-4">
        {filas.map((f) =>
          f.tipo === "lectura" ? (
            <li key={f.l.id}>
              <Link
                href={`/${lang}/leer/${f.l.id}`}
                className="block rounded-xl border border-rule bg-surface px-5 py-4 hover:border-cobalt transition-colors"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-xl">{f.l.titulo}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    {f.l.nivel}
                  </span>
                  {f.l.modo !== "texto" && (
                    <span className="font-mono text-[11px] uppercase tracking-wider text-cobalt">
                      ♪ karaoke
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-muted mt-1 italic">
                  {f.l.autor}
                  {f.l.muerteAutor ? ` († ${f.l.muerteAutor})` : ""} ·{" "}
                  {f.l.modo === "texto"
                    ? `${palabrasDe(f.l).toLocaleString("es")} palabras`
                    : `${f.l.parrafos.length} párrafos con audio`}
                </p>
              </Link>
            </li>
          ) : (
            <li key={`serie-${f.id}`}>
              <Link
                href={`/${lang}/leer/serie/${f.id}`}
                className="block rounded-xl border border-rule bg-surface px-5 py-4 hover:border-cobalt transition-colors"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-xl">{f.titulo}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    {f.nivel === f.nivelMax ? f.nivel : `${f.nivel}–${f.nivelMax}`}
                  </span>
                </div>
                <p className="text-sm text-ink-muted mt-1 italic">
                  {f.piezas[0]!.autor}
                  {f.piezas[0]!.muerteAutor ? ` († ${f.piezas[0]!.muerteAutor})` : ""} ·{" "}
                  {f.piezas.length} textos ·{" "}
                  {f.piezas.reduce((a, l) => a + palabrasDe(l), 0).toLocaleString("es")}{" "}
                  palabras
                </p>
              </Link>
            </li>
          ),
        )}
      </ul>
    </main>
  );
}
