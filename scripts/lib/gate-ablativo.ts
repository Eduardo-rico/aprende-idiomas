// scripts/lib/gate-ablativo.ts
//
// EL GATE DEL ABLATIVO. Punto: `l3-ablativo-abanico`, «el caso que absorbe
// lo que el español reparte entre preposiciones».
//
// ── POR QUÉ ESTE PUNTO NECESITA UN GATE DISTINTO ─────────────────────
//
// Los siete formatos anteriores tenían un eje de respuesta que se podía
// equilibrar: dos valores, o tres, y el techo era 1/k. Aquí no, y la razón
// no es de diseño:
//
//   instrumento ─┐
//   compañía    ─┼─→ CON        causa → POR    tiempo → EN
//   modo        ─┘               lugar → DE     comparación → QUE
//
// **Tres de las siete funciones latinas comparten preposición en
// español.** Con dos ítems por función —el mínimo para que cada función
// no quede confundida con las propiedades de su único ítem— «pon siempre
// CON» acierta 6 de 14: el 43 %. Y no se arregla diseñando: para bajarlo
// al 20 % harían falta treinta ítems, o sea veintidós de relleno.
//
//   **El eje de la RESPUESTA no es el eje del PUNTO.** Cuando la lengua de
//   llegada es más gruesa que la distinción que se examina, ningún tamaño
//   de lote arregla el techo, porque el suelo lo pone el español.
//
// ── LAS DOS MITADES, Y LAS DOS TIENEN FUNCIÓN ────────────────────────
//
// No es «una mitad medible y otra que no»:
//
//   · **Las tres de `con`** son las que el alumno produce por
//     TRANSFERENCIA: el español le da la preposición y acierta sin saber
//     latín. Son gratis, y están para impedir el error simétrico —«nunca
//     con»— que sería peor, porque lo aplicaría a tres de las siete. Es la
//     mitad que enseña la FRONTERA de la regla.
//   · **Las otras cuatro** son el contenido, tienen respuestas uniformes
//     —`por`, `en`, `de`, `que`, dos ítems cada una— y ahí el techo es
//     1/4 = 25 %, que sí es exigible.
//
// Bajar el techo global al 43 % y llamarlo techo sería ajustar el
// termómetro a lo que mide.
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

export type FuncionAbl =
  | 'instrumento' | 'compañía' | 'modo'      // → con
  | 'causa' | 'tiempo' | 'lugar-de-donde' | 'comparación';

export const PREPOSICION: Record<FuncionAbl, string> = {
  instrumento: 'con', 'compañía': 'con', modo: 'con',
  causa: 'por', tiempo: 'en', 'lugar-de-donde': 'de', 'comparación': 'que',
};

/** Las que el español agrupa bajo «con»: transferencia pura. */
export const POR_TRANSFERENCIA: FuncionAbl[] = ['instrumento', 'compañía', 'modo'];

export interface ItemAblativo {
  id: string;
  punto: string;
  latin: string;
  /** La glosa con `___` donde va la preposición española. */
  glosa: string;
  respuesta: string;
  ejes: { funcion: FuncionAbl };
}

export type ClaseFalloAbl =
  | 'huecos-y-respuestas' | 'respuesta-no-cuadra' | 'funcion-sin-pareja'
  | 'falta-una-funcion' | 'estrategia-ciega' | 'orden-separable'
  | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloAbl { item: string; clase: ClaseFalloAbl; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase().trim();
export const TECHO_CONTENIDO = 1 / 4;
/** El suelo de «siempre con»: tres funciones de siete. No es un techo, es
 *  una propiedad del español, y se declara para que nadie lo lea como
 *  defecto ni lo intente «arreglar». */
export const SUELO_TRANSFERENCIA = 3 / 7;

export function tasasCiegasAbl(items: ItemAblativo[]) {
  const n = items.length || 1;
  const contenido = items.filter((i) => !POR_TRANSFERENCIA.includes(i.ejes.funcion));
  const m = contenido.length || 1;
  const tasa = (xs: ItemAblativo[], p: string) => xs.filter((i) => norm(i.respuesta) === p).length / (xs.length || 1);
  return {
    siempreCon: tasa(items, 'con'),
    // Las cuatro del contenido, medidas SOBRE EL CONTENIDO: meter las de
    // transferencia en el denominador diluiría las cuatro a la vez.
    enElContenido: Object.fromEntries((['por', 'en', 'de', 'que'] as const).map((p) => [p, tasa(contenido, p)])),
    contenido: contenido.length,
    total: n, m,
  };
}

export function coberturaAblativo(items: ItemAblativo[]): Cobertura[] {
  const n = items.length;
  const contenido = items.filter((i) => !POR_TRANSFERENCIA.includes(i.ejes.funcion)).length;
  return [
    { comprobacion: 'la respuesta contra la función', decididos: n, total: n },
    { comprobacion: 'las siete funciones, con pareja', decididos: n, total: n },
    { comprobacion: 'el techo de 1/4 sobre las respuestas uniformes', decididos: contenido, total: n,
      motivoDeLosQueQuedanFuera: 'las tres funciones que el español agrupa bajo «con» se producen por transferencia y no tienen techo aplicable: su suelo lo pone la lengua' },
  ];
}

export function revisarLoteAbl(items: ItemAblativo[]): FalloAbl[] {
  const out: FalloAbl[] = [];
  const push = (item: string, clase: ClaseFalloAbl, detalle: string) => out.push({ item, clase, detalle });

  for (const it of items) {
    if ((it.glosa.match(/___/g) ?? []).length !== 1) push(it.id, 'huecos-y-respuestas', 'la glosa necesita exactamente un hueco');
    const esperada = PREPOSICION[it.ejes.funcion];
    if (norm(it.respuesta) !== esperada) {
      push(it.id, 'respuesta-no-cuadra', `la función «${it.ejes.funcion}» pide «${esperada}» y la respuesta es «${it.respuesta}»`);
    }
  }

  // Las siete, y con DOS cada una: con una sola, toda propiedad del ítem
  // queda confundida con su función y el punto no es examinable.
  const porFuncion = new Map<FuncionAbl, number>();
  for (const it of items) porFuncion.set(it.ejes.funcion, (porFuncion.get(it.ejes.funcion) ?? 0) + 1);
  for (const f of Object.keys(PREPOSICION) as FuncionAbl[]) {
    const c = porFuncion.get(f) ?? 0;
    if (c === 0) push('(lote)', 'falta-una-funcion', `la función «${f}» no aparece, y el punto exige las siete`);
    else if (c < 2) push('(lote)', 'funcion-sin-pareja', `«${f}» sale una sola vez: sus propiedades quedan confundidas con la función`);
  }

  out.push(...revisarCobertura(coberturaAblativo(items)).map((f) => ({ item: f.item, clase: f.clase as ClaseFalloAbl, detalle: f.detalle })));

  const sep = separablePorPosicion(patronDe(items, (i) => POR_TRANSFERENCIA.includes(i.ejes.funcion)));
  if (sep) push('(lote)', 'orden-separable', `«se traduce con CON» se predice por la POSICIÓN: ${sep}`);

  const t = tasasCiegasAbl(items);
  for (const [p, v] of Object.entries(t.enElContenido)) {
    if (v > TECHO_CONTENIDO + 1e-9) {
      push('(lote)', 'estrategia-ciega',
        `«poner siempre ${p}» acierta el ${(100 * v).toFixed(0)} % de las cuatro funciones con respuesta uniforme, por encima del ${(100 * TECHO_CONTENIDO).toFixed(0)} %`);
    }
  }
  return out;
}
