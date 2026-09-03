// lib/srs/fuga-sesion.ts
//
// La fuga ENTRE tarjetas: la respuesta de un ítem impresa en el texto que
// otro ítem MUESTRA. Cada tarjeta es correcta por separado; juntas en una
// sesión, la segunda se contesta por memoria de la primera. Ningún gate del
// proyecto la ve, porque todos son intra-ítem, y la revisión por lotes la
// hace invisible por construcción: el lote 15 no puede ver lo que imprimió
// el lote 1. Medida en pt (24 %) y ro (25 %) — ver
// docs/plans/2026-09-03-fuga-entre-tarjetas.md.
//
// Este fichero es el ÚNICO sitio donde vive la extracción; el medidor de
// `scripts/` importa de aquí en vez de copiarla, porque una regla duplicada
// se desincroniza en la copia que nadie recuerda haber hecho.

/** Forma mínima que necesitamos de un ejercicio. Estructural a propósito:
 *  no acopla este módulo al tipo completo de la app ni al del script. */
export interface ItemParaFuga {
  id: string;
  type?: string;
  concepts?: readonly string[];
  data?: Record<string, unknown>;
}

const norm = (s: unknown) => String(s).normalize('NFC').toLowerCase();

/** Lo que el alumno LEE en la tarjeta, incluido lo que aparece al revelar
 *  la respuesta: si la ve al corregir, ya la ha visto. */
export function textoVisible(it: ItemParaFuga): string {
  const d = (it.data ?? {}) as Record<string, unknown>;
  const alt = Array.isArray(d.alternatives) ? (d.alternatives as unknown[]) : [];
  return norm([d.sentence, d.correct, d.sourceText, d.modelAnswer, ...alt].filter(Boolean).join(' \n '));
}

/** Las respuestas que el ítem PIDE PRODUCIR. Sólo formas de una palabra:
 *  una frase entera no se copia de una tarjeta vecina sin darse cuenta. */
export function respuestasDe(it: ItemParaFuga): string[] {
  const d = (it.data ?? {}) as Record<string, unknown>;
  const blanks = Array.isArray(d.blanks) ? (d.blanks as unknown[]) : [];
  const r: string[] = [];
  for (const b of blanks) {
    const o = b as Record<string, unknown> | string;
    const v = typeof o === 'string' ? o : (o?.answer ?? o?.correct);
    if (typeof v === 'string') r.push(v);
    const alts = typeof o === 'object' && Array.isArray(o?.answers) ? (o.answers as unknown[]) : [];
    for (const a of alts) if (typeof a === 'string') r.push(a);
  }
  return r.map(norm).filter((x) => x && /^[\p{L}\p{M}'’-]+$/u.test(x));
}

const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Palabra entera: `un` no debe casar dentro de `unde`. */
export const contieneForma = (forma: string, texto: string): boolean =>
  new RegExp(`(?<![\\p{L}\\p{M}])${esc(forma)}(?![\\p{L}\\p{M}])`, 'u').test(texto);

export interface OpcionesFuga {
  /** Tope de tarjetas del conjunto en las que la forma puede aparecer para
   *  seguir contando como PISTA. El poder de pista es inverso a la
   *  frecuencia: una forma impresa en media sesión no señala nada, porque
   *  el alumno no puede saber cuál de las apariciones es la relevante. Sin
   *  este tope el grafo se vuelve denso, todo entra en ciclo y el
   *  reordenador deja de servir. */
  maxApariciones?: number;
  /** Si es true, sólo cuenta cuando los dos ítems examinan puntos
   *  DISTINTOS. Dentro de un punto las formas se repiten por diseño. Útil
   *  para medir; para ORDENAR conviene dejarlo en false, porque ordenar no
   *  tiene coste de falso positivo. */
  soloEntrePuntos?: boolean;
}

/** Para cada ítem, qué OTROS ítems del conjunto tienen su respuesta impresa
 *  en el texto visible de éste. Es decir: `mapa.get(A)` son los ítems que
 *  deberían examinarse ANTES que A. */
export function construirMapaDeFuga(
  items: readonly ItemParaFuga[],
  { maxApariciones = 3, soloEntrePuntos = false }: OpcionesFuga = {},
): Map<string, string[]> {
  const vis = items.map(textoVisible);
  const resp = items.map(respuestasDe);
  const mapa = new Map<string, string[]>();

  for (let b = 0; b < items.length; b++) {
    for (const forma of resp[b]!) {
      // Quién imprime esta forma, dentro del conjunto que se está mirando.
      const impresores: number[] = [];
      for (let a = 0; a < items.length; a++) {
        if (a !== b && contieneForma(forma, vis[a]!)) impresores.push(a);
      }
      // Demasiado frecuente ⇒ es fondo, no pista.
      if (impresores.length === 0 || impresores.length > maxApariciones) continue;
      for (const a of impresores) {
        if (soloEntrePuntos) {
          const suyos = new Set(items[a]!.concepts ?? []);
          if ((items[b]!.concepts ?? []).some((c) => suyos.has(c))) continue;
        }
        const antes = mapa.get(items[a]!.id) ?? [];
        if (!antes.includes(items[b]!.id)) antes.push(items[b]!.id);
        mapa.set(items[a]!.id, antes);
      }
    }
  }
  return mapa;
}
