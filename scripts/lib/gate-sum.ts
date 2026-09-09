// scripts/lib/gate-sum.ts
//
// GATE DE `sum` Y SUS COMPUESTOS. Punto: `l5-sum-y-compuestos`.
//
// El eje del punto sólo se ve en el contraste entre los DOS contextos: ante
// vocal y ante consonante. Un lote todo en `-est` no enseña que exista un
// alomorfo, y uno todo en `-sum` tampoco. Y sin compuestos que NO cambien,
// el alumno aprende que los prefijos siempre hacen algo.
import type { Persona, Tiempo } from '../../lib/data/languages/la/paradigma-la';
import { conjugar } from '../../lib/data/languages/la/paradigma-la';
import { COMPUESTOS_DE_SUM, conjugarCompuesto, type CompuestoDeSum } from '../../lib/data/languages/la/compuestos-de-sum';
import { VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

const SUM = () => VERBOS_L1.find((v) => v.lema === 'sum')!;

export interface ItemSumGate {
  id: string;
  compuesto: CompuestoDeSum | null;
  persona: Persona;
  tiempo: Tiempo;
  marco: string;
  respuesta: string;
  ejes: { anteVocal: boolean; cambia: boolean };
}

export type ClaseFalloS =
  | 'respuesta-no-derivada' | 'contexto-mal-declarado' | 'cambio-mal-declarado'
  | 'macron-en-el-marco' | 'sin-los-dos-contextos' | 'sin-compuesto-que-cambie'
  | 'sin-compuesto-que-no-cambie' | 'la-concatenacion-ingenua-vale'
  | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloS { item: string; clase: ClaseFalloS; detalle: string }

/** Lo que produce quien pega el prefijo a ciegas. Da *«potsum» y *«prōest». */
export function concatenacionIngenua(c: CompuestoDeSum, p: Persona, t: Tiempo): string {
  return c.anteConsonante + conjugar(SUM(), p, t).normalize('NFC');
}

export function revisarItemSum(it: ItemSumGate): FalloS[] {
  const out: FalloS[] = [];
  const push = (c: ClaseFalloS, d: string) => out.push({ item: it.id, clase: c, detalle: d });

  const dela = it.compuesto
    ? conjugarCompuesto(it.compuesto, it.persona, it.tiempo)
    : conjugar(SUM(), it.persona, it.tiempo);
  if (dela.normalize('NFC') !== it.respuesta.normalize('NFC'))
    push('respuesta-no-derivada', `la máquina da «${dela}» y el ítem escribe «${it.respuesta}»`);

  if (/[āēīōū]/.test(it.marco)) push('macron-en-el-marco', `«${it.marco}» lleva macrón`);

  const base = conjugar(SUM(), it.persona, it.tiempo).normalize('NFC');
  const realAnteVocal = /^[aeiouāēīōū]/.test(base);
  if (realAnteVocal !== it.ejes.anteVocal)
    push('contexto-mal-declarado', `«${base}» ${realAnteVocal ? 'sí' : 'no'} empieza por vocal y el ítem dice lo contrario`);

  const realCambia = it.compuesto ? it.compuesto.anteConsonante !== it.compuesto.anteVocal : false;
  if (realCambia !== it.ejes.cambia)
    push('cambio-mal-declarado', `el ítem declara cambia=${it.ejes.cambia} y la tabla dice ${realCambia}`);

  return out;
}

export function revisarLoteSum(items: ItemSumGate[]): { fallos: FalloS[]; cobertura: Cobertura[] } {
  const fallos = items.flatMap(revisarItemSum);
  const push = (c: ClaseFalloS, d: string) => fallos.push({ item: '(lote)', clase: c, detalle: d });

  for (const v of [true, false])
    if (!items.some((it) => it.ejes.anteVocal === v))
      push('sin-los-dos-contextos',
        `ningún ítem ante ${v ? 'vocal' : 'consonante'}: el alomorfo sólo se ve en el contraste, y con un solo contexto el punto no existe`);

  if (!items.some((it) => it.compuesto && it.ejes.cambia))
    push('sin-compuesto-que-cambie', 'ningún compuesto que cambie de alomorfo: no hay nada que enseñar');
  if (!items.some((it) => it.compuesto && !it.ejes.cambia))
    push('sin-compuesto-que-no-cambie',
      'todos los compuestos cambian algo: el alumno aprenderá que los prefijos siempre hacen algo, y tres de los cinco no hacen nada');

  // La ruta ciega: pegar el prefijo a ciegas. Debe fallar exactamente en los
  // ítems ante vocal de compuestos que cambian.
  const conCompuesto = items.filter((it) => it.compuesto);
  const ingenua = conCompuesto.filter(
    (it) => concatenacionIngenua(it.compuesto!, it.persona, it.tiempo) === it.respuesta.normalize('NFC')).length;
  const debe = conCompuesto.filter((it) => !(it.ejes.anteVocal && it.ejes.cambia)).length;
  if (ingenua > debe)
    push('la-concatenacion-ingenua-vale',
      `pegar el prefijo a ciegas acierta ${ingenua} de ${conCompuesto.length} y sólo debería llegar a ${debe}`);

  const sep = separablePorPosicion(items.map((it) => (it.ejes.cambia ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const cobertura: Cobertura[] = [
    { comprobacion: 'la forma contra la máquina', decididos: items.length, total: items.length },
    { comprobacion: 'ítems donde el alomorfo se VE', decididos:
        items.filter((it) => it.ejes.cambia && it.ejes.anteVocal).length, total: items.length,
      motivoDeLosQueQuedanFuera: 'los de `sum` a secas, los de compuestos que no cambian y los que van ante consonante. En todos ellos la forma es la que se esperaría; el alomorfo sólo asoma cuando un compuesto que cambia va ante vocal' },
    { comprobacion: 'compuestos distintos', decididos:
        new Set(items.filter((it) => it.compuesto).map((it) => it.compuesto!.lema)).size,
      total: COMPUESTOS_DE_SUM.length,
      motivoDeLosQueQuedanFuera: 'los que el lote no trae' },
  ];
  fallos.push(...revisarCobertura(cobertura));
  return { fallos, cobertura };
}
