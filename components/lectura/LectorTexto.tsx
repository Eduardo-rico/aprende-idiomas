"use client";
// El lector de texto puro: la misma tipografía del karaoke, sin audio.
// Así entran las novelas y cuentos completos sin gastar cuota TTS — el
// karaoke queda reservado para la escalera graduada (decisión de Edu,
// 2026-07-29).
//
// Cada palabra es tocable y abre el diccionario emergente — el MISMO
// WordSpan→WordPopover del lector de stories, contra /api/vocab/lookup
// (catálogo con audio → fallback → «no está»). El tokenizador conserva
// los runs de espacio con su raw (incluidos \n), así que los versos de
// las quadras sobreviven vía whitespace-pre-line.
import { WordSpan } from "@/components/stories/WordSpan";
import { tokenize } from "@/lib/text/portuguese-tokenize";
import type { ParrafoTexto } from "@/lib/data/loaders";
import type { LanguageId } from "@/lib/locales";

// Las secciones del original vienen como párrafos de un solo numeral
// romano («I», «II»…) — se muestran como separadores, no como prosa.
const esSeccion = (t: string) => /^[IVX]+$/.test(t.trim());

export function LectorTexto({
  parrafos,
  lecturaId,
  lang,
}: {
  parrafos: ParrafoTexto[];
  lecturaId: string;
  lang: LanguageId;
}) {
  return (
    <div>
      {parrafos.map((p, i) =>
        esSeccion(p.texto) ? (
          <p
            key={i}
            className="font-display text-[17px] tracking-[0.3em] text-ink-faint text-center mt-10 mb-6"
          >
            {p.texto.trim()}
          </p>
        ) : (
          <p
            key={i}
            className="font-display text-[20px] leading-[1.75] mb-5 whitespace-pre-line"
          >
            {tokenize(p.texto).map((t, ti) => (
              <WordSpan key={ti} token={t} storyId={lecturaId} lang={lang} />
            ))}
          </p>
        ),
      )}
    </div>
  );
}
