// lib/lang/ortografia-ro.ts — LA NORMA ORTOGRÁFICA DEL RUMANO, en un sitio.
//
// Decisión de la fase F (Paso 0 §6, 2026-09-01): DOOM3 — ș/ț con COMA
// debajo (U+0219/U+021B), «â» en interior de palabra e «î» al inicio y al
// final, «sunt» y no la grafía anterior a 1993 con î.
//
// Dos usos, y por eso vive en `lib/` y no en `scripts/`:
//
//   1. CANONICALIZAR antes de comparar y antes de hashear. El alumno
//      escribe con el teclado que tiene, y la web rumana mezcla cedilla y
//      coma en la misma página: «şi» y «și» son EL MISMO DATO en dos
//      codificaciones. Sin esto, `answersMatch` marca mal una respuesta
//      correcta, y el id de un ejercicio —que es el hash de su contenido—
//      trata dos textos idénticos como dos ítems y paga dos MP3.
//      La cedilla puede venir además DESCOMPUESTA (s + U+0327), que pasa
//      un `replace` de «ş» sin inmutarse: primero NFC, luego el mapa.
//   2. EL GATE de escritura para contenido nuevo: cedilla, «î» interior
//      fuera de compuesto, y las formas de «a fi» con î. Lo antiguo (la
//      biblioteca, 157 lecturas con grafía pre-1993 declarada en
//      `notaOrtografia`) NO pasa por él: ahí el texto se respeta y la nota
//      lo dice.
//
// Medido antes de tocar el hash: el plano de datos de PT tiene CERO
// cedillas s/t en 1.209 ficheros, así que ningún id de portugués cambia.
// La regla es la misma que `scripts/lectura/texto-ro.mjs` aplica al
// ingerir lecturas; está duplicada a propósito en dos runtimes (mjs de
// ingesta / ts de app), y el test cruza las dos contra los mismos casos
// para que no se desincronicen.

/** Cedilla → coma, sobre NFC. Idempotente. No toca nada más: «ç» del
 *  portugués sigue siendo «ç». */
export function canonicalRo(s: string): string {
  return s
    .normalize('NFC')
    .replace(/ş/g, 'ș').replace(/Ş/g, 'Ș')
    .replace(/ţ/g, 'ț').replace(/Ţ/g, 'Ț');
}

const RE_CEDILLA = /[ŞşŢţ]|[sStT]̧/;
export const tieneCedilla = (s: string): boolean => RE_CEDILLA.test(String(s ?? ''));

/** Prefijos tras los que «î» interior es legítimo porque abre raíz:
 *  neîncetat, reîncepe, subînțeles, bineînțeles, preîntâmpina, dezînvăța. */
const PREFIJOS = ['ne', 're', 'pre', 'sub', 'des', 'dez', 'răs', 'supra', 'semi', 'auto', 'contra', 'inter', 'non', 'bine', 'rău', 'ante', 'post', 'para', 'ori', 'între'];
const RE_PREFIJO = new RegExp(`^(?:${PREFIJOS.join('|')})î`, 'i');

/** Formas de «a fi» y afines con la grafía anterior a 1993. */
const RE_SINT = /^(?:sînt|sîntem|sînteți|sîntețĭ)$/i;

export type ClaseOrtografia = 'cedilla' | 'i-interior' | 'sint';
export interface HallazgoOrtografia { clase: ClaseOrtografia; palabra: string }

/** Las palabras de un texto que rompen la norma. Devuelve una entrada por
 *  ocurrencia; el llamador decide si bloquea o sólo informa. */
export function revisarOrtografiaRo(texto: string): HallazgoOrtografia[] {
  const out: HallazgoOrtografia[] = [];
  const t = String(texto ?? '').normalize('NFC');
  for (const m of t.matchAll(/[\p{L}̧]+/gu)) {
    const w = m[0];
    if (RE_CEDILLA.test(w)) { out.push({ clase: 'cedilla', palabra: w }); continue; }
    if (RE_SINT.test(w)) { out.push({ clase: 'sint', palabra: w }); continue; }
    // «î» que no está ni al principio ni al final de la palabra. Un
    // compuesto con guion («într-însul») se evalúa por partes, y un
    // prefijo que abre raíz («neîncetat») exime.
    const partes = w.split('-');
    const mala = partes.some((p) => p.length > 2 && /[îÎ]/.test(p.slice(1, -1)) && !RE_PREFIJO.test(p));
    if (mala) out.push({ clase: 'i-interior', palabra: w });
  }
  return out;
}
