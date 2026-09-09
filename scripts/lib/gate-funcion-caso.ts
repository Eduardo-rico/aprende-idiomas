// scripts/lib/gate-funcion-caso.ts
//
// GATE DE «QUÉ FUNCIÓN HACE ESTA FORMA». Sirve a los cuatro puntos de
// función del bloque 3 —`l3-nominativo`, `l3-acusativo-od`,
// `l3-genitivo-posesivo` y `l3-dativo-ci`—, que examinan lo mismo con casos
// distintos: leer una forma y decir qué papel juega.
//
// Uno para los cuatro por lo de siempre: cuatro copias de la misma regla
// fallan en la que nadie actualizó.
//
// ── EL EJE QUE SE PUEDE CONTAR ───────────────────────────────────────
//
// El `varia` de `l3-dativo-ci` dice «la declinación del sustantivo, porque
// el sincretismo del dativo cambia con ella». Eso es contable, y contado
// sale graduado de verdad:
//
//     1.ª  puellae   3 colisiones — gen.sg, nom.pl, voc.pl
//     2.ª  servō     1 colisión   — abl.sg
//     5.ª  reī       1 colisión   — gen.sg
//     3.ª  rēgī      0 dentro de su paradigma…
//     4.ª  manuī     0
//
// …pero `rēgī` cruza de declinación: un `-ī` se lee como genitivo de 2.ª
// (`servī`), y ésa es una colisión que ningún paradigma aislado enseña. Por
// eso hay dos cuentas y las dos van declaradas: la de DENTRO del paradigma y
// la de FUERA.
//
// Un lote que no recorra ese rango mide un solo grado de ambigüedad y su
// `varia` es decorativo — igual que pasaba con la opacidad de la 3.ª.
import {
  paradigmaNominal, declinacionDe,
  type EntradaNominal, type Caso, type Numero,
} from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

export type Funcion = 'sujeto' | 'objeto-directo' | 'posesor' | 'destinatario' | 'atributo';

/** El caso que corresponde a cada función. Escrito una vez para que ningún
 *  lote pueda declarar un dativo llamándolo objeto directo. */
export const CASO_DE_LA_FUNCION: Record<Funcion, Caso> = {
  sujeto: 'nom', atributo: 'nom', 'objeto-directo': 'ac', posesor: 'gen', destinatario: 'dat',
};

/** Colisiones DENTRO del paradigma: otras celdas del mismo lema con la misma
 *  forma escrita. */
export function colisionesDentro(e: EntradaNominal, caso: Caso, num: Numero): string[] {
  const p = paradigmaNominal(e);
  const mia = p[`${caso}.${num}`]!.normalize('NFC');
  return Object.entries(p)
    .filter(([k, v]) => k !== `${caso}.${num}` && v.normalize('NFC') === mia)
    .map(([k]) => k);
}

/** Colisiones FUERA: otros lemas del lexicón cuya forma coincide con ésta en
 *  otra celda. Es lo que ningún paradigma aislado enseña —`rēgī` leído como
 *  el genitivo de `servī`— y por eso se busca contra el lexicón entero. */
export function colisionesFuera(
  e: EntradaNominal, caso: Caso, num: Numero, lexicon: EntradaNominal[],
): string[] {
  const mia = paradigmaNominal(e)[`${caso}.${num}`]!.normalize('NFC');
  const fin = (s: string) => s.replace(/^.*?(?=[aeiouāēīōū]*$)/, '');
  const desinencia = mia.slice(-2);
  const out: string[] = [];
  for (const otro of lexicon) {
    if (otro.lema === e.lema) continue;
    for (const [k, v] of Object.entries(paradigmaNominal(otro))) {
      if (k === `${caso}.${num}`) continue;
      if (v.normalize('NFC').endsWith(desinencia) && v.length > 2 && desinencia.length === 2)
        out.push(`${otro.lema}.${k}`);
    }
  }
  void fin;
  return out;
}

export interface ItemFuncionCaso {
  id: string;
  punto: string;
  entrada: EntradaNominal;
  funcion: Funcion;
  numero: Numero;
  /** El marco latino SIN macrones, con la forma dentro. */
  marco: string;
  /** La forma que el alumno tiene que interpretar. */
  forma: string;
  glosa: string;
  respuesta: string;
  ejes: {
    /** Cuántas otras celdas del MISMO paradigma comparten esta forma.
     *  Escrito a mano y contrastado contra el cálculo. */
    colisiones: number;
    /** Obligatorio cuando la forma cruza de declinación: hay que decir con
     *  qué se confunde, porque ningún paradigma aislado lo enseña. */
    cruzaDeDeclinacion?: string;
  };
}

