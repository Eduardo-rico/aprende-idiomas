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
import { useState } from "react";
import { WordSpan } from "@/components/stories/WordSpan";
import { tokenize } from "@/lib/text/portuguese-tokenize";
import type { ParrafoTexto } from "@/lib/data/loaders";
import type { LanguageId } from "@/lib/locales";

// Las secciones del original vienen como párrafos de un solo numeral
// romano («I», «II»…) — se muestran como separadores, no como prosa.
const esSeccion = (t: string) => /^[IVX]+$/.test(t.trim());

// Un capítulo de novela trae miles de palabras tocables; renderizarlas
// todas producía páginas de 2+ MB de HTML (os-maias-c01, medido). Se
// pagina por párrafos del lado cliente: los datos viajan una vez
// (JSON pequeño), el DOM solo lleva la página visible.
const PARRAFOS_POR_PAGINA = 40;

export function LectorTexto({
  parrafos,
  lecturaId,
  lang,
}: {
  parrafos: ParrafoTexto[];
  lecturaId: string;
  lang: LanguageId;
}) {
  const [pagina, setPagina] = useState(0);
  const totalPaginas = Math.ceil(parrafos.length / PARRAFOS_POR_PAGINA);
  const visibles = parrafos.slice(
    pagina * PARRAFOS_POR_PAGINA,
    (pagina + 1) * PARRAFOS_POR_PAGINA,
  );

  const cambia = (p: number) => {
    setPagina(p);
    window.scrollTo({ top: 0 });
  };

  return (
    <div>
      {visibles.map((p, iVis) => {
        const i = pagina * PARRAFOS_POR_PAGINA + iVis;
        return esSeccion(p.texto) ? (
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
        );
      })}
      {totalPaginas > 1 && (
        <nav className="flex items-center justify-between border-t border-rule mt-8 pt-4">
          <button
            type="button"
            onClick={() => cambia(pagina - 1)}
            disabled={pagina === 0}
            className="font-mono text-[12px] text-ink-muted hover:text-cobalt disabled:opacity-40 disabled:hover:text-ink-muted"
          >
            ← anterior
          </button>
          <span className="font-mono text-[11px] text-ink-faint tabular-nums">
            página {pagina + 1} / {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => cambia(pagina + 1)}
            disabled={pagina + 1 >= totalPaginas}
            className="font-mono text-[12px] text-ink-muted hover:text-cobalt disabled:opacity-40 disabled:hover:text-ink-muted"
          >
            seguinte →
          </button>
        </nav>
      )}
    </div>
  );
}
