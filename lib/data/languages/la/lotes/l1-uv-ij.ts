// lib/data/languages/la/lotes/l1-uv-ij.ts
//
// Punto: `l1-uv-ij`. «El proyecto distingue u de v y usa "i" para i y para
// j: "venit", no "uenit"; "Iesus", no "Jesus". **No es tipografía**:
// escribir "v" es lo que hace que la voz italiana produzca el /v/
// eclesiástico y no el /w/ restituido.»
//
// ── LA EXCEPCIÓN ES EL PUNTO ENTERO ──────────────────────────────────
//
// `excepcion`: «la conversión automática u→v NO es decidible: "uolo"→"volo"
// pero "suus" se queda». Si fuera decidible no habría nada que enseñar. Por
// eso la mitad del lote son casos que NO cambian, cada uno con su motivo
// escrito — una lista de excepciones sin motivos es una lista ciega.
//
// Y hay un contexto donde nunca cambia que el descriptor no nombra: **`qu`**.
// `quī` se escribe con `u` y suena /kw/. Va con los demás.
//
// ── SIN MÁCRONES, A PROPÓSITO ────────────────────────────────────────
//
// La cantidad es otro punto y mezclarla haría que un fallo de cantidad se
// contara como fallo de convención. El ítem se plantea sobre la grafía sin
// mácrones, que es lo que el alumno ve en una edición antigua.
import type { ItemUV } from '../../../../../scripts/lib/gate-uv-ij';
import { comoLoEscribeLaEdicionAntigua } from '../../../../../scripts/lib/gate-uv-ij';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

type Def = [id: string, respuesta: string, letra: 'u' | 'i', glosa: string, porQueNoCambia?: string];

const DEFS: Def[] = [
  // ── CAMBIAN · la `u` de la edición antigua es consonante ──
  ['la-uv-01', 'venit', 'u', 'viene'],
  ['la-uv-02', 'verbum', 'u', 'la palabra'],
  ['la-uv-03', 'viri', 'u', 'del hombre'],
  ['la-uv-04', 'vocem', 'u', 'la voz'],
  ['la-uv-05', 'vos', 'u', 'pronombre de 2.ª persona del plural'],
  ['la-uv-06', 'vidit', 'u', 'vio'],

  // ── NO CAMBIAN · y cada uno dice por qué ──
  ['la-uv-07', 'cum', 'u', 'con',
   'la `u` va entre consonantes: es el núcleo de la sílaba, no puede ser consonante'],
  ['la-uv-08', 'sunt', 'u', 'son',
   'la `u` va entre consonantes: es vocal'],
  ['la-uv-09', 'eum', 'u', 'a él',
   'la `u` cierra la sílaba tras vocal: es el segundo elemento, no un ataque'],
  ['la-uv-10', 'qui', 'u', 'el que',
   'tras `q` la `u` NUNCA es consonante: `qu` es una sola consonante labiovelar y suena /kw/'],
  ['la-uv-11', 'suus', 'u', 'suyo',
   'ES EL CONTRAEJEMPLO QUE EL DESCRIPTOR DA: la `u` va ante vocal y aun así es vocálica — por eso la conversión no es decidible'],

  // ── LA CONVENCIÓN i/j ──
  ['la-uv-12', 'Iesus', 'i', 'Jesús'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemUV[] = DEFS.map(([id, respuesta, letra, glosa, porQueNoCambia]) => {
  const escrita = comoLoEscribeLaEdicionAntigua(respuesta, letra === 'i');
  return {
    id, punto: 'l1-uv-ij', escrita, respuesta, glosa,
    pista: letra === 'i'
      ? 'la edición antigua escribe «J»: ¿cómo lo escribe este curso?'
      : '¿la «u» de la edición antigua es vocal o consonante aquí?',
    ejes: { letra, cambia: escrita !== respuesta, ...(porQueNoCambia ? { porQueNoCambia } : {}) },
  };
});

export const LOTE_UV_IJ = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);
