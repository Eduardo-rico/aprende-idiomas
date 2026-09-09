// lib/data/languages/la/lotes/l3-dativo-ci.ts
//
// PRIMER LOTE DEL DATIVO. Punto: `l3-dativo-ci`.
//
// «"puerō librum dō". Regalo casi total: el español tiene dativo pronominal
// y la construcción transfiere.» `varia`: **la declinación del sustantivo,
// porque el sincretismo del dativo cambia con ella (-ae, -ō, -ī, -uī, -eī)**.
//
// ── EL VARIA ES CONTABLE, Y SALE GRADUADO DE VERDAD ──────────────────
//
// Contadas las colisiones del dativo singular en cada declinación:
//
//     1.ª  puellae   3 — gen.sg, nom.pl y voc.pl a la vez
//     2.ª  servō     1 — abl.sg
//     5.ª  reī       1 — gen.sg
//     3.ª  rēgī      0 dentro de su paradigma
//     4.ª  manuī     0 — el único limpio del todo
//
// El punto dice que es «regalo casi total», y lo es en la CONSTRUCCIÓN: el
// español tiene dativo y la transfiere entera. Lo que no transfiere es
// reconocer la forma, y ahí el regalo se acaba de golpe en la 1.ª, donde el
// mismo `-ae` hace tres cosas más.
//
// ── LA COLISIÓN QUE NINGÚN PARADIGMA ENSEÑA ──────────────────────────
//
// `rēgī` no colisiona con nada dentro de su propio paradigma, y aun así es
// trampa: un `-ī` se lee como genitivo de 2.ª —`servī`, «del esclavo»—, y
// esa confusión **cruza de declinación**, así que no aparece en ninguna
// tabla que se estudie de una en una. Los ítems que la traen lo declaran.
//
// ── EL MACRÓN ────────────────────────────────────────────────────────
//
// Marco sin macrones. Y aquí eso importa más que en otros puntos: sin la
// raya, `servō` (dativo) y `servo` no se distinguen del ablativo de todos
// modos, pero `reī` y `rēī` sí eran distintos en el papel. El texto real no
// los distingue, y el lote se presenta como el texto real.
import type { ItemFuncionCaso } from '../../../../../scripts/lib/gate-funcion-caso';
import { colisionesDentro } from '../../../../../scripts/lib/gate-funcion-caso';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar } from '../paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

const CRUCE_I = 'un «-ī» se lee como genitivo de 2.ª («servī», del esclavo): la confusión cruza de declinación y no aparece en ninguna tabla estudiada por separado';

type Def = [id: string, lema: string, funcion: ItemFuncionCaso['funcion'], num: 'sg' | 'pl',
            marco: string, glosa: string, respuesta: string, cruce?: string];

const DEFS: Def[] = [
  // ── 1.ª · TRES colisiones: el peor caso ──
  ['la-3d-01', 'puella', 'destinatario', 'sg', 'Poeta puellae rosam dat.',
   'El poeta da una rosa ___.', 'a la niña'],
  ['la-3d-02', 'rēgīna', 'destinatario', 'sg', 'Servus reginae donum portat.',
   'El esclavo lleva un regalo ___.', 'a la reina'],
  ['la-3d-03', 'domina', 'destinatario', 'sg', 'Medicus dominae verba mittit.',
   'El médico envía palabras ___.', 'a la señora'],

  // ── 2.ª · UNA colisión, con el ablativo ──
  ['la-3d-04', 'servus', 'destinatario', 'sg', 'Dominus servo donum dat.',
   'El señor da un regalo ___.', 'al esclavo'],
  ['la-3d-05', 'discipulus', 'destinatario', 'sg', 'Magister discipulo verba mittit.',
   'El maestro envía palabras ___.', 'al discípulo'],

  // ── 3.ª · CERO dentro del paradigma, pero cruza de declinación ──
  ['la-3d-06', 'rēx', 'destinatario', 'sg', 'Poeta regi verba mittit.',
   'El poeta envía palabras ___.', 'al rey', CRUCE_I],
  ['la-3d-07', 'homō', 'destinatario', 'sg', 'Regina homini donum dat.',
   'La reina da un regalo ___.', 'al hombre', CRUCE_I],
  ['la-3d-08', 'māter', 'destinatario', 'sg', 'Filia matri rosas portat.',
   'La hija lleva rosas ___.', 'a la madre', CRUCE_I],

  // ── 4.ª · el único dativo limpio de toda la lengua ──
  ['la-3d-09', 'exercitus', 'destinatario', 'sg', 'Rex exercitui dona mittit.',
   'El rey envía regalos ___.', 'al ejército'],
  ['la-3d-10', 'senātus', 'destinatario', 'sg', 'Poeta senatui verba mittit.',
   'El poeta envía palabras ___.', 'al senado'],

  // ── 5.ª · UNA colisión, con el genitivo ──
  ['la-3d-11', 'rēs', 'destinatario', 'sg', 'Discipulus rei curam dat.',
   'El discípulo da cuidado ___.', 'al asunto'],
  ['la-3d-12', 'fidēs', 'destinatario', 'sg', 'Poeta fidei verba dat.',
   'El poeta da palabras ___.', 'a la fe'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemFuncionCaso[] = DEFS.map(([id, lema, funcion, numero, marco, glosa, respuesta, cruce]) => {
  const entrada = N(lema);
  return {
    id, punto: 'l3-dativo-ci', entrada, funcion, numero, marco, glosa, respuesta,
    forma: declinar(entrada, 'dat', numero),
    ejes: {
      colisiones: colisionesDentro(entrada, 'dat', numero).length,
      ...(cruce ? { cruzaDeDeclinacion: cruce } : {}),
    },
  };
});

export const LOTE_DATIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);
