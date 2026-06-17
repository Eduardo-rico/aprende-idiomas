// app/[lang]/_empty-state.tsx
// Phase 5 (multi-idioma): empty state compartido para idiomas sin
// contenido (RU/RO/CS). Se renderiza desde las pages de list cuando
// `BLOCKS.length === 0` o equivalent. El link al portugués permite al
// usuario volver a una experiencia con contenido mientras se generan los
// scaffolds reales.
import Link from "next/link";
import { LANG_LABELS, LANG_FLAGS, type LanguageId } from "@/lib/locales";

export function EmptyState({ lang, page }: { lang: LanguageId; page: string }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
      <div className="text-5xl">{LANG_FLAGS[lang]}</div>
      <h1 className="font-display text-3xl">
        {LANG_LABELS[lang]} aún no tiene contenido
      </h1>
      <p className="text-muted-foreground">
        Esta sección ({page}) todavía no tiene lecciones, historias ni
        vocabulario para {LANG_LABELS[lang]}. Estamos trabajando para añadir
        contenido a este idioma.
      </p>
      <p className="text-sm text-muted">
        Mientras tanto, puedes seguir practicando con el currículo completo
        de{" "}
        <Link href="/pt" className="text-accent hover:underline">
          {LANG_FLAGS.pt} {LANG_LABELS.pt}
        </Link>
        .
      </p>
    </div>
  );
}
