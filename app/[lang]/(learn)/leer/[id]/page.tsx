// app/[lang]/(learn)/leer/[id]/page.tsx
// Una lectura: cabecera con procedencia + el lector que toque — karaoke
// (audio + resaltado) o texto puro (sin audio, la cuota TTS es el bien
// escaso y las novelas entran gratis).
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadLectura, loadLecturasMeta } from "@/lib/data/loaders";
import { Eyebrow } from "@/components/ui";
import { LectorKaraoke } from "@/components/lectura/LectorKaraoke";
import { LectorTexto } from "@/components/lectura/LectorTexto";
import { MarcarLida } from "@/components/lectura/MarcarLida";

export const dynamic = "force-dynamic";

export default async function LecturaPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang: rawLang, id } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang: LanguageId = rawLang;
  const lectura = await loadLectura(lang, id);
  if (!lectura) notFound();

  // Vecinos dentro de la serie (capítulo anterior / seguinte).
  let anterior = null, siguiente = null;
  if (lectura.serie) {
    const hermanas = (await loadLecturasMeta(lang))
      .filter((l) => l.serie?.id === lectura.serie!.id)
      .sort((a, b) => a.serie!.orden - b.serie!.orden);
    const idx = hermanas.findIndex((l) => l.id === lectura.id);
    anterior = idx > 0 ? hermanas[idx - 1]! : null;
    siguiente = idx >= 0 && idx + 1 < hermanas.length ? hermanas[idx + 1]! : null;
  }

  const esTexto = lectura.modo === "texto";
  const detalle =
    lectura.modo === "texto"
      ? `${lectura.parrafos
          .reduce((a, p) => a + p.texto.split(/\s+/).filter(Boolean).length, 0)
          .toLocaleString("es")} palabras`
      : `lectura con karaoke · ~${Math.round(
          lectura.parrafos.reduce((a, p) => a + (p.palabras.at(-1)?.e ?? 0), 0) / 60,
        )} min`;

  return (
    <main className={`mx-auto max-w-[680px] px-6 py-12 ${esTexto ? "pb-16" : "pb-28"}`}>
      <Link
        href={lectura.serie ? `/${lang}/leer/serie/${lectura.serie.id}` : `/${lang}/leer`}
        className="font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-cobalt"
      >
        ← {lectura.serie ? lectura.serie.titulo : "Biblioteca"}
      </Link>
      <header className="border-b border-rule pb-6 mt-6 mb-8">
        <Eyebrow>
          {lectura.nivel} · {detalle}
        </Eyebrow>
        <h1 className="font-display text-5xl mt-2 mb-1">{lectura.titulo}</h1>
        <p className="font-display italic text-lg text-ink-muted">
          {lectura.autor}
          {lectura.muerteAutor ? ` († ${lectura.muerteAutor})` : ""}
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-ink-faint mt-4">
          {lectura.fuente} · {lectura.licencia}
          {lectura.notaOrtografia ? (
            <>
              <br />
              {lectura.notaOrtografia}
            </>
          ) : null}
        </p>
      </header>
      {lectura.modo === "texto" ? (
        <LectorTexto parrafos={lectura.parrafos} lecturaId={lectura.id} lang={lang} />
      ) : (
        <LectorKaraoke
          parrafos={lectura.parrafos}
          baseAudio={`/lecturas/${lectura.id}`}
        />
      )}
      <MarcarLida lecturaId={lectura.id} nivel={lectura.nivel} lang={lang} />
      {(anterior || siguiente) && (
        <nav className="flex justify-between gap-4 border-t border-rule mt-10 pt-5">
          {anterior ? (
            <Link
              href={`/${lang}/leer/${anterior.id}`}
              className="font-mono text-[12px] text-ink-muted hover:text-cobalt"
            >
              ← {anterior.titulo}
            </Link>
          ) : (
            <span />
          )}
          {siguiente ? (
            <Link
              href={`/${lang}/leer/${siguiente.id}`}
              className="font-mono text-[12px] text-ink-muted hover:text-cobalt text-right"
            >
              {siguiente.titulo} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  );
}
