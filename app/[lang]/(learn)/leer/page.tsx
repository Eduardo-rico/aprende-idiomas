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

  return (
    <main className="mx-auto max-w-[760px] px-6 py-12">
      <Eyebrow>Biblioteca · lectura con karaoke</Eyebrow>
      <h1 className="font-display text-4xl mt-2 mb-2">Leer</h1>
      <p className="text-ink-muted mb-10 max-w-[52ch]">
        Textos reales de dominio público, con audio y el texto resaltado
        palabra a palabra mientras suena. Toca cualquier palabra para
        saltar a ella.
      </p>
      <ul className="space-y-4">
        {lecturas.map((l) => (
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
              </div>
              <p className="text-sm text-ink-muted mt-1 italic">
                {l.autor} († {l.muerteAutor}) · {l.parrafos.length} párrafos
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
