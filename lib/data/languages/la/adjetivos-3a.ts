// lib/data/languages/la/adjetivos-3a.ts
//
// LOS ADJETIVOS DE LA TERCERA. Punto: `l4-adjetivo-3a`.
//
// «ācer/ācris/ācre, omnis/omne, fēlīx. Y todos declinan como tema en -i, con
// ablativo en -ī.» `varia`: el número de terminaciones del adjetivo.
//
// Es la pieza que faltaba desde el principio, y desbloquea dos cosas: su
// propio punto y **el participio de presente**, que es un adjetivo de 3.ª de
// una terminación (`vidēns, videntis` — 2.967 tokens en el corpus).
//
// ── LOS TRES TIPOS, MEDIDOS ──────────────────────────────────────────
//
//     DOS terminaciones   `omnis/omne`      el tipo dominante
//                         similis 85 · gravis 69 · omnis 63 · commūnis 61 ·
//                         fortis 59 · fidēlis 46 · ūtilis 42
//     UNA terminación     `fēlīx, fēlīcis`  praesēns 43 · senex 61
//     TRES terminaciones  `ācer/ācris/ācre` raro, y por eso va el último
//
// Se declinan todos igual: como tema en `-i`. Lo que cambia es SÓLO el
// nominativo singular, que es lo que el `varia` llama «el número de
// terminaciones».
//
// ── EL ABLATIVO SINGULAR TIENE DOS FORMAS Y NO ES LIBRE ──────────────
//
// `-ī` cuando el adjetivo funciona como adjetivo, `-e` cuando funciona como
// sustantivo o como participio. En el corpus: `omnī` frente a `praesente`.
// La tabla da `-ī` y declara la variante, porque quien la necesite es el
// participio y ése tiene su propio módulo.
import type { Caso, Numero } from './paradigma-la';

export type GeneroAdj = 'm' | 'f' | 'n';
export type Terminaciones = 1 | 2 | 3;

export interface EntradaAdjetivo3a {
  /** El nominativo masculino singular, que es como se cita. */
  lema: string;
  /** El genitivo singular: de aquí sale el tema, igual que en los nombres. */
  genitivo: string;
  glosa: string;
  terminaciones: Terminaciones;
  /** Sólo en los de TRES: el femenino y el neutro del nominativo, que no se
   *  derivan («ācer, ācris, ācre»). */
  femenino?: string;
  neutro?: string;
}

// Las desinencias son las del tema en `-i` de los nombres, con el neutro
// haciendo lo suyo. El orden es el de `ORDEN` en `paradigma-la`.
const A3: Record<Numero, Record<'mf' | 'n', string[]>> = {
  sg: { mf: ['is', 'em', 'is', 'ī', 'ī', 'is'], n: ['e', 'e', 'is', 'ī', 'ī', 'e'] },
  pl: { mf: ['ēs', 'ēs', 'ium', 'ibus', 'ibus', 'ēs'], n: ['ia', 'ia', 'ium', 'ibus', 'ibus', 'ia'] },
};
const ORDEN: Caso[] = ['nom', 'ac', 'gen', 'dat', 'abl', 'voc'];

export function temaDelAdjetivo(e: EntradaAdjetivo3a): string {
  return e.genitivo.normalize('NFC').replace(/is$/, '');
}

export function declinarAdjetivo3a(e: EntradaAdjetivo3a, g: GeneroAdj, caso: Caso, num: Numero): string {
  // El NOMINATIVO SINGULAR es lo único que distingue los tres tipos, y por
  // eso es lo único que no sale de la tabla.
  if (num === 'sg' && (caso === 'nom' || caso === 'voc')) {
    if (g === 'm') return e.lema;
    if (g === 'f') return e.terminaciones === 3 ? e.femenino! : (e.terminaciones === 1 ? e.lema : temaDelAdjetivo(e) + 'is');
    return e.terminaciones === 1 ? e.lema : (e.terminaciones === 3 ? e.neutro! : temaDelAdjetivo(e) + 'e');
  }
  const tema = temaDelAdjetivo(e);
  const fila = A3[num][g === 'n' ? 'n' : 'mf'];
  return tema + fila[ORDEN.indexOf(caso)]!;
}

export function paradigmaAdjetivo3a(e: EntradaAdjetivo3a): Record<string, string> {
  const out: Record<string, string> = {};
  for (const g of ['m', 'f', 'n'] as GeneroAdj[])
    for (const num of ['sg', 'pl'] as Numero[])
      for (const caso of ORDEN) out[`${g}.${caso}.${num}`] = declinarAdjetivo3a(e, g, caso, num);
  return out;
}

/** El ablativo singular en `-e`, que usan los participios y los adjetivos
 *  sustantivados. No es variante libre: depende de la función. */
export function ablativoEnE(e: EntradaAdjetivo3a): string {
  return `${temaDelAdjetivo(e)}e`;
}

export const ADJETIVOS_3A: EntradaAdjetivo3a[] = [
  // ── DOS TERMINACIONES · el tipo dominante ──
  { lema: 'omnis', genitivo: 'omnis', glosa: 'todo, cada', terminaciones: 2 },
  { lema: 'similis', genitivo: 'similis', glosa: 'semejante', terminaciones: 2 },
  { lema: 'gravis', genitivo: 'gravis', glosa: 'pesado, grave', terminaciones: 2 },
  { lema: 'fortis', genitivo: 'fortis', glosa: 'fuerte, valiente', terminaciones: 2 },
  { lema: 'commūnis', genitivo: 'commūnis', glosa: 'común', terminaciones: 2 },
  { lema: 'fidēlis', genitivo: 'fidēlis', glosa: 'fiel', terminaciones: 2 },
  { lema: 'ūtilis', genitivo: 'ūtilis', glosa: 'útil', terminaciones: 2 },
  // ── UNA TERMINACIÓN · el nominativo no dice el género ──
  { lema: 'fēlīx', genitivo: 'fēlīcis', glosa: 'feliz, afortunado', terminaciones: 1 },
  { lema: 'praesēns', genitivo: 'praesentis', glosa: 'presente', terminaciones: 1 },
  // ── TRES TERMINACIONES · raro, y el descriptor lo nombra ──
  { lema: 'ācer', genitivo: 'ācris', glosa: 'agudo, penetrante', terminaciones: 3,
    femenino: 'ācris', neutro: 'ācre' },
];
