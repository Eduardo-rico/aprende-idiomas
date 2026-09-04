// lib/data/languages/la/lotes/l2-vocativo.ts
//
// EL LOTE DEL VOCATIVO. Punto: `l2-vocativo`, 10 ítems.
//
// El punto no es «el vocativo existe». Medido sobre los 589 vocativos
// comparables de la Vulgata, **el 63 % son idénticos al nominativo** y los
// 217 que difieren son TODOS de la 2.ª declinación singular en `-us`:
//
//     el vocativo ES el nominativo — salvo en la 2.ª en -us
//
// con la excepción en tres ramas: `-e` (121 `domine`), `-ī` de los `-ius`
// (18 `fīlī`) y `-u` de los griegos (9 `Iēsū`).
//
// ── CINCO Y CINCO, Y NO ES FIDELIDAD A LA FRECUENCIA ──────────────────
//
// El corpus va 63/37 y el lote va 50/50, por la misma razón que los
// anteriores: «copia el nominativo» acierta el 63 % del latín real, así
// que un lote fiel a la frecuencia se resuelve con esa regla. El
// ejercicio enseña dónde deja de valer; la frecuencia la enseña la
// lectura.
//
// Y hay que traer los cinco que COINCIDEN, o el alumno aprende el error
// simétrico —que el vocativo siempre cambia— y lo aplicaría al 63 % de
// los casos, que es peor.
//
// ── DOS DE LAS TRES RAMAS, Y LA TERCERA DECLARADA FUERA ───────────────
//
// `fīlī` está: sin ella el alumno saca 9/9 sobregeneralizando el `-e`.
//
// **`Iēsū` NO está, y por una razón que el gate encontró.** La entrada de
// este formato es «lema + genitivo», y el genitivo de `Iēsus` **es `Iēsū`,
// que es también su vocativo**: el ítem se contestaría copiando la propia
// entrada. Como tarea de producción no mide nada, y declararlo exento
// habría sido engañarme —la exención existe para cuando copiar ES el
// punto, no para cuando el punto no se puede examinar—.
//
// La rama griega se enseña en la descripción del punto y se examinará en
// un formato de RECONOCIMIENTO, donde la entrada no la regale. Queda
// declarada, no olvidada: `Iēsus` sale 846 veces en el corpus y su
// vocativo 9, y la regla del `-us` habría dado `*Iēse`, que es la forma
// que el alumno nunca ve.
import type { ItemClozeDerivado } from '../../../../../scripts/lib/gate-cloze-derivado';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar } from '../paradigma-la';

const E = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;
export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, lema: string, marco: string, pista: string];

const DEFS: Def[] = [
  // ── CINCO QUE COINCIDEN CON EL NOMINATIVO ──
  ['la-2v-01', 'puella', '___, poēta verba laudat.', 'Se le habla A LA NIÑA.'],
  ['la-2v-02', 'rēx', '___, servī agrōs custōdiunt.', 'Se le habla AL REY.'],
  ['la-2v-03', 'māter', '___, fīlia dōnum exspectat.', 'Se le habla A LA MADRE.'],
  ['la-2v-04', 'puer', '___, discipulī verba audiunt.', 'Se le habla AL NIÑO.'],
  ['la-2v-05', 'magister', '___, colōnī terram vident.', 'Se le habla AL MAESTRO.'],

  // ── CINCO QUE DIFIEREN, y sólo son de la 2.ª en -us ──
  ['la-2v-06', 'dominus', '___, agricolae agrōs custōdiunt.', 'Se le habla AL SEÑOR.'],
  ['la-2v-07', 'servus', '___, agricola dōnum mittit.', 'Se le habla AL ESCLAVO.'],
  ['la-2v-08', 'amīcus', '___, medicus terram videt.', 'Se le habla AL AMIGO.'],
  // La rama de los -ius: `fīlī`, no *`fīlie`. Treebank: fīlī 20, fīlie 0.
  ['la-2v-09', 'fīlius', '___, domina dōnum exspectat.', 'Se le habla AL HIJO.'],
  ['la-2v-10', 'medicus', '___, colōnus terram videt.', 'Se le habla AL MÉDICO.'],
];

const claseDe = (e: (typeof NOMBRES_L1)[number], lema: string): ItemClozeDerivado['ejes']['clase'] =>
  /ius$/.test(lema) ? 'voc-ius'
  : !/(er|ir)$/.test(lema) ? 'regular'
  : e.genitivo.normalize('NFC').startsWith(lema.normalize('NFC')) ? 'conserva' : 'sincopa';

const FUENTE: ItemClozeDerivado[] = DEFS.map(([id, lema, marco, pista]) => {
  const entrada = E(lema);
  return {
    id, punto: 'l2-vocativo', entrada, celda: 'voc.sg',
    respuesta: declinar(entrada, 'voc', 'sg'), marco, pista,
    // La clase se DERIVA de los datos. Escribirla a mano me salió mal en
    // dos ítems —`magister` y `māter` como «conserva» cuando sincopan— y
    // lo cazó el gate. Un eje declarado a mano es una etiqueta encima de
    // un dato, y se desincroniza.
    ejes: { examina: 'vocativo', clase: claseDe(entrada, lema), celda: 'voc.sg' },
    // El 63 % de los vocativos del corpus SON el nominativo: aquí eso no
    // es una celda gratis, es el punto.
    porQueNoEsGratis: declinar(entrada, 'voc', 'sg') === entrada.lema
      ? 'que el vocativo COINCIDA con el nominativo es el contenido del punto: pasa en el 63 % de los 589 vocativos comparables de la Vulgata, y sin estos ítems el alumno aprende que siempre cambia'
      : undefined,
  };
});

export const LOTE_VOCATIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);