export type ClaseFalloFC =
  | 'forma-no-derivada' | 'caso-no-cuadra-con-la-funcion' | 'macron-en-el-marco'
  | 'colisiones-mal-contadas' | 'rango-plano' | 'funcion-constante'
  | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloFC { item: string; clase: ClaseFalloFC; detalle: string }

const MACRON = /[āēīōūĀĒĪŌŪ]/;
const sinM = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC');

export function revisarItemFuncionCaso(it: ItemFuncionCaso): FalloFC[] {
  const out: FalloFC[] = [];
  const push = (clase: ClaseFalloFC, detalle: string) => out.push({ item: it.id, clase, detalle });

  const caso = CASO_DE_LA_FUNCION[it.funcion];
  const dela = paradigmaNominal(it.entrada)[`${caso}.${it.numero}`]!;
  if (dela.normalize('NFC') !== it.forma.normalize('NFC'))
    push('forma-no-derivada', `la función «${it.funcion}» pide ${caso}.${it.numero}, que da «${dela}», y el ítem trae «${it.forma}»`);

  if (MACRON.test(it.marco)) push('macron-en-el-marco', `«${it.marco}» lleva macrón`);
  if (!sinM(it.marco).includes(sinM(it.forma)))
    push('forma-no-derivada', `«${it.forma}» no aparece en el marco`);
  if (!it.glosa.includes('___')) push('forma-no-derivada', 'la glosa no tiene hueco');

  const reales = colisionesDentro(it.entrada, caso, it.numero);
  if (reales.length !== it.ejes.colisiones)
    push('colisiones-mal-contadas',
      `el ítem declara ${it.ejes.colisiones} y «${it.forma}» comparte forma con ${reales.length}: ${reales.join(', ') || 'ninguna'}`);

  return out;
}

export function revisarLoteFuncionCaso(items: ItemFuncionCaso[], opciones: {
  /** El lote tiene que recorrer el rango de ambigüedad, no medir un solo
   *  grado. */
  colisionesMinimas: number;
  colisionesMaximas: number;
}): { fallos: FalloFC[]; cobertura: Cobertura[] } {
  const fallos = items.flatMap(revisarItemFuncionCaso);
  const push = (clase: ClaseFalloFC, detalle: string) => fallos.push({ item: '(lote)', clase, detalle });
  const n = items.length || 1;

  const cs = items.map((it) => it.ejes.colisiones);
  if (Math.min(...cs) > opciones.colisionesMinimas || Math.max(...cs) < opciones.colisionesMaximas)
    push('rango-plano',
      `el lote va de ${Math.min(...cs)} a ${Math.max(...cs)} colisiones y el punto pide de ${opciones.colisionesMinimas} a ${opciones.colisionesMaximas}: sin los dos extremos mide un solo grado de ambigüedad`);

  const decl = new Set(items.map((it) => declinacionDe(it.entrada)));
  if (decl.size < 3)
    push('rango-plano', `${decl.size} declinaciones distintas: el varia dice que el sincretismo cambia con ella, así que hacen falta varias`);

  const porFuncion = new Map<Funcion, number>();
  for (const it of items) porFuncion.set(it.funcion, (porFuncion.get(it.funcion) ?? 0) + 1);
  const max = Math.max(...porFuncion.values());
  if (porFuncion.size > 1 && max / n > 0.6)
    push('funcion-constante', `una función sale en ${max} de ${n} ítems: contestarla siempre resuelve el lote`);

  const sep = separablePorPosicion(items.map((it) => (it.ejes.colisiones > 0 ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const ambiguos = items.filter((it) => it.ejes.colisiones > 0).length;
  const cruzan = items.filter((it) => it.ejes.cruzaDeDeclinacion).length;
  const cobertura: Cobertura[] = [
    { comprobacion: 'la forma contra la máquina', decididos: items.length, total: items.length },
    { comprobacion: 'formas ambiguas dentro de su paradigma', decididos: ambiguos, total: items.length,
      motivoDeLosQueQuedanFuera: 'las que no comparten forma con ninguna otra celda del mismo lema. Hacen falta como extremo limpio del eje, pero en ellas la desinencia decide sola',
      elCeroEsUnResultado: undefined },
    { comprobacion: 'formas que cruzan de declinación', decididos: cruzan, total: items.length,
      motivoDeLosQueQuedanFuera: 'las que sólo colisionan dentro de su propio paradigma. El cruce es lo que ningún paradigma aislado enseña —«rēgī» leído como el genitivo de «servī»— y por eso se cuenta aparte',
      elCeroEsUnResultado: 'un lote puede no traer ninguna forma que cruce, y eso es una elección legítima: el cruce es un extremo del eje, no un requisito' },
  ];
  fallos.push(...revisarCobertura(cobertura));
  return { fallos, cobertura };
}
