// lib/data/languages/la/lotes/l5-negacion.ts
//
// PRIMER LOTE DE LA NEGACIÓN. Punto: `l5-negacion`.
//
// «nōn delante del verbo. Transfiere entero desde el español.» `varia`: el
// tipo de constituyente negado (verbo, sintagma, palabra suelta).
//
// ── EL REGALO ES REAL, Y ESTÁ MEDIDO ─────────────────────────────────
//
// Sobre las 2.919 apariciones de `nōn` con cabeza en el corpus:
//
//     va DELANTE de su cabeza   2.826   96,8 %
//     va detrás                    93    3,2 %
//
// El español pone «no» delante igual, así que la posición transfiere y no
// hay nada que enseñar ahí. El punto tiene razón en llamarlo `regalo`.
//
// ── PERO NIEGA UN VERBO SÓLO EL 70 % DE LAS VECES ────────────────────
//
//     niega un VERBO      2.044   70,0 %
//     niega otra cosa       875   30,0 %   NOUN 269 · ADV 254 · ADJ 220 · PRON 76
//
// Y ahí el regalo se parte en dos:
//
//   · **adverbio y pronombre transfieren**: «nōn semper» es «no siempre»,
//     «nōn omnis» es «no todo», «nōn minus» es «no menos». El español hace
//     exactamente lo mismo.
//   · **nombre y adjetivo NO**: «nōn arbos», «nōn aquam», «nōn cor». El
//     español no dice «no árbol»; necesita otra construcción («no [es] un
//     árbol», «ningún árbol»). Ahí el alumno tiene que traducir con algo que
//     el latín no le da.
//
// Así que este punto es regalo en el 70 % largo y sólo enseña algo en los
// nombres y adjetivos. El lote lo dice y la cobertura lo cuenta: los ítems
// de verbo y adverbio están para que el contraste exista, no porque midan.
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export type Constituyente = 'verbo' | 'adverbio' | 'pronombre' | 'nombre' | 'adjetivo';

/** Qué constituyentes transfieren del español sin resto. Medido en la
 *  frecuencia y comprobado en la traducción. */
export const TRANSFIERE: Record<Constituyente, boolean> = {
  verbo: true, adverbio: true, pronombre: true, nombre: false, adjetivo: false,
};

export interface ItemNegacion {
  id: string;
  punto: string;
  marco: string;
  glosa: string;
  respuesta: string;
  ejes: {
    constituyente: Constituyente;
    /** Obligatorio cuando NO transfiere: qué tiene que hacer el español. */
    queHaceElEspanol?: string;
  };
}

type Def = [id: string, c: Constituyente, marco: string, glosa: string, resp: string, queHace?: string];

const DEFS: Def[] = [
  // ── VERBO · el 70 % del corpus, y regalo puro ──
  ['la-5n-01', 'verbo', 'Poeta rosam ___ videt.', 'El poeta ___ ve la rosa.', 'no'],
  ['la-5n-02', 'verbo', 'Servi agrum ___ custodiunt.', 'Los esclavos ___ guardan el campo.', 'no'],
  ['la-5n-03', 'verbo', 'Regina verba ___ audit.', 'La reina ___ oye las palabras.', 'no'],
  ['la-5n-04', 'verbo', 'Discipuli ___ legunt.', 'Los discípulos ___ leen.', 'no'],

  // ── ADVERBIO y PRONOMBRE · también transfieren ──
  ['la-5n-05', 'adverbio', '___ semper legit.', '___ siempre lee.', 'No'],
  ['la-5n-06', 'adverbio', '___ satis est.', '___ es suficiente.', 'No'],
  ['la-5n-07', 'pronombre', '___ omnes veniunt.', '___ todos vienen.', 'No'],
  ['la-5n-08', 'pronombre', 'Rex ___ me vocat.', 'El rey ___ me llama a mí.', 'no'],

  // ── NOMBRE y ADJETIVO · aquí el español necesita otra cosa ──
  ['la-5n-09', 'nombre', 'Poeta ___ aquam portat.', 'El poeta lleva ___ agua.', 'no',
   'el español no dice «lleva no agua»: necesita «no lleva agua» —mover la negación al verbo— o «lleva algo que no es agua». La negación latina se queda pegada al nombre y la española no puede'],
  ['la-5n-10', 'nombre', '___ arbor est.', 'Es ___ árbol.', 'no',
   'el español no dice «es no árbol»: dice «no es un árbol». La negación cambia de sitio al traducir'],
  ['la-5n-11', 'adjetivo', 'Regina ___ anxia est.', 'La reina es ___ ansiosa.', 'no',
   'el español admite «no ansiosa» pero es marcado y culto; lo corriente es «no está ansiosa». La construcción existe y no coincide en registro'],
  ['la-5n-12', 'adjetivo', 'Verba ___ certa sunt.', 'Las palabras son ___ ciertas.', 'no',
   'igual que el anterior: «no ciertas» se entiende y no es lo que un hispanohablante diría; el latín lo usa sin marca ninguna'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemNegacion[] = DEFS.map(([id, constituyente, marco, glosa, respuesta, queHaceElEspanol]) => ({
  id, punto: 'l5-negacion', marco, glosa, respuesta,
  ejes: { constituyente, ...(queHaceElEspanol ? { queHaceElEspanol } : {}) },
}));

export const LOTE_NEGACION = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);
