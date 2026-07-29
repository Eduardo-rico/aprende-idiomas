// El lector de texto puro: la misma tipografía del karaoke, sin audio.
// Así entran las novelas y cuentos completos sin gastar cuota TTS — el
// karaoke queda reservado para la escalera graduada (decisión de Edu,
// 2026-07-29). Componente de servidor: no hay estado que manejar.
import type { ParrafoTexto } from "@/lib/data/loaders";

// Las secciones del original vienen como párrafos de un solo numeral
// romano («I», «II»…) — se muestran como separadores, no como prosa.
const esSeccion = (t: string) => /^[IVX]+$/.test(t.trim());

export function LectorTexto({ parrafos }: { parrafos: ParrafoTexto[] }) {
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
            {p.texto}
          </p>
        ),
      )}
    </div>
  );
}
