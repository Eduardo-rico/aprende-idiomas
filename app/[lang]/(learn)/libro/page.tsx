// app/[lang]/(learn)/libro/page.tsx
// Índice del libro: los capítulos (bloques) del currículo.
//
// Ola 1 (2026-07-28): esta página NO EXISTÍA. `lib/routes/redirects.ts`
// mandaba `/blocks` → `/libro` con un 308 permanente, la barra de
// navegación enlazaba «Livro», la tarjeta de continuar apuntaba aquí y
// el botón con que termina el diagnóstico también — y las cuatro cosas
// daban 404. Era la puerta principal al material y estaba tapiada.
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { loadCurriculum } from "@/lib/data/loaders";
import { Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const romanize = (n: number) => ROMAN[n - 1] ?? String(n);

export default async function LibroIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang: LanguageId = rawLang;
  const { BLOCKS } = await loadCurriculum(lang);

  // Los idiomas sin contenido (checo, ruso, rumano) tienen un stub con
  // BLOCKS vacío. Se dice, no se revienta.
  if (BLOCKS.length === 0) {
    return (
      <main className="mx-auto max-w-[760px] px-6 py-16 text-center">
        <h1 className="font-display text-3xl mb-3">Todavía no hay libro</h1>
        <p className="text-ink-muted">
          Este idioma aún no tiene contenido. El de portugués sí.
        </p>
        <Link
          href="/pt/libro"
          className="mt-6 inline-block rounded-md bg-lesson px-4 py-2 text-white"
        >
          Ir al libro de portugués
        </Link>
      </main>
    );
  }

  const totalLecciones = BLOCKS.reduce((n, b) => n + b.lessons.length, 0);

  return (
    <main className="mx-auto max-w-[760px] px-6 pb-24 pt-14">
      <Eyebrow>El libro</Eyebrow>
      <h1 className="font-display text-4xl tracking-tight mb-2">
        Todo el curso, por capítulos
      </h1>
      <p className="text-ink-muted mb-10">
        {BLOCKS.length} capítulos · {totalLecciones} lecciones. No hace falta
        pasar por aquí para estudiar: esto es la referencia, para cuando
        quieras consultar algo.
      </p>

      <ol className="rounded-lg border border-rule bg-paper-raised overflow-hidden">
        {BLOCKS.map((b) => {
          const n = b.lessons.length;
          return (
            <li key={b.id} className="border-b border-rule last:border-b-0">
              <Link
                href={`/${lang}/libro/${b.id}`}
                className="flex items-baseline gap-4 px-5 py-4 hover:bg-paper-sunken transition-colors"
              >
                <span className="font-mono text-sm text-ink-faint w-8 shrink-0">
                  {romanize(b.id)}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg leading-snug">
                    {b.name}
                  </span>
                  <span className="block text-sm text-ink-muted mt-0.5">
                    {b.description}
                  </span>
                </span>
                <span className="font-mono text-xs text-ink-faint shrink-0">
                  {n > 0 ? `${n} ${n === 1 ? "lección" : "lecciones"}` : "sin lecciones"}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
