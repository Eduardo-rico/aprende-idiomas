// app/[lang]/(learn)/leer/[id]/page.tsx
// Una lectura: cabecera con procedencia + el lector karaoke (cliente).
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadLectura } from "@/lib/data/loaders";
import { Eyebrow } from "@/components/ui";
import { LectorKaraoke } from "@/components/lectura/LectorKaraoke";

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

  const min = Math.round(
    lectura.parrafos.reduce((a, p) => a + (p.palabras.at(-1)?.e ?? 0), 0) / 60,
  );

  return (
    <main className="mx-auto max-w-[680px] px-6 py-12 pb-28">
      <Link
        href={`/${lang}/leer`}
        className="font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-cobalt"
      >
        ← Biblioteca
      </Link>
      <header className="border-b border-rule pb-6 mt-6 mb-8">
        <Eyebrow>
          {lectura.nivel} · lectura con karaoke · ~{min} min
        </Eyebrow>
        <h1 className="font-display text-5xl mt-2 mb-1">{lectura.titulo}</h1>
        <p className="font-display italic text-lg text-ink-muted">
          {lectura.autor} († {lectura.muerteAutor})
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
      <LectorKaraoke
        parrafos={lectura.parrafos}
        baseAudio={`/lecturas/${lectura.id}`}
      />
    </main>
  );
}
