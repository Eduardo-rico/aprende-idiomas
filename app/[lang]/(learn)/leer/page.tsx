// app/[lang]/(learn)/leer/page.tsx
// Catálogo de la biblioteca de lectura (Ola L). Cada entrada declara su
// procedencia — el gate del generador garantiza que los campos existen.
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadLecturas } from "@/lib/data/loaders";
import { Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

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

  const ordenNivel = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const ordenadas = [...lecturas].sort(
    (a, b) =>
      ordenNivel.indexOf(a.nivel) - ordenNivel.indexOf(b.nivel) ||
      a.titulo.localeCompare(b.titulo, "pt"),
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
        {ordenadas.map((l) => (
          <li key={l.id}>
            <Link
              href={`/${lang}/leer/${l.id}`}
              className="block rounded-xl border border-rule bg-surface px-5 py-4 hover:border-cobalt transition-colors"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-xl">{l.titulo}</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                  {l.nivel}
                </span>
                {l.modo !== "texto" && (
                  <span className="font-mono text-[11px] uppercase tracking-wider text-cobalt">
                    ♪ karaoke
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-muted mt-1 italic">
                {l.autor}
                {l.muerteAutor ? ` († ${l.muerteAutor})` : ""} ·{" "}
                {l.modo === "texto"
                  ? `${l.parrafos
                      .reduce(
                        (a, p) => a + p.texto.split(/\s+/).filter(Boolean).length,
                        0,
                      )
                      .toLocaleString("es")} palabras`
                  : `${l.parrafos.length} párrafos con audio`}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
