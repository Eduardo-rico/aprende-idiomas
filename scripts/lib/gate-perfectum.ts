// scripts/lib/gate-perfectum.ts
//
// GATE DEL PERFECTUM. Punto: `l6-perfectum`.
//
// El `varia` son dos ejes: el TIEMPO —perfecto, pluscuamperfecto, futuro
// perfecto— y la FORMACIÓN DEL TEMA, que son cuatro y no se deducen. Un lote
// que no traiga las cuatro enseña que el perfecto se forma de una manera.
import type { Persona, TiempoPerfecto, EntradaVerbal } from '../../lib/data/languages/la/paradigma-la';
import { variantesDelPerfecto } from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

export type Formacion = 'en-v' | 'en-s' | 'alargamiento' | 'reduplicado';
export const FORMACIONES: Formacion[] = ['en-v', 'en-s', 'alargamiento', 'reduplicado'];
const TIEMPOS: TiempoPerfecto[] = ['perfecto', 'pluscuamperfecto', 'futuro-perfecto'];

export interface ItemPf {
  id: string;
  verbo: EntradaVerbal;
  persona: Persona;
  tiempo: TiempoPerfecto;
  marco: string;
  respuesta: string;
  ejes: { formacion: Formacion; chocaConElInfinitivo?: string };
}

export type ClaseFalloPf =
  | 'respuesta-no-derivada' | 'macron-en-el-marco' | 'formacion-sin-cubrir'
  | 'tiempo-sin-cubrir' | 'choque-no-declarado' | 'choque-declarado-de-mas'
  | 'sin-la-variante' | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloPf { item: string; clase: ClaseFalloPf; detalle: string }

const sinM = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC');

export function revisarItemPf(it: ItemPf): FalloPf[] {
  const out: FalloPf[] = [];
  const push = (c: ClaseFalloPf, d: string) => out.push({ item: it.id, clase: c, detalle: d });

  const vs = variantesDelPerfecto(it.verbo, it.persona, it.tiempo);
  if (!vs.map((v) => v.normalize('NFC')).includes(it.respuesta.normalize('NFC')))
    push('respuesta-no-derivada', `la máquina da ${vs.map((v) => `«${v}»`).join(' o ')} y el ítem escribe «${it.respuesta}»`);

  if (/[āēīōū]/.test(it.marco)) push('macron-en-el-marco', `«${it.marco}» lleva macrón`);

  // El choque con el infinitivo se calcula, no se cree.
  const choca = sinM(it.respuesta) === sinM(it.verbo.infinitivo);
  if (choca && !it.ejes.chocaConElInfinitivo)
    push('choque-no-declarado',
      `«${it.respuesta}» y el infinitivo «${it.verbo.infinitivo}» se escriben igual sin cantidad, y el ítem no lo dice`);
  if (!choca && it.ejes.chocaConElInfinitivo)
    push('choque-declarado-de-mas', `declara un choque y «${it.respuesta}» no se parece a «${it.verbo.infinitivo}»`);

  return out;
}

export function revisarLotePf(items: ItemPf[]): { fallos: FalloPf[]; cobertura: Cobertura[] } {
  const fallos = items.flatMap(revisarItemPf);
  const push = (c: ClaseFalloPf, d: string) => fallos.push({ item: '(lote)', clase: c, detalle: d });

  for (const f of FORMACIONES)
    if (!items.some((it) => it.ejes.formacion === f))
      push('formacion-sin-cubrir', `el varia enumera cuatro formaciones y falta «${f}»`);
  for (const t of TIEMPOS)
    if (!items.some((it) => it.tiempo === t))
      push('tiempo-sin-cubrir', `el varia dice «el tiempo» y falta «${t}»`);

  // La variante `-ēre` es la `excepcion` declarada del punto: sin ella, el
  // lote enseña que la 3.ª del plural tiene una sola forma.
  const conVariante = items.filter((it) => it.persona === '3pl' && it.tiempo === 'perfecto'
    && !it.respuesta.endsWith('ērunt'));
  if (conVariante.length === 0)
    push('sin-la-variante',
      'ningún ítem con la forma «-ēre»: es la `excepcion` del punto, sale el 3,6 % de las veces, y sin ella el alumno leerá un infinitivo cuando se la encuentre');

  const sep = separablePorPosicion(items.map((it) => (it.tiempo === 'perfecto' ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const chocan = items.filter((it) => it.ejes.chocaConElInfinitivo).length;
  const cobertura: Cobertura[] = [
    { comprobacion: 'la respuesta contra la máquina', decididos: items.length, total: items.length },
    { comprobacion: 'formaciones del tema cubiertas', decididos:
        new Set(items.map((it) => it.ejes.formacion)).size, total: FORMACIONES.length },
    { comprobacion: 'formas que el texto NO distingue del infinitivo', decididos: chocan, total: items.length,
      motivoDeLosQueQuedanFuera: 'las demás, que se leen sin ambigüedad. Éstas son las que la escritura no separa: sólo la cantidad las distingue y la cantidad no se escribe',
      elCeroEsUnResultado: undefined },
  ];
  fallos.push(...revisarCobertura(cobertura));
  return { fallos, cobertura };
}
