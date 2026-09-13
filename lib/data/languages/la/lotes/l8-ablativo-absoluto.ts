// lib/data/languages/la/lotes/l8-ablativo-absoluto.ts
//
// `l8-ablativo-absoluto` — la construcción que el alumno NO escribe.
//
//     Urbe captā, rēx ambulat.      una vez tomada la ciudad…   (temporal)
//     Verbō dictō, puer venit.      porque se dijo la palabra…  (causal)
//     Signō vīsō, servus manet.     aunque se vio la señal…     (concesivo)
//
// ── POR QUÉ NO VA POR CORRECCIÓN ─────────────────────────────────────
//
// El punto declara `dificultadEsOmision: true`: la dificultad es que el
// alumno NO lo produce, no que lo produzca mal. Un ítem de corregir mide lo
// que se pone de más, y una omisión no deja nada que corregir. Así que va
// por transformación: la glosa española trae el giro y el hueco pide la
// construcción entera, las dos palabras.
//
// ── LOS TRES VALORES, CUATRO DE CADA ─────────────────────────────────
//
// «ocho ablativos absolutos traducidos todos por “una vez que” son un ítem
// repetido ocho veces». La construcción latina no cambia; el español sí, y
// por eso el valor es el eje. Cuatro de cada deja la ciega del valor en el
// 33 %, que con tres salidas es el azar.
//
// ── DOS SIN PARTICIPIO, QUE ES LA EXCEPCIÓN DEL PUNTO ────────────────
//
// `Cicerōne cōnsule`, `vīvō patre`: existe con dos sustantivos o con un
// adjetivo, y «el que busque siempre un participio no lo reconocerá». Con
// material de L1 salen `integrō exercitū` («estando intacto el ejército») y
// `fīliō rēge` («siendo rey el hijo»).
//
// ── LA CIEGA DE LA 1.ª DECLINACIÓN ───────────────────────────────────
//
// «Ponerlo todo en `-ā`» acierta en `viā`, `causā` y `terrā` y falla en
// `urbe`, `bellō`, `verbō`, `signō`, `exercitū`, `fīliō`. En el plural no
// decide nada —la 1.ª y la 2.ª comparten el `-īs`—, así que esos tres
// quedan fuera del denominador.
//
// ── LA CONSTRUCCIÓN NO ES RARA: 322 EN EL CORPUS ─────────────────────
//
// Contados como nombre en ablativo seguido de participio de perfecto en
// ablativo: 322 en los 227.301 tokens, con `rēbus gestis` ×7 a la cabeza —y
// `rēs` es de L1—. Los participios de aquí van de `factā` ×115 a `captā` ×3.
import type { ItemAblAbs, Valor } from '../../../../../scripts/lib/gate-ablativo-absoluto';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Numero } from '../paradigma-la';
import { NOMBRES_L1, VERBOS_L1 } from '../lexicon-l1';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;
const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, nombre: string, numero: Numero, lema: string | null,
            segunda: string | null, valor: Valor, respuesta: string, marco: string, glosa: string];

const DEFS: Def[] = [
  // ── TEMPORAL ──
  ['la-aa-01', 'urbs', 'sg', 'capiō', null, 'temporal', 'urbe captā',
   '___, rēx ambulat.', 'Una vez tomada la ciudad, el rey anda.'],
  ['la-aa-02', 'bellum', 'sg', 'faciō', null, 'temporal', 'bellō factō',
   '___, populus timet.', 'Una vez hecha la guerra, el pueblo teme.'],
  ['la-aa-03', 'via', 'sg', 'faciō', null, 'temporal', 'viā factā',
   '___, agricola venit.', 'Una vez hecho el camino, el campesino viene.'],
  ['la-aa-04', 'servus', 'pl', 'mittō', null, 'temporal', 'servīs missīs',
   '___, domina stat.', 'Una vez enviados los esclavos, la señora se detiene.'],

  // ── CAUSAL ──
  ['la-aa-05', 'verbum', 'sg', 'dīcō', null, 'causal', 'verbō dictō',
   '___, puer venit.', 'Porque se dijo la palabra, el niño viene.'],
  ['la-aa-06', 'causa', 'sg', 'dīcō', null, 'causal', 'causā dictā',
   '___, rēx respondet.', 'Porque se expuso la causa, el rey responde.'],
  ['la-aa-07', 'terra', 'sg', 'videō', null, 'causal', 'terrā vīsā',
   '___, nauta ambulat.', 'Porque se vio la tierra, el marinero anda.'],
  ['la-aa-08', 'discipulus', 'pl', 'vocō', null, 'causal', 'discipulīs vocātīs',
   '___, magister stat.', 'Porque se llamó a los discípulos, el maestro se detiene.'],

  // ── CONCESIVO ──
  ['la-aa-09', 'signum', 'sg', 'videō', null, 'concesivo', 'signō vīsō',
   '___, servus tacet.', 'Aunque se vio la señal, el esclavo calla.'],
  ['la-aa-10', 'dōnum', 'pl', 'faciō', null, 'concesivo', 'dōnīs factīs',
   '___, rēgīna timet.', 'Aunque se hicieron los regalos, la reina teme.'],

  // ── LA EXCEPCIÓN · sin participio ──
  ['la-aa-11', 'exercitus', 'sg', null, 'integrō', 'concesivo', 'exercitū integrō',
   '___, rēx timet.', 'Aunque el ejército está intacto, el rey teme.'],
  ['la-aa-12', 'fīlius', 'sg', null, 'rēge', 'concesivo', 'fīliō rēge',
   '___, pater tacet.', 'Aunque el hijo es rey, el padre calla.'],
];

const FUENTE: ItemAblAbs[] = DEFS.map(([id, nombre, numero, lema, segunda, valor, respuesta, marco, glosa]) => ({
  id, punto: 'l8-ablativo-absoluto', nombre: N(nombre), numero,
  verbo: lema === null ? null : V(lema),
  ...(segunda ? { segundaSinParticipio: segunda } : {}),
  valor, respuesta, marco, glosa,
  ejes: { valor, conParticipio: lema !== null },
}));

export const LOTE_ABLATIVO_ABSOLUTO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);
